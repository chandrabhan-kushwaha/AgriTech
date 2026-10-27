import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldCheck,
  Users,
  Trees,
  Wheat,
  ShoppingBag,
  TrendingUp,
  ShieldAlert,
  MessageSquareShare,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Truck,
  Layers,
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [stats, setStats] = useState(null);
  const [userList, setUserList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'orders'
  const [loading, setLoading] = useState(true);

  // Status update modal for order
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newOrderStatus, setNewOrderStatus] = useState('Processing');
  const [statusLocation, setStatusLocation] = useState('Central Warehouse, Nagpur');
  const [statusNotes, setStatusNotes] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, ordersRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/users'),
        API.get('/orders'),
      ]);

      setStats(statsRes.data.data);
      setUserList(usersRes.data.data || []);
      setOrderList(ordersRes.data.data || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRoleToggle = async (userId, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'farmer' : 'admin';
    if (window.confirm(`Change role of user to ${nextRole}?`)) {
      try {
        await API.put(`/admin/users/${userId}/role`, { role: nextRole });
        fetchAdminData();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to update user role');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Delete this user?')) {
      try {
        await API.delete(`/admin/users/${userId}`);
        fetchAdminData();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleUpdateOrderStatus = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/orders/${selectedOrder._id}/status`, {
        status: newOrderStatus,
        location: statusLocation,
        notes: statusNotes || `Order transitioned to ${newOrderStatus}`,
      });
      setSelectedOrder(null);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status"></div>
        <p className="mt-2 text-muted">Loading administrative console...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-danger text-white fw-bold px-2.5 py-1">System Master Console</span>
            <span className="badge bg-light text-dark border">RBAC Enforced</span>
          </div>
          <h2 className="fw-bold mb-0 d-flex align-items-center gap-2">
            <ShieldCheck className="text-danger" size={28} />
            <span>Administrator Command Center</span>
          </h2>
          <p className="text-muted small mb-0">Platform oversight, user access governance, resource supply logistics, and dispute arbitration.</p>
        </div>

        {/* Tab Switcher */}
        <div className="btn-group shadow-sm">
          <button
            className={`btn btn-sm ${activeTab === 'overview' ? 'btn-danger' : 'btn-light border'}`}
            onClick={() => setActiveTab('overview')}
          >
            System Metrics
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'users' ? 'btn-danger' : 'btn-light border'}`}
            onClick={() => setActiveTab('users')}
          >
            User Management ({userList.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'orders' ? 'btn-danger' : 'btn-light border'}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders Fulfillment ({orderList.length})
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && stats && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-lg-3">
              <div className="stat-widget">
                <div className="stat-icon-wrapper bg-primary-subtle text-primary">
                  <Users size={26} />
                </div>
                <div>
                  <span className="d-block small text-muted fw-semibold">Total Users</span>
                  <h3 className="fw-bold mb-0">{stats.totalUsers}</h3>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="stat-widget">
                <div className="stat-icon-wrapper bg-success-subtle text-success">
                  <Trees size={26} />
                </div>
                <div>
                  <span className="d-block small text-muted fw-semibold">Registered Farms</span>
                  <h3 className="fw-bold mb-0">{stats.totalFarms}</h3>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="stat-widget">
                <div className="stat-icon-wrapper bg-warning-subtle text-warning">
                  <Wheat size={26} />
                </div>
                <div>
                  <span className="d-block small text-muted fw-semibold">Monitored Crops</span>
                  <h3 className="fw-bold mb-0">{stats.totalCrops}</h3>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="stat-widget">
                <div className="stat-icon-wrapper bg-info-subtle text-info">
                  <TrendingUp size={26} />
                </div>
                <div>
                  <span className="d-block small text-muted fw-semibold">Total Revenue</span>
                  <h3 className="fw-bold mb-0">₹{stats.totalRevenue?.toLocaleString()}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-7">
              <div className="agri-card p-4">
                <h5 className="fw-bold mb-3">Recent Platform Orders</h5>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0 small">
                    <thead className="table-light">
                      <tr>
                        <th>Order #</th>
                        <th>Farmer</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders?.map(order => (
                        <tr key={order._id}>
                          <td className="fw-bold text-dark">{order.orderNumber}</td>
                          <td>{order.farmer?.name || 'Farmer'}</td>
                          <td className="fw-bold text-success">₹{order.totalAmount}</td>
                          <td>
                            <span className={`badge ${order.status === 'Delivered' ? 'bg-success' : 'bg-warning text-dark'}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="agri-card p-4">
                <h5 className="fw-bold mb-3">System Health & Integrity</h5>
                <div className="d-flex flex-column gap-3 small">
                  <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                    <span>Database Engine:</span>
                    <strong className="text-success">MongoDB v8 (Connected)</strong>
                  </div>
                  <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                    <span>Active Pest Alerts:</span>
                    <strong className="text-danger">{stats.activePests} Regional Threats</strong>
                  </div>
                  <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                    <span>Agronomist Queue:</span>
                    <strong className="text-warning">{stats.pendingConsultations} Pending Advice</strong>
                  </div>
                  <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                    <span>Catalog Inventory:</span>
                    <strong className="text-dark">{stats.totalResources} SKUs Active</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="agri-card p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Registered User Accounts</h5>
            <span className="small text-muted">{userList.length} Accounts in Database</span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Region</th>
                  <th>Language</th>
                  <th>Assigned Role</th>
                  <th>Registered</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {userList.map(u => (
                  <tr key={u._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold"
                          style={{ width: '30px', height: '30px', background: u.role === 'admin' ? '#ef4444' : '#10b981', fontSize: '0.8rem' }}
                        >
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="fw-bold text-dark">{u.name}</span>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>{u.region || 'Maharashtra'}</td>
                    <td><span className="badge bg-light text-dark border text-uppercase">{u.preferredLanguage || 'en'}</span></td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-success'}`}>
                        {u.role === 'admin' ? 'Administrator' : 'Farmer'}
                      </span>
                    </td>
                    <td className="text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        <button
                          className="btn btn-sm btn-outline-secondary py-0 px-2"
                          onClick={() => handleRoleToggle(u._id, u.role)}
                          title="Toggle Role"
                        >
                          Toggle Role
                        </button>
                        {u._id !== user._id && (
                          <button
                            className="btn btn-sm btn-outline-danger py-0 px-1.5"
                            onClick={() => handleDeleteUser(u._id)}
                            title="Delete User"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="agri-card p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Agricultural Resource Orders & Dispatch</h5>
            <span className="small text-muted">{orderList.length} Orders Logged</span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th>Order #</th>
                  <th>Customer (Farmer)</th>
                  <th>Items Summary</th>
                  <th>Total Amount</th>
                  <th>Shipping City</th>
                  <th>Status</th>
                  <th className="text-end">Manage</th>
                </tr>
              </thead>
              <tbody>
                {orderList.map(order => (
                  <tr key={order._id}>
                    <td className="fw-bold text-dark">{order.orderNumber}</td>
                    <td>
                      <strong>{order.farmer?.name}</strong>
                      <span className="d-block text-muted" style={{ fontSize: '0.75rem' }}>{order.farmer?.phone}</span>
                    </td>
                    <td>
                      {order.items?.map(it => `${it.quantity}x ${it.name}`).join(', ')}
                    </td>
                    <td className="fw-bold text-success">₹{order.totalAmount}</td>
                    <td>{order.shippingAddress?.villageDistrict}, {order.shippingAddress?.state}</td>
                    <td>
                      <span className={`badge ${order.status === 'Delivered' ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-primary py-1 px-2.5"
                        onClick={() => {
                          setSelectedOrder(order);
                          setNewOrderStatus(order.status);
                        }}
                      >
                        Update Transit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transit Update Modal */}
      {selectedOrder && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Update Shipment: {selectedOrder.orderNumber}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedOrder(null)}></button>
              </div>
              <form onSubmit={handleUpdateOrderStatus}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">New Status Milestone</label>
                    <select
                      className="form-select"
                      value={newOrderStatus}
                      onChange={(e) => setNewOrderStatus(e.target.value)}
                    >
                      <option value="Placed">Placed</option>
                      <option value="Processing">Processing / Quality Check</option>
                      <option value="Dispatched">Dispatched to Logistics</option>
                      <option value="Out for Delivery">Out for Local Delivery</option>
                      <option value="Delivered">Delivered Successfully</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Current Location Checkpoint</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      value={statusLocation}
                      onChange={(e) => setStatusLocation(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Milestone Remarks</label>
                    <textarea
                      rows="2"
                      placeholder="e.g. Cleared district express transit hub. Driver assigned for farm delivery."
                      className="form-control"
                      value={statusNotes}
                      onChange={(e) => setStatusNotes(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="agri-btn-secondary" onClick={() => setSelectedOrder(null)}>Cancel</button>
                  <button type="submit" className="agri-btn-primary">
                    <CheckCircle2 size={16} />
                    <span>Apply Status Update</span>
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

export default AdminDashboard;
