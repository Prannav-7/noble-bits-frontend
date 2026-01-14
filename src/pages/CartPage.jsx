import React from 'react';
import { ArrowLeft, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();
  const { isAuthenticated } = useAuth();

  const handleCheckout = () => {
    if (!isAuthenticated()) {
      toast.error('Please login to proceed to checkout');
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-brand-bg py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto bg-[#EBC7C7] rounded-3xl p-6 md:p-8 shadow-xl min-h-[80vh] flex flex-col items-center justify-center">
          <ShoppingCart size={80} className="text-brand-text/30 mb-4" />
          <h2 className="text-2xl font-heading font-bold text-brand-text mb-2">Your cart is empty</h2>
          <p className="text-brand-text/60 mb-6">Add some delicious items to get started!</p>
          <Link
            to="/menu"
            className="bg-brand-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-text transition-colors"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-[#EBC7C7] rounded-3xl p-6 md:p-8 shadow-xl min-h-[80vh]">

        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-brand-text/10 pb-4">
          <div className="flex items-center gap-4">
            <Link to="/menu" className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <ArrowLeft size={24} className="text-brand-text" />
            </Link>
            <h1 className="font-heading text-3xl font-bold text-brand-text">My Cart</h1>
          </div>

          <div className="text-center hidden md:block">
            <h2 className="font-heading text-2xl font-bold text-brand-primary">Noble Bits</h2>
          </div>

          <Link
            to="/orders"
            className="flex items-center gap-2 bg-brand-card text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-opacity-90 transition-colors"
          >
            <ShoppingCart size={18} /> Orders
          </Link>
        </div>

        {/* Cart Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-brand-card rounded-xl p-4 flex gap-4 shadow-lg text-white">
              {/* Image */}
              <div className="w-1/3 flex flex-col items-center justify-center">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/30 mb-2 bg-white">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-heading font-bold text-lg text-center leading-tight">{item.name}</h3>
                <div className="flex mt-1 text-yellow-400 text-xs">★★★★★</div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="mt-2 text-xs bg-white text-brand-primary px-3 py-1 rounded-full flex items-center gap-1 hover:bg-gray-100 transition-colors"
                >
                  <Trash2 size={10} /> Remove
                </button>
              </div>

              {/* Details */}
              <div className="w-2/3 flex flex-col justify-between py-2">
                <div className="flex justify-between items-start">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">Details</span>
                </div>

                <div className="space-y-1 text-xs md:text-sm opacity-90 mt-2">
                  <p className="font-semibold">Price: Rs.{item.price}</p>
                  <div className="flex items-center gap-2">
                    <span>Quantity:</span>
                    <div className="flex items-center gap-2 bg-white/20 rounded-lg px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="hover:bg-white/20 rounded px-1"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="hover:bg-white/20 rounded px-1"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <p className="font-semibold">Subtotal: Rs.{item.price * item.quantity}</p>
                  <p>Free Delivery</p>
                  <p>No Return Policy</p>
                  <p>Cash On Delivery Available</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary & Checkout */}
        <div className="bg-white/30 rounded-2xl p-6 backdrop-blur-sm border border-white/40">
          <div className="flex justify-between items-center mb-4">
            <span className="text-brand-text font-semibold">Total Items:</span>
            <span className="text-brand-text font-bold">{getCartCount()}</span>
          </div>
          <div className="flex justify-between items-center mb-6 text-xl">
            <span className="text-brand-text font-bold">Total Amount:</span>
            <span className="text-brand-primary font-bold">Rs. {getCartTotal()}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-brand-primary text-white font-bold py-3 px-6 rounded-xl text-lg hover:bg-brand-text transition-colors shadow-lg"
          >
            Proceed to Checkout
          </button>
        </div>

      </div>
    </div>
  );
};

export default CartPage;
