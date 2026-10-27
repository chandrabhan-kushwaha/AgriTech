const Crop = require('../models/Crop');
const Farm = require('../models/Farm');

// @desc    Get crops (optionally filter by farmId)
// @route   GET /api/crops
// @access  Private
const getCrops = async (req, res, next) => {
  try {
    const { farmId } = req.query;
    let query = req.user.role === 'admin' ? {} : { farmer: req.user._id };

    if (farmId) {
      query.farm = farmId;
    }

    const crops = await Crop.find(query)
      .populate('farm', 'name location totalArea soilType')
      .populate('farmer', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: crops.length, data: crops });
  } catch (error) {
    next(error);
  }
};

// @desc    Get crop by ID
// @route   GET /api/crops/:id
// @access  Private
const getCropById = async (req, res, next) => {
  try {
    const crop = await Crop.findById(req.params.id)
      .populate('farm', 'name location totalArea soilType irrigationSource')
      .populate('farmer', 'name email');

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop record not found' });
    }

    if (req.user.role !== 'admin' && crop.farmer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this crop' });
    }

    res.json({ success: true, data: crop });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new crop record
// @route   POST /api/crops
// @access  Private
const createCrop = async (req, res, next) => {
  try {
    const { farm, name, variety, areaPlanted, sowingDate, expectedHarvestDate, stage, healthStatus, targetYield, notes } = req.body;

    const farmDoc = await Farm.findById(farm);
    if (!farmDoc) {
      return res.status(404).json({ success: false, message: 'Referenced farm not found' });
    }

    if (req.user.role !== 'admin' && farmDoc.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You do not own this farm' });
    }

    const crop = await Crop.create({
      farm,
      farmer: req.user._id,
      name,
      variety: variety || 'Standard Hybrid',
      areaPlanted,
      sowingDate,
      expectedHarvestDate,
      stage: stage || 'Germination',
      healthStatus: healthStatus || 'Optimal',
      targetYield: targetYield || 0,
      notes: notes || '',
      activities: [{
        activityType: 'Sowing',
        details: `Planted ${variety || 'Standard'} variety across ${areaPlanted} acres.`,
        date: sowingDate || Date.now(),
      }],
    });

    res.status(201).json({ success: true, data: crop });
  } catch (error) {
    next(error);
  }
};

// @desc    Update crop record
// @route   PUT /api/crops/:id
// @access  Private
const updateCrop = async (req, res, next) => {
  try {
    let crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop record not found' });
    }

    if (req.user.role !== 'admin' && crop.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this crop' });
    }

    crop = await Crop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('farm', 'name');

    res.json({ success: true, data: crop });
  } catch (error) {
    next(error);
  }
};

// @desc    Add activity log to crop
// @route   POST /api/crops/:id/activity
// @access  Private
const addActivityLog = async (req, res, next) => {
  try {
    const { activityType, details, cost, date } = req.body;
    const crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    if (req.user.role !== 'admin' && crop.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    crop.activities.unshift({
      activityType,
      details,
      cost: Number(cost) || 0,
      date: date || Date.now(),
    });

    await crop.save();
    res.json({ success: true, data: crop });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete crop record
// @route   DELETE /api/crops/:id
// @access  Private
const deleteCrop = async (req, res, next) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    if (req.user.role !== 'admin' && crop.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this crop' });
    }

    await crop.deleteOne();
    res.json({ success: true, message: 'Crop record removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCrops, getCropById, createCrop, updateCrop, addActivityLog, deleteCrop };
