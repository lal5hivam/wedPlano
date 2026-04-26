import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.container}>
        <Link to="/" style={styles.logo}>Wedplano</Link>
        <div style={styles.links}>
          <Link to="/venues" style={styles.link}>Venues</Link>
          {user ? (
            <>
              <Link to={user.role === 'partner' ? '/partner/dashboard' : '/dashboard'} style={styles.link}>
                Dashboard
              </Link>
              <Link to="/notifications" style={styles.link}>Notifications</Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/signup"><button className="btn btn-primary btn-sm">Sign Up</button></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: 'var(--bg-white)',
    borderBottom: '1px solid var(--border)',
    padding: '1rem 0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: 'var(--shadow)',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: '1.5rem',
    fontFamily: "'Playfair Display', serif",
    fontWeight: 700,
    color: 'var(--primary)',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  link: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: 'var(--text)',
    transition: 'color 0.2s',
  },
};

export default Navbar;
