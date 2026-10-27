const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  resource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unit: { type: String, default: 'Unit' },
  subtotal: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    street: { type: String, required: true },
    villageDistrict: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    contactPhone: { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    enum: ['Cash on Delivery (Kisan Pay)', 'Direct UPI / AgriCard', 'Net Banking'],
    default: 'Cash on Delivery (Kisan Pay)',
  },
  status: {
    type: String,
    enum: ['Placed', 'Processing', 'Dispatched', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Placed',
  },
  trackingUpdates: [{
    status: { type: String, required: true },
    location: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    notes: { type: String },
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);
