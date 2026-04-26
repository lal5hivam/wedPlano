const express = require('express');
const { body } = require('express-validator');
const router = express.Router({ mergeParams: true });
const { createService, getServices, updateService, deleteService } = require('../controllers/service.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const serviceValidation = [
  body('serviceName').notEmpty().withMessage('Service name is required'),
  body('unitPrice').isNumeric().withMessage('Unit price must be a number'),
];

/**
 * @swagger
 * /api/venues/{id}/services:
 *   post:
 *     summary: Add a service/pricing item to a venue
 *     tags: [Services]
 *   get:
 *     summary: Get all services for a venue
 *     tags: [Services]
 *     security: []
 */
router.post('/', verifyToken, requireRole('partner'), serviceValidation, validate, createService);
router.get('/', getServices);

module.exports = router;
