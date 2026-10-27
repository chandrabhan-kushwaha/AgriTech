const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const forumPostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Post title is required'],
  },
  category: {
    type: String,
    enum: ['Crop Care & Protection', 'Organic Farming Techniques', 'Machinery & Tools', 'Market Rates & MSP', 'Govt Schemes & Subsidies'],
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [commentSchema],
  isPinned: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('ForumPost', forumPostSchema);
