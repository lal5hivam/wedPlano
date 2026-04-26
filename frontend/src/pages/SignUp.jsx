import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignUp = () => {
  const [role, setRole] = useState('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { registerUser, registerPartner } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = { name, email, password, phone };
      const user = role === 'user' ? await registerUser(data) : await registerPartner(data);
      navigate(user.role === 'partner' ? '/partner/dashboard' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div className="container">
        <div style={styles.formContainer}>
          <div className="card" style={styles.card}>
            <div className="card-body">
              <h2 style={styles.title}>Create Account</h2>
              <p style={styles.subtitle}>Join Wedplano today</p>
              {error && <div className="alert alert-error">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">I am a</label>
                  <select className="form-input form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="user">Customer</option>
                    <option value="partner">Venue Partner</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone (optional)</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                  {loading ? <div className="spinner"></div> : 'Sign Up'}
                </button>
              </form>
              <p style={styles.footer}>
                Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '3rem 0', minHeight: 'calc(100vh - 80px)' },
  formContainer: { maxWidth: '450px', margin: '0 auto' },
  card: { width: '100%' },
  title: { fontSize: '1.8rem', marginBottom: '0.5rem', textAlign: 'center' },
  subtitle: { color: 'var(--text-light)', textAlign: 'center', marginBottom: '2rem' },
  footer: { textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-light)' },
  link: { color: 'var(--primary)', fontWeight: 500 },
};

export default SignUp;
