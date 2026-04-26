const express = require('express');
const router = express.Router();
const {
  createBookingRequest, getUserBookings, getPartnerBookings,
  acceptBooking, rejectBooking, cancelBooking, previewBilling,
} = require('../controllers/booking.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/bookings/request:
 *   post:
 *     summary: Submit a booking request (user only)
 *     tags: [Bookings]
 * /api/bookings/preview-billing:
 *   post:
 *     summary: Preview billing before submitting request
 *     tags: [Bookings]
 * /api/bookings/user:
 *   get:
 *     summary: Get all booking requests for logged-in user
 *     tags: [Bookings]
 * /api/bookings/partner:
 *   get:
 *     summary: Get all booking requests for logged-in partner
 *     tags: [Bookings]
 */
router.post('/request', verifyToken, requireRole('user'), createBookingRequest);
router.post('/preview-billing', verifyToken, previewBilling);
router.get('/user', verifyToken, requireRole('user'), getUserBookings);
router.get('/partner', verifyToken, requireRole('partner'), getPartnerBookings);

/**
 * @swagger
 * /api/bookings/{id}/accept:
 *   patch:
 *     summary: Accept a booking request (partner only)
 *     tags: [Bookings]
 * /api/bookings/{id}/reject:
 *   patch:
 *     summary: Reject a booking request (partner only)
 *     tags: [Bookings]
 * /api/bookings/{id}/cancel:
 *   patch:
 *     summary: Cancel a booking (user or partner)
 *     tags: [Bookings]
 */
router.patch('/:id/accept', verifyToken, requireRole('partner'), acceptBooking);
router.patch('/:id/reject', verifyToken, requireRole('partner'), rejectBooking);
router.patch('/:id/cancel', verifyToken, cancelBooking);

module.exports = router;
