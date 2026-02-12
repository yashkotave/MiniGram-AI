import { useState, useEffect } from 'react';
import { Search, Loader, X } from 'lucide-react';
import { postService } from '../services/api';
import PostCard from '../components/PostCard';

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const fetchAllPosts = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError('');
      const response = await postService.getAllPosts(pageNum, 12);
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
      console.error('Fetch posts error:', error);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchAllPosts();
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await postService.searchByTag(searchQuery, 1, 12);
      if (response.success) {
        setPosts(response.posts);
        setHasMore(response.pagination.page < response.pagination.pages);
        setPage(1);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to search posts');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      if (searchQuery.trim()) {
        handleSearchPage(page + 1);
      } else {
        fetchAllPosts(page + 1);
      }
    }
  };

  const handleSearchPage = async (pageNum) => {
    try {
      setLoading(true);
      const response = await postService.searchByTag(searchQuery, pageNum, 12);
      if (response.success) {
        setPosts([...posts, ...response.posts]);
        setHasMore(response.pagination.page < response.pagination.pages);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };

  const clearSearch = () => {
    setSearchQuery('');
    fetchAllPosts();
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Explore
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Discover amazing posts from the community
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8 flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search by tag..."
            className="w-full px-4 py-3 pl-10 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <Search size={20} className="absolute left-3 top-3.5 text-slate-400" />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X size={20} />
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-3 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
        >
          Search
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-center">
          {error}
        </div>
      )}

      {/* Posts Grid */}
      {loading && posts.length === 0 ? (
        <div className="flex justify-center py-12">
          <Loader className="animate-spin text-pink-500" size={40} />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            No posts found. Try a different search!
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onPostDeleted={handlePostDeleted}
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-8">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-8 py-3 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
