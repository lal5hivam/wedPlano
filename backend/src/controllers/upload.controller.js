const { cloudinary } = require('../config/cloudinary');
const { db } = require('../config/firebase');
const { asyncHandler, createError } = require('../middlewares/error.middleware');

// POST /api/uploads/venue-media
const uploadVenueMedia = asyncHandler(async (req, res) => {
  const { venueId } = req.body;
  if (!venueId) throw createError('venueId is required');

  const venueDoc = await db.collection('venues').doc(venueId).get();
  if (!venueDoc.exists) throw createError('Venue not found', 404);
  if (venueDoc.data().ownerId !== req.user.uid) throw createError('Forbidden', 403);

  if (!req.files || req.files.length === 0) throw createError('No files uploaded');

  const mediaItems = req.files.map((file) => ({
    url: file.path,
    publicId: file.filename,
    resourceType: file.mimetype.startsWith('video') ? 'video' : 'image',
    uploadedAt: new Date().toISOString(),
  }));

  // Append to venue media array
  const currentMedia = venueDoc.data().media || [];
  const updatedMedia = [...currentMedia, ...mediaItems];

  await db.collection('venues').doc(venueId).update({
    media: updatedMedia,
    updatedAt: new Date().toISOString(),
  });

  res.status(201).json({ success: true, media: mediaItems });
});

// DELETE /api/uploads/venue-media/:publicId
const deleteVenueMedia = asyncHandler(async (req, res) => {
  const { publicId } = req.params;
  const { venueId } = req.body;

  const venueDoc = await db.collection('venues').doc(venueId).get();
  if (!venueDoc.exists) throw createError('Venue not found', 404);
  if (venueDoc.data().ownerId !== req.user.uid) throw createError('Forbidden', 403);

  // Delete from Cloudinary
  await cloudinary.uploader.destroy(`wedplano/venues/${publicId}`, { resource_type: 'auto' });

  // Remove from venue media array
  const updatedMedia = (venueDoc.data().media || []).filter((m) => m.publicId !== publicId);
  await db.collection('venues').doc(venueId).update({ media: updatedMedia });

  res.json({ success: true, message: 'Media deleted' });
});

module.exports = { uploadVenueMedia, deleteVenueMedia };
