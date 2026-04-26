const express = require('express');
const router = express.Router({ mergeParams: true });
const { setAvailability, getAvailability, updateDateAvailability, removeDate } = require('../controllers/availability.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/venues/{id}/availability:
 *   post:
 *     summary: Set available dates for a venue
 *     tags: [Availability]
 *   get:
 *     summary: Get availability for a venue
 *     tags: [Availability]
 *     security: []
 */
router.post('/', verifyToken, requireRole('partner'), setAvailability);
router.get('/', getAvailability);

/**
 * @swagger
 * /api/venues/{id}/availability/{date}:
 *   put:
 *     summary: Update a specific date availability
 *     tags: [Availability]
 *   delete:
 *     summary: Remove a date from availability
 *     tags: [Availability]
 */
router.put('/:date', verifyToken, requireRole('partner'), updateDateAvailability);
router.delete('/:date', verifyToken, requireRole('partner'), removeDate);

module.exports = router;
