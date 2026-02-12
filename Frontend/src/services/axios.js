import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to auth for 401 on non-auth endpoints
    // Don't redirect for getCurrentUser (which returns 401 if not logged in)
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      // Don't redirect if this is just a getCurrentUser check (auth check on startup)
      if (!url.includes('/auth/me')) {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
