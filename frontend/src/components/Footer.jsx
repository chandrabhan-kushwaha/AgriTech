import React from 'react';
import { Sprout, PhoneCall, ShieldCheck, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="mt-auto pt-5 pb-4 border-top" style={{ backgroundColor: '#071810', color: '#94a3b8' }}>
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="d-flex align-items-center justify-content-center text-white rounded-3"
                style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' }}
              >
                <Sprout size={20} />
              </div>
              <span className="fw-bold fs-5 text-white" style={{ fontFamily: 'Outfit' }}>
                Agri<span style={{ color: '#10b981' }}>-Tech</span>
              </span>
            </div>
            <p className="small mb-3 text-secondary">
              A scalable, full-stack smart farming ecosystem bridging traditional agrarian wisdom with real-time weather analytics, automated soil NPK intelligence, early pest alerts, and certified agricultural supplies.
            </p>
            <div className="d-flex align-items-center gap-2 text-white small">
              <PhoneCall size={16} className="text-success" />
              <span>Kisan Agronomy Helpline: <strong>1800-180-1551</strong> (Toll Free)</span>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-white fw-bold mb-3 small tracking-wider text-uppercase">Modules</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li><a href="/farms" className="text-secondary text-decoration-none hover-white">Farm Profiles</a></li>
              <li><a href="/crops" className="text-secondary text-decoration-none hover-white">Crop Monitoring</a></li>
              <li><a href="/soil" className="text-secondary text-decoration-none hover-white">Soil Health</a></li>
              <li><a href="/weather" className="text-secondary text-decoration-none hover-white">Weather Forecast</a></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-white fw-bold mb-3 small tracking-wider text-uppercase">Services</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li><a href="/pests" className="text-secondary text-decoration-none hover-white">Pest Outbreak Alerts</a></li>
              <li><a href="/resources" className="text-secondary text-decoration-none hover-white">Agricultural Store</a></li>
              <li><a href="/consultation" className="text-secondary text-decoration-none hover-white">Expert Consultation</a></li>
              <li><a href="/forum" className="text-secondary text-decoration-none hover-white">Community Forum</a></li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="p-3 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <ShieldCheck size={18} className="text-success" />
                <span className="text-white fw-semibold small">MERN Production Ready</span>
              </div>
              <p className="small mb-2 text-secondary">
                Secured with JWT authentication, role-based authorization, bcrypt encryption, and MongoDB relational integrity.
              </p>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-success-subtle text-success border border-success-subtle">MongoDB Atlas / Local</span>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle">Node.js Express</span>
                <span className="badge bg-warning-subtle text-warning border border-warning-subtle">React.js Vite</span>
              </div>
            </div>
          </div>
        </div>

        <hr style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-secondary gap-2">
          <span>&copy; 2026 Agri-Tech Smart Farming Management System. All rights reserved.</span>
          <span className="d-flex align-items-center gap-1">
            Empowering sustainable agriculture with precision technology
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
