import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import API from '../services/api';
import {
  Trees,
  Wheat,
  FlaskConical,
  ShieldAlert,
  ShoppingBag,
  CloudSun,
  Plus,
  ArrowRight,
  TrendingUp,
  Droplets,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [soilReports, setSoilReports] = useState([]);
  const [pestAlerts, setPestAlerts] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [farmsRes, cropsRes, soilRes, pestsRes, weatherRes] = await Promise.all([
          API.get('/farms'),
          API.get('/crops'),
          API.get('/soil'),
          API.get('/pests'),
          API.get('/weather'),
        ]);

        setFarms(farmsRes.data.data || []);
        setCrops(cropsRes.data.data || []);
        setSoilReports(soilRes.data.data || []);
        setPestAlerts(pestsRes.data.data || []);
        setWeather(weatherRes.data.data || null);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalAcres = farms.reduce((acc, f) => acc + (f.totalArea || 0), 0);
  const avgSoilHealth = soilReports.length > 0
    ? Math.round(soilReports.reduce((acc, s) => acc + (s.overallHealthScore || 0), 0) / soilReports.length)
    : 85;

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-2 text-muted">Aggregating agricultural telemetry...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header Greeting */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-success-subtle text-success fw-bold px-2.5 py-1 rounded-pill">
              {user?.role === 'admin' ? 'Administrator Console' : 'Farmer Command Center'}
            </span>
            <span className="text-muted small">• {user?.region || 'Maharashtra'}</span>
          </div>
          <h2 className="fw-bold mb-0">
            {t('welcome')}, {user?.name}
          </h2>
          <p className="text-muted small mb-0">Here is your real-time agronomic overview and field diagnostics.</p>
        </div>

        <div className="d-flex gap-2">
          <Link to="/crops" className="agri-btn-primary btn-sm">
            <Plus size={16} />
            <span>Track New Crop</span>
          </Link>
          <Link to="/soil" className="agri-btn-outline btn-sm">
            <FlaskConical size={16} />
            <span>Log Soil Sample</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="stat-widget">
            <div className="stat-icon-wrapper bg-success-subtle text-success">
              <Trees size={26} />
            </div>
            <div>
              <span className="d-block small text-muted fw-semibold">{t('totalFarms')}</span>
              <h3 className="fw-bold mb-0">{farms.length} <span className="fs-6 fw-normal text-muted">({totalAcres} acres)</span></h3>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="stat-widget">
            <div className="stat-icon-wrapper bg-warning-subtle text-warning">
              <Wheat size={26} />
            </div>
            <div>
              <span className="d-block small text-muted fw-semibold">{t('activeCrops')}</span>
              <h3 className="fw-bold mb-0">{crops.length} <span className="fs-6 fw-normal text-muted">Active</span></h3>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="stat-widget">
            <div className="stat-icon-wrapper bg-info-subtle text-info">
              <FlaskConical size={26} />
            </div>
            <div>
              <span className="d-block small text-muted fw-semibold">{t('soilHealthScore')}</span>
              <h3 className="fw-bold mb-0">{avgSoilHealth}<span className="fs-6 fw-normal text-muted">/100</span></h3>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="stat-widget">
            <div className="stat-icon-wrapper bg-danger-subtle text-danger">
              <ShieldAlert size={26} />
            </div>
            <div>
              <span className="d-block small text-muted fw-semibold">Pest Alerts</span>
              <h3 className="fw-bold mb-0">{pestAlerts.length} <span className="fs-6 fw-normal text-danger">Active</span></h3>
            </div>
          </div>
        </div>
      </div>

      {/* Weather & Active Pest Advisories */}
      <div className="row g-4 mb-4">
        {/* Weather Card */}
        <div className="col-lg-7">
          {weather && (
            <div className="agri-card h-100 p-4 border-0">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <span className="badge bg-success-subtle text-success mb-1">Local Microclimate</span>
                  <h5 className="fw-bold mb-0">{weather.locationName}</h5>
                </div>
                <div className="text-end">
                  <span className="display-6 fw-bold text-success">{weather.current.temperature}°C</span>
                  <span className="d-block small text-muted">{weather.current.condition}</span>
                </div>
              </div>

              <div className="row g-3 py-3 border-top border-bottom my-2">
                <div className="col-4 text-center border-end">
                  <span className="d-block small text-muted">Humidity</span>
                  <span className="fw-bold fs-6">{weather.current.humidity}%</span>
                </div>
                <div className="col-4 text-center border-end">
                  <span className="d-block small text-muted">Wind Speed</span>
                  <span className="fw-bold fs-6">{weather.current.windSpeed} km/h</span>
                </div>
                <div className="col-4 text-center">
                  <span className="d-block small text-muted">Rain Probability</span>
                  <span className="fw-bold fs-6 text-info">{weather.current.precipitationChance}%</span>
                </div>
              </div>

              {weather.agriculturalAdvisories && weather.agriculturalAdvisories.length > 0 && (
                <div className="mt-3 p-3 bg-light rounded-3">
                  <span className="d-block small fw-bold text-success mb-1">💡 Agronomy Recommendation:</span>
                  <p className="small mb-0 text-secondary">{weather.agriculturalAdvisories[0]}</p>
                </div>
              )}

              <div className="mt-3 text-end">
                <Link to="/weather" className="small text-success fw-bold text-decoration-none">
                  Full Weather Outlook &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Quick Pest Warnings */}
        <div className="col-lg-5">
          <div className="agri-card h-100 p-4 border-0">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <AlertTriangle size={18} className="text-danger" />
                <span>Regional Pest Alerts</span>
              </h5>
              <Link to="/pests" className="small text-success text-decoration-none fw-semibold">
                View All
              </Link>
            </div>

            {pestAlerts.length === 0 ? (
              <div className="text-center py-4 text-muted small">
                <CheckCircle2 size={32} className="text-success mb-2" />
                <p>No active pest outbreaks reported in your immediate region.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2.5">
                {pestAlerts.slice(0, 3).map(alert => (
                  <div key={alert._id} className="p-3 border rounded-3 bg-light">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold small text-dark">{alert.pestName}</span>
                      <span className={`badge ${alert.severity === 'Critical' ? 'bg-danger' : alert.severity === 'High' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="small text-muted mb-1 text-truncate">
                      Affecting: {alert.targetCrops.join(', ')}
                    </p>
                    <span className="small text-danger fw-semibold" style={{ fontSize: '0.75rem' }}>
                      ⚡ {alert.preventiveMeasures?.[0] || 'Inspect field borders promptly'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Monitored Crops Table */}
      <div className="agri-card p-4 border-0 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="fw-bold mb-0">Active Crop Cycles</h5>
            <span className="small text-muted">Real-time phenology and health logs</span>
          </div>
          <Link to="/crops" className="agri-btn-outline btn-sm">
            Manage All Crops
          </Link>
        </div>

        {crops.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <Wheat size={40} className="mb-2 text-secondary opacity-50" />
            <p className="mb-2">No crops registered yet.</p>
            <Link to="/crops" className="agri-btn-primary btn-sm">Add First Crop</Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small">
                <tr>
                  <th>Crop & Variety</th>
                  <th>Farm Plot</th>
                  <th>Area (Acres)</th>
                  <th>Current Stage</th>
                  <th>Health Status</th>
                  <th>Expected Harvest</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="small">
                {crops.map(crop => (
                  <tr key={crop._id}>
                    <td>
                      <span className="fw-bold d-block text-dark">{crop.name}</span>
                      <span className="text-muted" style={{ fontSize: '0.78rem' }}>{crop.variety}</span>
                    </td>
                    <td>{crop.farm?.name || 'Primary Farm'}</td>
                    <td>{crop.areaPlanted} ac</td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {crop.stage}
                      </span>
                    </td>
                    <td>
                      <span className={`agri-badge ${crop.healthStatus === 'Optimal' ? 'badge-optimal' : crop.healthStatus === 'Mild Stress' ? 'badge-warning' : 'badge-critical'}`}>
                        {crop.healthStatus}
                      </span>
                    </td>
                    <td>
                      <span className="text-muted">
                        {new Date(crop.expectedHarvestDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="text-end">
                      <Link to="/crops" className="btn btn-sm btn-outline-success py-1 px-2.5">
                        View Log
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
