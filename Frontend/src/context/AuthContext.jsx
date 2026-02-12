import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authService.getCurrentUser();
        if (response && response.success && response.user) {
          setUser(response.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        // Not authenticated - this is normal for first visit or expired session
        console.log('Auth check completed - user not authenticated');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        // Always set loading to false after auth check completes
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const register = async (username, email, password, passwordConfirm) => {
    try {
      const response = await authService.register(username, email, password, passwordConfirm);
      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
        return response;
      }
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
        return response;
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (fullName, bio, profileImage) => {
    try {
      const response = await authService.updateProfile(fullName, bio, profileImage);
      if (response.success) {
        setUser(response.user);
        return response;
      }
    } catch (error) {
      throw error;
    }
  };

  const followUser = async (userId) => {
    try {
      const response = await authService.followUser(userId);
      if (response.success) {
        setUser(response.user);
        return response;
      }
    } catch (error) {
      throw error;
    }
  };

  const unfollowUser = async (userId) => {
    try {
      const response = await authService.unfollowUser(userId);
      if (response.success) {
        setUser(response.user);
        return response;
      }
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    updateProfile,
    followUser,
    unfollowUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
