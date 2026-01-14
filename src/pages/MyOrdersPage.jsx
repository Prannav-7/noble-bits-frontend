import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    Package,
    Truck,
    CheckCircle,
    Clock,
    XCircle,
    Calendar,
    MapPin,
    DollarSign,
    Star,
    ArrowLeft
} from 'lucide-react';

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [canReviewProduct, setCanReviewProduct] = useState({});
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated()) {
            toast.error('Please login to view your orders');
            navigate('/');
            return;
        }
        fetchOrders();
    }, [isAuthenticated, navigate]);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/orders/my-orders', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setOrders(response.data.orders);
                // Check which products can be reviewed
                response.data.orders.forEach(order => {
                    if (order.orderStatus === 'Delivered') {
                        order.items.forEach(item => {
                            checkCanReview(item.product);
                        });
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const checkCanReview = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/reviews/can-review/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setCanReviewProduct(prev => ({
                    ...prev,
                    [productId]: response.data.canReview
                }));
            }
        } catch (error) {
            console.error('Error checking review eligibility:', error);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending':
                return <Clock className="text-yellow-500" size={20} />;
            case 'Processing':
                return <Package className="text-blue-500" size={20} />;
            case 'Shipped':
                return <Truck className="text-purple-500" size={20} />;
            case 'Delivered':
                return <CheckCircle className="text-green-500" size={20} />;
            case 'Cancelled':
                return <XCircle className="text-red-500" size={20} />;
            default:
                return <Clock className="text-gray-500" size={20} />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Processing':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Shipped':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'Delivered':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleReviewProduct = (productId) => {
        navigate(`/product/${productId}?review=true`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
                    <p className="mt-4 text-brand-text">Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-bg py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-brand-text hover:text-brand-primary mb-4 transition-colors">
                        <ArrowLeft size={20} /> Back to Home
                    </Link>
                    <h1 className="font-heading text-4xl font-bold text-brand-primary mb-2">My Orders</h1>
                    <p className="text-brand-text/70">Track and manage your orders</p>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-12 text-center shadow-xl border border-white/40">
                        <Package size={64} className="mx-auto text-brand-primary/30 mb-4" />
                        <h2 className="text-2xl font-bold text-brand-text mb-2">No Orders Yet</h2>
                        <p className="text-brand-text/60 mb-6">You haven't placed any orders yet</p>
                        <Link
                            to="/menu"
                            className="inline-block bg-brand-primary text-white font-bold py-3 px-8 rounded-xl hover:bg-brand-text transition-colors"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-xl border border-white/40 overflow-hidden hover:shadow-2xl transition-shadow"
                            >
                                {/* Order Header */}
                                <div className="bg-brand-primary/10 border-b border-brand-primary/20 p-6">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(order.orderStatus)}`}>
                                                {getStatusIcon(order.orderStatus)}
                                                <span className="font-semibold text-sm">{order.orderStatus}</span>
                                            </div>
                                            <div className="text-sm text-brand-text/70">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} />
                                                    <span>{formatDate(order.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-brand-text/70">Order ID</p>
                                            <p className="font-mono text-sm font-semibold text-brand-primary">
                                                #{order._id.slice(-8).toUpperCase()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex gap-4 items-center p-4 bg-white rounded-xl border border-brand-secondary/20">
                                                <img
                                                    src={item.image || '/placeholder.png'}
                                                    alt={item.name}
                                                    className="w-20 h-20 object-cover rounded-lg"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-brand-text">{item.name}</h3>
                                                    <p className="text-sm text-brand-text/60">Quantity: {item.quantity}</p>
                                                    <p className="text-brand-primary font-bold mt-1">Rs. {item.price}</p>
                                                </div>
                                                {order.orderStatus === 'Delivered' && canReviewProduct[item.product] && (
                                                    <button
                                                        onClick={() => handleReviewProduct(item.product)}
                                                        className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-text transition-colors"
                                                    >
                                                        <Star size={16} />
                                                        <span className="text-sm font-semibold">Review</span>
                                                    </button>
                                                )}
                                                {order.orderStatus === 'Delivered' && !canReviewProduct[item.product] && canReviewProduct[item.product] !== undefined && (
                                                    <span className="text-sm text-green-600 font-semibold">✓ Reviewed</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Summary */}
                                    <div className="mt-6 pt-6 border-t border-brand-secondary/20">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Shipping Address */}
                                            <div>
                                                <h4 className="font-bold text-brand-text mb-3 flex items-center gap-2">
                                                    <MapPin size={18} className="text-brand-primary" />
                                                    Shipping Address
                                                </h4>
                                                <div className="bg-brand-light/30 p-4 rounded-lg text-sm text-brand-text/80">
                                                    <p className="font-semibold">{order.shippingAddress.name}</p>
                                                    <p>{order.shippingAddress.street}</p>
                                                    <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                                                    <p>{order.shippingAddress.pincode}</p>
                                                    <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
                                                </div>
                                            </div>

                                            {/* Payment & Price Details */}
                                            <div>
                                                <h4 className="font-bold text-brand-text mb-3 flex items-center gap-2">
                                                    <DollarSign size={18} className="text-brand-primary" />
                                                    Payment Details
                                                </h4>
                                                <div className="bg-brand-light/30 p-4 rounded-lg text-sm">
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between">
                                                            <span className="text-brand-text/70">Subtotal</span>
                                                            <span className="font-semibold">Rs. {order.totalAmount}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-brand-text/70">Tax</span>
                                                            <span className="font-semibold">Rs. {order.tax || 0}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-brand-text/70">Shipping</span>
                                                            <span className="font-semibold">Rs. {order.shippingCharges || 0}</span>
                                                        </div>
                                                        <div className="flex justify-between pt-2 border-t border-brand-secondary/20">
                                                            <span className="font-bold text-brand-text">Total</span>
                                                            <span className="font-bold text-brand-primary text-lg">Rs. {order.finalAmount}</span>
                                                        </div>
                                                        <div className="flex justify-between pt-2">
                                                            <span className="text-brand-text/70">Payment Method</span>
                                                            <span className="font-semibold">{order.paymentMethod}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-brand-text/70">Payment Status</span>
                                                            <span className={`font-semibold ${order.paymentStatus === 'Completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                                {order.paymentStatus}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tracking Info */}
                                        {order.trackingNumber && (
                                            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                                <p className="text-sm text-blue-800">
                                                    <span className="font-semibold">Tracking Number:</span> {order.trackingNumber}
                                                </p>
                                            </div>
                                        )}

                                        {order.deliveredAt && (
                                            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                                                <p className="text-sm text-green-800">
                                                    <span className="font-semibold">Delivered on:</span> {formatDate(order.deliveredAt)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrdersPage;
