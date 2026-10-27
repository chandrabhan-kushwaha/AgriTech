import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import LanguageSelector from './LanguageSelector';
import {
  Sprout,
  LayoutDashboard,
  Trees,
  Wheat,
  FlaskConical,
  CloudSun,
  ShieldAlert,
  ShoppingBag,
  MessageSquareShare,
  Users,
  ShieldCheck,
  ShoppingCart,
  LogOut,
  User as UserIcon,
} from 'lucide-react';

const Navbar = ({ onOpenCart }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { totalItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-xl agri-navbar">
      <div className="container-fluid px-lg-4">
        {/* Brand */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2 text-decoration-none">
          <div
            className="d-flex align-items-center justify-content-center text-white rounded-3 shadow-sm"
            style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' }}
          >
            <Sprout size={22} />
          </div>
          <div className="d-flex flex-column">
            <span className="fw-bold fs-5 tracking-tight lh-1" style={{ color: '#0f3622', fontFamily: 'Outfit' }}>
              Agri<span style={{ color: '#10b981' }}>-Tech</span>
            </span>
            <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.05em' }}>
              SMART FARMING
            </span>
          </div>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0 p-1"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#agriNavbarContent"
          aria-controls="agriNavbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="agriNavbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-xl-0 ms-xl-3 gap-1">
            <li className="nav-item">
              <NavLink to="/" className={({ isActive }) => `nav-link agri-nav-link ${isActive ? 'active' : ''}`} end>
                <LayoutDashboard size={17} />
                <span>{t('home')}</span>
              </NavLink>
            </li>

            {user && (
              <>
                <li className="nav-item">
                  <NavLink to="/dashboard" className={({ isActive }) => `nav-link agri-nav-link ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={17} />
                    <span>{t('dashboard')}</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/farms" className={({ isActive }) => `nav-link agri-nav-link ${isActive ? 'active' : ''}`}>
                    <Trees size={17} />
                    <span>{t('farms')}</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/crops" className={({ isActive }) => `nav-link agri-nav-link ${isActive ? 'active' : ''}`}>
                    <Wheat size={17} />
                    <span>{t('crops')}</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/soil" className={({ isActive }) => `nav-link agri-nav-link ${isActive ? 'active' : ''}`}>
                    <FlaskConical size={17} />
                    <span>{t('soil')}</span>
                  </NavLink>
                </li>
              </>
            )}

            <li className="nav-item">
              <NavLink to="/weather" className={({ isActive }) => `nav-link agri-nav-link ${isActive ? 'active' : ''}`}>
                <CloudSun size={17} />
                <span>{t('weather')}</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/pests" className={({ isActive }) => `nav-link agri-nav-link ${isActive ? 'active' : ''}`}>
                <ShieldAlert size={17} />
                <span>{t('pests')}</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/resources" className={({ isActive }) => `nav-link agri-nav-link ${isActive ? 'active' : ''}`}>
                <ShoppingBag size={17} />
                <span>{t('resources')}</span>
              </NavLink>
            </li>

            {user && (
              <>
                <li className="nav-item">
                  <NavLink to="/consultation" className={({ isActive }) => `nav-link agri-nav-link ${isActive ? 'active' : ''}`}>
                    <MessageSquareShare size={17} />
                    <span>{t('consultation')}</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/forum" className={({ isActive }) => `nav-link agri-nav-link ${isActive ? 'active' : ''}`}>
                    <Users size={17} />
                    <span>{t('forum')}</span>
                  </NavLink>
                </li>
              </>
            )}

            {user && user.role === 'admin' && (
              <li className="nav-item">
                <NavLink to="/admin" className={({ isActive }) => `nav-link agri-nav-link text-danger ${isActive ? 'active' : ''}`}>
                  <ShieldCheck size={17} className="text-danger" />
                  <span className="fw-bold">{t('admin')}</span>
                </NavLink>
              </li>
            )}
          </ul>

          {/* Right Action Icons */}
          <div className="d-flex align-items-center gap-2 mt-3 mt-xl-0">
            {/* Language Selector */}
            <LanguageSelector />

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="btn btn-outline-success position-relative p-2 rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: '38px', height: '38px' }}
              title={t('myCart')}
            >
              <ShoppingCart size={18} />
              {totalItemCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.68rem' }}>
                  {totalItemCount}
                </span>
              )}
            </button>

            {/* User Profile or Auth Buttons */}
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-light border d-flex align-items-center gap-2 rounded-pill px-3 py-1 shadow-sm"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ background: '#ffffff', borderColor: '#e2e8f0' }}
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                    style={{ width: '28px', height: '28px', background: user.role === 'admin' ? '#ef4444' : '#10b981', fontSize: '0.8rem' }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="d-none d-sm-flex flex-column text-start">
                    <span className="fw-semibold text-truncate" style={{ maxWidth: '110px', fontSize: '0.85rem' }}>
                      {user.name}
                    </span>
                    <span className="text-muted" style={{ fontSize: '0.68rem', textTransform: 'capitalize' }}>
                      {user.role}
                    </span>
                  </div>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 mt-1 py-2">
                  <li className="px-3 py-1">
                    <p className="mb-0 small fw-bold text-dark">{user.name}</p>
                    <p className="mb-0 text-muted small">{user.email}</p>
                    <span className={`badge mt-1 ${user.role === 'admin' ? 'bg-danger' : 'bg-success'}`}>
                      {user.role === 'admin' ? 'Admin Access' : 'Verified Farmer'}
                    </span>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link to="/orders" className="dropdown-item py-1.5 d-flex align-items-center gap-2">
                      <ShoppingBag size={16} />
                      <span>{t('ordersPlaced')}</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard" className="dropdown-item py-1.5 d-flex align-items-center gap-2">
                      <LayoutDashboard size={16} />
                      <span>{t('dashboard')}</span>
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button onClick={handleLogout} className="dropdown-item py-1.5 text-danger d-flex align-items-center gap-2">
                      <LogOut size={16} />
                      <span>{t('logout')}</span>
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="agri-btn-outline py-1.5 px-3" style={{ fontSize: '0.88rem' }}>
                  {t('login')}
                </Link>
                <Link to="/register" className="agri-btn-primary py-1.5 px-3" style={{ fontSize: '0.88rem' }}>
                  {t('register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
