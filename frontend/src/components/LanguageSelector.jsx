import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="dropdown">
      <button
        className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 rounded-pill px-2.5 py-1"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        style={{ borderColor: '#cbd5e1', fontSize: '0.85rem' }}
      >
        <Globe size={15} className="text-success" />
        <span className="fw-semibold">
          {language === 'en' && 'EN'}
          {language === 'hi' && 'हिन्दी'}
          {language === 'mr' && 'मराठी'}
          {language === 'es' && 'ES'}
        </span>
      </button>
      <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3 mt-1 py-1">
        <li>
          <button
            className={`dropdown-item py-1.5 px-3 d-flex align-items-center justify-content-between ${language === 'en' ? 'active bg-success' : ''}`}
            onClick={() => changeLanguage('en')}
          >
            <span>English</span>
            <span className="badge bg-light text-dark ms-2">EN</span>
          </button>
        </li>
        <li>
          <button
            className={`dropdown-item py-1.5 px-3 d-flex align-items-center justify-content-between ${language === 'hi' ? 'active bg-success' : ''}`}
            onClick={() => changeLanguage('hi')}
          >
            <span>हिन्दी (Hindi)</span>
            <span className="badge bg-light text-dark ms-2">HI</span>
          </button>
        </li>
        <li>
          <button
            className={`dropdown-item py-1.5 px-3 d-flex align-items-center justify-content-between ${language === 'mr' ? 'active bg-success' : ''}`}
            onClick={() => changeLanguage('mr')}
          >
            <span>मराठी (Marathi)</span>
            <span className="badge bg-light text-dark ms-2">MR</span>
          </button>
        </li>
        <li>
          <button
            className={`dropdown-item py-1.5 px-3 d-flex align-items-center justify-content-between ${language === 'es' ? 'active bg-success' : ''}`}
            onClick={() => changeLanguage('es')}
          >
            <span>Español (Spanish)</span>
            <span className="badge bg-light text-dark ms-2">ES</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default LanguageSelector;
