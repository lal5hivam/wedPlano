const { db } = require('../config/firebase');
const { asyncHandler, createError } = require('../middlewares/error.middleware');

const verifyVenueOwner = async (venueId, uid) => {
  const doc = await db.collection('venues').doc(venueId).get();
  if (!doc.exists) throw createError('Venue not found', 404);
  if (doc.data().ownerId !== uid) throw createError('Forbidden', 403);
};

// POST /api/venues/:id/availability  — bulk set available dates
const setAvailability = asyncHandler(async (req, res) => {
  await verifyVenueOwner(req.params.id, req.user.uid);

  const { dates } = req.body; // array of date strings YYYY-MM-DD
  if (!Array.isArray(dates)) throw createError('dates must be an array');

  const batch = db.batch();
  for (const date of dates) {
    const docId = `${req.params.id}_${date}`;
    const ref = db.collection('availability').doc(docId);
    batch.set(ref, {
      venueId: req.params.id,
      date,
      isAvailable: true,
      isBlocked: false,
      bookingId: null,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  }
  await batch.commit();

  res.json({ success: true, message: `${dates.length} dates updated` });
});

// GET /api/venues/:id/availability
const getAvailability = asyncHandler(async (req, res) => {
  const snapshot = await db
    .collection('availability')
    .where('venueId', '==', req.params.id)
    .get();

  const availability = snapshot.docs.map((d) => d.data());
  res.json({ success: true, availability });
});

// PUT /api/venues/:id/availability/:date
const updateDateAvailability = asyncHandler(async (req, res) => {
  await verifyVenueOwner(req.params.id, req.user.uid);

  const { date } = req.params;
  const docId = `${req.params.id}_${date}`;
  const docRef = db.collection('availability').doc(docId);
  const doc = await docRef.get();

  // Check no confirmed booking exists
  if (doc.exists && doc.data().bookingId) {
    throw createError('Cannot modify date with a confirmed booking', 400);
  }

  const { isAvailable, isBlocked } = req.body;
  await docRef.set(
    { venueId: req.params.id, date, isAvailable, isBlocked, bookingId: null, updatedAt: new Date().toISOString() },
    { merge: true }
  );

  res.json({ success: true, message: 'Availability updated' });
});

// DELETE /api/venues/:id/availability/:date
const removeDate = asyncHandler(async (req, res) => {
  await verifyVenueOwner(req.params.id, req.user.uid);

  const docId = `${req.params.id}_${req.params.date}`;
  await db.collection('availability').doc(docId).delete();
  res.json({ success: true, message: 'Date removed' });
});

module.exports = { setAvailability, getAvailability, updateDateAvailability, removeDate };
