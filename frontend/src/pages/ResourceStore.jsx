import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  ShoppingBag,
  Search,
  Star,
  Plus,
  Check,
  Package,
  CheckCircle2,
  Filter,
} from 'lucide-react';

const ResourceStore = () => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [addedIds, setAddedIds] = useState({});

  // Admin add modal
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category: 'Seeds & Hybrids',
    brand: '',
    description: '',
    price: '',
    unit: 'Pack',
    stockQuantity: 50,
    imageUrl: '',
  });

  const categories = [
    'All',
    'Seeds & Hybrids',
    'Bio-Fertilizers & Nutrients',
    'Organic Pesticides',
    'Irrigation Tools',
    'Farm Machinery & Implements',
  ];

  const fetchResources = async () => {
    try {
      setLoading(true);
      let url = '/resources?';
      if (categoryFilter !== 'All') url += `category=${encodeURIComponent(categoryFilter)}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;

      const res = await API.get(url);
      setResources(res.data.data || []);
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [categoryFilter, search]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedIds(prev => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedIds(prev => ({ ...prev, [product._id]: false }));
    }, 1500);
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/resources', form);
      setShowAdminModal(false);
      fetchResources();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add product');
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <ShoppingBag className="text-success" size={28} />
            <span>Agricultural Resource Marketplace</span>
          </h2>
          <p className="text-muted small mb-0">
            Govt-certified hybrid seeds, organic microbial inputs, drip irrigation systems, and farm machinery.
          </p>
        </div>

        {user && user.role === 'admin' && (
          <button className="agri-btn-primary" onClick={() => setShowAdminModal(true)}>
            <Plus size={18} />
            <span>Add Catalog Product (Admin)</span>
          </button>
        )}
      </div>

      {/* Categories Toolbar */}
      <div className="agri-card p-3 mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between gap-3 align-items-md-center">
          <div className="d-flex align-items-center gap-1.5 flex-wrap">
            <Filter size={15} className="text-muted me-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                className={`btn btn-sm ${categoryFilter === cat ? 'btn-success' : 'btn-light border'} rounded-pill px-3 py-1`}
                style={{ fontSize: '0.82rem' }}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ minWidth: '240px' }}>
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-end-0 text-muted"><Search size={14} /></span>
              <input
                type="text"
                placeholder="Search supplies, fertilizers, brands..."
                className="form-control border-start-0 ps-1"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : resources.length === 0 ? (
        <div className="agri-card text-center py-5">
          <Package size={48} className="text-muted mb-3 opacity-50" />
          <h5 className="fw-bold mb-1">No Agricultural Resources Found</h5>
          <p className="text-muted small">Try switching categories or clearing search keywords.</p>
        </div>
      ) : (
        <div className="row g-4">
          {resources.map((item) => (
            <div key={item._id} className="col-sm-6 col-lg-4">
              <div className="agri-card h-100 p-3 d-flex flex-column justify-content-between">
                <div>
                  <div className="position-relative mb-3 rounded-3 overflow-hidden bg-light" style={{ height: '180px' }}>
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80'}
                      alt={item.name}
                      className="w-100 h-100 object-fit-cover"
                    />
                    <span className="position-absolute top-0 start-0 m-2 badge bg-dark bg-opacity-75 text-white small">
                      {item.category}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="small text-muted fw-semibold">{item.brand}</span>
                    <div className="d-flex align-items-center gap-1 text-warning small">
                      <Star size={14} fill="#f59e0b" />
                      <span className="fw-bold text-dark">{item.rating || 4.8}</span>
                    </div>
                  </div>

                  <h5 className="fw-bold mb-1 text-dark text-truncate" title={item.name}>
                    {item.name}
                  </h5>

                  <p className="small text-muted mb-3" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-top d-flex align-items-center justify-content-between">
                  <div>
                    <span className="fs-5 fw-bold text-success">₹{item.price}</span>
                    <span className="small text-muted ms-1">/ {item.unit}</span>
                  </div>

                  <button
                    className={`agri-btn-primary btn-sm ${addedIds[item._id] ? 'btn-success' : ''}`}
                    onClick={() => handleAddToCart(item)}
                  >
                    {addedIds[item._id] ? (
                      <>
                        <Check size={15} />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus size={15} />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin Add Product Modal */}
      {showAdminModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Add Agricultural Resource to Catalog</h5>
                <button type="button" className="btn-close" onClick={() => setShowAdminModal(false)}></button>
              </div>
              <form onSubmit={handleAdminSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label small fw-bold text-muted">Product / Equipment Name</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-muted">Brand / Manufacturer</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={form.brand}
                        onChange={(e) => setForm({ ...form, brand: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Category</label>
                      <select
                        className="form-select"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                      >
                        <option value="Seeds & Hybrids">Seeds & Hybrids</option>
                        <option value="Bio-Fertilizers & Nutrients">Bio-Fertilizers & Nutrients</option>
                        <option value="Organic Pesticides">Organic Pesticides</option>
                        <option value="Irrigation Tools">Irrigation Tools</option>
                        <option value="Farm Machinery & Implements">Farm Machinery & Implements</option>
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small fw-bold text-muted">Price (₹)</label>
                      <input
                        type="number"
                        required
                        className="form-control"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small fw-bold text-muted">Unit / Packing</label>
                      <input
                        type="text"
                        placeholder="e.g. 25 kg Bag, 1L"
                        className="form-control"
                        value={form.unit}
                        onChange={(e) => setForm({ ...form, unit: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">Product Description & Specs</label>
                      <textarea
                        rows="3"
                        required
                        className="form-control"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">Image URL (Unsplash or CDN)</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        className="form-control"
                        value={form.imageUrl}
                        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="agri-btn-secondary" onClick={() => setShowAdminModal(false)}>Cancel</button>
                  <button type="submit" className="agri-btn-primary">
                    <CheckCircle2 size={16} />
                    <span>Publish Product</span>
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

export default ResourceStore;
