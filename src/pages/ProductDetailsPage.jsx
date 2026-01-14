import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, Heart, ShoppingBag, ShoppingCart, Truck, ShieldCheck, Clock } from 'lucide-react';
import { products } from '../data/products';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/AuthModal';
import toast from 'react-hot-toast';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === parseInt(id));
  const [quantity, setQuantity] = useState(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const { isAuthenticated } = useAuth();

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-brand-text">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Link to="/menu" className="text-brand-primary hover:underline flex items-center gap-2">
          <ArrowLeft size={20} /> Back to Menu
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);

  const handleAuthRequired = (action) => {
    if (!isAuthenticated()) {
      setPendingAction(() => action);
      setShowAuthModal(true);
      return false;
    }
    return true;
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated()) {
      toast.error('Please login to continue');
      setPendingAction(() => handleAddToCart);
      setShowAuthModal(true);
      return;
    }
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated()) {
      toast.error('Please login to continue');
      setPendingAction(() => handleBuyNow);
      setShowAuthModal(true);
      return;
    }
    addToCart(product, quantity);
    navigate('/cart');
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated()) {
      toast.error('Please login to continue');
      setPendingAction(() => handleWishlistToggle);
      setShowAuthModal(true);
      return;
    }
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-brand-bg py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link to="/menu" className="inline-flex items-center gap-2 text-brand-text hover:text-brand-primary mb-8 transition-colors">
            <ArrowLeft size={20} /> Back to Menu
          </Link>

          <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 md:p-12 shadow-xl border border-white/40">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">

              {/* Image Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative"
              >
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl border-8 border-white bg-white">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute top-4 right-4">
                  <button
                    onClick={handleWishlistToggle}
                    className={`p-3 rounded-full shadow-lg transition-all ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-500'}`}
                  >
                    <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
                  </button>
                </div>
              </motion.div>

              {/* Details Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col justify-center space-y-6"
              >
                <div>
                  <span className="inline-block px-3 py-1 bg-brand-secondary/10 text-brand-primary rounded-full text-sm font-semibold mb-3">
                    {product.category}
                  </span>
                  <h1 className="font-heading text-4xl md:text-5xl font-bold text-brand-primary mb-2">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} fill={i < product.rating ? "currentColor" : "none"} className={i < product.rating ? "text-yellow-400" : "text-gray-300"} />
                      ))}
                    </div>
                    <span className="text-brand-text/60 text-sm">(124 reviews)</span>
                  </div>
                  <p className="text-2xl font-bold text-brand-text">
                    Rs. {product.price} <span className="text-base font-normal text-brand-text/60">/ {product.weight}</span>
                  </p>
                </div>

                <p className="text-brand-text/80 text-lg leading-relaxed">
                  {product.description}
                </p>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-brand-secondary/20">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">Ingredients</span>
                    <p className="text-sm text-brand-text/80">{product.ingredients}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">Shelf Life</span>
                    <p className="text-sm text-brand-text/80 flex items-center gap-1">
                      <Clock size={14} /> {product.shelfLife}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center border border-brand-secondary/30 rounded-full bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-brand-primary hover:bg-brand-light rounded-l-full transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 font-bold text-brand-text w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-brand-primary hover:bg-brand-light rounded-r-full transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-sm text-brand-text/60">
                    Total: <span className="font-bold text-brand-primary">Rs. {product.price * quantity}</span>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-brand-primary text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-brand-text hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={20} /> Buy Now
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-white border-2 border-brand-primary text-brand-primary font-bold py-4 px-8 rounded-xl hover:bg-brand-light transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={20} /> Add to Cart
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-brand-text/60 pt-4">
                  <div className="flex items-center gap-1">
                    <Truck size={14} /> Fast Delivery
                  </div>
                  <div className="flex items-center gap-1">
                    <ShieldCheck size={14} /> Quality Assured
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={14} /> Authentic Taste
                  </div>
                </div>

              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setPendingAction(null);
        }}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default ProductDetailsPage;

