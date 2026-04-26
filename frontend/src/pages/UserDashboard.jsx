import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const UserDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookingsRes, dashRes] = await Promise.all([
        api.get('/bookings/user'),
        api.get('/dashboard/user'),
      ]);
      setBookings(bookingsRes.data.bookings);
      setStats(dashRes.data.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (requestId) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await api.patch(`/bookings/${requestId}/cancel`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      pending: 'badge-warning',
      accepted: 'badge-success',
      rejected: 'badge-error',
      cancelled: 'badge-neutral',
    };
    return `badge ${map[status] || 'badge-neutral'}`;
  };

  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;

  return (
    <div className="page-content">
      <div className="container">
        <h1 style={styles.title}>My Dashboard</h1>
        <p style={styles.subtitle}>Welcome back, {user.name}!</p>

        <div style={styles.statsGrid}>
          <div className="card">
            <div className="card-body text-center">
              <div style={styles.statValue}>{stats?.totalRequests || 0}</div>
              <div style={styles.statLabel}>Total Requests</div>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <div style={styles.statValue}>{stats?.pendingRequests || 0}</div>
              <div style={styles.statLabel}>Pending</div>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <div style={styles.statValue}>{stats?.acceptedRequests || 0}</div>
              <div style={styles.statLabel}>Accepted</div>
            </div>
          </div>
        </div>

        <h2 style={styles.sectionTitle}>My Booking Requests</h2>
        {bookings.length === 0 ? (
          <div className="card"><div className="card-body text-center">No bookings yet</div></div>
        ) : (
          <div style={styles.bookingList}>
            {bookings.map((booking) => (
              <div key={booking.requestId} className="card">
                <div className="card-body">
                  <div style={styles.bookingHeader}>
                    <div>
                      <h3 style={styles.bookingTitle}>Booking for {booking.requestedDate}</h3>
                      <p style={styles.bookingMeta}>
                        {booking.guestCount} guests • {booking.foodType}
                      </p>
                    </div>
                    <span className={getStatusBadge(booking.status)}>{booking.status}</span>
                  </div>
                  <div style={styles.bookingDetails}>
                    <div>
                      <strong>Estimated Total:</strong> ₹{booking.estimatedTotal?.toLocaleString()}
                    </div>
                    <div style={styles.bookingActions}>
                      {booking.status === 'pending' && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleCancel(booking.requestId)}>
                          Cancel
                        </button>
                      )}
                    </div>
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
  title: { fontSize: '2rem', marginBottom: '0.5rem' },
  subtitle: { color: 'var(--text-light)', marginBottom: '2rem' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' },
  statValue: { fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)' },
  statLabel: { fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem' },
  sectionTitle: { fontSize: '1.5rem', marginBottom: '1.5rem' },
  bookingList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  bookingHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' },
  bookingTitle: { fontSize: '1.1rem', marginBottom: '0.25rem' },
  bookingMeta: { fontSize: '0.85rem', color: 'var(--text-muted)' },
  bookingDetails: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' },
  bookingActions: { display: 'flex', gap: '0.5rem' },
};

export default UserDashboard;
