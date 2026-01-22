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
        // Replace with your actual API endpoint
        const response = await fetch('http://localhost:5000/api/posts', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setPosts(data || []);
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        // Mock data for demo purposes
        setPosts(generateMockPosts());
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
          <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setFilterCategory(category.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filterCategory === category.id
                      ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-md'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-pink-500'
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
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No posts found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className={`group rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 ${
                  viewMode === 'list' ? 'flex gap-4' : ''
                }`}
              >
                {/* Image Container */}
                <div className={`relative overflow-hidden bg-gray-200 dark:bg-gray-700 ${viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : 'aspect-square'}`}>
                  <img
                    src={post.image || `https://via.placeholder.com/400?text=${encodeURIComponent(post.caption || 'Post')}`}
                    alt={post.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Overlay with stats */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="flex gap-6 text-white w-full">
                      <div className="flex items-center gap-2">
                        <Heart size={18} />
                        <span className="text-sm font-medium">{post.likes || 0}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle size={18} />
                        <span className="text-sm font-medium">{post.comments || 0}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye size={18} />
                        <span className="text-sm font-medium">{post.views || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={`p-4 flex flex-col justify-between ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  {/* Header */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <img
                        src={post.author?.avatar || 'https://via.placeholder.com/32'}
                        alt={post.author?.username}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {post.author?.username || 'Anonymous'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">
                      {post.caption}
                    </p>

                    {post.category && (
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 font-medium mb-3">
                        #{post.category}
                      </span>
                    )}
                  </div>

                  {/* Footer Stats */}
                  <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-pink-500 transition-colors text-sm">
                      <Heart size={16} />
                      <span>{post.likes || 0}</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors text-sm">
                      <MessageCircle size={16} />
                      <span>{post.comments || 0}</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors text-sm">
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
