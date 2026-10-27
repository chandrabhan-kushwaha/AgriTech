const express = require('express');
const router = express.Router();
const { getOrders, getOrderById, createOrder, updateOrderStatus } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getOrders)
  .post(createOrder);

router.route('/:id')
  .get(getOrderById);

router.put('/:id/status', authorize('admin'), updateOrderStatus);

module.exports = router;
