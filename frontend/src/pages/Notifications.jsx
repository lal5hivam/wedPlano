import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;

  return (
    <div className="page-content">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={styles.header}>
          <h1 style={styles.title}>Notifications</h1>
          {notifications.some((n) => !n.isRead) && (
            <button className="btn btn-outline btn-sm" onClick={handleMarkAllRead}>
              Mark All Read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="card"><div className="card-body text-center">No notifications</div></div>
        ) : (
          <div style={styles.list}>
            {notifications.map((notif) => (
              <div
                key={notif.notificationId}
                className="card"
                style={{ ...styles.notifCard, ...(notif.isRead ? {} : styles.unread) }}
              >
                <div className="card-body">
                  <div style={styles.notifHeader}>
                    <div>
                      <h3 style={styles.notifTitle}>{notif.title}</h3>
                      <p style={styles.notifMessage}>{notif.message}</p>
                      <p style={styles.notifDate}>{new Date(notif.createdAt).toLocaleString()}</p>
                    </div>
                    {!notif.isRead && (
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleMarkRead(notif.notificationId)}
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  title: { fontSize: '2rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  notifCard: { cursor: 'pointer' },
  unread: { borderLeft: '4px solid var(--primary)' },
  notifHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  notifTitle: { fontSize: '1.1rem', marginBottom: '0.5rem' },
  notifMessage: { color: 'var(--text-light)', marginBottom: '0.5rem' },
  notifDate: { fontSize: '0.8rem', color: 'var(--text-muted)' },
};

export default Notifications;
