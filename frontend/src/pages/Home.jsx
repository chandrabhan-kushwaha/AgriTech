import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
  Sprout,
  Trees,
  Wheat,
  FlaskConical,
  CloudSun,
  ShieldAlert,
  ShoppingBag,
  MessageSquareShare,
  Users,
  ArrowRight,
  TrendingUp,
  Droplets,
  Wind,
  CheckCircle,
} from 'lucide-react';

const Home = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    API.get('/weather')
      .then(res => setWeather(res.data.data))
      .catch(err => console.error('Weather load error:', err));
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Hero Section */}
      <section className="agri-gradient-header py-5">
        <div className="container py-lg-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-7 text-white">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill mb-3" style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                <Sprout size={16} className="text-success" />
                <span className="small fw-semibold text-emerald">Empowering Smart Sustainable Farming</span>
              </div>
              <h1 className="display-4 fw-extrabold mb-3 text-white lh-sm">
                {t('heroTitle')}
              </h1>
              <p className="lead text-light mb-4 opacity-90" style={{ maxWidth: '620px' }}>
                {t('heroSubtitle')}
              </p>

              <div className="d-flex flex-wrap gap-3">
                {user ? (
                  <Link to="/dashboard" className="agri-btn-primary px-4 py-2.5 fs-6 shadow">
                    <span>{t('explorePlatform')}</span>
                    <ArrowRight size={18} />
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="agri-btn-primary px-4 py-2.5 fs-6 shadow">
                      <span>Get Started Free</span>
                      <ArrowRight size={18} />
                    </Link>
                    <Link to="/login" className="agri-btn-outline px-4 py-2.5 fs-6 text-white border-white">
                      <span>{t('login')}</span>
                    </Link>
                  </>
                )}
                <Link to="/resources" className="btn btn-outline-light px-4 py-2.5 fs-6 rounded-2 d-inline-flex align-items-center gap-2">
                  <ShoppingBag size={18} />
                  <span>{t('browseStore')}</span>
                </Link>
              </div>

              {/* Highlights row */}
              <div className="row mt-5 pt-3 g-3 border-top border-success-subtle border-opacity-25">
                <div className="col-sm-4">
                  <h3 className="fw-bold text-white mb-0">100%</h3>
                  <span className="small text-light opacity-75">Data-Driven Advisory</span>
                </div>
                <div className="col-sm-4">
                  <h3 className="fw-bold text-white mb-0">4+</h3>
                  <span className="small text-light opacity-75">Regional Languages</span>
                </div>
                <div className="col-sm-4">
                  <h3 className="fw-bold text-white mb-0">24/7</h3>
                  <span className="small text-light opacity-75">Agronomist Support</span>
                </div>
              </div>
            </div>

            {/* Quick Weather Snapshot Card */}
            <div className="col-lg-5">
              {weather ? (
                <div className="agri-card-dark p-4 shadow-lg position-relative">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <span className="badge bg-success bg-opacity-25 text-success mb-1">Live Climate Feed</span>
                      <h4 className="fw-bold mb-0 text-white">{weather.locationName}</h4>
                      <span className="small text-secondary">{weather.state}</span>
                    </div>
                    <div className="p-2 rounded-circle bg-success bg-opacity-20 text-success">
                      <CloudSun size={32} />
                    </div>
                  </div>

                  <div className="d-flex align-items-baseline gap-3 my-3">
                    <span className="display-4 fw-bold text-white">{weather.current.temperature}°C</span>
                    <div>
                      <span className="d-block fw-semibold text-warning">{weather.current.condition}</span>
                      <span className="small text-secondary">Feels like {weather.current.feelsLike}°C</span>
                    </div>
                  </div>

                  <div className="row g-2 pt-2 border-top border-secondary border-opacity-25 text-secondary small">
                    <div className="col-4 d-flex align-items-center gap-1.5">
                      <Droplets size={15} className="text-info" />
                      <span>{weather.current.humidity}% Humidity</span>
                    </div>
                    <div className="col-4 d-flex align-items-center gap-1.5">
                      <Wind size={15} className="text-success" />
                      <span>{weather.current.windSpeed} km/h Wind</span>
                    </div>
                    <div className="col-4 d-flex align-items-center gap-1.5">
                      <TrendingUp size={15} className="text-warning" />
                      <span>UV {weather.current.uvIndex} (High)</span>
                    </div>
                  </div>

                  {weather.agriculturalAdvisories && weather.agriculturalAdvisories.length > 0 && (
                    <div className="mt-3 p-2.5 rounded-3 bg-success bg-opacity-10 border border-success border-opacity-25">
                      <p className="small mb-0 text-light fw-medium">
                        💡 <strong>Advisory:</strong> {weather.agriculturalAdvisories[0]}
                      </p>
                    </div>
                  )}

                  <div className="mt-3 text-end">
                    <Link to="/weather" className="small text-success text-decoration-none fw-semibold">
                      View 5-Day Agro Forecast &rarr;
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="agri-card-dark p-5 text-center">
                  <div className="spinner-border text-success mb-2" role="status"></div>
                  <p className="small text-secondary mb-0">Loading regional climate station...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center max-w-xl mx-auto mb-5">
            <span className="badge bg-success-subtle text-success fw-bold px-3 py-1.5 rounded-pill mb-2">
              COMPREHENSIVE SMART FARMING SUITE
            </span>
            <h2 className="fw-bold display-6">Engineered for Agricultural Excellence</h2>
            <p className="text-muted">
              Built on the robust MERN stack with modern responsive design, role-based security, and multilingual accessibility.
            </p>
          </div>

          <div className="row g-4">
            {/* Feature 1 */}
            <div className="col-md-6 col-lg-4">
              <div className="agri-card h-100 p-4 border-0 shadow-sm">
                <div className="stat-icon-wrapper bg-success-subtle text-success mb-3">
                  <Trees size={24} />
                </div>
                <h5 className="fw-bold mb-2">Farm Profile Management</h5>
                <p className="text-muted small mb-3">
                  Map and organize your agricultural plots, soil classifications (black cotton, loamy, alluvial), and irrigation systems with precision.
                </p>
                <Link to="/farms" className="text-success small fw-semibold text-decoration-none d-flex align-items-center gap-1">
                  Manage Farms <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="col-md-6 col-lg-4">
              <div className="agri-card h-100 p-4 border-0 shadow-sm">
                <div className="stat-icon-wrapper bg-warning-subtle text-warning mb-3">
                  <Wheat size={24} />
                </div>
                <h5 className="fw-bold mb-2">Crop Monitoring & Lifecycle</h5>
                <p className="text-muted small mb-3">
                  Track crop phenology from germination to harvest. Log fertilization, weeding, and pest sprays with estimated yield projections.
                </p>
                <Link to="/crops" className="text-success small fw-semibold text-decoration-none d-flex align-items-center gap-1">
                  Track Crops <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="col-md-6 col-lg-4">
              <div className="agri-card h-100 p-4 border-0 shadow-sm">
                <div className="stat-icon-wrapper bg-info-subtle text-info mb-3">
                  <FlaskConical size={24} />
                </div>
                <h5 className="fw-bold mb-2">Soil Health & NPK Intelligence</h5>
                <p className="text-muted small mb-3">
                  Automated diagnostic reports evaluating pH balance, Nitrogen, Phosphorus, Potassium, and organic carbon with custom fertilizer guidance.
                </p>
                <Link to="/soil" className="text-success small fw-semibold text-decoration-none d-flex align-items-center gap-1">
                  Analyze Soil <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="col-md-6 col-lg-4">
              <div className="agri-card h-100 p-4 border-0 shadow-sm">
                <div className="stat-icon-wrapper bg-danger-subtle text-danger mb-3">
                  <ShieldAlert size={24} />
                </div>
                <h5 className="fw-bold mb-2">Early Pest Alerts & Outbreaks</h5>
                <p className="text-muted small mb-3">
                  Real-time regional alerts with pest symptoms, bio-control strategies, and targeted treatments to avert crop damage before it spreads.
                </p>
                <Link to="/pests" className="text-success small fw-semibold text-decoration-none d-flex align-items-center gap-1">
                  View Alerts <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="col-md-6 col-lg-4">
              <div className="agri-card h-100 p-4 border-0 shadow-sm">
                <div className="stat-icon-wrapper bg-primary-subtle text-primary mb-3">
                  <ShoppingBag size={24} />
                </div>
                <h5 className="fw-bold mb-2">Agricultural Resource Marketplace</h5>
                <p className="text-muted small mb-3">
                  Purchase certified hybrid seeds, organic bio-nutrients, micro-irrigation lines, and battery sprayers with step-by-step order tracking.
                </p>
                <Link to="/resources" className="text-success small fw-semibold text-decoration-none d-flex align-items-center gap-1">
                  Browse Store <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="col-md-6 col-lg-4">
              <div className="agri-card h-100 p-4 border-0 shadow-sm">
                <div className="stat-icon-wrapper bg-success-subtle text-success mb-3">
                  <MessageSquareShare size={24} />
                </div>
                <h5 className="fw-bold mb-2">Agronomist Consultation & Forums</h5>
                <p className="text-muted small mb-3">
                  Consult agricultural scientists directly for crop diagnosis and exchange firsthand farming wisdom on community discussion boards.
                </p>
                <Link to="/consultation" className="text-success small fw-semibold text-decoration-none d-flex align-items-center gap-1">
                  Ask Expert <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-5" style={{ background: '#f1f5f9' }}>
        <div className="container py-4">
          <div className="p-4 p-md-5 rounded-4 agri-glass text-center border-0 shadow-sm">
            <h2 className="fw-bold mb-3">Ready to Transform Your Farm Yields?</h2>
            <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '600px' }}>
              Join thousands of progressive farmers leveraging real-time weather analytics, precision soil tests, and certified agricultural supplies.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Link to="/register" className="agri-btn-primary px-4 py-2">
                Register Your Farm Now
              </Link>
              <Link to="/resources" className="agri-btn-secondary px-4 py-2">
                Explore Marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
