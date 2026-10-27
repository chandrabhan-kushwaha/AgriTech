import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Users,
  Plus,
  Heart,
  MessageCircle,
  Pin,
  Send,
  Trash2,
  Filter,
  CheckCircle2,
  Search,
} from 'lucide-react';

const CommunityForum = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // New post form
  const [postForm, setPostForm] = useState({
    title: '',
    category: 'Crop Care & Protection',
    content: '',
  });

  // Comment input state per post
  const [commentInputs, setCommentInputs] = useState({});

  const categories = [
    'All',
    'Crop Care & Protection',
    'Organic Farming Techniques',
    'Machinery & Tools',
    'Market Rates & MSP',
    'Govt Schemes & Subsidies',
  ];

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let url = '/forum?';
      if (categoryFilter !== 'All') url += `category=${encodeURIComponent(categoryFilter)}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;

      const res = await API.get(url);
      setPosts(res.data.data || []);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [categoryFilter, search]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await API.post('/forum', postForm);
      setShowModal(false);
      setPostForm({
        title: '',
        category: 'Crop Care & Protection',
        content: '',
      });
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create discussion');
    }
  };

  const handleLike = async (postId) => {
    if (!user) {
      alert('Please log in to like posts');
      return;
    }
    try {
      const res = await API.post(`/forum/${postId}/like`);
      if (res.data.success) {
        setPosts(prev => prev.map(p => p._id === postId ? res.data.data : p));
      }
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  const handleAddComment = async (postId) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    try {
      const res = await API.post(`/forum/${postId}/comment`, { content: text });
      if (res.data.success) {
        setPosts(prev => prev.map(p => p._id === postId ? res.data.data : p));
        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add comment');
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Delete this forum post?')) {
      try {
        await API.delete(`/forum/${postId}`);
        fetchPosts();
      } catch (err) {
        alert('Failed to delete post');
      }
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <Users className="text-success" size={28} />
            <span>Kisan Community & Farmer Knowledge Exchange</span>
          </h2>
          <p className="text-muted small mb-0">
            Connect with progressive growers, discuss micro-irrigation, fertilizer recipes, mandi rates, and subsidy claims.
          </p>
        </div>

        <button className="agri-btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          <span>New Discussion Thread</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="agri-card p-3 mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between gap-3 align-items-md-center">
          <div className="d-flex align-items-center gap-1.5 flex-wrap">
            <Filter size={15} className="text-muted me-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                className={`btn btn-sm ${categoryFilter === cat ? 'btn-success' : 'btn-light border'} rounded-pill px-3 py-1`}
                style={{ fontSize: '0.82rem' }}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ minWidth: '240px' }}>
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-end-0 text-muted"><Search size={14} /></span>
              <input
                type="text"
                placeholder="Search topics, questions..."
                className="form-control border-start-0 ps-1"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Discussion Threads List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="agri-card text-center py-5">
          <Users size={48} className="text-muted mb-3 opacity-50" />
          <h5 className="fw-bold mb-1">No Discussions Yet</h5>
          <p className="text-muted small mb-3">Be the first to post a topic or ask a question to fellow farmers.</p>
          <button className="agri-btn-primary mx-auto" onClick={() => setShowModal(true)}>
            Start First Thread
          </button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {posts.map((post) => {
            const isLiked = user && post.likes?.includes(user._id);

            return (
              <div key={post._id} className="agri-card p-4">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-light text-dark border">{post.category}</span>
                    {post.isPinned && (
                      <span className="badge bg-warning-subtle text-warning-emphasis d-flex align-items-center gap-1">
                        <Pin size={12} /> Pinned
                      </span>
                    )}
                  </div>
                  {(user?.role === 'admin' || user?._id === post.author?._id || user?._id === post.author) && (
                    <button
                      className="btn btn-sm btn-light text-danger border p-1"
                      onClick={() => handleDeletePost(post._id)}
                      title="Delete Post"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <h4 className="fw-bold mb-1 text-dark">{post.title}</h4>
                <span className="d-block small text-muted mb-3">
                  Posted by <strong>{post.authorName || post.author?.name}</strong> • {new Date(post.createdAt).toLocaleDateString()}
                </span>

                <p className="small text-secondary mb-4 leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                  {post.content}
                </p>

                {/* Actions & Likes */}
                <div className="d-flex align-items-center gap-3 py-2 border-top border-bottom mb-3 small">
                  <button
                    className={`btn btn-sm d-flex align-items-center gap-1.5 border-0 ${isLiked ? 'text-danger' : 'text-muted'}`}
                    onClick={() => handleLike(post._id)}
                  >
                    <Heart size={16} fill={isLiked ? '#ef4444' : 'none'} />
                    <span className="fw-semibold">{post.likes?.length || 0} Helpful</span>
                  </button>

                  <div className="d-flex align-items-center gap-1.5 text-muted">
                    <MessageCircle size={16} />
                    <span>{post.comments?.length || 0} Replies</span>
                  </div>
                </div>

                {/* Comments List */}
                {post.comments && post.comments.length > 0 && (
                  <div className="d-flex flex-column gap-2 mb-3 ps-3 border-start">
                    {post.comments.map((c, i) => (
                      <div key={i} className="p-2.5 bg-light rounded-3 small">
                        <div className="d-flex justify-content-between align-items-baseline mb-1">
                          <strong className="text-dark">{c.authorName}</strong>
                          <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                            {new Date(c.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mb-0 text-secondary">{c.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input */}
                {user ? (
                  <div className="input-group input-group-sm">
                    <input
                      type="text"
                      placeholder="Write a helpful reply or farm insight..."
                      className="form-control"
                      value={commentInputs[post._id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddComment(post._id);
                      }}
                    />
                    <button
                      className="btn btn-success d-flex align-items-center gap-1"
                      onClick={() => handleAddComment(post._id)}
                    >
                      <Send size={13} />
                      <span>Reply</span>
                    </button>
                  </div>
                ) : (
                  <span className="small text-muted">
                    <a href="/login" className="text-success text-decoration-none fw-semibold">Log in</a> to participate in this discussion.
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* New Post Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Start a Community Discussion</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreatePost}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">Discussion Title / Question</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Recommended micronutrient spray schedule for flowering cotton?"
                        className="form-control"
                        value={postForm.title}
                        onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Topic Category</label>
                      <select
                        className="form-select"
                        value={postForm.category}
                        onChange={(e) => setPostForm({ ...postForm, category: e.target.value })}
                      >
                        <option value="Crop Care & Protection">Crop Care & Protection</option>
                        <option value="Organic Farming Techniques">Organic Farming Techniques</option>
                        <option value="Machinery & Tools">Machinery & Tools</option>
                        <option value="Market Rates & MSP">Market Rates & MSP</option>
                        <option value="Govt Schemes & Subsidies">Govt Schemes & Subsidies</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">Post Content & Context</label>
                      <textarea
                        rows="4"
                        required
                        placeholder="Share your practical experience, field trial results, questions, or observations..."
                        className="form-control"
                        value={postForm.content}
                        onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="agri-btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="agri-btn-primary">
                    <CheckCircle2 size={16} />
                    <span>Publish Topic</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityForum;
