import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const VenueDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [services, setServices] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingData, setBookingData] = useState({
    requestedDate: '',
    guestCount: '',
    foodType: 'veg',
    selectedServices: [],
    message: '',
  });
  const [billing, setBilling] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [venueRes, servicesRes, availRes] = await Promise.all([
        api.get(`/venues/${id}`),
        api.get(`/venues/${id}/services`),
        api.get(`/venues/${id}/availability`),
      ]);
      setVenue(venueRes.data.venue);
      setServices(servicesRes.data.services);
      setAvailability(availRes.data.availability);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateBilling = async () => {
    try {
      const res = await api.post('/bookings/preview-billing', {
        venueId: id,
        guestCount: bookingData.guestCount,
        selectedServices: bookingData.selectedServices,
      });
      setBilling(res.data.billing);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (bookingData.guestCount && showBooking) {
      calculateBilling();
    }
  }, [bookingData.guestCount, bookingData.selectedServices]);

  const handleServiceToggle = (serviceId, unitPrice) => {
    const exists = bookingData.selectedServices.find((s) => s.serviceId === serviceId);
    if (exists) {
      setBookingData({
        ...bookingData,
        selectedServices: bookingData.selectedServices.filter((s) => s.serviceId !== serviceId),
      });
    } else {
      setBookingData({
        ...bookingData,
        selectedServices: [...bookingData.selectedServices, { serviceId, quantity: 1 }],
      });
    }
  };

  const handleQuantityChange = (serviceId, quantity) => {
    setBookingData({
      ...bookingData,
      selectedServices: bookingData.selectedServices.map((s) =>
        s.serviceId === serviceId ? { ...s, quantity: Number(quantity) } : s
      ),
    });
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/bookings/request', { venueId: id, ...bookingData });
      alert('Booking request submitted successfully!');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;
  if (!venue) return <div className="container">Venue not found</div>;

  const availableDates = availability.filter((a) => a.isAvailable && !a.isBlocked).map((a) => a.date);

  return (
    <div className="page-content">
      <div className="container">
        <div style={styles.gallery}>
          {venue.media?.length > 0 ? (
            venue.media.slice(0, 3).map((m, i) => (
              <img key={i} src={m.url} alt={venue.title} style={styles.galleryImage} />
            ))
          ) : (
            <div style={styles.noImage}>No images available</div>
          )}
        </div>

        <div style={styles.content}>
          <div style={styles.main}>
            <h1 style={styles.title}>{venue.title}</h1>
            <p style={styles.location}>📍 {venue.address}, {venue.city}</p>
            <div style={styles.meta}>
              <span className="badge badge-info">{venue.venueType}</span>
              <span>👥 Capacity: {venue.capacity}</span>
            </div>
            <div className="divider"></div>
            <h3>About</h3>
            <p style={styles.description}>{venue.description || 'No description available'}</p>
            <div className="divider"></div>
            <h3>Amenities</h3>
            <div style={styles.amenities}>
              {venue.amenities?.length > 0 ? venue.amenities.map((a, i) => (
                <span key={i} className="badge badge-neutral">{a}</span>
              )) : <p>No amenities listed</p>}
            </div>
            <div className="divider"></div>
            <h3>Services & Pricing</h3>
            {services.length > 0 ? (
              <div style={styles.services}>
                {services.map((s) => (
                  <div key={s.serviceId} style={styles.serviceItem}>
                    <div>
                      <strong>{s.serviceName}</strong>
                      <p style={styles.serviceDesc}>{s.description}</p>
                    </div>
                    <div style={styles.servicePrice}>₹{s.unitPrice} / {s.unitType}</div>
                  </div>
                ))}
              </div>
            ) : <p>No services listed</p>}
          </div>

          <div style={styles.sidebar}>
            <div className="card">
              <div className="card-body">
                <div style={styles.price}>₹{venue.basePrice.toLocaleString()}</div>
                <p style={styles.priceLabel}>Base Price</p>
                {!showBooking ? (
                  <button className="btn btn-primary w-full" onClick={() => setShowBooking(true)}>
                    Book This Venue
                  </button>
                ) : (
                  <form onSubmit={handleSubmitBooking}>
                    <div className="form-group">
                      <label className="form-label">Select Date</label>
                      <select
                        className="form-input form-select"
                        value={bookingData.requestedDate}
                        onChange={(e) => setBookingData({ ...bookingData, requestedDate: e.target.value })}
                        required
                      >
                        <option value="">Choose a date</option>
                        {availableDates.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Guest Count</label>
                      <input
                        type="number"
                        className="form-input"
                        value={bookingData.guestCount}
                        onChange={(e) => setBookingData({ ...bookingData, guestCount: e.target.value })}
                        required
                        min="1"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Food Type</label>
                      <select
                        className="form-input form-select"
                        value={bookingData.foodType}
                        onChange={(e) => setBookingData({ ...bookingData, foodType: e.target.value })}
                      >
                        <option value="veg">Vegetarian</option>
                        <option value="non-veg">Non-Vegetarian</option>
                        <option value="both">Both</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Add-on Services</label>
                      {services.map((s) => {
                        const selected = bookingData.selectedServices.find((sel) => sel.serviceId === s.serviceId);
                        return (
                          <div key={s.serviceId} style={styles.serviceCheckbox}>
                            <label style={styles.checkboxLabel}>
                              <input
                                type="checkbox"
                                checked={!!selected}
                                onChange={() => handleServiceToggle(s.serviceId, s.unitPrice)}
                              />
                              <span>{s.serviceName} (₹{s.unitPrice}/{s.unitType})</span>
                            </label>
                            {selected && (
                              <input
                                type="number"
                                min="1"
                                value={selected.quantity}
                                onChange={(e) => handleQuantityChange(s.serviceId, e.target.value)}
                                style={styles.qtyInput}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {billing && (
                      <div style={styles.billing}>
                        <h4>Billing Summary</h4>
                        {billing.breakdown.map((item, i) => (
                          <div key={i} style={styles.billingRow}>
                            <span>{item.label}</span>
                            <span>₹{item.amount}</span>
                          </div>
                        ))}
                        <div className="divider"></div>
                        <div style={styles.billingTotal}>
                          <strong>Total</strong>
                          <strong>₹{billing.grandTotal.toLocaleString()}</strong>
                        </div>
                      </div>
                    )}
                    <div className="form-group">
                      <label className="form-label">Message (optional)</label>
                      <textarea
                        className="form-input"
                        rows="3"
                        value={bookingData.message}
                        onChange={(e) => setBookingData({ ...bookingData, message: e.target.value })}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
                      {submitting ? <div className="spinner"></div> : 'Submit Booking Request'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  gallery: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' },
  galleryImage: { width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'var(--radius)' },
  noImage: { background: 'var(--border)', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius)' },
  content: { display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' },
  main: {},
  sidebar: { position: 'sticky', top: '100px', height: 'fit-content' },
  title: { fontSize: '2rem', marginBottom: '0.5rem' },
  location: { color: 'var(--text-light)', marginBottom: '1rem' },
  meta: { display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' },
  description: { color: 'var(--text-light)', lineHeight: 1.7 },
  amenities: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' },
  services: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  serviceItem: { display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg)', borderRadius: 'var(--radius-sm)' },
  serviceDesc: { fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' },
  servicePrice: { fontWeight: 600, color: 'var(--primary)' },
  price: { fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' },
  priceLabel: { fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' },
  serviceCheckbox: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' },
  checkboxLabel: { display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer' },
  qtyInput: { width: '60px', padding: '0.3rem', border: '1px solid var(--border)', borderRadius: '4px' },
  billing: { background: 'var(--primary-light)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' },
  billingRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' },
  billingTotal: { display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem' },
};

export default VenueDetail;
