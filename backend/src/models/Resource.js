const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Resource name is required'],
    trim: true,
  },
  category: {
    type: String,
    enum: ['Seeds & Hybrids', 'Bio-Fertilizers & Nutrients', 'Organic Pesticides', 'Irrigation Tools', 'Farm Machinery & Implements'],
    required: true,
  },
  brand: {
    type: String,
    default: 'AgriPrime',
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    default: 'Pack',
  },
  stockQuantity: {
    type: Number,
    default: 100,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    default: 4.8,
  },
  imageUrl: {
    type: String,
    default: '',
  },
  technicalSpecifications: {
    type: Map,
    of: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Resource', resourceSchema);
