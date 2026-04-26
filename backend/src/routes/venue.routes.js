const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  createVenue, getVenues, getVenueById, updateVenue, deleteVenue, getPartnerVenues,
} = require('../controllers/venue.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const venueValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('capacity').isNumeric().withMessage('Capacity must be a number'),
  body('basePrice').isNumeric().withMessage('Base price must be a number'),
];

/**
 * @swagger
 * /api/venues:
 *   post:
 *     summary: Create a new venue (partner only)
 *     tags: [Venues]
 *   get:
 *     summary: Get all active venues with filters
 *     tags: [Venues]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: city
 *         schema: { type: string }
 *       - in: query
 *         name: venueType
 *         schema: { type: string }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *       - in: query
 *         name: capacity
 *         schema: { type: number }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: number }
 *       - in: query
 *         name: limit
 *         schema: { type: number }
 */
router.post('/', verifyToken, requireRole('partner'), venueValidation, validate, createVenue);
router.get('/', getVenues);
router.get('/partner/my-venues', verifyToken, requireRole('partner'), getPartnerVenues);

/**
 * @swagger
 * /api/venues/{id}:
 *   get:
 *     summary: Get venue by ID
 *     tags: [Venues]
 *     security: []
 *   put:
 *     summary: Update venue (partner only)
 *     tags: [Venues]
 *   delete:
 *     summary: Delete venue (partner only)
 *     tags: [Venues]
 */
router.get('/:id', getVenueById);
router.put('/:id', verifyToken, requireRole('partner'), updateVenue);
router.delete('/:id', verifyToken, requireRole('partner'), deleteVenue);

module.exports = router;
