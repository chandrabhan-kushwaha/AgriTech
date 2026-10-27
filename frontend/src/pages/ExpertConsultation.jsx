import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  MessageSquareShare,
  Plus,
  CheckCircle2,
  Clock,
  HelpCircle,
  UserCheck,
  Send,
  AlertCircle,
  FileQuestion,
} from 'lucide-react';

const ExpertConsultation = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Farmer query submission form
  const [form, setForm] = useState({
    subject: '',
    cropType: '',
    category: 'Crop Disease & Pathology',
    description: '',
    urgency: 'Normal',
  });

  // Admin reply modal
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [replyText, setReplyText] = useState('');

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const res = await API.get('/consultations');
      setConsultations(res.data.data || []);
    } catch (err) {
      console.error('Failed to load consultations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/consultations', form);
      setShowModal(false);
      setForm({
        subject: '',
        cropType: '',
        category: 'Crop Disease & Pathology',
        description: '',
        urgency: 'Normal',
      });
      fetchConsultations();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit consultation');
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/consultations/${activeItem._id}/reply`, {
        expertResponse: replyText,
        expertName: user.name,
      });
      setShowReplyModal(false);
      setReplyText('');
      fetchConsultations();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit reply');
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <MessageSquareShare className="text-success" size={28} />
            <span>Agronomist & Scientist Expert Desk</span>
          </h2>
          <p className="text-muted small mb-0">
            Submit field queries, crop disease symptoms, and soil deficiency questions for certified specialist prescription.
          </p>
        </div>

        <button className="agri-btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          <span>Ask An Agronomist</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : consultations.length === 0 ? (
        <div className="agri-card text-center py-5">
          <FileQuestion size={48} className="text-muted mb-3 opacity-50" />
          <h5 className="fw-bold mb-1">No Consultations Submitted Yet</h5>
          <p className="text-muted small mb-3">Facing unexpected yellowing, pest attack, or soil salinity? Consult our agricultural scientists.</p>
          <button className="agri-btn-primary mx-auto" onClick={() => setShowModal(true)}>
            <Plus size={16} />
            <span>Submit First Query</span>
          </button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {consultations.map((item) => (
            <div key={item._id} className="agri-card p-4">
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start gap-2 mb-3">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="badge bg-light text-dark border">{item.category}</span>
                    <span className="badge bg-success-subtle text-success">{item.cropType}</span>
                    {item.urgency === 'High' || item.urgency === 'Emergency' ? (
                      <span className="badge bg-danger">{item.urgency} Urgency</span>
                    ) : null}
                  </div>
                  <h4 className="fw-bold mb-0 text-dark">{item.subject}</h4>
                  <span className="small text-muted">
                    Submitted by {item.farmer?.name || 'Farmer'} on {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span className={`badge py-1.5 px-3 ${item.status === 'Resolved' ? 'bg-success' : 'bg-warning text-dark'}`}>
                    {item.status === 'Resolved' ? 'Prescription Issued' : 'Under Review'}
                  </span>
                  {user && user.role === 'admin' && item.status !== 'Resolved' && (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        setActiveItem(item);
                        setShowReplyModal(true);
                      }}
                    >
                      Answer as Expert
                    </button>
                  )}
                </div>
              </div>

              <div className="p-3 bg-light rounded-3 mb-3 small text-secondary">
                <p className="mb-0 leading-relaxed text-dark">{item.description}</p>
              </div>

              {/* Expert Diagnosis / Response */}
              {item.status === 'Resolved' ? (
                <div className="p-3 bg-success bg-opacity-10 border border-success border-opacity-25 rounded-3">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <UserCheck size={18} className="text-success" />
                    <span className="fw-bold text-success small">
                      Specialist Recommendation — {item.expertName}
                    </span>
                    <span className="text-muted ms-auto small" style={{ fontSize: '0.75rem' }}>
                      {new Date(item.answeredAt || item.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mb-0 small text-dark leading-relaxed">
                    {item.expertResponse}
                  </p>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2 text-warning small">
                  <Clock size={16} />
                  <span>An agronomist is currently diagnosing this case. You will receive an advisory within 2-4 hours.</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Query Submission Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Consult Agricultural Specialist</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">Subject / Problem Headline</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Yellow mosaic discoloration on lower soybean foliage"
                        className="form-control"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Crop / Specie</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bt Cotton, Wheat HD-2967"
                        className="form-control"
                        value={form.cropType}
                        onChange={(e) => setForm({ ...form, cropType: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Category</label>
                      <select
                        className="form-select"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                      >
                        <option value="Crop Disease & Pathology">Crop Disease & Pathology</option>
                        <option value="Soil Nutrition & Micronutrients">Soil Nutrition & Micronutrients</option>
                        <option value="Pest Control Strategy">Pest Control Strategy</option>
                        <option value="Water Management & Micro-irrigation">Water Management & Micro-irrigation</option>
                        <option value="Market & Harvest Timing">Market & Harvest Timing</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Urgency</label>
                      <select
                        className="form-select"
                        value={form.urgency}
                        onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                      >
                        <option value="Normal">Normal (Routine advice)</option>
                        <option value="High">High (Spreading rapidly)</option>
                        <option value="Emergency">Emergency (Severe crop loss threat)</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">Detailed Observations & Symptoms</label>
                      <textarea
                        rows="4"
                        required
                        placeholder="Describe leaf symptoms, recent weather conditions, soil moisture, and any sprays applied recently..."
                        className="form-control"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="agri-btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="agri-btn-primary">
                    <Send size={16} />
                    <span>Submit to Agronomist Desk</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Admin Reply Modal */}
      {showReplyModal && activeItem && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Agronomist Response: {activeItem.subject}</h5>
                <button type="button" className="btn-close" onClick={() => setShowReplyModal(false)}></button>
              </div>
              <form onSubmit={handleReplySubmit}>
                <div className="modal-body">
                  <div className="p-3 bg-light rounded-3 mb-3 small text-muted">
                    <strong>Farmer Query:</strong> {activeItem.description}
                  </div>

                  <div>
                    <label className="form-label small fw-bold text-muted">Scientific Diagnosis & Treatment Prescription</label>
                    <textarea
                      rows="4"
                      required
                      placeholder="Specify chemical or organic formulation, dilution ratio (ml/liter), application timing, and precautionary steps..."
                      className="form-control"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="agri-btn-secondary" onClick={() => setShowReplyModal(false)}>Cancel</button>
                  <button type="submit" className="agri-btn-primary">
                    <CheckCircle2 size={16} />
                    <span>Send Diagnosis</span>
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

export default ExpertConsultation;
