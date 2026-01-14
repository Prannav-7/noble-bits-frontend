# Noble Bits E-Commerce - Setup Documentation

## Features Implemented

### Frontend Features:
- ✅ **Shopping Cart** - Add products, update quantities, remove items
- ✅ **Wishlist** - Save favorite products
- ✅ **User Authentication** - Login/Register with modal
- ✅ **Protected Actions** - Login required for cart and wishlist operations
- ✅ **Responsive Design** - Mobile-friendly UI
- ✅ **Real-time Notifications** - Toast notifications for user actions
- ✅ **Persistent Storage** - Cart and wishlist saved to localStorage

### Components Created:
1. **AuthContext** - Manages user authentication state
2. **CartContext** - Manages cart and wishlist state
3. **AuthModal** - Login/Register modal component
4. **Navbar** - Updated with cart count, wishlist count, and auth buttons
5. **ProductDetailsPage** - Working Add to Cart, Buy Now, and Wishlist buttons
6. **WishlistPage** - View and manage wishlist items

## Current Setup

The application is currently using **local storage** for data persistence. To integrate with MongoDB, you'll need to set up a backend server.

## MongoDB Integration (Next Steps)

### Your MongoDB Connection String:
\`\`\`
mongodb+srv://prannavp803_db_user:mtVnZZ9smGHAB7HS@cluster0.gprfdbn.mongodb.net/?appName=Cluster0
\`\`\`

### Required Backend Setup:

#### 1. Create a Backend Server
Create a new directory for your backend:
\`\`\`bash
mkdir backend
cd backend
npm init -y
npm install express mongoose cors dotenv bcryptjs jsonwebtoken
\`\`\`

#### 2. Environment Variables (.env)
\`\`\`env
MONGODB_URI=mongodb+srv://prannavp803_db_user:mtVnZZ9smGHAB7HS@cluster0.gprfdbn.mongodb.net/noblebits?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
\`\`\`

#### 3. MongoDB Schema Models

**User Model (models/User.js):**
\`\`\`javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
\`\`\`

**Product Model (models/Product.js):**
\`\`\`javascript
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: { type: String },
  shelfLife: { type: String },
  weight: { type: String },
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
\`\`\`

**Order Model (models/Order.js):**
\`\`\`javascript
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    name: String,
    phone: String,
    address: String,
    city: String,
    pincode: String
  },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
\`\`\`

**Review Model (models/Review.js):**
\`\`\`javascript
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
\`\`\`

**Wishlist Model (models/Wishlist.js):**
\`\`\`javascript
const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
\`\`\`

#### 4. API Routes Structure

**Auth Routes (routes/auth.js):**
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

**Product Routes (routes/products.js):**
- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get single product
- POST `/api/products` - Create product (admin)
- PUT `/api/products/:id` - Update product (admin)
- DELETE `/api/products/:id` - Delete product (admin)

**Order Routes (routes/orders.js):**
- POST `/api/orders` - Create order
- GET `/api/orders/user/:userId` - Get user orders
- GET `/api/orders/:id` - Get single order
- PUT `/api/orders/:id/status` - Update order status

**Review Routes (routes/reviews.js):**
- POST `/api/reviews` - Create review
- GET `/api/reviews/product/:productId` - Get product reviews
- DELETE `/api/reviews/:id` - Delete review

**Wishlist Routes (routes/wishlist.js):**
- GET `/api/wishlist/user/:userId` - Get user wishlist
- POST `/api/wishlist` - Add to wishlist
- DELETE `/api/wishlist/:productId` - Remove from wishlist

#### 5. Basic Server Setup (server.js)

\`\`\`javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/wishlist', require('./routes/wishlist'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
\`\`\`

### Frontend Configuration

Once your backend is running, update the AuthContext.jsx:

Replace `YOUR_BACKEND_URL` with your actual backend URL (e.g., `http://localhost:5000`)

## How to Use

### Running the Application:

1. **Start Development Server:**
   \`\`\`bash
   npm run dev
   \`\`\`
   
2. **Access the Application:**
   Open browser to `http://localhost:5173`

### User Flow:

1. Browse products on the Home or Menu page
2. Click on a product to view details
3. When clicking "Add to Cart" or "Buy Now", if not logged in, a login modal appears
4. After logging in, the action completes automatically
5. Cart and wishlist are saved to localStorage
6. Cart count and wishlist count appear in the navbar

## Key Features:

### Authentication Flow:
- Login/Register modal appears when user tries to add to cart or wishlist
- After successful login, the pending action executes automatically
- User state persists across page refreshes

### Cart Management:
- Add products with quantity
- Update quantities
- Remove items
- View total price
- Persistent storage

### Wishlist:
- Add/remove products
- View all wishlist items
- Quick add to cart from wishlist
- Badge count in navbar

## Technologies Used:

- **React** - UI Library
- **React Router** - Navigation
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **React Hot Toast** - Notifications
- **Axios** - HTTP Client (ready for backend integration)
- **LocalStorage** - Current data persistence

## Next Steps for Full Backend Integration:

1. Set up the Node.js/Express backend server
2. Create all the required API routes
3. Update the AuthContext to call actual backend APIs
4. Migrate product data to MongoDB
5. Implement cart and wishlist sync with database
6. Add order placement functionality
7. Implement review system
8. Add admin panel for product management

## Notes:

- Currently, authentication is simulated locally
- Cart and wishlist data is stored in browser localStorage
- For production, you'll need to implement actual backend authentication
- Product data is currently hardcoded in `src/data/products.js`
- Once backend is ready, this data should come from MongoDB

## Support:

For questions or issues, please check:
- React Router docs: https://reactrouter.com/
- TailwindCSS docs: https://tailwindcss.com/
- MongoDB docs: https://docs.mongodb.com/
- Express docs: https://expressjs.com/
