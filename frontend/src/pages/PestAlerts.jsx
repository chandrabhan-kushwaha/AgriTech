import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldAlert,
  AlertTriangle,
  Bug,
  Plus,
  CheckCircle2,
  Filter,
  ShieldCheck,
  Search,
  ExternalLink,
  MapPin,
} from 'lucide-react';

const PestAlerts = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('All');
  const [searchCrop, setSearchCrop] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    pestName: '',
    scientificName: '',
    targetCrops: '',
    severity: 'High',
    affectedRegions: '',
    symptoms: '',
    preventiveMeasures: '',
    recommendedTreatments: '',
    imageUrl: '',
  });

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      let url = '/pests?';
      if (severityFilter !== 'All') url += `severity=${severityFilter}&`;
      if (searchCrop) url += `crop=${encodeURIComponent(searchCrop)}&`;

      const res = await API.get(url);
      setAlerts(res.data.data || []);
    } catch (err) {
      console.error('Failed to load pest alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [severityFilter, searchCrop]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/pests', form);
      setShowModal(false);
      fetchAlerts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to publish pest alert');
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <ShieldAlert className="text-danger" size={28} />
            <span>Pest Outbreak Alerts & Disease Surveillance</span>
          </h2>
          <p className="text-muted small mb-0">
            Early detection protocols, diagnostic symptoms, organic bio-remedies, and approved chemical treatments.
          </p>
        </div>

        {user && user.role === 'admin' && (
          <button className="agri-btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} />
            <span>Issue New Alert (Admin)</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="agri-card p-3 mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <span className="small text-muted fw-bold d-flex align-items-center gap-1">
            <Filter size={15} /> Severity:
          </span>
          {['All', 'Critical', 'High', 'Moderate'].map((sev) => (
            <button
              key={sev}
              className={`btn btn-sm ${severityFilter === sev ? 'btn-success' : 'btn-light border'} px-3 rounded-pill`}
              onClick={() => setSeverityFilter(sev)}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="d-flex align-items-center gap-2" style={{ maxWidth: '280px' }}>
          <input
            type="text"
            placeholder="Filter by crop (e.g. Cotton, Soybean)..."
            className="form-control form-control-sm"
            value={searchCrop}
            onChange={(e) => setSearchCrop(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : alerts.length === 0 ? (
        <div className="agri-card text-center py-5">
          <ShieldCheck size={48} className="text-success mb-2" />
          <h5 className="fw-bold mb-1">No Active Outbreaks Reported</h5>
          <p className="text-muted small">Your crops and selected region currently show no high-severity pest risks.</p>
        </div>
      ) : (
        <div className="row g-4">
          {alerts.map((alert) => (
            <div key={alert._id} className="col-lg-6">
              <div className="agri-card h-100 p-4 border-0 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className={`agri-badge ${alert.severity === 'Critical' ? 'badge-critical' : alert.severity === 'High' ? 'badge-warning' : 'badge-info'}`}>
                      {alert.severity} Risk Outbreak
                    </span>
                    <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                      Issued: {new Date(alert.reportedDate).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="fw-bold mb-1 text-dark">{alert.pestName}</h4>
                  {alert.scientificName && (
                    <span className="d-block small text-muted fst-italic mb-3">
                      ({alert.scientificName})
                    </span>
                  )}

                  {/* Target Crops & Regions */}
                  <div className="mb-3 d-flex flex-wrap gap-1.5 align-items-center">
                    <strong className="small text-muted me-1">Host Crops:</strong>
                    {alert.targetCrops.map((c, i) => (
                      <span key={i} className="badge bg-light text-dark border">
                        {c}
                      </span>
                    ))}
                  </div>

                  <div className="mb-3 small text-muted d-flex align-items-center gap-1">
                    <MapPin size={14} className="text-danger" />
                    <span><strong>Affected Belts:</strong> {alert.affectedRegions.join(', ')}</span>
                  </div>

                  {/* Symptoms */}
                  <div className="p-3 bg-light rounded-3 mb-3 small">
                    <strong className="text-dark d-block mb-1">Key Diagnostic Symptoms:</strong>
                    <ul className="mb-0 ps-3 text-secondary">
                      {alert.symptoms?.map((sym, i) => (
                        <li key={i}>{sym}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Prevention & Treatments */}
                  <div className="p-3 bg-success bg-opacity-10 border border-success border-opacity-25 rounded-3 mb-3 small">
                    <strong className="text-success d-block mb-1">🛡️ Recommended Control Action:</strong>
                    <p className="mb-1 text-dark">
                      <strong>Preventive:</strong> {alert.preventiveMeasures?.[0]}
                    </p>
                    <p className="mb-0 text-dark">
                      <strong>Curative Spray:</strong> {alert.recommendedTreatments?.[0]}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-top d-flex justify-content-between align-items-center small text-muted">
                  <span className="text-success fw-bold">Active Surveillance</span>
                  <a href="/consultation" className="text-success fw-semibold text-decoration-none">
                    Consult Specialist on this &rarr;
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin Publish Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Issue Regional Pest Warning Alert</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Common Pest Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Fall Armyworm"
                        className="form-control"
                        value={form.pestName}
                        onChange={(e) => setForm({ ...form, pestName: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Scientific Binomial</label>
                      <input
                        type="text"
                        placeholder="e.g. Spodoptera frugiperda"
                        className="form-control"
                        value={form.scientificName}
                        onChange={(e) => setForm({ ...form, scientificName: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Target Crops (comma-separated)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Maize, Sorghum, Cotton"
                        className="form-control"
                        value={form.targetCrops}
                        onChange={(e) => setForm({ ...form, targetCrops: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Severity Level</label>
                      <select
                        className="form-select"
                        value={form.severity}
                        onChange={(e) => setForm({ ...form, severity: e.target.value })}
                      >
                        <option value="Critical">Critical (Immediate Hazard)</option>
                        <option value="High">High Outbreak Alert</option>
                        <option value="Moderate">Moderate Vigilance</option>
                        <option value="Low">Low / Advisory</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">Affected Regions (comma-separated)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vidarbha, Marathwada, Northern Plains"
                        className="form-control"
                        value={form.affectedRegions}
                        onChange={(e) => setForm({ ...form, affectedRegions: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">Visible Symptoms</label>
                      <textarea
                        rows="2"
                        required
                        placeholder="e.g. Window-paning on young leaves, fresh sawdust-like excreta in whorl"
                        className="form-control"
                        value={form.symptoms}
                        onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
                      ></textarea>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Preventive Measures</label>
                      <textarea
                        rows="2"
                        required
                        placeholder="e.g. Deep summer ploughing, pheromone traps @ 5/acre"
                        className="form-control"
                        value={form.preventiveMeasures}
                        onChange={(e) => setForm({ ...form, preventiveMeasures: e.target.value })}
                      ></textarea>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Recommended Treatments</label>
                      <textarea
                        rows="2"
                        required
                        placeholder="e.g. Foliar spray of Bacillus thuringiensis (Bt) @ 2g/L"
                        className="form-control"
                        value={form.recommendedTreatments}
                        onChange={(e) => setForm({ ...form, recommendedTreatments: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="agri-btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="agri-btn-primary">
                    <CheckCircle2 size={16} />
                    <span>Publish Pest Alert</span>
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

export default PestAlerts;
