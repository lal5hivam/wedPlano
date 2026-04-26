import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === 'partner' ? '/partner/dashboard' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
              <h2 style={styles.title}>Welcome Back</h2>
              <p style={styles.subtitle}>Sign in to your account</p>
              {error && <div className="alert alert-error">{error}</div>}
              <form onSubmit={handleSubmit}>
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
                  />
                </div>
                <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                  {loading ? <div className="spinner"></div> : 'Sign In'}
                </button>
              </form>
              <p style={styles.footer}>
                Don't have an account? <Link to="/signup" style={styles.link}>Sign up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '3rem 0', minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center' },
  formContainer: { maxWidth: '450px', margin: '0 auto' },
  card: { width: '100%' },
  title: { fontSize: '1.8rem', marginBottom: '0.5rem', textAlign: 'center' },
  subtitle: { color: 'var(--text-light)', textAlign: 'center', marginBottom: '2rem' },
  footer: { textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-light)' },
  link: { color: 'var(--primary)', fontWeight: 500 },
};

export default Login;
