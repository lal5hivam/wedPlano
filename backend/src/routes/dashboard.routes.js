const express = require('express');
const router = express.Router();
const { getPartnerDashboard, getUserDashboard } = require('../controllers/dashboard.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

router.get('/partner', verifyToken, requireRole('partner'), getPartnerDashboard);
router.get('/user', verifyToken, requireRole('user'), getUserDashboard);

module.exports = router;
