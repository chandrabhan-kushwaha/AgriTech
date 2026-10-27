const express = require('express');
const router = express.Router();
const { getConsultations, getConsultationById, createConsultation, replyConsultation } = require('../controllers/expertController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getConsultations)
  .post(createConsultation);

router.route('/:id')
  .get(getConsultationById);

router.put('/:id/reply', authorize('admin'), replyConsultation);

module.exports = router;
