const express = require('express');
const router = express.Router();
const { getWeather, updateWeather } = require('../controllers/weatherController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getWeather);
router.post('/', protect, authorize('admin'), updateWeather);

module.exports = router;
