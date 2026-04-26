const express = require('express');
const router = express.Router();
const { updateService, deleteService } = require('../controllers/service.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/services/{serviceId}:
 *   put:
 *     summary: Update a service item
 *     tags: [Services]
 *   delete:
 *     summary: Delete a service item
 *     tags: [Services]
 */
router.put('/:serviceId', verifyToken, requireRole('partner'), updateService);
router.delete('/:serviceId', verifyToken, requireRole('partner'), deleteService);

module.exports = router;
