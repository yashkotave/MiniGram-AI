import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Authentication() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Input validation
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isSignUp) {
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
      } else if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    console.log(`[Auth] ${isSignUp ? 'Registering' : 'Logging in'}...`);

    try {
      if (isSignUp) {
        console.log('[Auth] Register attempt:', { 
          username: formData.username, 
          email: formData.email 
        });
        const result = await register(formData.username, formData.email, formData.password, formData.confirmPassword);
        console.log('[Auth] Registration successful:', result);
        setSuccess('Account created successfully! Welcome to MiniGram');
        setTimeout(() => {
          navigate('/profile');
        }, 1500);
      } else {
        console.log('[Auth] Login attempt:', { email: formData.email });
        const result = await login(formData.email, formData.password);
        console.log('[Auth] Login successful:', result);
        setSuccess('Welcome back! Redirecting...');
        setTimeout(() => {
          navigate('/profile');
        }, 1500);
      }
    } catch (err) {
      console.error('[Auth] Error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-elevated overflow-hidden border-2 border-slate-200 dark:border-slate-700">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 via-orange-500 to-red-500 px-8 py-12 sm:py-14 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">MiniGram</h1>
            <p className="text-pink-100 text-base sm:text-lg font-medium">
              {isSignUp ? 'Join our community' : 'Welcome back'}
            </p>
          </div>

          {/* Form Container */}
          <div className="px-8 py-10">
            
            {/* Alert Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl flex items-start space-x-3">
                <AlertCircle size={20} className="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl flex items-start space-x-3">
                <CheckCircle size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-green-700 dark:text-green-300 text-sm font-medium">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Username Field (Sign Up Only) */}
              {isSignUp && (
                <div>
                  <label htmlFor="username" className="block text-sm font-bold text-slate-900 dark:text-white mb-2.5">
                    Username
                  </label>
                  <div className="relative">
                    <User size={20} className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500" />
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Choose your username"
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all outline-none ${
                        errors.username
                          ? 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/10'
                          : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-700'
                      } text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400`}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-red-600 dark:text-red-400 text-xs mt-1.5 font-medium">{errors.username}</p>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-900 dark:text-white mb-2.5">
                  Email
                </label>
                <div className="relative">
                  <Mail size={20} className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all outline-none ${
                      errors.email
                        ? 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/10'
                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-700'
                    } text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 dark:text-red-400 text-xs mt-1.5 font-medium">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-bold text-slate-900 dark:text-white mb-2.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={20} className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={isSignUp ? 'Create a strong password' : 'Enter your password'}
                    className={`w-full pl-11 pr-11 py-3 rounded-xl border-2 transition-all outline-none ${
                      errors.password
                        ? 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/10'
                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-700'
                    } text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 dark:text-red-400 text-xs mt-1.5 font-medium">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field (Sign Up Only) */}
              {isSignUp && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-bold text-slate-900 dark:text-white mb-2.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className={`w-full pl-11 pr-11 py-3 rounded-xl border-2 transition-all outline-none ${
                        errors.confirmPassword
                          ? 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/10'
                          : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-700'
                      } text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-600 dark:text-red-400 text-xs mt-1.5 font-medium">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* Forgot Password Link (Sign In Only) */}
              {!isSignUp && (
                <div className="flex justify-end pt-1">
                  <a href="#" className="text-sm font-semibold text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors">
                    Forgot password?
                  </a>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 px-4 py-3.5 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </button>
            </form>

            {/* Toggle Sign In / Sign Up */}
            <div className="mt-8 text-center border-t-2 border-slate-200 dark:border-slate-700 pt-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setFormData({ email: '', password: '', confirmPassword: '', username: '' });
                    setErrors({});
                    setError('');
                    setSuccess('');
                  }}
                  className="text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 font-bold transition-colors"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>

            {/* Social Login */}
            <div className="mt-8 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-slate-300 dark:border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="px-4 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  className="px-4 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-xs text-slate-600 dark:text-slate-400 mt-8 px-4 font-medium">
          By signing up, you agree to our{' '}
          <a href="#" className="text-pink-600 dark:text-pink-400 hover:underline font-semibold">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-pink-600 dark:text-pink-400 hover:underline font-semibold">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
