import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.container}>
        <Link to="/" style={styles.logo} onClick={closeMenu}>Wedplano</Link>

        {/* Hamburger button — visible only on mobile via CSS */}
        <button
          className="nav-hamburger"
          style={styles.hamburger}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span style={styles.bar}></span>
          <span style={styles.bar}></span>
          <span style={styles.bar}></span>
        </button>

        {/* Desktop links */}
        <div style={styles.links} className="nav-desktop-links">
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

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          <Link to="/venues" style={styles.mobileLink} onClick={closeMenu}>Venues</Link>
          {user ? (
            <>
              <Link
                to={user.role === 'partner' ? '/partner/dashboard' : '/dashboard'}
                style={styles.mobileLink}
                onClick={closeMenu}
              >
                Dashboard
              </Link>
              <Link to="/notifications" style={styles.mobileLink} onClick={closeMenu}>Notifications</Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.mobileLink} onClick={closeMenu}>Login</Link>
              <Link to="/signup" onClick={closeMenu}>
                <button className="btn btn-primary btn-sm" style={{ width: '100%' }}>Sign Up</button>
              </Link>
            </>
          )}
        </div>
      )}
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
    position: 'relative',
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
  hamburger: {
    display: 'none',          // shown via CSS on mobile
    flexDirection: 'column',
    gap: '5px',
    background: 'none',
    border: 'none',
    padding: '4px',
    cursor: 'pointer',
  },
  bar: {
    display: 'block',
    width: '22px',
    height: '2px',
    background: 'var(--text)',
    borderRadius: '2px',
  },
  mobileMenu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1rem 1.5rem',
    background: 'var(--bg-white)',
    borderTop: '1px solid var(--border)',
    boxShadow: 'var(--shadow)',
  },
  mobileLink: {
    fontSize: '1rem',
    fontWeight: 500,
    color: 'var(--text)',
    padding: '0.25rem 0',
  },
};

// Override display for mobile via a style tag injected once
const mobileStyle = `
  @media (max-width: 768px) {
    .nav-desktop-links { display: none !important; }
    .nav-hamburger { display: flex !important; }
  }
`;

// Inject once
if (typeof document !== 'undefined' && !document.getElementById('navbar-mobile-style')) {
  const tag = document.createElement('style');
  tag.id = 'navbar-mobile-style';
  tag.textContent = mobileStyle;
  document.head.appendChild(tag);
}

export default Navbar;
