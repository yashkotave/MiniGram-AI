import axiosInstance from './axios';

// Auth Service
export const authService = {
  register: async (username, email, password, passwordConfirm) => {
    const response = await axiosInstance.post('/auth/register', {
      username,
      email,
      password,
      passwordConfirm
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await axiosInstance.post('/auth/login', {
      email,
      password
    });
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  updateProfile: async (fullName, bio, profileImage) => {
    const response = await axiosInstance.put('/auth/profile', {
      fullName,
      bio,
      profileImage
    });
    return response.data;
  },

  getUserByUsername: async (username) => {
    const response = await axiosInstance.get(`/auth/user/${username}`);
    return response.data;
  },

  followUser: async (userId) => {
    const response = await axiosInstance.post(`/auth/follow/${userId}`);
    return response.data;
  },

  unfollowUser: async (userId) => {
    const response = await axiosInstance.delete(`/auth/unfollow/${userId}`);
    return response.data;
  }
};

// Post Service
export const postService = {
  createPost: async (caption, imageUrl, tags = [], aiGenerated = false, originalCaption = null) => {
    const response = await axiosInstance.post('/posts', {
      caption,
      imageUrl,
      tags,
      aiGenerated,
      originalCaption
    });
    return response.data;
  },

  getAllPosts: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get('/posts', {
      params: { page, limit }
    });
    return response.data;
  },

  getUserFeed: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get('/posts/feed', {
      params: { page, limit }
    });
    return response.data;
  },

  getUserPosts: async (userId, page = 1, limit = 10) => {
    const response = await axiosInstance.get(`/posts/user/${userId}`, {
      params: { page, limit }
    });
    return response.data;
  },

  getPostById: async (postId) => {
    const response = await axiosInstance.get(`/posts/${postId}`);
    return response.data;
  },

  updatePost: async (postId, caption, tags) => {
    const response = await axiosInstance.put(`/posts/${postId}`, {
      caption,
      tags
    });
    return response.data;
  },

  deletePost: async (postId) => {
    const response = await axiosInstance.delete(`/posts/${postId}`);
    return response.data;
  },

  likePost: async (postId) => {
    const response = await axiosInstance.post(`/posts/${postId}/like`);
    return response.data;
  },

  unlikePost: async (postId) => {
    const response = await axiosInstance.delete(`/posts/${postId}/like`);
    return response.data;
  },

  addComment: async (postId, text) => {
    const response = await axiosInstance.post(`/posts/${postId}/comments`, { text });
    return response.data;
  },

  deleteComment: async (postId, commentId) => {
    const response = await axiosInstance.delete(`/posts/${postId}/comments/${commentId}`);
    return response.data;
  },

  searchByTag: async (tag, page = 1, limit = 10) => {
    const response = await axiosInstance.get('/posts/search/tag', {
      params: { tag, page, limit }
    });
    return response.data;
  }
};

// AI Service
export const aiService = {
  generateCaption: async (imageDescription, base64Image = null) => {
    const response = await axiosInstance.post('/ai/generate-caption', {
      imageDescription,
      base64Image
    });
    return response.data;
  },

  generateCaptionSuggestions: async (imageDescription) => {
    const response = await axiosInstance.post('/ai/generate-suggestions', {
      imageDescription
    });
    return response.data;
  },

  generateHashtags: async (caption) => {
    const response = await axiosInstance.post('/ai/generate-hashtags', {
      caption
    });
    return response.data;
  }
};
