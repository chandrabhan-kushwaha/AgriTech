import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import {
  Wheat,
  Plus,
  Calendar,
  Layers,
  Activity,
  Edit2,
  Trash2,
  CheckCircle2,
  TrendingUp,
  X,
  Clock,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

const CropMonitoring = () => {
  const { t } = useLanguage();
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Crop Add/Edit modal state
  const [showCropModal, setShowCropModal] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);

  // Activity modal state
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activeCropForActivity, setActiveCropForActivity] = useState(null);
  const [activityForm, setActivityForm] = useState({
    activityType: 'Fertilization',
    details: '',
    cost: '',
  });

  const [cropForm, setCropForm] = useState({
    farm: '',
    name: '',
    variety: '',
    areaPlanted: '',
    sowingDate: new Date().toISOString().split('T')[0],
    expectedHarvestDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    stage: 'Vegetative',
    healthStatus: 'Optimal',
    targetYield: '',
    notes: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cropsRes, farmsRes] = await Promise.all([
        API.get('/crops'),
        API.get('/farms'),
      ]);
      setCrops(cropsRes.data.data || []);
      setFarms(farmsRes.data.data || []);
      if (farmsRes.data.data && farmsRes.data.data.length > 0) {
        setCropForm(prev => ({ ...prev, farm: farmsRes.data.data[0]._id }));
      }
    } catch (err) {
      console.error('Failed to load crop data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAddCrop = () => {
    setEditingCrop(null);
    setCropForm({
      farm: farms.length > 0 ? farms[0]._id : '',
      name: '',
      variety: '',
      areaPlanted: '',
      sowingDate: new Date().toISOString().split('T')[0],
      expectedHarvestDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      stage: 'Vegetative',
      healthStatus: 'Optimal',
      targetYield: '',
      notes: '',
    });
    setShowCropModal(true);
  };

  const handleOpenEditCrop = (crop) => {
    setEditingCrop(crop);
    setCropForm({
      farm: crop.farm?._id || crop.farm,
      name: crop.name,
      variety: crop.variety,
      areaPlanted: crop.areaPlanted,
      sowingDate: new Date(crop.sowingDate).toISOString().split('T')[0],
      expectedHarvestDate: new Date(crop.expectedHarvestDate).toISOString().split('T')[0],
      stage: crop.stage,
      healthStatus: crop.healthStatus,
      targetYield: crop.targetYield,
      notes: crop.notes || '',
    });
    setShowCropModal(true);
  };

  const handleSaveCrop = async (e) => {
    e.preventDefault();
    try {
      if (editingCrop) {
        await API.put(`/crops/${editingCrop._id}`, cropForm);
      } else {
        await API.post('/crops', cropForm);
      }
      setShowCropModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving crop record');
    }
  };

  const handleDeleteCrop = async (id) => {
    if (window.confirm('Are you sure you want to delete this crop cycle?')) {
      try {
        await API.delete(`/crops/${id}`);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete crop');
      }
    }
  };

  const handleOpenActivity = (crop) => {
    setActiveCropForActivity(crop);
    setActivityForm({
      activityType: 'Fertilization',
      details: '',
      cost: '',
    });
    setShowActivityModal(true);
  };

  const handleSaveActivity = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/crops/${activeCropForActivity._id}/activity`, activityForm);
      setShowActivityModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to log activity');
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <Wheat className="text-warning" size={28} />
            <span>Crop Lifecycle Monitoring & Analytics</span>
          </h2>
          <p className="text-muted small mb-0">
            Track phenological stages, real-time stress signals, harvest dates, and farm field activities.
          </p>
        </div>
        <button className="agri-btn-primary" onClick={handleOpenAddCrop}>
          <Plus size={18} />
          <span>Track New Crop Cycle</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : crops.length === 0 ? (
        <div className="agri-card text-center py-5">
          <Wheat size={48} className="text-muted mb-3 opacity-50" />
          <h5 className="fw-bold mb-1">No Crops Monitored Yet</h5>
          <p className="text-muted small mb-3">Begin by selecting a farm plot and logging your sown variety.</p>
          <button className="agri-btn-primary mx-auto" onClick={handleOpenAddCrop}>
            <Plus size={16} />
            <span>Start Tracking Crop</span>
          </button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {crops.map((crop) => (
            <div key={crop._id} className="agri-card p-4">
              <div className="row g-4">
                {/* Left Overview Column */}
                <div className="col-lg-5 border-end-lg">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <span className="badge bg-light text-dark border me-2">{crop.farm?.name || 'Main Farm'}</span>
                      <span className={`agri-badge ${crop.healthStatus === 'Optimal' ? 'badge-optimal' : crop.healthStatus === 'Mild Stress' ? 'badge-warning' : 'badge-critical'}`}>
                        {crop.healthStatus}
                      </span>
                    </div>
                    <div className="d-flex gap-1">
                      <button className="btn btn-sm btn-light border p-1" onClick={() => handleOpenEditCrop(crop)}>
                        <Edit2 size={14} />
                      </button>
                      <button className="btn btn-sm btn-light border p-1 text-danger" onClick={() => handleDeleteCrop(crop._id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <h3 className="fw-bold mb-1 text-dark">{crop.name}</h3>
                  <span className="d-block small text-muted mb-3">Variety: <strong>{crop.variety}</strong> • Area: <strong>{crop.areaPlanted} Acres</strong></span>

                  <div className="p-3 bg-light rounded-3 mb-3 small d-flex flex-column gap-2">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Lifecycle Stage:</span>
                      <span className="fw-bold text-success">{crop.stage}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Sowing Date:</span>
                      <span>{new Date(crop.sowingDate).toLocaleDateString()}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Expected Harvest:</span>
                      <span className="fw-semibold text-dark">{new Date(crop.expectedHarvestDate).toLocaleDateString()}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Target Yield Estimate:</span>
                      <strong className="text-success">{crop.targetYield || 'TBD'} Quintals</strong>
                    </div>
                  </div>

                  {crop.notes && (
                    <p className="small text-muted mb-3 fst-italic">
                      "{crop.notes}"
                    </p>
                  )}

                  <button
                    className="agri-btn-outline w-100 justify-content-center btn-sm"
                    onClick={() => handleOpenActivity(crop)}
                  >
                    <Plus size={15} />
                    <span>Log Field Activity</span>
                  </button>
                </div>

                {/* Right Timeline Column */}
                <div className="col-lg-7">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                      <Activity size={17} className="text-success" />
                      <span>Field Activity & Agronomic Timeline</span>
                    </h6>
                    <span className="badge bg-secondary-subtle text-secondary small">
                      {crop.activities?.length || 0} Events
                    </span>
                  </div>

                  {(!crop.activities || crop.activities.length === 0) ? (
                    <div className="text-center py-4 bg-light rounded-3 text-muted small">
                      <Clock size={24} className="mb-1 opacity-50" />
                      <p className="mb-0">No field activities recorded yet. Click "Log Field Activity" to add sowing, sprays, or fertilizer.</p>
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-2.5" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                      {crop.activities.map((act, index) => (
                        <div key={index} className="p-2.5 rounded-3 border bg-white d-flex align-items-center justify-content-between">
                          <div>
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <span className="badge bg-success-subtle text-success small">{act.activityType}</span>
                              <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                                {new Date(act.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="small mb-0 text-dark">{act.details}</p>
                          </div>
                          {act.cost > 0 && (
                            <div className="text-end ps-2">
                              <span className="badge bg-light text-dark border">₹{act.cost}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Crop Modal */}
      {showCropModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {editingCrop ? 'Update Crop Monitoring' : 'Track New Crop Cycle'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowCropModal(false)}></button>
              </div>
              <form onSubmit={handleSaveCrop}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Select Farm Plot</label>
                      <select
                        className="form-select"
                        required
                        value={cropForm.farm}
                        onChange={(e) => setCropForm({ ...cropForm, farm: e.target.value })}
                      >
                        {farms.map(f => (
                          <option key={f._id} value={f._id}>{f.name} ({f.totalArea} Acres)</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Crop Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Soybean, Wheat, Bt Cotton"
                        className="form-control"
                        value={cropForm.name}
                        onChange={(e) => setCropForm({ ...cropForm, name: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Variety / Hybrid</label>
                      <input
                        type="text"
                        placeholder="e.g. JS-335, HD-2967, Rasi 659"
                        className="form-control"
                        value={cropForm.variety}
                        onChange={(e) => setCropForm({ ...cropForm, variety: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Area Sown (Acres)</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        placeholder="e.g. 10"
                        className="form-control"
                        value={cropForm.areaPlanted}
                        onChange={(e) => setCropForm({ ...cropForm, areaPlanted: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Sowing Date</label>
                      <input
                        type="date"
                        required
                        className="form-control"
                        value={cropForm.sowingDate}
                        onChange={(e) => setCropForm({ ...cropForm, sowingDate: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Expected Harvest Date</label>
                      <input
                        type="date"
                        required
                        className="form-control"
                        value={cropForm.expectedHarvestDate}
                        onChange={(e) => setCropForm({ ...cropForm, expectedHarvestDate: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Growth Stage</label>
                      <select
                        className="form-select"
                        value={cropForm.stage}
                        onChange={(e) => setCropForm({ ...cropForm, stage: e.target.value })}
                      >
                        <option value="Germination">Germination / Emergence</option>
                        <option value="Vegetative">Vegetative Canopy</option>
                        <option value="Flowering">Flowering / Booting</option>
                        <option value="Grain Filling">Grain Filling / Podding</option>
                        <option value="Maturity">Maturity / Ripening</option>
                        <option value="Harvested">Harvested</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Health Condition</label>
                      <select
                        className="form-select"
                        value={cropForm.healthStatus}
                        onChange={(e) => setCropForm({ ...cropForm, healthStatus: e.target.value })}
                      >
                        <option value="Optimal">Optimal (Healthy)</option>
                        <option value="Mild Stress">Mild Stress (Water / Heat)</option>
                        <option value="Attention Needed">Attention Needed</option>
                        <option value="Pest Risk">Pest Risk Detected</option>
                        <option value="Critical">Critical Intervention</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Target Yield (Quintals)</label>
                      <input
                        type="number"
                        placeholder="e.g. 150"
                        className="form-control"
                        value={cropForm.targetYield}
                        onChange={(e) => setCropForm({ ...cropForm, targetYield: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">Agronomic Notes</label>
                      <textarea
                        rows="2"
                        placeholder="Notes on seed treatment, fertilizer dose, row spacing..."
                        className="form-control"
                        value={cropForm.notes}
                        onChange={(e) => setCropForm({ ...cropForm, notes: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="agri-btn-secondary" onClick={() => setShowCropModal(false)}>Cancel</button>
                  <button type="submit" className="agri-btn-primary">
                    <CheckCircle2 size={16} />
                    <span>{editingCrop ? 'Update Record' : 'Save Crop'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Log Activity Modal */}
      {showActivityModal && activeCropForActivity && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  Log Activity: {activeCropForActivity.name}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowActivityModal(false)}></button>
              </div>
              <form onSubmit={handleSaveActivity}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Activity Type</label>
                    <select
                      className="form-select"
                      value={activityForm.activityType}
                      onChange={(e) => setActivityForm({ ...activityForm, activityType: e.target.value })}
                    >
                      <option value="Sowing">Sowing / Planting</option>
                      <option value="Fertilization">Fertilization / Nutrient Spray</option>
                      <option value="Irrigation">Irrigation Cycle</option>
                      <option value="Pesticide Application">Pesticide / Fungicide Spray</option>
                      <option value="Weeding">Weeding / Interculture</option>
                      <option value="Inspection">Field Scouting & Inspection</option>
                      <option value="Harvesting">Harvesting & Threshing</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Activity Details / Dosage</label>
                    <textarea
                      rows="3"
                      required
                      placeholder="e.g. Applied 25kg/acre Urea via fertigation drip tube."
                      className="form-control"
                      value={activityForm.details}
                      onChange={(e) => setActivityForm({ ...activityForm, details: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Expense / Cost (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 2500"
                      className="form-control"
                      value={activityForm.cost}
                      onChange={(e) => setActivityForm({ ...activityForm, cost: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="agri-btn-secondary" onClick={() => setShowActivityModal(false)}>Cancel</button>
                  <button type="submit" className="agri-btn-primary">
                    <CheckCircle2 size={16} />
                    <span>Append Activity</span>
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

export default CropMonitoring;
