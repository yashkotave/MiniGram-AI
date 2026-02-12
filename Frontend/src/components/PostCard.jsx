import { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, X, Loader, Trash2 } from 'lucide-react';
import { postService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function PostCard({ post, onPostUpdated, onPostDeleted }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(post.likes?.some(like => like._id === user?._id));
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    try {
      setLoading(true);
      if (isLiked) {
        await postService.unlikePost(post._id);
        setIsLiked(false);
        setLikeCount(likeCount - 1);
      } else {
        await postService.likePost(post._id);
        setIsLiked(true);
        setLikeCount(likeCount + 1);
      }
    } catch (error) {
      console.error('Like error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    try {
      setLoading(true);
      const response = await postService.addComment(post._id, commentText);
      if (response.success) {
        setComments(response.post.comments);
        setCommentText('');
      }
    } catch (error) {
      console.error('Comment error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      setLoading(true);
      const response = await postService.deleteComment(post._id, commentId);
      if (response.success) {
        setComments(response.post.comments);
      }
    } catch (error) {
      console.error('Delete comment error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      setIsDeleting(true);
      const response = await postService.deletePost(post._id);
      if (response.success) {
        if (onPostDeleted) {
          onPostDeleted(post._id);
        }
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting post');
    } finally {
      setIsDeleting(false);
      setShowMenu(false);
    }
  };

  const isAuthor = user?._id === post.author._id;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
        <Link to={`/profile/${post.author.username}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img
            src={post.author.profileImage || 'https://via.placeholder.com/40'}
            alt={post.author.username}
            className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
          />
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">
              {post.author.fullName || post.author.username}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              @{post.author.username}
            </p>
          </div>
        </Link>

        {isAuthor && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              <MoreHorizontal size={20} />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg z-10">
                <button
                  onClick={handleDeletePost}
                  disabled={isDeleting}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image */}
      <div className="w-full">
        <img
          src={post.imageUrl}
          alt="post"
          className="w-full h-96 object-cover"
        />
      </div>

      {/* Caption and Stats */}
      <div className="p-4">
        <p className="text-slate-900 dark:text-white mb-2">{post.caption}</p>
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag) => (
              <span key={tag} className="text-pink-600 dark:text-pink-400 text-sm hover:underline cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          {new Date(post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-around p-4 border-t border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
        <button
          onClick={handleLike}
          disabled={loading}
          className={`flex items-center gap-2 transition-colors duration-200 ${
            isLiked
              ? 'text-red-500'
              : 'hover:text-red-500'
          } disabled:opacity-50`}
        >
          <Heart
            size={20}
            fill={isLiked ? 'currentColor' : 'none'}
            className="transition-all duration-200"
          />
          <span className="text-sm font-medium">{likeCount}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 hover:text-blue-500 transition-colors"
        >
          <MessageCircle size={20} />
          <span className="text-sm font-medium">{comments.length}</span>
        </button>

        <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
          <Share2 size={20} />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          {/* Comment Form */}
        {user && (
            <form onSubmit={handleAddComment} className="mb-4 flex gap-2">
              <img
                src={user.profileImage || 'https://via.placeholder.com/32'}
                alt={user.username}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={loading || !commentText.trim()}
                  className="px-3 py-2 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {loading ? <Loader size={16} className="animate-spin" /> : 'Post'}
                </button>
              </div>
            </form>
          )}

          {!isAuthenticated && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-700 dark:text-blue-300 text-sm text-center">
              <p>Sign in to comment on this post</p>
              <button
                onClick={() => navigate('/auth')}
                className="mt-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {comments.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-sm text-center py-3">
                No comments yet. Be the first!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="flex gap-2 text-sm">
                  <img
                    src={comment.author.profileImage || 'https://via.placeholder.com/32'}
                    alt={comment.author.username}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-2">
                      <p className="font-semibold text-slate-900 dark:text-white text-xs">
                        {comment.author.username}
                      </p>
                      <p className="text-slate-700 dark:text-slate-300">{comment.text}</p>
                    </div>
                  </div>
                  {user?._id === comment.author._id && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      disabled={loading}
                      className="text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
