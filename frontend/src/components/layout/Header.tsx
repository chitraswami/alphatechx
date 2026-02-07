import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, UserIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../common/Logo';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Products', href: '/products' },
    { name: 'Contact Us', href: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActivePage = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-lg border-b border-gray-200'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-padding">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="block">
              <Logo
                width={160}
                height={48}
                variant={isScrolled ? 'dark' : 'dark'}
                className="transition-all duration-300"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActivePage(item.href)
                    ? 'text-primary-600'
                    : isScrolled
                    ? 'text-gray-800 hover:text-primary-600'
                    : 'text-gray-800 hover:text-primary-600'
                }`}
              >
                {item.name}
                {isActivePage(item.href) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-primary-600"
                    initial={false}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Auth & User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isScrolled
                      ? 'text-secondary-700 hover:bg-secondary-100'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <UserIcon className="w-5 h-5" />
                  <span className="hidden sm:block">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.1 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 py-1"
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <hr className="my-1 border-secondary-200" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isScrolled
                      ? 'text-secondary-700 hover:bg-secondary-100'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm px-4 py-2"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors duration-200 ${
                isScrolled
                  ? 'text-secondary-700 hover:bg-secondary-100'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-white/20 pt-4 pb-6 space-y-2"
            >
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 text-base font-medium rounded-lg transition-colors duration-200 ${
                    isActivePage(item.href)
                      ? 'bg-primary-600 text-white'
                      : isScrolled
                      ? 'text-secondary-700 hover:bg-secondary-100'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {!isAuthenticated && (
                <div className="pt-4 space-y-2 border-t border-white/20">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 text-base font-medium rounded-lg transition-colors duration-200 ${
                      isScrolled
                        ? 'text-secondary-700 hover:bg-secondary-100'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="btn-primary text-base w-full text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header; 