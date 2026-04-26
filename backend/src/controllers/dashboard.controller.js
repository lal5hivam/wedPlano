const { db } = require('../config/firebase');
const { asyncHandler } = require('../middlewares/error.middleware');

// GET /api/dashboard/partner
const getPartnerDashboard = asyncHandler(async (req, res) => {
  const uid = req.user.uid;

  const [venuesSnap, requestsSnap] = await Promise.all([
    db.collection('venues').where('ownerId', '==', uid).get(),
    db.collection('bookingRequests').where('ownerId', '==', uid).get(),
  ]);

  const venues = venuesSnap.docs.map((d) => d.data()).filter((v) => v.status !== 'deleted');
  const requests = requestsSnap.docs.map((d) => d.data());

  const stats = {
    totalVenues: venues.length,
    totalRequests: requests.length,
    pendingRequests: requests.filter((r) => r.status === 'pending').length,
    acceptedRequests: requests.filter((r) => r.status === 'accepted').length,
    rejectedRequests: requests.filter((r) => r.status === 'rejected').length,
    totalRevenue: requests
      .filter((r) => r.status === 'accepted')
      .reduce((sum, r) => sum + (r.estimatedTotal || 0), 0),
  };

  res.json({ success: true, stats, venues, recentRequests: requests.slice(0, 10) });
});

// GET /api/dashboard/user
const getUserDashboard = asyncHandler(async (req, res) => {
  const uid = req.user.uid;

  const requestsSnap = await db.collection('bookingRequests').where('userId', '==', uid).get();
  const requests = requestsSnap.docs.map((d) => d.data());
  requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const stats = {
    totalRequests: requests.length,
    pendingRequests: requests.filter((r) => r.status === 'pending').length,
    acceptedRequests: requests.filter((r) => r.status === 'accepted').length,
  };

  res.json({ success: true, stats, recentRequests: requests.slice(0, 10) });
});

module.exports = { getPartnerDashboard, getUserDashboard };
