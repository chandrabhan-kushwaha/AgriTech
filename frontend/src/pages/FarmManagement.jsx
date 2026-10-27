import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import {
  Trees,
  Plus,
  MapPin,
  Compass,
  Edit2,
  Trash2,
  Droplets,
  Layers,
  FileText,
  X,
  CheckCircle2,
} from 'lucide-react';

const FarmManagement = () => {
  const { t } = useLanguage();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    totalArea: '',
    soilType: 'Loamy',
    irrigationSource: 'Drip Irrigation',
    primaryCropCategory: 'Grains & Pulses',
    location: {
      address: '',
      state: 'Maharashtra',
      latitude: 21.1458,
      longitude: 79.0882,
    },
    notes: '',
  });

  const fetchFarms = async () => {
    try {
      setLoading(true);
      const res = await API.get('/farms');
      setFarms(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch farms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const handleOpenAdd = () => {
    setEditingFarm(null);
    setFormData({
      name: '',
      totalArea: '',
      soilType: 'Loamy',
      irrigationSource: 'Drip Irrigation',
      primaryCropCategory: 'Grains & Pulses',
      location: {
        address: '',
        state: 'Maharashtra',
        latitude: 21.1458,
        longitude: 79.0882,
      },
      notes: '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (farm) => {
    setEditingFarm(farm);
    setFormData({
      name: farm.name,
      totalArea: farm.totalArea,
      soilType: farm.soilType,
      irrigationSource: farm.irrigationSource,
      primaryCropCategory: farm.primaryCropCategory,
      location: {
        address: farm.location?.address || '',
        state: farm.location?.state || 'Maharashtra',
        latitude: farm.location?.latitude || 21.1458,
        longitude: farm.location?.longitude || 79.0882,
      },
      notes: farm.notes || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFarm) {
        await API.put(`/farms/${editingFarm._id}`, formData);
      } else {
        await API.post('/farms', formData);
      }
      setShowModal(false);
      fetchFarms();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving farm profile');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this farm? This will also remove associated crop records.')) {
      try {
        await API.delete(`/farms/${id}`);
        fetchFarms();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete farm');
      }
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <Trees className="text-success" size={28} />
            <span>Farm Profiles & Boundaries</span>
          </h2>
          <p className="text-muted small mb-0">
            Define acreage, soil classification, micro-irrigation networks, and GPS coordinates for precision tracking.
          </p>
        </div>
        <button className="agri-btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} />
          <span>Add New Farm Plot</span>
        </button>
      </div>

      {/* Farm Cards Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : farms.length === 0 ? (
        <div className="agri-card text-center py-5">
          <Trees size={48} className="text-muted mb-3 opacity-50" />
          <h5 className="fw-bold mb-1">No Farm Plots Registered</h5>
          <p className="text-muted small mb-3">Add your first agricultural parcel to start tracking crops and soil health.</p>
          <button className="agri-btn-primary mx-auto" onClick={handleOpenAdd}>
            <Plus size={16} />
            <span>Create Farm Profile</span>
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {farms.map((farm) => (
            <div key={farm._id} className="col-md-6 col-lg-4">
              <div className="agri-card h-100 d-flex flex-column justify-content-between p-4 position-relative">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-success-subtle text-success fw-bold px-2.5 py-1">
                      {farm.primaryCropCategory}
                    </span>
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-sm btn-light p-1.5 text-secondary border rounded"
                        onClick={() => handleOpenEdit(farm)}
                        title="Edit Farm"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        className="btn btn-sm btn-light p-1.5 text-danger border rounded"
                        onClick={() => handleDelete(farm._id)}
                        title="Delete Farm"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <h4 className="fw-bold mb-1 text-dark">{farm.name}</h4>
                  <p className="small text-muted mb-3 d-flex align-items-center gap-1">
                    <MapPin size={14} className="text-success" />
                    <span>{farm.location?.address || 'Regional Agro Sector'}, {farm.location?.state}</span>
                  </p>

                  <div className="p-3 bg-light rounded-3 mb-3 small d-flex flex-column gap-2">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted d-flex align-items-center gap-1">
                        <Layers size={14} /> Total Acreage:
                      </span>
                      <strong className="text-dark">{farm.totalArea} Acres</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted d-flex align-items-center gap-1">
                        <Compass size={14} /> Soil Type:
                      </span>
                      <span className="badge bg-white text-dark border">{farm.soilType}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted d-flex align-items-center gap-1">
                        <Droplets size={14} /> Irrigation:
                      </span>
                      <span className="text-success fw-semibold">{farm.irrigationSource}</span>
                    </div>
                  </div>

                  {farm.notes && (
                    <p className="small text-muted fst-italic mb-3">
                      "{farm.notes}"
                    </p>
                  )}
                </div>

                <div className="pt-2 border-top d-flex justify-content-between align-items-center text-muted small">
                  <span>GPS: {farm.location?.latitude?.toFixed(4)}, {farm.location?.longitude?.toFixed(4)}</span>
                  <span className="text-success fw-bold">Active Status</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {editingFarm ? 'Edit Farm Profile' : 'Register New Farm Plot'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-7">
                      <label className="form-label small fw-bold text-muted">Farm Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Surya Greenfields Sector A"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="col-md-5">
                      <label className="form-label small fw-bold text-muted">Total Area (Acres)</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        placeholder="e.g. 15.5"
                        className="form-control"
                        value={formData.totalArea}
                        onChange={(e) => setFormData({ ...formData, totalArea: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Soil Classification</label>
                      <select
                        className="form-select"
                        value={formData.soilType}
                        onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                      >
                        <option value="Loamy">Loamy Soil</option>
                        <option value="Clay">Clay Soil</option>
                        <option value="Sandy">Sandy Soil</option>
                        <option value="Silt">Silt Soil</option>
                        <option value="Black Cotton">Black Cotton Soil</option>
                        <option value="Red Loam">Red Loam Soil</option>
                        <option value="Alluvial">Alluvial Soil</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Irrigation Source</label>
                      <select
                        className="form-select"
                        value={formData.irrigationSource}
                        onChange={(e) => setFormData({ ...formData, irrigationSource: e.target.value })}
                      >
                        <option value="Drip Irrigation">Drip Irrigation (Micro-drip)</option>
                        <option value="Sprinkler">Sprinkler System</option>
                        <option value="Canal / River">Canal / River Intake</option>
                        <option value="Tube Well">Tube Well / Borewell</option>
                        <option value="Rainfed">Rainfed / Monsoonal</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Primary Crop Category</label>
                      <input
                        type="text"
                        placeholder="e.g. Grains & Pulses, Oilseeds, Horticulture"
                        className="form-control"
                        value={formData.primaryCropCategory}
                        onChange={(e) => setFormData({ ...formData, primaryCropCategory: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">State / Region</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.location.state}
                        onChange={(e) => setFormData({
                          ...formData,
                          location: { ...formData.location, state: e.target.value }
                        })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">Plot Address / Landmark</label>
                      <input
                        type="text"
                        placeholder="e.g. Survey No. 44, Village Katol"
                        className="form-control"
                        value={formData.location.address}
                        onChange={(e) => setFormData({
                          ...formData,
                          location: { ...formData.location, address: e.target.value }
                        })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">Field Notes & Specifics</label>
                      <textarea
                        rows="2"
                        placeholder="Notes on solar pump, organic buffer zones, terrain slope, etc."
                        className="form-control"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="agri-btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="agri-btn-primary">
                    <CheckCircle2 size={16} />
                    <span>{editingFarm ? 'Update Farm' : 'Save Farm'}</span>
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

export default FarmManagement;
