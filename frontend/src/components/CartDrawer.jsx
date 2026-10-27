import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, CheckCircle2 } from 'lucide-react';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart' | 'checkout' | 'success'
  const [shippingAddress, setShippingAddress] = useState({
    street: 'Sector 4, Kisan Agro Nagar',
    villageDistrict: 'Nagpur District',
    state: 'Maharashtra',
    postalCode: '440001',
    contactPhone: user?.phone || '+91 98765 43210',
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery (Kisan Pay)');
  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  if (!isOpen) return null;

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user) {
      onClose();
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const itemsPayload = cartItems.map(item => ({
        resourceId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const res = await API.post('/orders', {
        items: itemsPayload,
        shippingAddress,
        paymentMethod,
      });

      if (res.data.success) {
        setPlacedOrder(res.data.data);
        clearCart();
        setCheckoutStep('success');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-end"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)', zIndex: 1060 }}
      onClick={onClose}
    >
      <div
        className="bg-white h-100 d-flex flex-column shadow-lg"
        style={{ width: '100%', maxWidth: '480px', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3 border-bottom d-flex align-items-center justify-content-between bg-light">
          <div className="d-flex align-items-center gap-2">
            <ShoppingBag className="text-success" size={20} />
            <h5 className="mb-0 fw-bold">
              {checkoutStep === 'cart' && 'Agricultural Cart'}
              {checkoutStep === 'checkout' && 'Shipping & Payment'}
              {checkoutStep === 'success' && 'Order Placed!'}
            </h5>
          </div>
          <button className="btn btn-sm btn-light border-0 rounded-circle" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 flex-grow-1 overflow-auto">
          {checkoutStep === 'cart' && (
            <>
              {cartItems.length === 0 ? (
                <div className="text-center py-5">
                  <ShoppingBag size={48} className="text-muted mb-3 opacity-50" />
                  <p className="text-muted fw-semibold">Your cart is empty</p>
                  <button className="agri-btn-outline btn-sm mt-2" onClick={onClose}>
                    Explore Agri Resources
                  </button>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {cartItems.map((item) => (
                    <div key={item._id} className="p-2 border rounded-3 d-flex align-items-center gap-3">
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=120&q=80'}
                        alt={item.name}
                        className="rounded object-fit-cover"
                        style={{ width: '60px', height: '60px' }}
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-1 small fw-bold text-truncate" style={{ maxWidth: '200px' }}>
                          {item.name}
                        </h6>
                        <span className="text-success fw-bold small">₹{item.price}</span>
                        <span className="text-muted small"> / {item.unit}</span>

                        <div className="d-flex align-items-center gap-2 mt-2">
                          <button
                            className="btn btn-sm btn-outline-secondary p-0 px-1 rounded"
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="small fw-semibold">{item.quantity}</span>
                          <button
                            className="btn btn-sm btn-outline-secondary p-0 px-1 rounded"
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      <button
                        className="btn btn-sm text-danger border-0 p-1"
                        onClick={() => removeFromCart(item._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {checkoutStep === 'checkout' && (
            <form onSubmit={handleCheckout} className="d-flex flex-column gap-3">
              <div>
                <label className="form-label small fw-bold text-muted mb-1">Delivery Street / Farm Location</label>
                <input
                  type="text"
                  required
                  className="form-control form-control-sm"
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                />
              </div>
              <div className="row g-2">
                <div className="col-7">
                  <label className="form-label small fw-bold text-muted mb-1">Village / District</label>
                  <input
                    type="text"
                    required
                    className="form-control form-control-sm"
                    value={shippingAddress.villageDistrict}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, villageDistrict: e.target.value })}
                  />
                </div>
                <div className="col-5">
                  <label className="form-label small fw-bold text-muted mb-1">PIN Code</label>
                  <input
                    type="text"
                    required
                    className="form-control form-control-sm"
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="form-label small fw-bold text-muted mb-1">Contact Phone</label>
                <input
                  type="text"
                  required
                  className="form-control form-control-sm"
                  value={shippingAddress.contactPhone}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, contactPhone: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label small fw-bold text-muted mb-1">Payment Method</label>
                <select
                  className="form-select form-select-sm"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="Cash on Delivery (Kisan Pay)">Cash on Delivery (Kisan Pay)</option>
                  <option value="Direct UPI / AgriCard">Direct UPI / AgriCard</option>
                  <option value="Net Banking">Net Banking</option>
                </select>
              </div>

              <div className="p-3 bg-light rounded-3 mt-2">
                <div className="d-flex justify-content-between mb-1 small">
                  <span className="text-muted">Subtotal:</span>
                  <span className="fw-semibold">₹{totalAmount}</span>
                </div>
                <div className="d-flex justify-content-between mb-1 small">
                  <span className="text-muted">Delivery Charges:</span>
                  <span className="text-success fw-semibold">FREE (Agri Subsidy)</span>
                </div>
                <div className="d-flex justify-content-between border-top pt-2 fw-bold">
                  <span>Grand Total:</span>
                  <span className="text-success">₹{totalAmount}</span>
                </div>
              </div>

              <div className="d-flex gap-2 mt-3">
                <button
                  type="button"
                  className="agri-btn-secondary flex-fill justify-content-center"
                  onClick={() => setCheckoutStep('cart')}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="agri-btn-primary flex-fill justify-content-center"
                >
                  {loading ? 'Processing...' : 'Confirm Order'}
                </button>
              </div>
            </form>
          )}

          {checkoutStep === 'success' && placedOrder && (
            <div className="text-center py-4">
              <CheckCircle2 size={56} className="text-success mb-3" />
              <h5 className="fw-bold mb-1">Thank You! Order Confirmed</h5>
              <p className="text-muted small">
                Order Tracking #: <strong className="text-dark">{placedOrder.orderNumber}</strong>
              </p>
              <div className="p-3 bg-light rounded-3 text-start small mb-4">
                <p className="mb-1"><strong>Status:</strong> <span className="badge bg-warning text-dark">{placedOrder.status}</span></p>
                <p className="mb-1"><strong>Total:</strong> ₹{placedOrder.totalAmount}</p>
                <p className="mb-0"><strong>Shipping to:</strong> {placedOrder.shippingAddress.street}, {placedOrder.shippingAddress.villageDistrict}</p>
              </div>
              <button
                className="agri-btn-primary w-100 justify-content-center"
                onClick={() => {
                  onClose();
                  setCheckoutStep('cart');
                  navigate('/orders');
                }}
              >
                Track Order
              </button>
            </div>
          )}
        </div>

        {/* Footer for Cart Step */}
        {checkoutStep === 'cart' && cartItems.length > 0 && (
          <div className="p-3 border-top bg-light">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted fw-semibold">Total Amount:</span>
              <span className="fs-5 fw-bold text-success">₹{totalAmount}</span>
            </div>
            <button
              className="agri-btn-primary w-100 justify-content-center"
              onClick={() => {
                if (!user) {
                  onClose();
                  navigate('/login');
                } else {
                  setCheckoutStep('checkout');
                }
              }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
