import { useState, useEffect } from 'react';
import { Search, Filter, Flame, Zap, TrendingUp, Calendar, MapPin, Eye, Heart, MessageCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('trending');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());

  const categories = [
    { id: 'all', label: 'All Posts', icon: '🎯' },
    { id: 'photography', label: 'Photography', icon: '📷' },
    { id: 'art', label: 'Art', icon: '🎨' },
    { id: 'travel', label: 'Travel', icon: '✈️' },
    { id: 'food', label: 'Food', icon: '🍽️' },
    { id: 'technology', label: 'Technology', icon: '💻' },
    { id: 'lifestyle', label: 'Lifestyle', icon: '🌟' },
    { id: 'fitness', label: 'Fitness', icon: '💪' },
  ];

  const sortOptions = [
    { id: 'trending', label: 'Trending', icon: Flame },
    { id: 'latest', label: 'Latest', icon: Zap },
    { id: 'popular', label: 'Most Popular', icon: TrendingUp },
  ];

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3000/api/posts', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts || []);
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        setPosts(generateMockPosts());
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update posts list with new like count
        setPosts(posts.map(post => 
          post._id === postId ? data.post : post
        ));

        // Update liked posts set
        if (data.isLiked) {
          setLikedPosts(prev => new Set([...prev, postId]));
        } else {
          setLikedPosts(prev => {
            const newSet = new Set(prev);
            newSet.delete(postId);
            return newSet;
          });
        }
      }
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  // Filter and sort posts
  const filteredPosts = posts
    .filter(post => {
      const matchesSearch = post.caption?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'trending') return (b.likes?.length || 0) - (a.likes?.length || 0);
      if (sortBy === 'latest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'popular') return b.views - a.views;
      return 0;
    });

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-500 via-orange-500 to-red-500 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 leading-tight">Explore the World</h1>
          <p className="text-pink-100 text-base sm:text-lg">Discover amazing content from creators worldwide</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search Bar */}
        <div className="mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search posts by caption, hashtag, or creator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-8 border-b-2 border-slate-200 dark:border-slate-800">
          {/* Sort Options */}
          <div className="flex gap-3 flex-wrap">
            {sortOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => setSortBy(option.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-200 font-medium text-sm ${
                    sortBy === option.id
                      ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <IconComponent size={18} />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>

          {/* View Mode & Filter Toggle */}
          <div className="flex gap-3">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 text-sm font-medium"
            >
              {viewMode === 'grid' ? 'List' : 'Grid'}
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 text-sm font-medium"
            >
              <Filter size={18} />
              Filter
            </button>
          </div>
        </div>

        {/* Category Filter */}
        {showFilters && (
          <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Categories</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setFilterCategory(category.id)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filterCategory === category.id
                      ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-md'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600 hover:border-pink-400'
                  }`}
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Posts Grid/List */}
        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <div className="spinner"></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 opacity-80">🔍</div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No posts found</h3>
            <p className="text-slate-600 dark:text-slate-400 text-lg">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-5'}>
            {filteredPosts.map((post) => (
              <div
                key={post._id}
                className={`group rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card hover:shadow-elevated transition-all duration-300 hover:scale-105 ${
                  viewMode === 'list' ? 'flex gap-4' : ''
                }`}
              >
                {/* Image Container */}
                <div className={`relative overflow-hidden bg-slate-200 dark:bg-slate-700 ${viewMode === 'list' ? 'w-56 h-48 flex-shrink-0' : 'aspect-square'}`}>
                  <img
                    src={post.imageUrl || `https://via.placeholder.com/400?text=${encodeURIComponent(post.caption || 'Post')}`}
                    alt={post.caption}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Overlay with stats */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <div className="flex gap-8 text-white w-full">
                      <div className="flex items-center gap-2">
                        <Heart size={18} />
                        <span className="text-sm font-semibold">{post.likes?.length || 0}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle size={18} />
                        <span className="text-sm font-semibold">{post.comments || 0}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye size={18} />
                        <span className="text-sm font-semibold">{post.views || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={`p-5 flex flex-col justify-between ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  {/* Header */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={post.user?.avatar || 'https://via.placeholder.com/32'}
                        alt={post.user?.username}
                        className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-600"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {post.user?.username || 'Anonymous'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2 mb-3 font-medium">
                      {post.caption}
                    </p>

                    {post.category && (
                      <span className="inline-block px-3 py-1 text-xs rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 font-bold mb-3">
                        #{post.category}
                      </span>
                    )}
                  </div>

                  {/* Footer Stats */}
                  <div className="flex justify-around pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button 
                      onClick={() => handleLike(post._id)}
                      className={`flex items-center gap-1 transition-colors text-sm font-semibold ${
                        likedPosts.has(post._id)
                          ? 'text-red-500'
                          : 'text-slate-600 dark:text-slate-400 hover:text-pink-500'
                      }`}
                    >
                      <Heart size={16} fill={likedPosts.has(post._id) ? 'currentColor' : 'none'} />
                      <span>{post.likes?.length || 0}</span>
                    </button>
                    <button className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors text-sm font-semibold">
                      <MessageCircle size={16} />
                      <span>{post.comments || 0}</span>
                    </button>
                    <button className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-green-500 transition-colors text-sm font-semibold">
                      <Eye size={16} />
                      <span>{post.views || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// Helper function to format dates
function formatDate(dateString) {
  if (!dateString) return 'Recently';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Mock data generator for demo
function generateMockPosts() {
  const mockCaptions = [
    'Sunset over the mountains 🌅',
    'Coffee and coding ☕💻',
    'Beach day vibes 🏖️',
    'New art piece 🎨',
    'Traveling through Europe ✈️',
    'Delicious pasta night 🍝',
    'Gym goals 💪',
    'City lights 🌃',
  ];

  return Array.from({ length: 12 }, (_, i) => ({
    _id: i + 1,
    caption: mockCaptions[i % mockCaptions.length],
    imageUrl: `https://via.placeholder.com/400?text=Post%20${i + 1}`,
    user: {
      username: `creator_${i + 1}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i + 1}`,
    },
    likes: [],
    comments: Math.floor(Math.random() * 100),
    views: Math.floor(Math.random() * 5000),
    category: ['photography', 'art', 'travel', 'food', 'technology', 'lifestyle', 'fitness'][i % 7],
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  }));
}
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  // Filter and sort posts
  const filteredPosts = posts
    .filter(post => {
      const matchesSearch = post.caption?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'trending') return b.likes - a.likes;
      if (sortBy === 'latest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'popular') return b.views - a.views;
      return 0;
    });

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-500 via-orange-500 to-red-500 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 leading-tight">Explore the World</h1>
          <p className="text-pink-100 text-base sm:text-lg">Discover amazing content from creators worldwide</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search Bar */}
        <div className="mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search posts by caption, hashtag, or creator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-8 border-b-2 border-slate-200 dark:border-slate-800">
          {/* Sort Options */}
          <div className="flex gap-3 flex-wrap">
            {sortOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => setSortBy(option.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-200 font-medium text-sm ${
                    sortBy === option.id
                      ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <IconComponent size={18} />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>

          {/* View Mode & Filter Toggle */}
          <div className="flex gap-3">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 text-sm font-medium"
            >
              {viewMode === 'grid' ? 'List' : 'Grid'}
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 text-sm font-medium"
            >
              <Filter size={18} />
              Filter
            </button>
          </div>
        </div>

        {/* Category Filter */}
        {showFilters && (
          <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Categories</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setFilterCategory(category.id)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filterCategory === category.id
                      ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-md'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600 hover:border-pink-400'
                  }`}
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Posts Grid/List */}
        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <div className="spinner"></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 opacity-80">🔍</div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No posts found</h3>
            <p className="text-slate-600 dark:text-slate-400 text-lg">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-5'}>
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className={`group rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card hover:shadow-elevated transition-all duration-300 hover:scale-105 ${
                  viewMode === 'list' ? 'flex gap-4' : ''
                }`}
              >
                {/* Image Container */}
                <div className={`relative overflow-hidden bg-slate-200 dark:bg-slate-700 ${viewMode === 'list' ? 'w-56 h-48 flex-shrink-0' : 'aspect-square'}`}>
                  <img
                    src={post.image || `https://via.placeholder.com/400?text=${encodeURIComponent(post.caption || 'Post')}`}
                    alt={post.caption}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Overlay with stats */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <div className="flex gap-8 text-white w-full">
                      <div className="flex items-center gap-2">
                        <Heart size={18} />
                        <span className="text-sm font-semibold">{post.likes || 0}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle size={18} />
                        <span className="text-sm font-semibold">{post.comments || 0}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye size={18} />
                        <span className="text-sm font-semibold">{post.views || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={`p-5 flex flex-col justify-between ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  {/* Header */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={post.author?.avatar || 'https://via.placeholder.com/32'}
                        alt={post.author?.username}
                        className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-600"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {post.author?.username || 'Anonymous'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2 mb-3 font-medium">
                      {post.caption}
                    </p>

                    {post.category && (
                      <span className="inline-block px-3 py-1 text-xs rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 font-bold mb-3">
                        #{post.category}
                      </span>
                    )}
                  </div>

                  {/* Footer Stats */}
                  <div className="flex justify-around pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-pink-500 transition-colors text-sm font-semibold">
                      <Heart size={16} />
                      <span>{post.likes || 0}</span>
                    </button>
                    <button className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors text-sm font-semibold">
                      <MessageCircle size={16} />
                      <span>{post.comments || 0}</span>
                    </button>
                    <button className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-green-500 transition-colors text-sm font-semibold">
                      <Eye size={16} />
                      <span>{post.views || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// Helper function to format dates
function formatDate(dateString) {
  if (!dateString) return 'Recently';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Mock data generator for demo
function generateMockPosts() {
  const mockCaptions = [
    'Sunset over the mountains 🌅',
    'Coffee and coding ☕💻',
    'Beach day vibes 🏖️',
    'New art piece 🎨',
    'Traveling through Europe ✈️',
    'Delicious pasta night 🍝',
    'Gym goals 💪',
    'City lights 🌃',
  ];

  return Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    caption: mockCaptions[i % mockCaptions.length],
    image: `https://via.placeholder.com/400?text=Post%20${i + 1}`,
    author: {
      username: `creator_${i + 1}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i + 1}`,
    },
    likes: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 100),
    views: Math.floor(Math.random() * 5000),
    category: ['photography', 'art', 'travel', 'food', 'technology', 'lifestyle', 'fitness'][i % 7],
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  }));
}
