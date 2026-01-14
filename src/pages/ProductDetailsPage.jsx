import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Star, Heart, ShoppingBag, ShoppingCart, Truck, ShieldCheck, Clock, MessageCircle, User, CheckCircle } from 'lucide-react';
import { products } from '../data/products';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/AuthModal';
import toast from 'react-hot-toast';
import axios from 'axios';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === parseInt(id));
  const [quantity, setQuantity] = useState(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [hasOrdered, setHasOrdered] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (product && isAuthenticated()) {
      fetchReviews();
      checkReviewEligibility();
      fetchRelatedProducts();
    } else if (product) {
      fetchReviews();
      fetchRelatedProducts();
    }

    // If review parameter is present, scroll to review section
    if (searchParams.get('review') === 'true' && isAuthenticated()) {
      setTimeout(() => {
        setShowReviewForm(true);
        document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [product, isAuthenticated]);

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const response = await axios.get(`http://localhost:5000/api/reviews/product/${id}`);
      if (response.data.success) {
        setReviews(response.data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const checkReviewEligibility = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/reviews/can-review/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setCanReview(response.data.canReview);
        setHasPurchased(response.data.hasPurchased);
        setHasOrdered(response.data.hasOrdered || false);
        setHasReviewed(response.data.hasReviewed);
      }
    } catch (error) {
      console.error('Error checking review eligibility:', error);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      if (isAuthenticated()) {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/orders/my-orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success && response.data.orders.length > 0) {
          // Get all purchased product IDs
          const purchasedProductIds = new Set();
          response.data.orders.forEach(order => {
            order.items.forEach(item => {
              purchasedProductIds.add(item.product);
            });
          });

          // Find related products based on category and purchased history
          const related = products.filter(p =>
            p.id !== parseInt(id) &&
            (p.category === product.category || purchasedProductIds.has(p.id.toString()))
          ).slice(0, 4);

          setRelatedProducts(related);
        } else {
          // Default: show products from same category
          const related = products.filter(p =>
            p.id !== parseInt(id) && p.category === product.category
          ).slice(0, 4);
          setRelatedProducts(related);
        }
      } else {
        // Default: show products from same category
        const related = products.filter(p =>
          p.id !== parseInt(id) && p.category === product.category
        ).slice(0, 4);
        setRelatedProducts(related);
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
      // Fallback to category-based related products
      const related = products.filter(p =>
        p.id !== parseInt(id) && p.category === product.category
      ).slice(0, 4);
      setRelatedProducts(related);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      toast.error('Please login to submit a review');
      setShowAuthModal(true);
      return;
    }

    if (!canReview) {
      if (!hasPurchased) {
        toast.error('You can only review products you have purchased and received');
      } else if (hasReviewed) {
        toast.error('You have already reviewed this product');
      }
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/reviews', {
        product: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        toast.success('Review submitted successfully!');
        setReviewForm({ rating: 5, comment: '' });
        setShowReviewForm(false);
        fetchReviews();
        checkReviewEligibility();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

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
                    <span className="text-brand-text/60 text-sm">({reviews.length} reviews)</span>
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

          {/* Reviews Section */}
          <div id="reviews-section" className="mt-12 bg-white/50 backdrop-blur-sm rounded-3xl p-6 md:p-12 shadow-xl border border-white/40">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading text-3xl font-bold text-brand-primary flex items-center gap-3">
                <MessageCircle size={32} />
                Customer Reviews
              </h2>
              {isAuthenticated() && canReview && !showReviewForm && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="bg-brand-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-text transition-colors flex items-center gap-2"
                >
                  <Star size={18} />
                  Write a Review
                </button>
              )}
            </div>

            {/* Purchase requirement notice */}
            {isAuthenticated() && !hasOrdered && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-yellow-800 text-sm flex items-center gap-2">
                  <MessageCircle size={16} />
                  You must purchase and receive this product before you can review it
                </p>
                <p className="text-yellow-700 text-xs mt-2">
                  💡 Tip: Order status must be "Delivered" to write a review
                </p>
              </div>
            )}

            {isAuthenticated() && hasOrdered && !hasPurchased && !hasReviewed && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-blue-800 text-sm flex items-center gap-2">
                  <Clock size={16} />
                  You have ordered this product! You can review it once your order is delivered.
                </p>
                <p className="text-blue-700 text-xs mt-2">
                  📦 Check <Link to="/my-orders" className="underline font-semibold">My Orders</Link> for delivery status
                </p>
              </div>
            )}

            {isAuthenticated() && hasReviewed && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-green-800 text-sm flex items-center gap-2">
                  <CheckCircle size={16} />
                  Thank you! You have already reviewed this product
                </p>
              </div>
            )}

            {/* Review Form */}
            {showReviewForm && isAuthenticated() && canReview && (
              <motion.form
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmitReview}
                className="mb-8 p-6 bg-brand-light/30 rounded-xl border border-brand-secondary/30"
              >
                <h3 className="font-bold text-lg text-brand-text mb-4">Write Your Review</h3>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-brand-text mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="focus:outline-none"
                      >
                        <Star
                          size={32}
                          className={star <= reviewForm.rating ? "text-yellow-400" : "text-gray-300"}
                          fill={star <= reviewForm.rating ? "currentColor" : "none"}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-brand-text mb-2">Your Review</label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    className="w-full px-4 py-3 border border-brand-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    rows="4"
                    placeholder="Share your experience with this product..."
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-brand-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-text transition-colors"
                  >
                    Submit Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.form>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
              {loadingReviews ? (
                <p className="text-center text-brand-text/60">Loading reviews...</p>
              ) : reviews.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle size={48} className="mx-auto text-brand-primary/30 mb-4" />
                  <p className="text-brand-text/60">No reviews yet. Be the first to review this product!</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review._id} className="p-6 bg-white rounded-xl border border-brand-secondary/20">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold">
                          {review.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-semibold text-brand-text">{review.userName}</h4>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                                  fill={i < review.rating ? "currentColor" : "none"}
                                />
                              ))}
                            </div>
                            {review.isVerifiedPurchase && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                                <CheckCircle size={12} /> Verified Purchase
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-brand-text/50">
                        {new Date(review.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <p className="text-brand-text/80 leading-relaxed">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="font-heading text-3xl font-bold text-brand-primary mb-6">
                {isAuthenticated() ? 'You May Also Like' : 'Related Products'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    to={`/product/${relatedProduct.id}`}
                    className="bg-white/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/40 hover:shadow-2xl transition-all group"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-brand-text mb-1 group-hover:text-brand-primary transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-brand-primary font-bold">Rs. {relatedProduct.price}</span>
                        <div className="flex items-center text-yellow-400">
                          <Star size={14} fill="currentColor" />
                          <span className="text-xs text-brand-text/60 ml-1">{relatedProduct.rating}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
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
