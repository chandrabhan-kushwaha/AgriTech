const ForumPost = require('../models/ForumPost');

// @desc    Get all forum discussions
// @route   GET /api/forum
// @access  Public
const getPosts = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const posts = await ForumPost.find(query)
      .populate('author', 'name role region')
      .sort({ isPinned: -1, createdAt: -1 });

    res.json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    next(error);
  }
};

// @desc    Get post by ID
// @route   GET /api/forum/:id
// @access  Public
const getPostById = async (req, res, next) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate('author', 'name role region')
      .populate('comments.author', 'name role');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new discussion post
// @route   POST /api/forum
// @access  Private
const createPost = async (req, res, next) => {
  try {
    const { title, category, content } = req.body;

    const post = await ForumPost.create({
      author: req.user._id,
      authorName: req.user.name,
      title,
      category,
      content,
    });

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to post
// @route   POST /api/forum/:id/comment
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.comments.push({
      author: req.user._id,
      authorName: req.user.name,
      content,
      createdAt: new Date(),
    });

    await post.save();
    res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle like on post
// @route   POST /api/forum/:id/like
// @access  Private
const toggleLike = async (req, res, next) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const index = post.likes.indexOf(req.user._id);
    if (index === -1) {
      post.likes.push(req.user._id);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    res.json({ success: true, likesCount: post.likes.length, data: post });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post (author or admin)
// @route   DELETE /api/forum/:id
// @access  Private
const deletePost = async (req, res, next) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (req.user.role !== 'admin' && post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ success: true, message: 'Discussion post deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPosts, getPostById, createPost, addComment, toggleLike, deletePost };
