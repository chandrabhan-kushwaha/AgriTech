import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

const OrderTracking = () => {
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get('/orders');
      setOrders(res.data.data || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStepIndex = (status) => {
    switch (status) {
      case 'Placed': return 0;
      case 'Processing': return 1;
      case 'Dispatched': return 2;
      case 'Out for Delivery': return 3;
      case 'Delivered': return 4;
      default: return 0;
    }
  };

  const steps = ['Placed', 'Processing', 'Dispatched', 'Out for Delivery', 'Delivered'];

  return (
    <div className="container py-4">
      <div className="mb-4 pb-3 border-bottom">
        <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
          <Truck className="text-success" size={28} />
          <span>Order Fulfillment & Live Shipment Tracking</span>
        </h2>
        <p className="text-muted small mb-0">
          Track transit milestones for seeds, biological inputs, drip lateral coils, and mechanized sprayers.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="agri-card text-center py-5">
          <Package size={48} className="text-muted mb-3 opacity-50" />
          <h5 className="fw-bold mb-1">No Orders Placed Yet</h5>
          <p className="text-muted small mb-3">Explore our certified agricultural inputs store to place your first order.</p>
          <a href="/resources" className="agri-btn-primary mx-auto">Browse Store</a>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {orders.map((order) => {
            const currentStep = getStepIndex(order.status);

            return (
              <div key={order._id} className="agri-card p-4">
                {/* Order Top Bar */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4 pb-3 border-bottom">
                  <div>
                    <span className="badge bg-light text-dark border me-2">Tracking #{order.orderNumber}</span>
                    <span className="text-muted small">Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <span className="fw-bold text-success fs-5">₹{order.totalAmount}</span>
                    <span className={`badge ${order.status === 'Delivered' ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Tracking Stepper */}
                <div className="my-4 px-2">
                  <div className="position-relative d-flex justify-content-between">
                    <div
                      className="position-absolute top-50 start-0 translate-middle-y w-100 bg-secondary-subtle"
                      style={{ height: '4px', zIndex: 1 }}
                    ></div>
                    <div
                      className="position-absolute top-50 start-0 translate-middle-y bg-success"
                      style={{
                        height: '4px',
                        width: `${(currentStep / (steps.length - 1)) * 100}%`,
                        zIndex: 2,
                        transition: 'width 0.4s ease',
                      }}
                    ></div>

                    {steps.map((step, idx) => {
                      const isCompleted = idx <= currentStep;
                      return (
                        <div key={step} className="position-relative text-center" style={{ zIndex: 3 }}>
                          <div
                            className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-1 ${isCompleted ? 'bg-success text-white shadow-sm' : 'bg-white border text-muted'}`}
                            style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}
                          >
                            {isCompleted ? <CheckCircle2 size={18} /> : idx + 1}
                          </div>
                          <span className={`d-none d-sm-block small ${isCompleted ? 'fw-bold text-success' : 'text-muted'}`} style={{ fontSize: '0.75rem' }}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="row g-4 mt-2">
                  {/* Items List */}
                  <div className="col-lg-6">
                    <h6 className="fw-bold small text-muted text-uppercase mb-2">Order Items:</h6>
                    <div className="d-flex flex-column gap-2">
                      {order.items?.map((item, i) => (
                        <div key={i} className="p-2 border rounded-2 d-flex justify-content-between align-items-center bg-light">
                          <span className="small fw-semibold text-dark text-truncate" style={{ maxWidth: '280px' }}>
                            {item.quantity}x {item.name}
                          </span>
                          <span className="small fw-bold text-success">₹{item.subtotal}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address & Method */}
                  <div className="col-lg-6">
                    <h6 className="fw-bold small text-muted text-uppercase mb-2">Delivery & Payment:</h6>
                    <div className="p-3 bg-light rounded-2 small">
                      <p className="mb-1 text-dark">
                        <MapPin size={14} className="text-danger me-1" />
                        <strong>Destination:</strong> {order.shippingAddress?.street}, {order.shippingAddress?.villageDistrict}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
                      </p>
                      <p className="mb-1 text-dark">
                        <strong>Phone:</strong> {order.shippingAddress?.contactPhone}
                      </p>
                      <p className="mb-0 text-dark">
                        <strong>Payment:</strong> {order.paymentMethod}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Milestone Logs */}
                {order.trackingUpdates && order.trackingUpdates.length > 0 && (
                  <div className="mt-4 pt-3 border-top">
                    <h6 className="fw-bold small text-muted text-uppercase mb-2">Checkpoint Logs:</h6>
                    <div className="d-flex flex-column gap-2 small">
                      {order.trackingUpdates.map((log, i) => (
                        <div key={i} className="d-flex align-items-start gap-2">
                          <Clock size={15} className="text-success mt-0.5 flex-shrink-0" />
                          <div>
                            <strong>{log.status}</strong> — <span>{log.location}</span> ({new Date(log.timestamp).toLocaleString()}): {log.notes}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
