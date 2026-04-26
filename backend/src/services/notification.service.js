const { db } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

const createNotification = async (userId, type, title, message) => {
  const notificationId = uuidv4();
  await db.collection('notifications').doc(notificationId).set({
    notificationId,
    userId,
    type,
    title,
    message,
    isRead: false,
    createdAt: new Date().toISOString(),
  });
};

module.exports = { createNotification };
