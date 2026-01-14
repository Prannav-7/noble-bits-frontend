import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Heart, User, LogOut, Shield, Package, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const location = useLocation();
  const { getCartCount, getWishlistCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();

  // Admin emails
  const ADMIN_EMAILS = ['prannavp803@gmail.com', 'ran17062005@gmail.com'];
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/#about' },
    { name: 'Menu', path: '/menu' },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    setShowProfileDropdown(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-brand-bg/95 backdrop-blur-sm shadow-sm border-b border-brand-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white">
                <ShoppingCart size={20} />
              </div>
              <span className="font-heading text-2xl font-bold text-brand-primary">Noble Bites</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`font-medium text-lg transition-colors duration-200 ${location.pathname === link.path
                    ? 'text-brand-primary font-bold'
                    : 'text-brand-text hover:text-brand-primary'
                    }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Wishlist */}
              <Link to="/wishlist" className="relative p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors">
                <Heart size={20} />
                {getWishlistCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {getWishlistCount()}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link to="/cart" className="relative p-2 rounded-full bg-brand-secondary/20 hover:bg-brand-secondary/40 text-brand-primary transition-colors">
                <ShoppingCart size={20} />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {getCartCount()}
                  </span>
                )}
              </Link>

              {/* User Account */}
              {isAuthenticated() ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-2 text-brand-text hover:text-brand-primary transition-colors font-medium"
                    onBlur={() => setTimeout(() => setShowProfileDropdown(false), 200)}
                  >
                    <span>Hi, {user?.name || 'User'}</span>
                    <ChevronDown size={18} className={`transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showProfileDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    >
                      <Link
                        to="/my-orders"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-brand-light transition-colors"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        <Package size={18} className="text-brand-primary" />
                        <span>My Orders</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-brand-light transition-colors"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          <Shield size={18} className="text-purple-600" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <hr className="my-2" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 transition-colors text-red-600"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-full hover:bg-brand-text transition-colors"
                >
                  <User size={18} />
                  Login
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-brand-primary hover:text-brand-text focus:outline-none"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden bg-brand-bg border-t border-brand-secondary/20"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-brand-text hover:text-brand-primary hover:bg-brand-light"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/wishlist"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-brand-text hover:text-brand-primary hover:bg-brand-light"
              >
                Wishlist
                {getWishlistCount() > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getWishlistCount()}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-brand-text hover:text-brand-primary hover:bg-brand-light"
              >
                My Cart
                {getCartCount() > 0 && (
                  <span className="bg-brand-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </Link>

              {isAuthenticated() ? (
                <>
                  <Link
                    to="/my-orders"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-brand-text hover:text-brand-primary hover:bg-brand-light"
                  >
                    <Package size={18} />
                    My Orders
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-purple-600 hover:bg-purple-50"
                    >
                      <Shield size={18} />
                      Admin Dashboard
                    </Link>
                  )}

                  <div className="px-3 py-2 text-sm text-gray-600">
                    Logged in as: <span className="font-bold text-brand-primary">{user?.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-brand-primary hover:bg-brand-light"
                >
                  Login / Register
                </button>
              )}
            </div>
          </motion.div>
        )}
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default Navbar;

