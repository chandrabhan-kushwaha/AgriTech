const mongoose = require('mongoose');

const pestAlertSchema = new mongoose.Schema({
  pestName: {
    type: String,
    required: true,
  },
  scientificName: {
    type: String,
    default: '',
  },
  targetCrops: [{
    type: String,
    required: true,
  }],
  severity: {
    type: String,
    enum: ['Low', 'Moderate', 'High', 'Critical'],
    default: 'Moderate',
  },
  affectedRegions: [{
    type: String,
    required: true,
  }],
  symptoms: [{
    type: String,
  }],
  preventiveMeasures: [{
    type: String,
  }],
  recommendedTreatments: [{
    type: String,
  }],
  imageUrl: {
    type: String,
    default: '',
  },
  reportedDate: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('PestAlert', pestAlertSchema);
