const Farm = require('../models/Farm');
const Crop = require('../models/Crop');

// @desc    Get all farms for logged-in user (or all if admin)
// @route   GET /api/farms
// @access  Private
const getFarms = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { farmer: req.user._id };
    const farms = await Farm.find(query).populate('farmer', 'name email phone').sort({ createdAt: -1 });
    res.json({ success: true, count: farms.length, data: farms });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single farm by ID
// @route   GET /api/farms/:id
// @access  Private
const getFarmById = async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.params.id).populate('farmer', 'name email phone');
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm profile not found' });
    }
    // Ensure ownership if not admin
    if (req.user.role !== 'admin' && farm.farmer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this farm' });
    }
    res.json({ success: true, data: farm });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new farm profile
// @route   POST /api/farms
// @access  Private
const createFarm = async (req, res, next) => {
  try {
    const { name, location, totalArea, soilType, irrigationSource, primaryCropCategory, notes } = req.body;

    const farm = await Farm.create({
      farmer: req.user._id,
      name,
      location: location || {},
      totalArea,
      soilType: soilType || 'Loamy',
      irrigationSource: irrigationSource || 'Drip Irrigation',
      primaryCropCategory: primaryCropCategory || 'Grains & Pulses',
      notes: notes || '',
    });

    res.status(201).json({ success: true, data: farm });
  } catch (error) {
    next(error);
  }
};

// @desc    Update farm profile
// @route   PUT /api/farms/:id
// @access  Private
const updateFarm = async (req, res, next) => {
  try {
    let farm = await Farm.findById(req.params.id);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm profile not found' });
    }
    if (req.user.role !== 'admin' && farm.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this farm' });
    }

    farm = await Farm.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: farm });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete farm profile
// @route   DELETE /api/farms/:id
// @access  Private
const deleteFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm profile not found' });
    }
    if (req.user.role !== 'admin' && farm.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this farm' });
    }

    // Also remove associated crops
    await Crop.deleteMany({ farm: farm._id });
    await farm.deleteOne();

    res.json({ success: true, message: 'Farm and associated crops deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getFarms, getFarmById, createFarm, updateFarm, deleteFarm };
