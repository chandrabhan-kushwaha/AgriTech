const Resource = require('../models/Resource');

// @desc    Get agricultural resources (with filtering & search)
// @route   GET /api/resources
// @access  Public
const getResources = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ];
    }

    const resources = await Resource.find(query).sort({ rating: -1, createdAt: -1 });
    res.json({ success: true, count: resources.length, data: resources });
  } catch (error) {
    next(error);
  }
};

// @desc    Get resource by ID
// @route   GET /api/resources/:id
// @access  Public
const getResourceById = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    res.json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new agricultural resource (Admin)
// @route   POST /api/resources
// @access  Private (Admin)
const createResource = async (req, res, next) => {
  try {
    const resource = await Resource.create(req.body);
    res.status(201).json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
};

// @desc    Update resource (Admin)
// @route   PUT /api/resources/:id
// @access  Private (Admin)
const updateResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    res.json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete resource (Admin)
// @route   DELETE /api/resources/:id
// @access  Private (Admin)
const deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    await resource.deleteOne();
    res.json({ success: true, message: 'Resource deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getResources, getResourceById, createResource, updateResource, deleteResource };
