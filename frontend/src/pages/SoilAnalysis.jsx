import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import {
  FlaskConical,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Trees,
  Award,
  TrendingUp,
  Layers,
  Trash2,
} from 'lucide-react';

const SoilAnalysis = () => {
  const { t } = useLanguage();
  const [reports, setReports] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    farm: '',
    labOrDevice: 'District Soil Test Lab (Govt Certified)',
    ph: 6.8,
    nitrogen: 320,
    phosphorus: 35,
    potassium: 220,
    organicCarbon: 0.7,
    moisturePercentage: 24,
    electricalConductivity: 0.4,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reportsRes, farmsRes] = await Promise.all([
        API.get('/soil'),
        API.get('/farms'),
      ]);
      setReports(reportsRes.data.data || []);
      setFarms(farmsRes.data.data || []);
      if (farmsRes.data.data && farmsRes.data.data.length > 0) {
        setForm(prev => ({ ...prev, farm: farmsRes.data.data[0]._id }));
      }
    } catch (err) {
      console.error('Failed to load soil reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/soil', form);
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save soil test report');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this soil report?')) {
      try {
        await API.delete(`/soil/${id}`);
        fetchData();
      } catch (err) {
        alert('Failed to delete report');
      }
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <FlaskConical className="text-info" size={28} />
            <span>Soil Health Diagnostic & NPK Intelligence</span>
          </h2>
          <p className="text-muted small mb-0">
            Real-time chemical & microbial analysis, nutrient deficit diagnostics, and tailored agronomic advisory.
          </p>
        </div>
        <button className="agri-btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          <span>New Soil Test Report</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : reports.length === 0 ? (
        <div className="agri-card text-center py-5">
          <FlaskConical size={48} className="text-muted mb-3 opacity-50" />
          <h5 className="fw-bold mb-1">No Soil Test Reports On Record</h5>
          <p className="text-muted small mb-3">Input your laboratory test sheet or digital soil sensor kit results.</p>
          <button className="agri-btn-primary mx-auto" onClick={() => setShowModal(true)}>
            <Plus size={16} />
            <span>Log Soil Health Report</span>
          </button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {reports.map((report) => (
            <div key={report._id} className="agri-card p-4">
              <div className="row g-4 align-items-start">
                {/* Score & Lab Card */}
                <div className="col-lg-4 border-end-lg text-center text-lg-start">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-light text-dark border">
                      {report.farm?.name || 'Farm Plot'}
                    </span>
                    <button
                      className="btn btn-sm text-danger border-0 p-1"
                      onClick={() => handleDelete(report._id)}
                      title="Delete Report"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="my-3 p-3 bg-light rounded-4 text-center">
                    <span className="small text-muted fw-semibold d-block mb-1">SOIL HEALTH SCORE</span>
                    <div className="display-4 fw-extrabold text-success mb-1">
                      {report.overallHealthScore}<span className="fs-5 text-muted">/100</span>
                    </div>
                    <span className={`agri-badge ${report.overallHealthScore >= 80 ? 'badge-optimal' : report.overallHealthScore >= 60 ? 'badge-warning' : 'badge-critical'}`}>
                      {report.overallHealthScore >= 80 ? 'Grade A: Highly Fertile' : report.overallHealthScore >= 60 ? 'Grade B: Moderate Fertility' : 'Grade C: Deficient'}
                    </span>
                  </div>

                  <div className="small text-muted d-flex flex-column gap-1">
                    <span><strong>Tested By:</strong> {report.labOrDevice}</span>
                    <span><strong>Date Tested:</strong> {new Date(report.testedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Chemical & Nutrient Breakdown */}
                <div className="col-lg-8">
                  <h6 className="fw-bold mb-3 d-flex align-items-center gap-1.5">
                    <Layers size={17} className="text-success" />
                    <span>Essential Nutrient & Physical Parameters</span>
                  </h6>

                  <div className="row g-3 mb-4">
                    {/* pH */}
                    <div className="col-sm-4 col-6">
                      <div className="p-3 border rounded-3 bg-white">
                        <span className="d-block small text-muted mb-1">pH Level</span>
                        <div className="d-flex align-items-baseline gap-1">
                          <h4 className="fw-bold mb-0 text-dark">{report.ph}</h4>
                          <span className="small text-muted" style={{ fontSize: '0.72rem' }}>
                            {report.ph < 6.5 ? '(Acidic)' : report.ph > 7.5 ? '(Alkaline)' : '(Neutral)'}
                          </span>
                        </div>
                        <div className="agri-progress mt-2">
                          <div
                            className="agri-progress-bar"
                            style={{
                              width: `${Math.min((report.ph / 10) * 100, 100)}%`,
                              background: report.ph >= 6.0 && report.ph <= 7.5 ? '#10b981' : '#f59e0b',
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Nitrogen */}
                    <div className="col-sm-4 col-6">
                      <div className="p-3 border rounded-3 bg-white">
                        <span className="d-block small text-muted mb-1">Nitrogen (N)</span>
                        <div className="d-flex align-items-baseline gap-1">
                          <h4 className="fw-bold mb-0 text-dark">{report.nitrogen}</h4>
                          <span className="small text-muted" style={{ fontSize: '0.72rem' }}>kg/ha</span>
                        </div>
                        <div className="agri-progress mt-2">
                          <div
                            className="agri-progress-bar"
                            style={{ width: `${Math.min((report.nitrogen / 500) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Phosphorus */}
                    <div className="col-sm-4 col-6">
                      <div className="p-3 border rounded-3 bg-white">
                        <span className="d-block small text-muted mb-1">Phosphorus (P)</span>
                        <div className="d-flex align-items-baseline gap-1">
                          <h4 className="fw-bold mb-0 text-dark">{report.phosphorus}</h4>
                          <span className="small text-muted" style={{ fontSize: '0.72rem' }}>kg/ha</span>
                        </div>
                        <div className="agri-progress mt-2">
                          <div
                            className="agri-progress-bar"
                            style={{ width: `${Math.min((report.phosphorus / 60) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Potassium */}
                    <div className="col-sm-4 col-6">
                      <div className="p-3 border rounded-3 bg-white">
                        <span className="d-block small text-muted mb-1">Potassium (K)</span>
                        <div className="d-flex align-items-baseline gap-1">
                          <h4 className="fw-bold mb-0 text-dark">{report.potassium}</h4>
                          <span className="small text-muted" style={{ fontSize: '0.72rem' }}>kg/ha</span>
                        </div>
                        <div className="agri-progress mt-2">
                          <div
                            className="agri-progress-bar"
                            style={{ width: `${Math.min((report.potassium / 350) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Organic Carbon */}
                    <div className="col-sm-4 col-6">
                      <div className="p-3 border rounded-3 bg-white">
                        <span className="d-block small text-muted mb-1">Organic Carbon</span>
                        <div className="d-flex align-items-baseline gap-1">
                          <h4 className="fw-bold mb-0 text-dark">{report.organicCarbon}%</h4>
                        </div>
                        <div className="agri-progress mt-2">
                          <div
                            className="agri-progress-bar"
                            style={{ width: `${Math.min((report.organicCarbon / 1.5) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Moisture */}
                    <div className="col-sm-4 col-6">
                      <div className="p-3 border rounded-3 bg-white">
                        <span className="d-block small text-muted mb-1">Moisture</span>
                        <div className="d-flex align-items-baseline gap-1">
                          <h4 className="fw-bold mb-0 text-dark">{report.moisturePercentage}%</h4>
                        </div>
                        <div className="agri-progress mt-2">
                          <div
                            className="agri-progress-bar"
                            style={{ width: `${Math.min((report.moisturePercentage / 40) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="p-3 bg-success bg-opacity-10 border border-success border-opacity-25 rounded-3 mb-3">
                    <h6 className="fw-bold text-success mb-2 d-flex align-items-center gap-1.5 small">
                      <Lightbulb size={16} />
                      <span>Automated Agronomic Recommendations:</span>
                    </h6>
                    <ul className="mb-0 small text-dark ps-3">
                      {report.recommendations?.map((rec, i) => (
                        <li key={i} className="mb-1">{rec}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Crop Suitability */}
                  {report.suitableCrops && report.suitableCrops.length > 0 && (
                    <div className="d-flex align-items-center flex-wrap gap-2 small">
                      <strong className="text-muted">High Suitability Crops:</strong>
                      {report.suitableCrops.map((crop, i) => (
                        <span key={i} className="badge bg-light text-success border">
                          🌱 {crop}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Report Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Record Soil Test Analysis</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Farm Plot Tested</label>
                      <select
                        className="form-select"
                        required
                        value={form.farm}
                        onChange={(e) => setForm({ ...form, farm: e.target.value })}
                      >
                        {farms.map(f => (
                          <option key={f._id} value={f._id}>{f.name} ({f.soilType})</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Laboratory / Sensor Device</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={form.labOrDevice}
                        onChange={(e) => setForm({ ...form, labOrDevice: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-muted">Soil pH (0 - 14)</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        className="form-control"
                        value={form.ph}
                        onChange={(e) => setForm({ ...form, ph: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-muted">Available Nitrogen (N) (kg/ha)</label>
                      <input
                        type="number"
                        required
                        className="form-control"
                        value={form.nitrogen}
                        onChange={(e) => setForm({ ...form, nitrogen: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-muted">Phosphorus (P) (kg/ha)</label>
                      <input
                        type="number"
                        required
                        className="form-control"
                        value={form.phosphorus}
                        onChange={(e) => setForm({ ...form, phosphorus: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-muted">Potassium (K) (kg/ha)</label>
                      <input
                        type="number"
                        required
                        className="form-control"
                        value={form.potassium}
                        onChange={(e) => setForm({ ...form, potassium: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-muted">Organic Carbon (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={form.organicCarbon}
                        onChange={(e) => setForm({ ...form, organicCarbon: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-muted">Moisture (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control"
                        value={form.moisturePercentage}
                        onChange={(e) => setForm({ ...form, moisturePercentage: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="agri-btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="agri-btn-primary">
                    <CheckCircle2 size={16} />
                    <span>Run Agronomic Diagnostics</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoilAnalysis;
