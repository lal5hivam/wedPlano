const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/firebase');
const { asyncHandler, createError } = require('../middlewares/error.middleware');
const { calculateBilling } = require('../services/billing.service');
const { createNotification } = require('../services/notification.service');

// POST /api/bookings/request
const createBookingRequest = asyncHandler(async (req, res) => {
  const {
    venueId, requestedDate, eventType, guestCount,
    foodType, selectedServices, message,
  } = req.body;

  // 1. Verify venue exists
  const venueDoc = await db.collection('venues').doc(venueId).get();
  if (!venueDoc.exists) throw createError('Venue not found', 404);
  const venue = venueDoc.data();

  // 2. Check date availability (race-condition safe with transaction)
  const availDocId = `${venueId}_${requestedDate}`;
  const availRef = db.collection('availability').doc(availDocId);

  await db.runTransaction(async (t) => {
    const availDoc = await t.get(availRef);
    if (!availDoc.exists || !availDoc.data().isAvailable || availDoc.data().isBlocked) {
      throw createError('Selected date is not available', 400);
    }
    if (availDoc.data().bookingId) {
      throw createError('Date already booked', 400);
    }
  });

  // 3. Fetch services and calculate billing
  const servicesSnap = await db
    .collection('venueServices')
    .where('venueId', '==', venueId)
    .where('isActive', '==', true)
    .get();
  const services = servicesSnap.docs.map((d) => d.data());

  const billing = calculateBilling(venue, services, selectedServices || [], guestCount);

  // 4. Create booking request
  const requestId = uuidv4();
  const bookingRequest = {
    requestId,
    userId: req.user.uid,
    venueId,
    ownerId: venue.ownerId,
    requestedDate,
    eventType: eventType || 'wedding',
    guestCount: Number(guestCount),
    foodType: foodType || 'veg',
    selectedServices: selectedServices || [],
    pricingBreakdown: billing.breakdown,
    estimatedTotal: billing.grandTotal,
    message: message || '',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await db.collection('bookingRequests').doc(requestId).set(bookingRequest);

  // 5. Notify venue partner
  await createNotification(
    venue.ownerId,
    'booking_request',
    'New Booking Request',
    `You have a new booking request for ${requestedDate} from ${req.user.name}`
  );

  res.status(201).json({ success: true, bookingRequest });
});

// GET /api/bookings/user
const getUserBookings = asyncHandler(async (req, res) => {
  const snapshot = await db
    .collection('bookingRequests')
    .where('userId', '==', req.user.uid)
    .get();

  const requests = snapshot.docs.map((d) => d.data());
  requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ success: true, bookings: requests });
});

// GET /api/bookings/partner
const getPartnerBookings = asyncHandler(async (req, res) => {
  const snapshot = await db
    .collection('bookingRequests')
    .where('ownerId', '==', req.user.uid)
    .get();

  const requests = snapshot.docs.map((d) => d.data());
  requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ success: true, bookings: requests });
});

