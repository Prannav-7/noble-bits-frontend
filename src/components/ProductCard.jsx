import React from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product.id}`}
      className="bg-brand-card rounded-xl p-4 flex flex-col items-center text-center shadow-lg transform transition-transform hover:scale-105 duration-300 relative group overflow-hidden h-full cursor-pointer"
    >
      {/* Circle Image Container */}
      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 mb-3 shadow-md bg-white shrink-0">
        <img
          src={product.image || "https://img-wrapper.vercel.app/image?url=https://placehold.co/200x200"}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="text-white font-heading text-xl font-bold mb-1 line-clamp-1">{product.name}</h3>
      <p className="text-white/90 text-sm mb-3">Rs.{product.price}</p>

      {/* Star Rating */}
      <div className="flex items-center justify-center gap-1 text-yellow-400 mt-auto">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} fill={i < product.rating ? "currentColor" : "none"} className={i < product.rating ? "text-yellow-400" : "text-white/30"} />
        ))}
      </div>
    </Link>
  );
};

export default ProductCard;
