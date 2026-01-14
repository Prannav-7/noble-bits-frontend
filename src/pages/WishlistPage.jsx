import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const WishlistPage = () => {
    const { wishlist, removeFromWishlist, addToCart } = useCart();
    const { isAuthenticated } = useAuth();

    const handleAddToCart = (product) => {
        addToCart(product, 1);
    };

    if (!isAuthenticated()) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 px-4">
                <Heart className="text-gray-300 mb-4" size={64} />
                <h2 className="text-2xl font-bold text-brand-primary mb-2">Please Login</h2>
                <p className="text-brand-text/70 mb-6">Login to view your wishlist</p>
            </div>
        );
    }

    if (wishlist.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 px-4">
                <Heart className="text-gray-300 mb-4" size={64} />
                <h2 className="text-2xl font-bold text-brand-primary mb-2">Your Wishlist is Empty</h2>
                <p className="text-brand-text/70 mb-6">Add items you love to your wishlist</p>
                <Link
                    to="/menu"
                    className="bg-brand-primary text-white px-6 py-3 rounded-full font-bold hover:bg-brand-text transition-colors"
                >
                    Browse Menu
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-bg py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-heading font-bold text-brand-primary mb-2">My Wishlist</h1>
                    <p className="text-brand-text/70">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlist.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                        >
                            <Link to={`/product/${product.id}`} className="block">
                                <div className="aspect-square overflow-hidden bg-gray-100">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                            </Link>

                            <div className="p-4">
                                <Link to={`/product/${product.id}`}>
                                    <h3 className="font-heading text-lg font-bold text-brand-primary mb-1 hover:underline">
                                        {product.name}
                                    </h3>
                                </Link>
                                <p className="text-brand-text/70 text-sm mb-1">{product.category}</p>
                                <p className="text-xl font-bold text-brand-text mb-4">Rs. {product.price}</p>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="flex-1 bg-brand-primary text-white py-2 px-4 rounded-lg font-semibold hover:bg-brand-text transition-colors flex items-center justify-center gap-2 text-sm"
                                    >
                                        <ShoppingCart size={16} />
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={() => removeFromWishlist(product.id)}
                                        className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                                        title="Remove from wishlist"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WishlistPage;
