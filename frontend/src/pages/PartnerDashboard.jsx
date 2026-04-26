import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const PartnerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dashRes, venuesRes, bookingsRes] = await Promise.all([
        api.get('/dashboard/partner'),
        api.get('/venues/partner/my-venues'),
        api.get('/bookings/partner'),
      ]);
      setStats(dashRes.data.stats);
      setVenues(venuesRes.data.venues);
      setBookings(bookingsRes.data.bookings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await api.patch(`/bookings/${requestId}/accept`);
      fetchData();
      alert('Booking accepted!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept');
    }
  };

  const handleReject = async (requestId) => {
    if (!confirm('Reject this booking?')) return;
    try {
      await api.patch(`/bookings/${requestId}/reject`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject');
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
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Partner Dashboard</h1>
            <p style={styles.subtitle}>Welcome, {user.name}</p>
          </div>
          <Link to="/partner/venues/new"><button className="btn btn-primary">+ Add Venue</button></Link>
        </div>

        <div style={styles.statsGrid}>
          <div className="card">
            <div className="card-body text-center">
              <div style={styles.statValue}>{stats?.totalVenues || 0}</div>
              <div style={styles.statLabel}>Total Venues</div>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <div style={styles.statValue}>{stats?.pendingRequests || 0}</div>
              <div style={styles.statLabel}>Pending Requests</div>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <div style={styles.statValue}>{stats?.acceptedRequests || 0}</div>
              <div style={styles.statLabel}>Accepted Bookings</div>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <div style={styles.statValue}>₹{stats?.totalRevenue?.toLocaleString() || 0}</div>
              <div style={styles.statLabel}>Total Revenue</div>
            </div>
          </div>
        </div>

        <h2 style={styles.sectionTitle}>My Venues</h2>
        {venues.length === 0 ? (
          <div className="card"><div className="card-body text-center">No venues yet. Add your first venue!</div></div>
        ) : (
          <div style={styles.venueGrid}>
            {venues.map((venue) => (
              <div key={venue.venueId} className="card">
                <div className="card-body">
                  <h3 style={styles.venueName}>{venue.title}</h3>
                  <p style={styles.venueLocation}>📍 {venue.city}</p>
                  <p style={styles.venuePrice}>₹{venue.basePrice.toLocaleString()}</p>
                  <Link to={`/partner/venues/${venue.venueId}/edit`}>
                    <button className="btn btn-outline btn-sm w-full">Manage</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 style={styles.sectionTitle}>Booking Requests</h2>
        {bookings.length === 0 ? (
          <div className="card"><div className="card-body text-center">No booking requests</div></div>
        ) : (
          <div style={styles.bookingList}>
            {bookings.map((booking) => (
              <div key={booking.requestId} className="card">
                <div className="card-body">
                  <div style={styles.bookingHeader}>
                    <div>
                      <h3 style={styles.bookingTitle}>Request for {booking.requestedDate}</h3>
                      <p style={styles.bookingMeta}>
                        {booking.guestCount} guests • {booking.foodType} • {booking.eventType}
                      </p>
                      {booking.message && <p style={styles.message}>Message: {booking.message}</p>}
                    </div>
                    <span className={getStatusBadge(booking.status)}>{booking.status}</span>
                  </div>
                  <div style={styles.bookingDetails}>
                    <div><strong>Total:</strong> ₹{booking.estimatedTotal?.toLocaleString()}</div>
                    {booking.status === 'pending' && (
                      <div style={styles.bookingActions}>
                        <button className="btn btn-primary btn-sm" onClick={() => handleAccept(booking.requestId)}>
                          Accept
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleReject(booking.requestId)}>
                          Reject
                        </button>
                      </div>
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
  title: { fontSize: '2rem', marginBottom: '0.5rem' },
  subtitle: { color: 'var(--text-light)' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' },
  statValue: { fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)' },
  statLabel: { fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem' },
  sectionTitle: { fontSize: '1.5rem', marginBottom: '1.5rem', marginTop: '2rem' },
  venueGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' },
  venueName: { fontSize: '1.2rem', marginBottom: '0.5rem' },
  venueLocation: { fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' },
  venuePrice: { fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '1rem' },
  bookingList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  bookingHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' },
  bookingTitle: { fontSize: '1.1rem', marginBottom: '0.25rem' },
  bookingMeta: { fontSize: '0.85rem', color: 'var(--text-muted)' },
  message: { fontSize: '0.9rem', marginTop: '0.5rem', fontStyle: 'italic', color: 'var(--text-light)' },
  bookingDetails: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' },
  bookingActions: { display: 'flex', gap: '0.5rem' },
};

export default PartnerDashboard;
