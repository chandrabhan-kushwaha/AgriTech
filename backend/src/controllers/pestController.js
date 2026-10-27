const PestAlert = require('../models/PestAlert');

// @desc    Get all active pest alerts (filter by crop or region)
// @route   GET /api/pests
// @access  Public
const getPestAlerts = async (req, res, next) => {
  try {
    const { crop, region, severity } = req.query;
    let query = { active: true };

    if (crop) {
      query.targetCrops = { $regex: new RegExp(crop, 'i') };
    }
    if (region) {
      query.affectedRegions = { $regex: new RegExp(region, 'i') };
    }
    if (severity) {
      query.severity = severity;
    }

    const alerts = await PestAlert.find(query).sort({ reportedDate: -1 });
    res.json({ success: true, count: alerts.length, data: alerts });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single pest alert
// @route   GET /api/pests/:id
// @access  Public
const getPestAlertById = async (req, res, next) => {
  try {
    const alert = await PestAlert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Pest alert not found' });
    }
    res.json({ success: true, data: alert });
  } catch (error) {
    next(error);
  }
};

// @desc    Create pest alert
// @route   POST /api/pests
// @access  Private (Admin)
const createPestAlert = async (req, res, next) => {
  try {
    const { pestName, scientificName, targetCrops, severity, affectedRegions, symptoms, preventiveMeasures, recommendedTreatments, imageUrl } = req.body;

    const alert = await PestAlert.create({
      pestName,
      scientificName,
      targetCrops: Array.isArray(targetCrops) ? targetCrops : targetCrops.split(',').map(s => s.trim()),
      severity: severity || 'Moderate',
      affectedRegions: Array.isArray(affectedRegions) ? affectedRegions : affectedRegions.split(',').map(s => s.trim()),
      symptoms: Array.isArray(symptoms) ? symptoms : [symptoms],
      preventiveMeasures: Array.isArray(preventiveMeasures) ? preventiveMeasures : [preventiveMeasures],
      recommendedTreatments: Array.isArray(recommendedTreatments) ? recommendedTreatments : [recommendedTreatments],
      imageUrl: imageUrl || '',
    });

    res.status(201).json({ success: true, data: alert });
  } catch (error) {
    next(error);
  }
};

// @desc    Update pest alert
// @route   PUT /api/pests/:id
// @access  Private (Admin)
const updatePestAlert = async (req, res, next) => {
  try {
    const alert = await PestAlert.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }
    res.json({ success: true, data: alert });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete pest alert
// @route   DELETE /api/pests/:id
// @access  Private (Admin)
const deletePestAlert = async (req, res, next) => {
  try {
    const alert = await PestAlert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }
    await alert.deleteOne();
    res.json({ success: true, message: 'Pest alert deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPestAlerts, getPestAlertById, createPestAlert, updatePestAlert, deletePestAlert };
