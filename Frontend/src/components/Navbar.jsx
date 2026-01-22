import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Heart, MessageCircle, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
    setIsOpen(false);
  };

  const navLinks = [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'Explore', icon: Heart, href: '/explore' },
    { label: 'Messages', icon: MessageCircle, href: '/messages' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl sm:text-2xl font-bold gradient-text hover:opacity-80 transition-opacity">
              MiniGram
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 lg:space-x-10">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors duration-200 text-sm font-medium"
              >
                <link.icon size={20} className="opacity-80" />
                <span>{link.label}</span>
              </a>
            ))}
          </div>

          {/* Right Side - User Actions */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200">
                  <User size={20} className="text-slate-700 dark:text-slate-300" />
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
                >
                  <LogOut size={20} className="text-slate-700 dark:text-slate-300" />
                </button>
              </>
            ) : (
              <>
                <Link to="/auth" className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link to="/auth" className="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 max-h-[calc(100vh-64px)] overflow-y-auto">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 text-sm font-medium"
              >
                <link.icon size={20} />
                <span>{link.label}</span>
              </a>
            ))}
            <hr className="my-2 border-slate-200 dark:border-slate-700" />
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 text-sm font-medium"
                >
                  <User size={20} />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 text-sm font-medium text-left"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-2">
                <Link to="/auth" className="w-full block px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 text-center">
                  Sign In
                </Link>
                <Link to="/auth" className="w-full block px-4 py-3 text-sm font-medium bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 text-center">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
