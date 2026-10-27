const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  activityType: {
    type: String,
    enum: ['Sowing', 'Fertilization', 'Irrigation', 'Pesticide Application', 'Weeding', 'Harvesting', 'Inspection'],
    required: true,
  },
  details: { type: String, required: true },
  cost: { type: Number, default: 0 },
});

const cropSchema = new mongoose.Schema({
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true,
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide crop name'],
  },
  variety: {
    type: String,
    default: 'Standard Hybrid',
  },
  areaPlanted: {
    type: Number,
    required: [true, 'Planted area in acres'],
  },
  sowingDate: {
    type: Date,
    required: [true, 'Please provide sowing date'],
  },
  expectedHarvestDate: {
    type: Date,
    required: [true, 'Please provide expected harvest date'],
  },
  stage: {
    type: String,
    enum: ['Germination', 'Vegetative', 'Flowering', 'Grain Filling', 'Maturity', 'Harvested'],
    default: 'Vegetative',
  },
  healthStatus: {
    type: String,
    enum: ['Optimal', 'Mild Stress', 'Attention Needed', 'Pest Risk', 'Critical'],
    default: 'Optimal',
  },
  targetYield: {
    type: Number, // in quintals/tonnes
    default: 0,
  },
  actualYield: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
    default: '',
  },
  activities: [activityLogSchema],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Crop', cropSchema);
