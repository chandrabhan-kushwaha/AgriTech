const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide farm name'],
    trim: true,
  },
  location: {
    address: { type: String, default: '' },
    state: { type: String, default: 'Maharashtra' },
    country: { type: String, default: 'India' },
    latitude: { type: Number, default: 19.0760 },
    longitude: { type: Number, default: 72.8777 },
  },
  totalArea: {
    type: Number,
    required: [true, 'Please specify total area in acres'],
  },
  soilType: {
    type: String,
    enum: ['Loamy', 'Clay', 'Sandy', 'Silt', 'Black Cotton', 'Red Loam', 'Alluvial'],
    default: 'Loamy',
  },
  irrigationSource: {
    type: String,
    enum: ['Drip Irrigation', 'Sprinkler', 'Canal / River', 'Tube Well', 'Rainfed'],
    default: 'Drip Irrigation',
  },
  primaryCropCategory: {
    type: String,
    default: 'Grains & Pulses',
  },
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Farm', farmSchema);
