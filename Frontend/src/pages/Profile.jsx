import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { LogOut, Edit, UserPlus, UserCheck, Loader, Mail, MapPin } from 'lucide-react';
import { authService, postService } from '../services/api';
import PostCard from '../components/PostCard';

export default function Profile() {
  const { user: currentUser, logout, followUser, unfollowUser } = useAuth();
  const navigate = useNavigate();
  const { username } = useParams();
  
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    bio: '',
    profileImage: ''
  });

  useEffect(() => {
    if (!currentUser && !username) {
      navigate('/auth');
      return;
    }
    
    // If username in URL, fetch that user's profile
    if (username) {
      fetchUserProfile(username);
    } else {
      // Show current user's profile
      setProfileUser(currentUser);
      setEditForm({
        fullName: currentUser.fullName || '',
        bio: currentUser.bio || '',
        profileImage: currentUser.profileImage || ''
      });
    }
  }, [username, currentUser, navigate]);

  useEffect(() => {
    if (profileUser) {
      fetchUserPosts();
      checkFollowing();
    }
  }, [profileUser]);

  const fetchUserProfile = async (uname) => {
    try {
      setLoading(true);
      const response = await authService.getUserByUsername(uname);
      if (response.success) {
        setProfileUser(response.user);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      setPostLoading(true);
      const response = await postService.getUserPosts(profileUser._id, 1, 12);
      if (response.success) {
        setUserPosts(response.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setPostLoading(false);
    }
  };

  const checkFollowing = () => {
    if (currentUser && profileUser) {
      setIsFollowing(currentUser.following?.includes(profileUser._id));
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(profileUser._id);
      } else {
        await followUser(profileUser._id);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Follow error:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const response = await authService.updateProfile(
        editForm.fullName,
        editForm.bio,
        editForm.profileImage
      );
      if (response.success) {
        setProfileUser(response.user);
        setEditMode(false);
      }
    } catch (error) {
      console.error('Update profile error:', error);
      alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePostDeleted = (postId) => {
    setUserPosts(userPosts.filter(post => post._id !== postId));
  };

  const isOwnProfile = currentUser?._id === profileUser?._id;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin text-pink-500" size={40} />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-slate-600 dark:text-slate-400">User not found</p>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          {/* Profile Image */}
          <img
            src={profileUser.profileImage || 'https://via.placeholder.com/120'}
            alt={profileUser.username}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-pink-500"
          />

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-start sm:items-center justify-between mb-3 flex-col sm:flex-row gap-3">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {profileUser.fullName || profileUser.username}
                </h1>
                <p className="text-slate-600 dark:text-slate-400">@{profileUser.username}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {isOwnProfile ? (
                  <>
                    <button
                      onClick={() => setEditMode(!editMode)}
                      className="flex items-center gap-2 px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                      Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-6 py-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-semibold rounded-lg transition-colors"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleFollow}
                    className={`flex items-center gap-2 px-6 py-2 font-semibold rounded-lg transition-colors ${
                      isFollowing
                        ? 'bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-400'
                        : 'bg-pink-500 text-white hover:bg-pink-600'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck size={18} />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus size={18} />
                        Follow
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Bio */}
            {profileUser.bio && (
              <p className="text-slate-700 dark:text-slate-300 mb-4">{profileUser.bio}</p>
            )}

            {/* Stats */}
            <div className="flex gap-6 text-center sm:text-left">
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {userPosts.length}
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Posts</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {profileUser.followers?.length || 0}
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Followers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {profileUser.following?.length || 0}
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Following</p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {editMode && isOwnProfile && (
          <div className="mt-6 pt-6 border-t border-slate-300 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Edit Profile
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                value={editForm.fullName}
                onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                placeholder="Full Name"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                placeholder="Bio"
                maxLength={500}
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
              />
              <input
                type="url"
                value={editForm.profileImage}
                onChange={(e) => setEditForm({...editForm, profileImage: e.target.value})}
                placeholder="Profile Image URL"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="px-6 py-2 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-6 py-2 bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-lg hover:bg-slate-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Posts */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Posts
        </h2>

        {postLoading ? (
          <div className="flex justify-center py-12">
            <Loader className="animate-spin text-pink-500" size={40} />
          </div>
        ) : userPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              No posts yet
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {userPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onPostDeleted={handlePostDeleted}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
