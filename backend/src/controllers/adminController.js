const User = require('../models/User');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const Order = require('../models/Order');
const Resource = require('../models/Resource');
const PestAlert = require('../models/PestAlert');
const Consultation = require('../models/Consultation');
const ForumPost = require('../models/ForumPost');

// @desc    Get system-wide metrics and stats for Admin Dashboard
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalFarms,
      totalCrops,
      totalOrders,
      activePests,
      pendingConsultations,
      totalResources,
      recentOrders,
    ] = await Promise.all([
      User.countDocuments(),
      Farm.countDocuments(),
      Crop.countDocuments(),
      Order.countDocuments(),
      PestAlert.countDocuments({ active: true }),
      Consultation.countDocuments({ status: { $ne: 'Resolved' } }),
      Resource.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('farmer', 'name email'),
    ]);

    // Calculate revenue
    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalFarms,
        totalCrops,
        totalOrders,
        totalRevenue,
        activePests,
        pendingConsultations,
        totalResources,
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role or status
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin)
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({ success: true, message: `Role updated to ${role}`, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Do not delete oneself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own admin account' });
    }

    await user.deleteOne();
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAdminStats, getAllUsers, updateUserRole, deleteUser };
