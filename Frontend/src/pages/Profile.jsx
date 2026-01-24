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
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Profile Header */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-elevated overflow-hidden mb-12">
          {/* Banner */}
          <div className="h-40 bg-gradient-to-r from-pink-500 via-orange-500 to-red-500"></div>

          {/* Profile Info */}
          <div className="px-8 sm:px-12 py-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-8">
                <div className="w-28 h-28 rounded-full bg-gradient-to-r from-pink-400 to-orange-400 flex items-center justify-center text-white text-5xl font-bold -mt-16 border-4 border-white dark:border-slate-800 shadow-lg">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div className="mt-4 sm:mt-0">
                  <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{user?.username}</h1>
                  <p className="text-slate-600 dark:text-slate-400 flex items-center mt-3 text-lg">
                    <User size={18} className="mr-2" />
                    @{user?.username}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-7 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all duration-200 hover:shadow-lg flex items-center gap-2"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t-2 border-slate-200 dark:border-slate-700">
              <div className="text-center">
                <p className="text-4xl font-bold gradient-text">{userPosts.length}</p>
                <p className="text-slate-600 dark:text-slate-400 text-base mt-2 font-medium">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-orange-500">0</p>
                <p className="text-slate-600 dark:text-slate-400 text-base mt-2 font-medium">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-pink-500">0</p>
                <p className="text-slate-600 dark:text-slate-400 text-base mt-2 font-medium">Following</p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Your Posts</h2>

          {loading ? (
            <div className="text-center py-20">
              <div className="spinner mx-auto"></div>
              <p className="text-slate-600 dark:text-slate-400 mt-4 text-lg font-medium">Loading posts...</p>
            </div>
          ) : userPosts.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-elevated p-16 text-center border-2 border-slate-200 dark:border-slate-700">
              <p className="text-slate-600 dark:text-slate-400 text-xl font-medium">No posts yet. Create your first post!</p>
              <button
                onClick={() => navigate('/')}
                className="mt-8 px-8 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                Create Post
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {userPosts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 hover:scale-105 border border-slate-200 dark:border-slate-700"
                >
                  <div className="aspect-square bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center">
                    <p className="text-white text-center px-6 text-lg font-semibold">{post.caption || 'Post'}</p>
                  </div>
                  <div className="p-5">
                    <p className="text-slate-900 dark:text-white font-bold truncate text-lg">{post.caption}</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 font-medium">
                      {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
