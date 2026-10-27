const Order = require('../models/Order');
const Resource = require('../models/Resource');

// @desc    Get orders (farmer gets their own, admin gets all)
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { farmer: req.user._id };
    const orders = await Order.find(query)
      .populate('farmer', 'name email phone')
      .populate('items.resource', 'name imageUrl category')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('farmer', 'name email phone')
      .populate('items.resource', 'name imageUrl category brand');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (req.user.role !== 'admin' && order.farmer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new order (Farmer purchase)
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items provided' });
    }

    // Calculate subtotal and verify items
    let totalAmount = 0;
    const verifiedItems = [];

    for (const item of items) {
      const resource = await Resource.findById(item.resourceId || item.resource);
      if (!resource) {
        return res.status(404).json({ success: false, message: `Resource item not found: ${item.name}` });
      }

      const qty = Number(item.quantity) || 1;
      const subtotal = resource.price * qty;
      totalAmount += subtotal;

      verifiedItems.push({
        resource: resource._id,
        name: resource.name,
        price: resource.price,
        quantity: qty,
        unit: resource.unit,
        subtotal,
      });

      // Optionally deduct stock
      resource.stockQuantity = Math.max(0, resource.stockQuantity - qty);
      await resource.save();
    }

    const orderNumber = `AGR-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const order = await Order.create({
      farmer: req.user._id,
      orderNumber,
      items: verifiedItems,
      totalAmount,
      shippingAddress: {
        street: shippingAddress.street || 'Agri Hub #12',
        villageDistrict: shippingAddress.villageDistrict || 'Wardha',
        state: shippingAddress.state || 'Maharashtra',
        postalCode: shippingAddress.postalCode || '442001',
        contactPhone: shippingAddress.contactPhone || req.user.phone || '9876543210',
      },
      paymentMethod: paymentMethod || 'Cash on Delivery (Kisan Pay)',
      status: 'Placed',
      trackingUpdates: [{
        status: 'Placed',
        location: 'Central Agro Hub, Nagpur Warehouse',
        notes: 'Order received and verified for packing.',
        timestamp: new Date(),
      }],
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status & add tracking milestone (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, location, notes } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status || order.status;
    order.trackingUpdates.push({
      status: status || order.status,
      location: location || 'Regional Transit Hub',
      notes: notes || `Shipment status updated to ${status}`,
      timestamp: new Date(),
    });

    await order.save();
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

module.exports = { getOrders, getOrderById, createOrder, updateOrderStatus };
