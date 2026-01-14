# Backend Quick Start for Noble Bits

## Installation

Create a backend folder at the same level as frontend:

\`\`\`bash
# From the project root (sample1/)
mkdir backend
cd backend
npm init -y
\`\`\`

Install dependencies:
\`\`\`bash
npm install express mongoose cors dotenv bcryptjs jsonwebtoken
npm install --save-dev nodemon
\`\`\`

## Project Structure

\`\`\`
backend/
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   ├── Review.js
│   └── Wishlist.js
├── routes/
│   ├── auth.js
│   ├── products.js
│   ├── orders.js
│   ├── reviews.js
│   └── wishlist.js
├── middleware/
│   └── auth.js
├── .env
├── server.js
└── package.json
\`\`\`

## Environment Setup

Create `.env` file:
\`\`\`env
MONGODB_URI=mongodb+srv://prannavp803_db_user:mtVnZZ9smGHAB7HS@cluster0.gprfdbn.mongodb.net/noblebits?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=noblebits_secret_key_2025
\`\`\`

## package.json Scripts

Add to your package.json:
\`\`\`json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
\`\`\`

## Running the Backend

\`\`\`bash
npm run dev
\`\`\`

## Database Collections

Your MongoDB will have these collections:
- **users** - User accounts
- **products** - Product catalog
- **orders** - Customer orders
- **reviews** - Product reviews
- **wishlists** - User wishlists

## API Endpoints Overview

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/user/:userId` - Get user's orders
- `GET /api/orders/:id` - Get single order details

### Reviews
- `POST /api/reviews` - Add review
- `GET /api/reviews/product/:productId` - Get product reviews

### Wishlist
- `GET /api/wishlist/:userId` - Get user wishlist
- `POST /api/wishlist` - Add item to wishlist
- `DELETE /api/wishlist/:userId/:productId` - Remove from wishlist

## Connecting Frontend

Update `src/contexts/AuthContext.jsx`:

Replace `YOUR_BACKEND_URL` with:
\`\`\`javascript
const API_URL = 'http://localhost:5000';
\`\`\`

## Testing the Connection

1. Start backend: `npm run dev`
2. Start frontend: `npm run dev` (in frontend directory)
3. Try to register a new user
4. Check MongoDB Atlas to see the new user in the database

## Security Notes

⚠️ **Important:**
- Never commit `.env` file to git
- Change JWT_SECRET in production
- Use HTTPS in production
- Implement rate limiting for API calls
- Validate all user inputs
- Sanitize data before storing in database

## MongoDB Atlas Dashboard

Access your database at:
https://cloud.mongodb.com/

Use this to:
- View collections and documents
- Monitor database performance
- Set up backups
- Manage users and access

## Troubleshooting

### Cannot connect to MongoDB:
1. Check your IP is whitelisted in MongoDB Atlas
2. Verify connection string is correct
3. Ensure network allows outbound connections

### CORS errors:
Make sure backend has CORS enabled for your frontend URL

### Authentication errors:
Check that JWT_SECRET matches in all parts of your app

## Next Steps

1. Copy the model files from SETUP_GUIDE.md
2. Create the route files with proper endpoints
3. Set up middleware for authentication
4. Seed initial product data to MongoDB
5. Test all endpoints with Postman or Thunder Client
6. Connect frontend to backend APIs

## Production Deployment

For production:
1. Deploy backend to services like:
   - Render
   - Railway
   - Heroku
   - AWS/Azure/Google Cloud

2. Update frontend API URL to production backend URL
3. Use environment variables for all sensitive data
4. Enable MongoDB backup and monitoring
