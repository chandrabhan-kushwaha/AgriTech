import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, Lock, Mail, User, Phone, MapPin, ArrowRight } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'farmer',
    phone: '',
    region: 'Central Agricultural Belt',
    preferredLanguage: 'en',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await register(formData);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center" style={{ minHeight: '85vh' }}>
      <div className="w-100" style={{ maxWidth: '520px' }}>
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center text-white rounded-3 mb-2 shadow"
            style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' }}
          >
            <Sprout size={28} />
          </div>
          <h2 className="fw-bold mb-1">Create Your Account</h2>
          <p className="text-muted small">Join Agri-Tech to digitize your farm operations</p>
        </div>

        <div className="agri-card p-4 p-sm-5 shadow-sm">
          {error && (
            <div className="alert alert-danger py-2 small mb-4" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted mb-1">Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted"><User size={16} /></span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Balwant Singh"
                  className="form-control border-start-0 ps-1"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-muted mb-1">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted"><Mail size={16} /></span>
                <input
                  type="email"
                  required
                  placeholder="farmer@domain.com"
                  className="form-control border-start-0 ps-1"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-muted mb-1">Password (min. 6 characters)</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted"><Lock size={16} /></span>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="form-control border-start-0 ps-1"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="row g-2 mb-3">
              <div className="col-sm-6">
                <label className="form-label small fw-bold text-muted mb-1">Account Role</label>
                <select
                  className="form-select form-select-sm py-2"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="farmer">Farmer / Grower</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>
              <div className="col-sm-6">
                <label className="form-label small fw-bold text-muted mb-1">Language</label>
                <select
                  className="form-select form-select-sm py-2"
                  value={formData.preferredLanguage}
                  onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="mr">मराठी (Marathi)</option>
                  <option value="es">Español (Spanish)</option>
                </select>
              </div>
            </div>

            <div className="row g-2 mb-4">
              <div className="col-sm-6">
                <label className="form-label small fw-bold text-muted mb-1">Phone Number</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted"><Phone size={15} /></span>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    className="form-control border-start-0 ps-1"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <label className="form-label small fw-bold text-muted mb-1">Farming Region / State</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted"><MapPin size={15} /></span>
                  <input
                    type="text"
                    placeholder="Maharashtra, Punjab, etc."
                    className="form-control border-start-0 ps-1"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="agri-btn-primary w-100 justify-content-center py-2.5 mb-2"
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-4 small text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-success fw-bold text-decoration-none">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
