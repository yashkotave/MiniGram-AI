import { useState, useEffect } from 'react';
import { Search, Filter, Flame, Zap, TrendingUp, Eye, Heart, MessageCircle } from 'lucide-react';
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

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3000/api/posts');
        const data = await response.json();
        setPosts(data.posts || generateMockPosts());
      } catch {
        setPosts(generateMockPosts());
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

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

      <div className="bg-gradient-to-r from-pink-500 via-orange-500 to-red-500 py-12 text-center text-white">
        <h1 className="text-5xl font-bold">Explore</h1>
      </div>

      <main className="max-w-6xl mx-auto p-6">

        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border rounded mb-6"
        />

        <div className="flex gap-3 mb-6">
          {sortOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => setSortBy(opt.id)}
              className="px-4 py-2 bg-slate-200 rounded"
            >
              {opt.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => (
              <div key={post.id} className="border rounded overflow-hidden">
                <img src={post.image} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold">{post.caption}</h3>
                  <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                  <div className="flex justify-between mt-2 text-sm">
                    <span>❤️ {post.likes}</span>
                    <span>👁️ {post.views}</span>
                    <span>💬 {post.comments}</span>
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

function formatDate(dateString) {
  const date = new Date(dateString);
  const diff = Math.floor((Date.now() - date) / 60000);
  if (diff < 60) return `${diff}m ago`;
  return date.toLocaleDateString();
}

function generateMockPosts() {
  return Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    caption: `Post ${i + 1}`,
    image: `https://via.placeholder.com/400?text=Post+${i + 1}`,
    likes: Math.floor(Math.random() * 100),
    comments: Math.floor(Math.random() * 20),
    views: Math.floor(Math.random() * 1000),
    category: 'photography',
    createdAt: new Date().toISOString()
  }));
}
