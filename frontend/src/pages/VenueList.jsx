import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../utils/api';

const VenueList = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
    venueType: searchParams.get('venueType') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  });

  useEffect(() => {
    fetchVenues();
  }, [searchParams]);

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(searchParams);
      const res = await api.get('/venues', { params });
      setVenues(res.data.venues);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    const params = Object.entries(newFilters).filter(([_, v]) => v);
    setSearchParams(Object.fromEntries(params));
  };

  return (
    <div className="page-content">
      <div className="container">
        <h1 style={styles.title}>Browse Venues</h1>

        <div className="card" style={styles.filterCard}>
          <div className="card-body">
            {/* filter-grid uses CSS class for responsive columns */}
            <div style={styles.filterGrid} className="filter-grid">
              <input
                type="text"
                placeholder="Search venues..."
                className="form-input"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
              <input
                type="text"
                placeholder="City"
                className="form-input"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
              />
              <select
                className="form-input form-select"
                value={filters.venueType}
                onChange={(e) => handleFilterChange('venueType', e.target.value)}
              >
                <option value="">All Types</option>
                <option value="banquet">Banquet Hall</option>
                <option value="garden">Garden</option>
                <option value="resort">Resort</option>
                <option value="hotel">Hotel</option>
              </select>
              <input
                type="number"
                placeholder="Min Price"
                className="form-input"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
              <input
                type="number"
                placeholder="Max Price"
                className="form-input"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner"></div></div>
        ) : venues.length === 0 ? (
          <div style={styles.empty}>No venues found</div>
        ) : (
          <div className="venue-grid" style={styles.grid}>
            {venues.map((venue) => (
              <Link to={`/venues/${venue.venueId}`} key={venue.venueId} className="card" style={styles.venueCard}>
                <div style={styles.imageContainer}>
                  {venue.media?.[0] ? (
                    <img src={venue.media[0].url} alt={venue.title} style={styles.image} />
                  ) : (
                    <div style={styles.placeholder}>No Image</div>
                  )}
                </div>
                <div className="card-body">
                  <h3 style={styles.venueTitle}>{venue.title}</h3>
                  <p style={styles.location}>📍 {venue.city}</p>
                  <div style={styles.details}>
                    <span>👥 {venue.capacity} guests</span>
                    <span className="badge badge-info">{venue.venueType}</span>
                  </div>
                  <div style={styles.price}>₹{venue.basePrice.toLocaleString()}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  title: { fontSize: '2rem', marginBottom: '1.5rem' },
  filterCard: { marginBottom: '2rem' },
  filterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
  },
  grid: { marginTop: '2rem' },
  venueCard: { cursor: 'pointer', transition: 'transform 0.2s', display: 'block' },
  imageContainer: { height: '200px', overflow: 'hidden', background: 'var(--border)' },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  placeholder: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)',
  },
  venueTitle: { fontSize: '1.2rem', marginBottom: '0.5rem' },
  location: { color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.5rem' },
  details: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '0.75rem',
    fontSize: '0.85rem',
  },
  price: { fontSize: '1.3rem', fontWeight: 600, color: 'var(--primary)', marginTop: '0.75rem' },
  empty: { textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' },
};

export default VenueList;
