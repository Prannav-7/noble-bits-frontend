import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    BarChart3,
    Package,
    ShoppingCart,
    Users,
    DollarSign,
    TrendingUp,
    AlertCircle,
    Plus,
    Edit,
    Trash2,
    Search,
    Eye
} from 'lucide-react';
import {
    PieChart,
    Pie,
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
const ADMIN_EMAILS = ['prannavp803@gmail.com', 'ran17062005@gmail.com'];

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [monthlySales, setMonthlySales] = useState([]);
    const [weeklySales, setWeeklySales] = useState([]);
    const [salesByCategory, setSalesByCategory] = useState([]);
    const [salesByPayment, setSalesByPayment] = useState([]);
    const [orderStatus, setOrderStatus] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [userOrders, setUserOrders] = useState([]);

    // Check admin access
    useEffect(() => {
        if (!user || !ADMIN_EMAILS.includes(user.email)) {
            toast.error('Access denied. Admin privileges required.');
            navigate('/');
            return;
        }
        fetchDashboardData();
    }, [user, navigate]);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    };

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [
                statsRes,
                productsRes,
                ordersRes,
                monthlyRes,
                weeklyRes,
                categoryRes,
                paymentRes,
                statusRes,
                topRes
            ] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/dashboard/stats', getAuthHeaders()),
                axios.get('http://localhost:5000/api/admin/products', getAuthHeaders()),
                axios.get('http://localhost:5000/api/admin/orders/recent?limit=20', getAuthHeaders()),
                axios.get('http://localhost:5000/api/admin/analytics/monthly-sales', getAuthHeaders()),
                axios.get('http://localhost:5000/api/admin/analytics/weekly-sales', getAuthHeaders()),
                axios.get('http://localhost:5000/api/admin/analytics/sales-by-category', getAuthHeaders()),
                axios.get('http://localhost:5000/api/admin/analytics/sales-by-payment', getAuthHeaders()),
                axios.get('http://localhost:5000/api/admin/analytics/order-status', getAuthHeaders()),
                axios.get('http://localhost:5000/api/admin/analytics/top-products?limit=10', getAuthHeaders())
            ]);

            setStats(statsRes.data.stats);
            setProducts(productsRes.data.products);
            setOrders(ordersRes.data.orders);
            setMonthlySales(monthlyRes.data.data);
            setWeeklySales(weeklyRes.data.data);
            setSalesByCategory(categoryRes.data.data.map(item => ({
                name: item._id || 'Unknown',
                value: item.totalSales
            })));
            setSalesByPayment(paymentRes.data.data.map(item => ({
                name: item._id,
                value: item.totalSales
            })));
            setOrderStatus(statusRes.data.data.map(item => ({
                name: item._id,
                value: item.count
            })));
            setTopProducts(topRes.data.data);

            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            toast.error('Failed to load dashboard data');
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            await axios.delete(`http://localhost:5000/api/admin/products/${productId}`, getAuthHeaders());
            toast.success('Product deleted successfully');
            fetchDashboardData();
        } catch (error) {
            console.error('Delete product error:', error);
            toast.error('Failed to delete product');
        }
    };

    const handleUpdateProduct = async (productData) => {
        try {
            if (selectedProduct) {
                await axios.put(
                    `http://localhost:5000/api/admin/products/${selectedProduct._id}`,
                    productData,
                    getAuthHeaders()
                );
                toast.success('Product updated successfully');
            } else {
                await axios.post(
                    'http://localhost:5000/api/admin/products',
                    productData,
                    getAuthHeaders()
                );
                toast.success('Product added successfully');
            }
            setIsEditModalOpen(false);
            setIsAddModalOpen(false);
            setSelectedProduct(null);
            fetchDashboardData();
        } catch (error) {
            console.error('Save product error:', error);
            toast.error('Failed to save product');
        }
    };

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            await axios.patch(
                `http://localhost:5000/api/admin/orders/${orderId}/status`,
                { orderStatus: newStatus },
                getAuthHeaders()
            );
            toast.success('Order status updated');
            fetchDashboardData();
        } catch (error) {
            console.error('Update order error:', error);
            toast.error('Failed to update order status');
        }
    };

    const fetchUserOrders = async (userId) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/admin/orders/user/${userId}`,
                getAuthHeaders()
            );
            setUserOrders(response.data.orders);
            setSelectedUser(userId);
        } catch (error) {
            console.error('Fetch user orders error:', error);
            toast.error('Failed to fetch user orders');
        }
    };

    const StatCard = ({ icon: Icon, title, value, color, subtitle }) => (
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm font-medium">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-2">{value}</h3>
                    {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
                </div>
                <div className={`p-3 rounded-full ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {user?.name}!</p>
                </div>

                {/* Navigation Tabs */}
                <div className="mb-6 flex flex-wrap gap-2 bg-white rounded-lg p-2 shadow-sm">
                    {['dashboard', 'products', 'orders', 'analytics'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-md font-medium transition-all ${activeTab === tab
                                    ? 'bg-amber-600 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && stats && (
                    <div className="space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <StatCard
                                icon={DollarSign}
                                title="Total Revenue"
                                value={`₹${stats.totalRevenue.toLocaleString()}`}
                                color="bg-green-500"
                            />
                            <StatCard
                                icon={ShoppingCart}
                                title="Total Orders"
                                value={stats.totalOrders}
                                color="bg-blue-500"
                                subtitle={`${stats.pendingOrders} pending`}
                            />
                            <StatCard
                                icon={Package}
                                title="Total Products"
                                value={stats.totalProducts}
                                color="bg-purple-500"
                                subtitle={`${stats.lowStockProducts} low stock`}
                            />
                            <StatCard
                                icon={Users}
                                title="Total Users"
                                value={stats.totalUsers}
                                color="bg-orange-500"
                            />
                            <StatCard
                                icon={TrendingUp}
                                title="Pending Orders"
                                value={stats.pendingOrders}
                                color="bg-yellow-500"
                            />
                            <StatCard
                                icon={AlertCircle}
                                title="Low Stock Items"
                                value={stats.lowStockProducts}
                                color="bg-red-500"
                            />
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5" />
                                Recent Orders
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {orders.slice(0, 10).map((order) => (
                                            <tr key={order._id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm font-mono">{order._id.slice(-8)}</td>
                                                <td className="px-4 py-3 text-sm">{order.user?.name || 'N/A'}</td>
                                                <td className="px-4 py-3 text-sm font-semibold">₹{order.finalAmount}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                            order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                                                order.orderStatus === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {order.orderStatus}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-500">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Products Tab */}
                {activeTab === 'products' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedProduct(null);
                                    setIsAddModalOpen(true);
                                }}
                                className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                Add Product
                            </button>
                        </div>

                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {products
                                            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                            .map((product) => (
                                                <tr key={product._id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3">
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="w-12 h-12 object-cover rounded-lg"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 font-medium">{product.name}</td>
                                                    <td className="px-4 py-3">
                                                        <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                                                            {product.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 font-semibold">₹{product.price}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 text-xs rounded-full ${product.stockQuantity < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                            }`}>
                                                            {product.stockQuantity}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">⭐ {product.rating.toFixed(1)}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedProduct(product);
                                                                    setIsEditModalOpen(true);
                                                                }}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteProduct(product._id)}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">All Orders</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {orders.map((order) => (
                                            <tr key={order._id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm font-mono">{order._id.slice(-8)}</td>
                                                <td className="px-4 py-3 text-sm">{order.user?.name || 'N/A'}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{order.user?.email || 'N/A'}</td>
                                                <td className="px-4 py-3 text-sm">{order.items.length} items</td>
                                                <td className="px-4 py-3 text-sm font-semibold">₹{order.finalAmount}</td>
                                                <td className="px-4 py-3">
                                                    <select
                                                        value={order.orderStatus}
                                                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                                        className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Processing">Processing</option>
                                                        <option value="Shipped">Shipped</option>
                                                        <option value="Delivered">Delivered</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                                <td className="px-4 py-3 text-sm">{order.paymentMethod}</td>
                                                <td className="px-4 py-3 text-sm text-gray-500">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        onClick={() => fetchUserOrders(order.user._id)}
                                                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                        title="View user's order history"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* User Order History Modal */}
                        {selectedUser && userOrders.length > 0 && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                                <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                                    <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                                        <h3 className="text-xl font-bold">User Order History</h3>
                                        <button
                                            onClick={() => {
                                                setSelectedUser(null);
                                                setUserOrders([]);
                                            }}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        {userOrders.map((order) => (
                                            <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex justify-between mb-2">
                                                    <span className="font-semibold">Order #{order._id.slice(-8)}</span>
                                                    <span className="text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <div>Status: <span className="font-medium">{order.orderStatus}</span></div>
                                                    <div>Payment: <span className="font-medium">{order.paymentMethod}</span></div>
                                                    <div>Items: <span className="font-medium">{order.items.length}</span></div>
                                                    <div>Total: <span className="font-medium">₹{order.finalAmount}</span></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <div className="space-y-6">
                        {/* Monthly Sales Chart */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Sales (2026)</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={monthlySales}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="totalSales" fill="#f59e0b" name="Sales (₹)" />
                                    <Bar dataKey="orderCount" fill="#8b5cf6" name="Orders" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Charts Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Sales by Category */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Sales by Category</h2>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={salesByCategory}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {salesByCategory.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Sales by Payment Method */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Sales by Payment Method</h2>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={salesByPayment}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {salesByPayment.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Order Status Distribution */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Order Status Distribution</h2>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={orderStatus}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {orderStatus.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Top Products */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Top Selling Products</h2>
                                <div className="space-y-3">
                                    {topProducts.map((product, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <div className="font-medium">{product._id}</div>
                                                <div className="text-sm text-gray-500">{product.totalQuantity} sold</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold text-green-600">₹{product.totalRevenue.toFixed(0)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit/Add Product Modal */}
            {(isEditModalOpen || isAddModalOpen) && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setIsAddModalOpen(false);
                        setSelectedProduct(null);
                    }}
                    onSave={handleUpdateProduct}
                />
            )}
        </div>
    );
};

// Product Modal Component
const ProductModal = ({ product, onClose, onSave }) => {
    const [formData, setFormData] = useState(
        product || {
            name: '',
            price: '',
            category: 'Savory',
            image: '',
            description: '',
            ingredients: '',
            shelfLife: '',
            weight: '',
            stockQuantity: 100,
            inStock: true,
            featured: false
        }
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                    <h3 className="text-xl font-bold">{product ? 'Edit Product' : 'Add New Product'}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                            <input
                                type="number"
                                required
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                            >
                                <option value="Savory">Savory</option>
                                <option value="Sweet">Sweet</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input
                            type="text"
                            required
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                            rows="3"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients</label>
                        <input
                            type="text"
                            required
                            value={formData.ingredients}
                            onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Shelf Life</label>
                            <input
                                type="text"
                                required
                                value={formData.shelfLife}
                                onChange={(e) => setFormData({ ...formData, shelfLife: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                            <input
                                type="text"
                                required
                                value={formData.weight}
                                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                        <input
                            type="number"
                            required
                            value={formData.stockQuantity}
                            onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.inStock}
                                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                                className="w-4 h-4 text-amber-600 focus:ring-amber-500 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">In Stock</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.featured}
                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                className="w-4 h-4 text-amber-600 focus:ring-amber-500 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">Featured</span>
                        </label>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium"
                        >
                            {product ? 'Update Product' : 'Add Product'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;