// PATCH /api/bookings/:id/accept
const acceptBooking = asyncHandler(async (req, res) => {
  const reqDoc = await db.collection('bookingRequests').doc(req.params.id).get();
  if (!reqDoc.exists) throw createError('Booking request not found', 404);

  const data = reqDoc.data();
  if (data.ownerId !== req.user.uid) throw createError('Forbidden', 403);
  if (data.status !== 'pending') throw createError('Request is not pending', 400);

  const availDocId = `${data.venueId}_${data.requestedDate}`;

  await db.runTransaction(async (t) => {
    const availRef = db.collection('availability').doc(availDocId);
    const availDoc = await t.get(availRef);

    if (availDoc.exists && availDoc.data().bookingId) {
      throw createError('Date was already booked by another request', 409);
    }

    // Create confirmed booking
    const bookingId = uuidv4();
    const bookingRef = db.collection('bookings').doc(bookingId);
    t.set(bookingRef, {
      bookingId,
      requestId: data.requestId,
      userId: data.userId,
      venueId: data.venueId,
      ownerId: data.ownerId,
      bookingDate: data.requestedDate,
      finalPrice: data.estimatedTotal,
      pricingBreakdown: data.pricingBreakdown,
      bookingStatus: 'confirmed',
      createdAt: new Date().toISOString(),
    });

    // Mark date unavailable
    t.set(availRef, {
      venueId: data.venueId,
      date: data.requestedDate,
      isAvailable: false,
      isBlocked: true,
      bookingId,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    // Update request status
    t.update(db.collection('bookingRequests').doc(req.params.id), {
      status: 'accepted',
      bookingId,
      updatedAt: new Date().toISOString(),
    });
  });

  await createNotification(
    data.userId,
    'booking_accepted',
    'Booking Accepted',
    `Your booking request for ${data.requestedDate} has been accepted.`
  );

  res.json({ success: true, message: 'Booking accepted' });
});

// PATCH /api/bookings/:id/reject
const rejectBooking = asyncHandler(async (req, res) => {
  const reqDoc = await db.collection('bookingRequests').doc(req.params.id).get();
  if (!reqDoc.exists) throw createError('Booking request not found', 404);

  const data = reqDoc.data();
  if (data.ownerId !== req.user.uid) throw createError('Forbidden', 403);
  if (data.status !== 'pending') throw createError('Request is not pending', 400);

  await db.collection('bookingRequests').doc(req.params.id).update({
    status: 'rejected',
    updatedAt: new Date().toISOString(),
  });

  await createNotification(
    data.userId,
    'booking_rejected',
    'Booking Rejected',
    `Your booking request for ${data.requestedDate} was not accepted.`
  );

  res.json({ success: true, message: 'Booking rejected' });
});

// PATCH /api/bookings/:id/cancel
const cancelBooking = asyncHandler(async (req, res) => {
  const reqDoc = await db.collection('bookingRequests').doc(req.params.id).get();
  if (!reqDoc.exists) throw createError('Booking request not found', 404);

  const data = reqDoc.data();
  const isOwner = data.userId === req.user.uid;
  const isPartner = data.ownerId === req.user.uid;

  if (!isOwner && !isPartner) throw createError('Forbidden', 403);
  if (!['pending', 'accepted'].includes(data.status)) throw createError('Cannot cancel this request', 400);

  await db.runTransaction(async (t) => {
    t.update(db.collection('bookingRequests').doc(req.params.id), {
      status: 'cancelled',
      updatedAt: new Date().toISOString(),
    });

    // Free up the date if it was accepted
    if (data.status === 'accepted') {
      const availDocId = `${data.venueId}_${data.requestedDate}`;
      const availRef = db.collection('availability').doc(availDocId);
      t.set(availRef, {
        venueId: data.venueId,
        date: data.requestedDate,
        isAvailable: true,
        isBlocked: false,
        bookingId: null,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      if (data.bookingId) {
        t.update(db.collection('bookings').doc(data.bookingId), { bookingStatus: 'cancelled' });
      }
    }
  });

  const notifyId = isOwner ? data.ownerId : data.userId;
  await createNotification(notifyId, 'booking_cancelled', 'Booking Cancelled', `Booking for ${data.requestedDate} was cancelled.`);

  res.json({ success: true, message: 'Booking cancelled' });
});

// GET /api/bookings/preview-billing
const previewBilling = asyncHandler(async (req, res) => {
  const { venueId, guestCount, selectedServices } = req.body;

  const venueDoc = await db.collection('venues').doc(venueId).get();
  if (!venueDoc.exists) throw createError('Venue not found', 404);

  const servicesSnap = await db
    .collection('venueServices')
    .where('venueId', '==', venueId)
    .where('isActive', '==', true)
    .get();
  const services = servicesSnap.docs.map((d) => d.data());

  const billing = calculateBilling(venueDoc.data(), services, selectedServices || [], guestCount);
  res.json({ success: true, billing });
});

module.exports = {
  createBookingRequest,
  getUserBookings,
  getPartnerBookings,
  acceptBooking,
  rejectBooking,
  cancelBooking,
  previewBilling,
};
