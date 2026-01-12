import { useState } from 'react';
import { Menu, X, Home, Heart, MessageCircle, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'Explore', icon: Heart, href: '/explore' },
    { label: 'Messages', icon: MessageCircle, href: '/messages' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
              MiniGram
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors duration-200"
              >
                <link.icon size={20} />
                <span className="text-sm font-medium">{link.label}</span>
              </a>
            ))}
          </div>

          {/* Right Side - User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <User size={20} className="text-gray-700 dark:text-gray-300" />
                </button>
                <button 
                  onClick={() => setIsLoggedIn(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <LogOut size={20} className="text-gray-700 dark:text-gray-300" />
                </button>
              </>
            ) : (
              <>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Sign In
                </button>
                <button className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition-shadow">
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <link.icon size={20} />
                <span className="text-sm font-medium">{link.label}</span>
              </a>
            ))}
            <hr className="my-2 border-gray-200 dark:border-gray-700" />
            {isLoggedIn ? (
              <>
                <a
                  href="/profile"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <User size={20} />
                  <span className="text-sm font-medium">Profile</span>
                </a>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <LogOut size={20} />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-2">
                <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  Sign In
                </button>
                <button className="w-full px-4 py-2 text-sm font-medium bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition-shadow">
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
