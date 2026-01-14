# Noble Bits E-Commerce Platform 🛒

A full-featured e-commerce application for selling authentic Tamil Nadu snacks and sweets.

## ✨ Features

### Current Implementation:
- ✅ **User Authentication** - Login & Register with modal
- ✅ **Shopping Cart** - Add/remove products, update quantities
- ✅ **Wishlist** - Save favorite items
- ✅ **Product Details** - Detailed product information
- ✅ **Authentication Guards** - Login required for cart/wishlist actions
- ✅ **Responsive Design** - Mobile-friendly UI
- ✅ **Real-time Notifications** - Toast messages for user actions
- ✅ **Persistent Storage** - Cart & wishlist saved locally

### Currently Using:
- LocalStorage for data persistence
- Simulated authentication (no real backend yet)
- Static product data

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Run development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Open browser:**
   Navigate to `http://localhost:5173`

## 🎯 How to Use

1. **Browse Products**: Visit the Menu page to see all products
2. **View Details**: Click on any product to see full details
3. **Add to Cart**: Click "Add to Cart" (login modal appears if not logged in)
4. **Manage Wishlist**: Click the heart icon to save favorites
5. **Checkout**: View cart and proceed to checkout

## 📦 Project Structure

\`\`\`
src/
├── components/
│   ├── AuthModal.jsx          # Login/Register modal
│   ├── Navbar.jsx              # Navigation with cart/wishlist badges
│   ├── ProductCard.jsx         # Product display card
│   └── ScrollToTop.jsx         # Auto-scroll utility
├── contexts/
│   ├── AuthContext.jsx         # Authentication state management
│   └── CartContext.jsx         # Cart & wishlist management
├── pages/
│   ├── Home.jsx                # Landing page
│   ├── MenuPage.jsx            # Products listing
│   ├── ProductDetailsPage.jsx  # Single product view
│   ├── CartPage.jsx            # Shopping cart
│   ├── WishlistPage.jsx        # Wishlist items
│   └── CheckoutPage.jsx        # Checkout form
├── data/
│   └── products.js             # Product data
├── App.jsx                     # Main app component
└── main.jsx                    # Entry point
\`\`\`

## 🛠 Technology Stack

- **React 19** - UI library
- **React Router DOM** - Navigation
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **Axios** - HTTP client (ready for backend)
- **Vite** - Build tool

## 🔐 Authentication Flow

1. User tries to add item to cart/wishlist
2. If not logged in → Login modal appears
3. User logs in or registers
4. Original action completes automatically
5. User state persists across sessions

## 🗄 MongoDB Integration

Your MongoDB connection string is configured for:
\`\`\`
mongodb+srv://prannavp803_db_user:mtVnZZ9smGHAB7HS@cluster0.gprfdbn.mongodb.net/
\`\`\`

### To Connect Backend:

1. See `BACKEND_QUICKSTART.md` for step-by-step backend setup
2. See `SETUP_GUIDE.md` for detailed MongoDB schema and API structure

## 📝 Configuration Files

### `SETUP_GUIDE.md`
Complete documentation including:
- All MongoDB schemas (User, Product, Order, Review, Wishlist)
- API routes structure
- Backend server setup
- Environment configuration

### `BACKEND_QUICKSTART.md`
Quick reference for:
- Backend installation steps
- Project structure
- API endpoints
- Deployment guide

## 🎨 Color Scheme

- **Primary**: `#A0522D` (Sienna Brown)
- **Secondary**: `#D2691E` (Chocolate)
- **Background**: `#FFF5EE` (Seashell)
- **Card**: `#C65D3B` (Burnt Sienna)
- **Text**: `#4A4A4A` (Dark Gray)

## 📱 Pages

1. **Home** (`/`) - Hero section, featured products, about, contact
2. **Menu** (`/menu`) - All products with filtering
3. **Product Details** (`/product/:id`) - Product information with add to cart
4. **Cart** (`/cart`) - Shopping cart management
5. **Wishlist** (`/wishlist`) - Saved items
6. **Checkout** (`/checkout`) - Order placement

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## ⚡ Key Features Detail

### Cart System
- Add multiple quantities
- Update quantities in cart
- Remove items
- Calculate total automatically
- Persist across page refreshes

### Wishlist System
- Quick add to wishlist
- Remove from wishlist
- Move items to cart
- Badge count in navbar

### Authentication
- Modal-based login/register
- Form validation
- Automatic re-authentication on refresh
- Protected routes

## 🚧 Pending Backend Integration

To make this a fully functional e-commerce platform, you need to:

1. ✅ Set up Node.js/Express backend (see BACKEND_QUICKSTART.md)
2. ✅ Connect to MongoDB Atlas
3. ✅ Implement API routes
4. ✅ Update frontend to use real APIs
5. ✅ Add payment gateway integration
6. ✅ Implement order management
7. ✅ Add admin dashboard

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is for educational and commercial use.

## 👨‍💻 Developer Notes

- Authentication is simulated (localStorage based)
- Product data is static (from `data/products.js`)
- Cart & wishlist use localStorage
- Ready for backend integration
- All components are reusable

## 🎯 Next Immediate Steps

1. Read `BACKEND_QUICKSTART.md`
2. Set up the Express backend
3. Create MongoDB collections
4. Update AuthContext API URLs
5. Test the complete flow
6. Deploy to production

## 📞 Support

For issues or questions:
- Check documentation in `SETUP_GUIDE.md`
- Review `BACKEND_QUICKSTART.md` for backend setup
- Check browser console for errors
- Verify localStorage in DevTools

---

**Made with ❤️ for Noble Bits - Authentic Tamil Nadu Snacks & Sweets**