import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, MapPin, ShieldCheck } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 40 : 0;
  const total = subtotal + shipping;

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    address: '', // Don't pre-fill from user.address as it might be an object
    city: '',
    state: '',
    zip: '',
    phone: user?.phone || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare order data matching backend schema
      const orderData = {
        items: cartItems.map(item => ({
          product: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          street: formData.address,
          city: formData.city,
          state: formData.state || 'Tamil Nadu', // Default state if not provided
          pincode: formData.zip,
          country: 'India'
        },
        paymentMethod: 'Cash on Delivery',
        totalAmount: subtotal,
        tax: 0,
        shippingCharges: shipping,
        finalAmount: total
      };

      console.log('=== Order Data Being Sent ===');
      console.log('Full orderData:', JSON.stringify(orderData, null, 2));
      console.log('ShippingAddress:', orderData.shippingAddress);
      console.log('Items:', orderData.items);

      // Get token from localStorage
      const token = localStorage.getItem('token');

      console.log('Token:', token ? 'Token exists' : 'NO TOKEN!');

      // Send order to backend
      const response = await axios.post('http://localhost:5000/api/orders', orderData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response received:', response.data);

      if (response.data.success) {
        toast.success('Order placed successfully!');
        clearCart();
        navigate('/');
      }
    } catch (error) {
      console.error('=== Order Placement Error ===');
      console.error('Full error:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      console.error('Error message from backend:', error.response?.data?.message);
      console.error('Detailed error:', error.response?.data?.error);

      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to place order. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bg p-4">
        <h2 className="font-heading text-3xl text-brand-primary mb-4">Your cart is empty</h2>
        <Link to="/menu" className="bg-brand-secondary text-white px-6 py-2 rounded-full hover:bg-brand-primary transition-colors">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/cart" className="p-2 hover:bg-brand-secondary/10 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-brand-text" />
          </Link>
          <h1 className="font-heading text-3xl font-bold text-brand-primary">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-secondary/20">
              <h2 className="font-heading text-xl font-bold text-brand-text mb-6 flex items-center gap-2">
                <MapPin size={20} className="text-brand-primary" /> Shipping Details
              </h2>
              <form id="checkout-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-brand-text">First Name</label>
                  <input
                    required
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    type="text"
                    className="w-full px-4 py-3 rounded-lg bg-brand-bg/50 border border-brand-secondary/20 focus:ring-2 focus:ring-brand-primary outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-brand-text">Last Name</label>
                  <input
                    required
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    type="text"
                    className="w-full px-4 py-3 rounded-lg bg-brand-bg/50 border border-brand-secondary/20 focus:ring-2 focus:ring-brand-primary outline-none"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-brand-text">Email Address</label>
                  <input
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    type="email"
                    className="w-full px-4 py-3 rounded-lg bg-brand-bg/50 border border-brand-secondary/20 focus:ring-2 focus:ring-brand-primary outline-none"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-brand-text">Street Address</label>
                  <input
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    type="text"
                    className="w-full px-4 py-3 rounded-lg bg-brand-bg/50 border border-brand-secondary/20 focus:ring-2 focus:ring-brand-primary outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-brand-text">City</label>
                  <input
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    type="text"
                    className="w-full px-4 py-3 rounded-lg bg-brand-bg/50 border border-brand-secondary/20 focus:ring-2 focus:ring-brand-primary outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-brand-text">State</label>
                  <input
                    required
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="e.g., Tamil Nadu"
                    className="w-full px-4 py-3 rounded-lg bg-brand-bg/50 border border-brand-secondary/20 focus:ring-2 focus:ring-brand-primary outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-brand-text">PIN Code</label>
                  <input
                    required
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    type="text"
                    className="w-full px-4 py-3 rounded-lg bg-brand-bg/50 border border-brand-secondary/20 focus:ring-2 focus:ring-brand-primary outline-none"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-brand-text">Phone Number</label>
                  <input
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    type="tel"
                    className="w-full px-4 py-3 rounded-lg bg-brand-bg/50 border border-brand-secondary/20 focus:ring-2 focus:ring-brand-primary outline-none"
                  />
                </div>
              </form>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-secondary/20">
              <h2 className="font-heading text-xl font-bold text-brand-text mb-6 flex items-center gap-2">
                <CreditCard size={20} className="text-brand-primary" /> Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-brand-primary/20 rounded-xl bg-brand-light/30 cursor-pointer">
                  <input type="radio" name="payment" defaultChecked className="text-brand-primary focus:ring-brand-primary" />
                  <span className="font-medium text-brand-text">Cash on Delivery</span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer opacity-60">
                  <input type="radio" name="payment" disabled className="text-brand-primary" />
                  <span className="font-medium text-brand-text">Online Payment (Coming Soon)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-brand-card text-white rounded-2xl p-6 shadow-xl sticky top-24">
              <h2 className="font-heading text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center bg-white/10 p-3 rounded-lg">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-white" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm truncate">{item.name}</h3>
                      <p className="text-xs text-white/70">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-sm">Rs.{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-white/20 pt-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-white/80">Subtotal</span>
                  <span>Rs.{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/80">Shipping</span>
                  <span>Rs.{shipping}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/20">
                  <span>Total</span>
                  <span>Rs.{total}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full bg-white text-brand-primary font-bold py-3 rounded-xl hover:bg-brand-secondary hover:text-white transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShieldCheck size={18} /> {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>

              <p className="text-xs text-center text-white/60 mt-4">
                By placing an order, you agree to our Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
