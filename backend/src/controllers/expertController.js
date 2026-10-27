const Consultation = require('../models/Consultation');

// @desc    Get consultations (farmer gets their own, admin gets all)
// @route   GET /api/consultations
// @access  Private
const getConsultations = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { farmer: req.user._id };
    const list = await Consultation.find(query)
      .populate('farmer', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single consultation
// @route   GET /api/consultations/:id
// @access  Private
const getConsultationById = async (req, res, next) => {
  try {
    const item = await Consultation.findById(req.params.id).populate('farmer', 'name email');
    if (!item) {
      return res.status(404).json({ success: false, message: 'Consultation query not found' });
    }
    if (req.user.role !== 'admin' && item.farmer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit new consultation inquiry
// @route   POST /api/consultations
// @access  Private
const createConsultation = async (req, res, next) => {
  try {
    const { subject, cropType, category, description, urgency } = req.body;

    const consultation = await Consultation.create({
      farmer: req.user._id,
      subject,
      cropType,
      category: category || 'Crop Disease & Pathology',
      description,
      urgency: urgency || 'Normal',
      status: 'Submitted',
    });

    res.status(201).json({ success: true, data: consultation });
  } catch (error) {
    next(error);
  }
};

// @desc    Provide expert response to inquiry (Admin / Agronomist)
// @route   PUT /api/consultations/:id/reply
// @access  Private (Admin)
const replyConsultation = async (req, res, next) => {
  try {
    const { expertResponse, expertName } = req.body;
    const item = await Consultation.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Consultation not found' });
    }

    item.expertResponse = expertResponse;
    if (expertName) item.expertName = expertName;
    item.status = 'Resolved';
    item.answeredAt = new Date();

    await item.save();
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

module.exports = { getConsultations, getConsultationById, createConsultation, replyConsultation };
