const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/firebase');
const { asyncHandler, createError } = require('../middlewares/error.middleware');

// POST /api/venues
const createVenue = asyncHandler(async (req, res) => {
  const {
    title, description, venueType, capacity, city, address,
    basePrice, perGuestPrice, amenities, policies, contactInfo,
  } = req.body;

  const venueId = uuidv4();
  const venue = {
    venueId,
    ownerId: req.user.uid,
    title,
    description: description || '',
    venueType: venueType || 'banquet',
    capacity: Number(capacity),
    city,
    address,
    basePrice: Number(basePrice),
    perGuestPrice: Number(perGuestPrice) || 0,
    amenities: amenities || [],
    media: [],
    policies: policies || '',
    contactInfo: contactInfo || {},
    status: 'active',
    rating: 0,
    reviewCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await db.collection('venues').doc(venueId).set(venue);
  res.status(201).json({ success: true, venue });
});

// GET /api/venues
const getVenues = asyncHandler(async (req, res) => {
  const { city, minPrice, maxPrice, capacity, venueType, search, page = 1, limit = 12 } = req.query;

  let query = db.collection('venues').where('status', '==', 'active');

  if (city) query = query.where('city', '==', city);
  if (venueType) query = query.where('venueType', '==', venueType);

  const snapshot = await query.get();
  let venues = snapshot.docs.map((d) => d.data());

  // Client-side filters for range queries (Firestore limitation)
  if (minPrice) venues = venues.filter((v) => v.basePrice >= Number(minPrice));
  if (maxPrice) venues = venues.filter((v) => v.basePrice <= Number(maxPrice));
  if (capacity) venues = venues.filter((v) => v.capacity >= Number(capacity));
  if (search) {
    const q = search.toLowerCase();
    venues = venues.filter(
      (v) => v.title.toLowerCase().includes(q) || v.city.toLowerCase().includes(q)
    );
  }

  const total = venues.length;
  const start = (Number(page) - 1) * Number(limit);
  const paginated = venues.slice(start, start + Number(limit));

  res.json({ success: true, venues: paginated, total, page: Number(page), limit: Number(limit) });
});

// GET /api/venues/:id
const getVenueById = asyncHandler(async (req, res) => {
  const doc = await db.collection('venues').doc(req.params.id).get();
  if (!doc.exists) throw createError('Venue not found', 404);
  res.json({ success: true, venue: doc.data() });
});

// PUT /api/venues/:id
const updateVenue = asyncHandler(async (req, res) => {
  const doc = await db.collection('venues').doc(req.params.id).get();
  if (!doc.exists) throw createError('Venue not found', 404);
  if (doc.data().ownerId !== req.user.uid) throw createError('Forbidden', 403);

  const updates = { ...req.body, updatedAt: new Date().toISOString() };
  // Sanitize numeric fields
  if (updates.basePrice) updates.basePrice = Number(updates.basePrice);
  if (updates.capacity) updates.capacity = Number(updates.capacity);
  if (updates.perGuestPrice) updates.perGuestPrice = Number(updates.perGuestPrice);

  await db.collection('venues').doc(req.params.id).update(updates);
  const updated = await db.collection('venues').doc(req.params.id).get();
  res.json({ success: true, venue: updated.data() });
});

// DELETE /api/venues/:id
const deleteVenue = asyncHandler(async (req, res) => {
  const doc = await db.collection('venues').doc(req.params.id).get();
  if (!doc.exists) throw createError('Venue not found', 404);
  if (doc.data().ownerId !== req.user.uid) throw createError('Forbidden', 403);

  await db.collection('venues').doc(req.params.id).update({ status: 'deleted' });
  res.json({ success: true, message: 'Venue deleted' });
});

// GET /api/venues/partner/my-venues
const getPartnerVenues = asyncHandler(async (req, res) => {
  const snapshot = await db.collection('venues').where('ownerId', '==', req.user.uid).get();
  const venues = snapshot.docs.map((d) => d.data()).filter((v) => v.status !== 'deleted');
  res.json({ success: true, venues });
});

module.exports = { createVenue, getVenues, getVenueById, updateVenue, deleteVenue, getPartnerVenues };
