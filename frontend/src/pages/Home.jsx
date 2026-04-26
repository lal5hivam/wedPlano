import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/venues?search=${search}`);
  };

  return (
    <div>
      <section style={styles.hero}>
        <div className="container text-center">
          <h1 style={styles.title}>Find Your Perfect Wedding Venue</h1>
          <p style={styles.subtitle}>Discover and book stunning venues for your special day</p>
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <input
              type="text"
              placeholder="Search by city, venue name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={styles.searchInput}
            />
            <button type="submit" className="btn btn-primary btn-lg">Search Venues</button>
          </form>
        </div>
      </section>

      <section style={styles.features}>
        <div className="container">
          <h2 style={styles.sectionTitle}>Why Choose Wedplano?</h2>
          <div style={styles.featureGrid}>
            <div className="card">
              <div className="card-body text-center">
                <div style={styles.icon}>🏛️</div>
                <h3 style={styles.featureTitle}>Curated Venues</h3>
                <p style={styles.featureText}>Browse verified wedding venues with detailed information</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body text-center">
                <div style={styles.icon}>📅</div>
                <h3 style={styles.featureTitle}>Real-time Availability</h3>
                <p style={styles.featureText}>Check date availability and book instantly</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body text-center">
                <div style={styles.icon}>💰</div>
                <h3 style={styles.featureTitle}>Transparent Pricing</h3>
                <p style={styles.featureText}>See detailed pricing breakdown before booking</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #f5ead8 0%, #e8dcc8 100%)',
    padding: '5rem 0',
    minHeight: '500px',
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontSize: '3rem',
    marginBottom: '1rem',
    color: 'var(--secondary)',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: 'var(--text-light)',
    marginBottom: '2.5rem',
  },
  searchForm: {
    display: 'flex',
    gap: '1rem',
    maxWidth: '600px',
    margin: '0 auto',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    minWidth: '300px',
  },
  features: {
    padding: '4rem 0',
  },
  sectionTitle: {
    fontSize: '2rem',
    textAlign: 'center',
    marginBottom: '3rem',
    color: 'var(--secondary)',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
  },
  icon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  featureTitle: {
    fontSize: '1.3rem',
    marginBottom: '0.5rem',
    color: 'var(--secondary)',
  },
  featureText: {
    color: 'var(--text-light)',
    fontSize: '0.95rem',
  },
};

export default Home;
