const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/firebase');
const { asyncHandler, createError } = require('../middlewares/error.middleware');

const verifyVenueOwner = async (venueId, uid) => {
  const doc = await db.collection('venues').doc(venueId).get();
  if (!doc.exists) throw createError('Venue not found', 404);
  if (doc.data().ownerId !== uid) throw createError('Forbidden', 403);
  return doc.data();
};

// POST /api/venues/:id/services
const createService = asyncHandler(async (req, res) => {
  await verifyVenueOwner(req.params.id, req.user.uid);

  const { serviceName, unitType, unitPrice, description, isRequired } = req.body;
  const serviceId = uuidv4();

  const service = {
    serviceId,
    venueId: req.params.id,
    serviceName,
    unitType: unitType || 'unit',
    unitPrice: Number(unitPrice),
    description: description || '',
    isRequired: Boolean(isRequired),
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  await db.collection('venueServices').doc(serviceId).set(service);
  res.status(201).json({ success: true, service });
});

// GET /api/venues/:id/services
const getServices = asyncHandler(async (req, res) => {
  const snapshot = await db
    .collection('venueServices')
    .where('venueId', '==', req.params.id)
    .where('isActive', '==', true)
    .get();

  const services = snapshot.docs.map((d) => d.data());
  res.json({ success: true, services });
});

// PUT /api/services/:serviceId
const updateService = asyncHandler(async (req, res) => {
  const doc = await db.collection('venueServices').doc(req.params.serviceId).get();
  if (!doc.exists) throw createError('Service not found', 404);

  await verifyVenueOwner(doc.data().venueId, req.user.uid);

  const updates = { ...req.body };
  if (updates.unitPrice) updates.unitPrice = Number(updates.unitPrice);

  await db.collection('venueServices').doc(req.params.serviceId).update(updates);
  const updated = await db.collection('venueServices').doc(req.params.serviceId).get();
  res.json({ success: true, service: updated.data() });
});

// DELETE /api/services/:serviceId
const deleteService = asyncHandler(async (req, res) => {
  const doc = await db.collection('venueServices').doc(req.params.serviceId).get();
  if (!doc.exists) throw createError('Service not found', 404);

  await verifyVenueOwner(doc.data().venueId, req.user.uid);

  await db.collection('venueServices').doc(req.params.serviceId).update({ isActive: false });
  res.json({ success: true, message: 'Service removed' });
});

module.exports = { createService, getServices, updateService, deleteService };
