const { db } = require('../config/firebase');
const { asyncHandler } = require('../middlewares/error.middleware');

// GET /api/notifications
const getNotifications = asyncHandler(async (req, res) => {
  const snapshot = await db
    .collection('notifications')
    .where('userId', '==', req.user.uid)
    .get();

  const notifications = snapshot.docs.map((d) => d.data());
  notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({ success: true, notifications });
});

// PATCH /api/notifications/:id/read
const markAsRead = asyncHandler(async (req, res) => {
  await db.collection('notifications').doc(req.params.id).update({ isRead: true });
  res.json({ success: true, message: 'Marked as read' });
});

// PATCH /api/notifications/read-all
const markAllRead = asyncHandler(async (req, res) => {
  const snapshot = await db
    .collection('notifications')
    .where('userId', '==', req.user.uid)
    .where('isRead', '==', false)
    .get();

  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.update(doc.ref, { isRead: true }));
  await batch.commit();

  res.json({ success: true, message: 'All notifications marked as read' });
});

module.exports = { getNotifications, markAsRead, markAllRead };
