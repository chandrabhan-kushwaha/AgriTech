const mongoose = require('mongoose');

const soilReportSchema = new mongoose.Schema({
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
  testedAt: {
    type: Date,
    default: Date.now,
  },
  labOrDevice: {
    type: String,
    default: 'District Agritech Lab #4',
  },
  ph: {
    type: Number,
    required: [true, 'pH value is required'],
  },
  nitrogen: {
    type: Number, // kg/ha
    required: [true, 'Nitrogen (N) value is required'],
  },
  phosphorus: {
    type: Number, // kg/ha
    required: [true, 'Phosphorus (P) value is required'],
  },
  potassium: {
    type: Number, // kg/ha
    required: [true, 'Potassium (K) value is required'],
  },
  organicCarbon: {
    type: Number, // %
    default: 0.65,
  },
  moisturePercentage: {
    type: Number, // %
    default: 24,
  },
  electricalConductivity: {
    type: Number, // dS/m
    default: 0.42,
  },
  overallHealthScore: {
    type: Number, // 0 - 100
    default: 75,
  },
  recommendations: [{
    type: String,
  }],
  suitableCrops: [{
    type: String,
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('SoilReport', soilReportSchema);
