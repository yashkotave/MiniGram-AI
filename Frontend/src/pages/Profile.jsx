import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Mail, Calendar } from 'lucide-react';

export default function UserProfile() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    // Fetch user's posts
    const fetchUserPosts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/posts/user/${user.id}`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setUserPosts(data.posts || []);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchUserPosts();
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-pink-500 to-orange-500"></div>

          {/* Profile Info */}
          <div className="px-6 sm:px-8 py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="flex items-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-400 to-orange-400 flex items-center justify-center text-white text-4xl font-bold -mt-12 border-4 border-white dark:border-gray-800 shadow-lg">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div className="ml-6 mt-4 sm:mt-0">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user?.username}</h1>
                  <p className="text-gray-600 dark:text-gray-400 flex items-center mt-2">
                    <User size={16} className="mr-2" />
                    @{user?.username}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="mt-6 sm:mt-0 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors flex items-center"
              >
                <LogOut size={18} className="mr-2" />
                Logout
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <p className="text-3xl font-bold text-pink-500">{userPosts.length}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-500">0</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-pink-500">0</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Following</p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Posts</h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Loading posts...</p>
            </div>
          ) : userPosts.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-lg">No posts yet. Create your first post!</p>
              <button
                onClick={() => navigate('/')}
                className="mt-6 px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
              >
                Create Post
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPosts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="aspect-square bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center">
                    <p className="text-white text-center px-4">{post.caption || 'Post'}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-900 dark:text-white font-semibold truncate">{post.caption}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
