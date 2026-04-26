const express = require('express');
const router = express.Router();
const { uploadVenueMedia, deleteVenueMedia } = require('../controllers/upload.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const { upload } = require('../config/cloudinary');

/**
 * @swagger
 * /api/uploads/venue-media:
 *   post:
 *     summary: Upload venue images/videos
 *     tags: [Uploads]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               venueId: { type: string }
 *               files:
 *                 type: array
 *                 items: { type: string, format: binary }
 */
router.post(
  '/venue-media',
  verifyToken,
  requireRole('partner'),
  upload.array('files', 10),
  uploadVenueMedia
);

/**
 * @swagger
 * /api/uploads/venue-media/{publicId}:
 *   delete:
 *     summary: Delete a venue media item
 *     tags: [Uploads]
 */
router.delete('/venue-media/:publicId', verifyToken, requireRole('partner'), deleteVenueMedia);

module.exports = router;
