import { useState, useEffect } from 'react';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { postService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError('');
      // If authenticated, fetch personalized feed; otherwise fetch all posts
      let response;
      if (isAuthenticated) {
        response = await postService.getUserFeed(pageNum, 10);
      } else {
        response = await postService.getAllPosts(pageNum, 10);
      }
      
      if (response.success) {
        if (pageNum === 1) {
          setPosts(response.posts);
        } else {
          setPosts([...posts, ...response.posts]);
        }
        setHasMore(response.pagination.page < response.pagination.pages);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Fetch feed error:', error);
      setError('Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchFeed(page + 1);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Create Post Form - Only for authenticated users */}
      {isAuthenticated && <PostForm onPostCreated={handlePostCreated} />}

      {/* Sign in prompt for unauthenticated users */}
      {!isAuthenticated && (
        <div className="mb-8 p-6 bg-gradient-to-r from-pink-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 border-2 border-pink-200 dark:border-pink-700 rounded-2xl text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome to MiniGram!</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-4">Sign in to create posts and interact with the community</p>
          <button
            onClick={() => navigate('/auth')}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            Sign In / Sign Up
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-center">
          {error}
        </div>
      )}

      {/* Feed */}
      <div className="space-y-6">
        {loading && posts.length === 0 ? (
          <div className="flex justify-center py-12">
            <Loader className="animate-spin text-pink-500" size={40} />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              {isAuthenticated ? 'No posts yet. Follow some users or create your first post!' : 'No posts available. Be the first to create one!'}
            </p>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onPostDeleted={handlePostDeleted}
              />
            ))}
            
            {hasMore && (
              <div className="flex justify-center pt-6">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
