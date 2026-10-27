const express = require('express');
const router = express.Router();
const { getPestAlerts, getPestAlertById, createPestAlert, updatePestAlert, deletePestAlert } = require('../controllers/pestController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getPestAlerts);
router.get('/:id', getPestAlertById);
router.post('/', protect, authorize('admin'), createPestAlert);
router.put('/:id', protect, authorize('admin'), updatePestAlert);
router.delete('/:id', protect, authorize('admin'), deletePestAlert);

module.exports = router;
