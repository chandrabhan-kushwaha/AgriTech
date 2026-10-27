import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'farmer') {
      setEmail('farmer@agritech.com');
      setPassword('farmer123');
    } else {
      setEmail('admin@agritech.com');
      setPassword('admin123');
    }
    setError('');
  };

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="w-100" style={{ maxWidth: '440px' }}>
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center text-white rounded-3 mb-2 shadow"
            style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' }}
          >
            <Sprout size={28} />
          </div>
          <h2 className="fw-bold mb-1">Welcome Back</h2>
          <p className="text-muted small">Sign in to your Agri-Tech smart farming portal</p>
        </div>

        <div className="agri-card p-4 p-sm-5 shadow-sm">
          {error && (
            <div className="alert alert-danger py-2 small mb-4" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted mb-1">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  required
                  placeholder="farmer@agritech.com"
                  className="form-control border-start-0 ps-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between">
                <label className="form-label small fw-bold text-muted mb-1">Password</label>
              </div>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="form-control border-start-0 ps-1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="agri-btn-primary w-100 justify-content-center py-2.5 mb-3"
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Demo Logins */}
          <div className="pt-3 border-top mt-3">
            <span className="d-block small text-muted text-center mb-2 fw-semibold">Quick Demo Logins:</span>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-success flex-fill d-flex align-items-center justify-content-center gap-1"
                onClick={() => fillDemo('farmer')}
              >
                <span>🌾 Farmer Demo</span>
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-danger flex-fill d-flex align-items-center justify-content-center gap-1"
                onClick={() => fillDemo('admin')}
              >
                <span>🛡️ Admin Demo</span>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-4 small text-muted">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-success fw-bold text-decoration-none">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
