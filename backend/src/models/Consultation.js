const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
  },
  cropType: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Crop Disease & Pathology', 'Soil Nutrition & Micronutrients', 'Pest Control Strategy', 'Water Management & Micro-irrigation', 'Market & Harvest Timing'],
    default: 'Crop Disease & Pathology',
  },
  description: {
    type: String,
    required: true,
  },
  urgency: {
    type: String,
    enum: ['Normal', 'High', 'Emergency'],
    default: 'Normal',
  },
  status: {
    type: String,
    enum: ['Submitted', 'In Review', 'Resolved'],
    default: 'Submitted',
  },
  expertName: {
    type: String,
    default: 'Dr. Ramesh Patil (Senior Agronomist)',
  },
  expertResponse: {
    type: String,
    default: '',
  },
  answeredAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Consultation', consultationSchema);
