import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="page-content">
      <div className="container" style={{ maxWidth: '600px' }}>
        <h1 style={styles.title}>My Profile</h1>
        <div className="card">
          <div className="card-body">
            <div style={styles.field}>
              <label style={styles.label}>Name</label>
              <p style={styles.value}>{user.name}</p>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <p style={styles.value}>{user.email}</p>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Phone</label>
              <p style={styles.value}>{user.phone || 'Not provided'}</p>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Role</label>
              <p style={styles.value}>
                <span className="badge badge-info">{user.role === 'partner' ? 'Venue Partner' : 'Customer'}</span>
              </p>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Member Since</label>
              <p style={styles.value}>{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  title: { fontSize: '2rem', marginBottom: '2rem' },
  field: { marginBottom: '1.5rem' },
  label: { fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' },
  value: { fontSize: '1rem', color: 'var(--text)' },
};

export default Profile;
