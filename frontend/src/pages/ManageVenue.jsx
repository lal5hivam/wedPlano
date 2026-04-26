import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const ManageVenue = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [venue, setVenue] = useState({
    title: '',
    description: '',
    venueType: 'banquet',
    capacity: '',
    city: '',
    address: '',
    basePrice: '',
    perGuestPrice: '',
    amenities: '',
    policies: '',
  });
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ serviceName: '', unitType: 'unit', unitPrice: '', description: '' });
  const [availability, setAvailability] = useState('');

  useEffect(() => {
    if (isEdit) fetchVenue();
  }, [id]);

  const fetchVenue = async () => {
    try {
      const [venueRes, servicesRes] = await Promise.all([
        api.get(`/venues/${id}`),
        api.get(`/venues/${id}/services`),
      ]);
      const v = venueRes.data.venue;
      setVenue({
        title: v.title,
        description: v.description,
        venueType: v.venueType,
        capacity: v.capacity,
        city: v.city,
        address: v.address,
        basePrice: v.basePrice,
        perGuestPrice: v.perGuestPrice || '',
        amenities: v.amenities?.join(', ') || '',
        policies: v.policies || '',
      });
      setServices(servicesRes.data.services);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = {
        ...venue,
        amenities: venue.amenities.split(',').map((a) => a.trim()).filter(Boolean),
      };
      if (isEdit) {
        await api.put(`/venues/${id}`, data);
        alert('Venue updated!');
      } else {
        const res = await api.post('/venues', data);
        alert('Venue created!');
        navigate(`/partner/venues/${res.data.venue.venueId}/edit`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save venue');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/venues/${id}/services`, newService);
      setNewService({ serviceName: '', unitType: 'unit', unitPrice: '', description: '' });
      fetchVenue();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add service');
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!confirm('Delete this service?')) return;
    try {
      await api.delete(`/services/${serviceId}`);
      fetchVenue();
    } catch (err) {
      alert('Failed to delete service');
    }
  };

  const handleSetAvailability = async (e) => {
    e.preventDefault();
    const dates = availability.split(',').map((d) => d.trim()).filter(Boolean);
    if (dates.length === 0) return alert('Enter dates');
    try {
      await api.post(`/venues/${id}/availability`, { dates });
      alert(`${dates.length} dates added!`);
      setAvailability('');
    } catch (err) {
      alert('Failed to set availability');
    }
  };

  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;

  return (
    <div className="page-content">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 style={styles.title}>{isEdit ? 'Edit Venue' : 'Add New Venue'}</h1>

        <div className="card">
          <div className="card-body">
            <h3>Venue Details</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Venue Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={venue.title}
                  onChange={(e) => setVenue({ ...venue, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  rows="4"
                  value={venue.description}
                  onChange={(e) => setVenue({ ...venue, description: e.target.value })}
                />
              </div>
              <div style={styles.row}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Venue Type</label>
                  <select
                    className="form-input form-select"
                    value={venue.venueType}
                    onChange={(e) => setVenue({ ...venue, venueType: e.target.value })}
                  >
                    <option value="banquet">Banquet Hall</option>
                    <option value="garden">Garden</option>
                    <option value="resort">Resort</option>
                    <option value="hotel">Hotel</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Capacity</label>
                  <input
                    type="number"
                    className="form-input"
                    value={venue.capacity}
                    onChange={(e) => setVenue({ ...venue, capacity: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-input"
                  value={venue.city}
                  onChange={(e) => setVenue({ ...venue, city: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-input"
                  value={venue.address}
                  onChange={(e) => setVenue({ ...venue, address: e.target.value })}
                  required
                />
              </div>
              <div style={styles.row}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Base Price (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={venue.basePrice}
                    onChange={(e) => setVenue({ ...venue, basePrice: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Per Guest Price (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={venue.perGuestPrice}
                    onChange={(e) => setVenue({ ...venue, perGuestPrice: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Amenities (comma-separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Parking, AC, WiFi, etc."
                  value={venue.amenities}
                  onChange={(e) => setVenue({ ...venue, amenities: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Policies</label>
                <textarea
                  className="form-input"
                  rows="3"
                  value={venue.policies}
                  onChange={(e) => setVenue({ ...venue, policies: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? <div className="spinner"></div> : isEdit ? 'Update Venue' : 'Create Venue'}
              </button>
            </form>
          </div>
        </div>

        {isEdit && (
          <>
            <div className="card" style={{ marginTop: '2rem' }}>
              <div className="card-body">
                <h3>Services & Pricing</h3>
                {services.length > 0 && (
                  <div style={styles.serviceList}>
                    {services.map((s) => (
                      <div key={s.serviceId} style={styles.serviceItem}>
                        <div>
                          <strong>{s.serviceName}</strong>
                          <p style={styles.serviceDesc}>₹{s.unitPrice} / {s.unitType}</p>
                        </div>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteService(s.serviceId)}>
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <form onSubmit={handleAddService} style={{ marginTop: '1.5rem' }}>
                  <div style={styles.row}>
                    <div className="form-group" style={{ flex: 2 }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Service name"
                        value={newService.serviceName}
                        onChange={(e) => setNewService({ ...newService, serviceName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Unit (e.g., plate)"
                        value={newService.unitType}
                        onChange={(e) => setNewService({ ...newService, unitType: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="Price"
                        value={newService.unitPrice}
                        onChange={(e) => setNewService({ ...newService, unitPrice: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-outline btn-sm">+ Add Service</button>
                </form>
              </div>
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
              <div className="card-body">
                <h3>Availability</h3>
                <form onSubmit={handleSetAvailability}>
                  <div className="form-group">
                    <label className="form-label">Add Available Dates (comma-separated YYYY-MM-DD)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="2024-12-25, 2024-12-26"
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-outline btn-sm">Set Availability</button>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  title: { fontSize: '2rem', marginBottom: '2rem' },
  row: { display: 'flex', gap: '1rem' },
  serviceList: { display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' },
  serviceItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg)', borderRadius: 'var(--radius-sm)' },
  serviceDesc: { fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' },
};

export default ManageVenue;
