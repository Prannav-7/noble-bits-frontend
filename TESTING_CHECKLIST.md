# Testing Checklist for Noble Bits

## ✅ Testing the Application

### Prerequisites
- Development server running (`npm run dev`)
- Browser open at `http://localhost:5173`
- Browser DevTools open (F12) to check for errors

---

## 1️⃣ Initial Load & Homepage

- [ ] Homepage loads without errors
- [ ] Hero section displays correctly
- [ ] Featured products show (4 products)
- [ ] Images load properly
- [ ] Navbar shows "Login" button (not logged in)
- [ ] Cart icon shows no badge
- [ ] Wishlist icon shows no badge

---

## 2️⃣ Navigation

- [ ] Click "Menu" - navigates to `/menu`
- [ ] All 10 products display in grid
- [ ] Products show images, names, prices, ratings
- [ ] Click "Home" - returns to homepage
- [ ] Click "About" - scrolls to about section
- [ ] Click "Contact" - shows contact section

---

## 3️⃣ Product Details (Without Login)

- [ ] Click "View Details" on any product
- [ ] Product details page loads
- [ ] Product image, name, price display correctly
- [ ] Ingredients and shelf life show
- [ ] Quantity selector works (+ and -)
- [ ] Total price updates with quantity
- [ ] Click **"Add to Cart"** → ⚠️ Login modal appears
- [ ] Toast message: "Please login to continue"
- [ ] Click **heart icon** (wishlist) → ⚠️ Login modal appears

---

## 4️⃣ User Registration

### Open Login Modal:
- [ ] Click "Login" button in navbar (or triggered from cart)
- [ ] Modal appears with login form

### Switch to Register:
- [ ] Click "Don't have an account? Register"
- [ ] Form changes to show Name input

### Fill Registration Form:
```
Name: Test User
Email: test@example.com
Password: test123
```

- [ ] Click "Register" button
- [ ] Toast message: "Registered successfully!"
- [ ] Modalcloses automatically
- [ ] Navbar updates to show "Hi, Test User"
- [ ] Logout icon appears in navbar

---

## 5️⃣ Product Actions (After Login)

### Return to Product Details Page:
- [ ] Click "Add to Cart" button
- [ ] ✅ Toast: "Added to cart!"
- [ ] ✅ Cart badge appears in navbar showing "1"
- [ ] Click "Add to Cart" again
- [ ] ✅ Toast: "Cart updated!"
- [ ] ✅ Cart badge updates to "2"

### Test Wishlist:
- [ ] Click heart icon (wishlist)
- [ ] ✅ Heart turns red (filled)
- [ ] ✅ Toast: "Added to wishlist!"
- [ ] ✅ Wishlist badge appears showing "1"
- [ ] Click heart again
- [ ] ✅ Heart becomes outline (removed)
- [ ] ✅ Toast: "Removed from wishlist"
- [ ] ✅ Wishlist badge disappears

---

## 6️⃣ Shopping Cart Page

### Navigate to Cart:
- [ ] Click cart icon in navbar
- [ ] Cart page loads at `/cart`
- [ ] Shows all cart items
- [ ] Each item displays:
  - [ ] Product image
  - [ ] Product name
  - [ ] Price per item
  - [ ] Quantity selector
  - [ ] Total for that item
  - [ ] Remove button

### Test Cart Functions:
- [ ] Increase quantity using "+" button
- [ ] ✅ Total updates
- [ ] Decrease quantity using "-" button
- [ ] ✅ Total updates
- [ ] Click remove (trash icon)
- [ ] ✅ Toast: "Removed from cart"
- [ ] ✅ Item disappears
- [ ] ✅ Cart badge updates

### Cart Summary:
- [ ] Subtotal shows correct calculation
- [ ] Delivery fee displays
- [ ] Total amount is correct
- [ ] "Proceed to Checkout" button visible

---

## 7️⃣ Wishlist Page

### Navigate to Wishlist:
- [ ] Click heart icon in navbar (or `/wishlist` URL)
- [ ] Wishlist page loads
- [ ] Shows "My Wishlist" heading
- [ ] Item count displays (e.g., "2 items saved")

### If Wishlist is Empty:
- [ ] Shows empty state message
- [ ] "Browse Menu" button appears
- [ ] Clicking it goes to `/menu`

### If Wishlist Has Items:
- [ ] Products display in grid
- [ ] Each shows:
  - [ ] Product image
  - [ ] Name, category, price
  - [ ] "Add to Cart" button
  - [ ] Remove (trash) icon

### Test Wishlist Functions:
- [ ] Click "Add to Cart" on wishlist item
- [ ] ✅ Toast: "Added to cart!"
- [ ] ✅ Cart badge updates
- [ ] Click trash icon
- [ ] ✅ Toast: "Removed from wishlist"
- [ ] ✅ Item disappears
- [ ] ✅ Wishlist badge updates

---

## 8️⃣ Buy Now Flow

### From Product Details:
- [ ] Set quantity (e.g., 3)
- [ ] Click "Buy Now" button
- [ ] ✅ Product added to cart
- [ ] ✅ Redirects to `/cart` page
- [ ] ✅ Item appears in cart with correct quantity

---

## 9️⃣ User Authentication Persistence

### Test Session Persistence:
- [ ] Refresh the page (F5)
- [ ] ✅ Still logged in ("Hi, Test User" shows)
- [ ] ✅ Cart items still present
- [ ] ✅ Wishlist items still present
- [ ] ✅ Badge counts accurate

### Test Logout:
- [ ] Click logout icon in navbar
- [ ] ✅ User name disappears
- [ ] ✅ "Login" button reappears
- [ ] ⚠️ Try clicking "Add to Cart" → Login modal appears again

### Test Login:
- [ ] Click "Login" button
- [ ] Use same credentials:
  ```
  Email: test@example.com
  Password: test123
  ```
- [ ] Click "Login"
- [ ] ✅ Toast: "Logged in successfully!"
- [ ] ✅ Navbar updates
- [ ] ✅ Cart badge may show "0" (localStorage cleared on logout)

---

## 🔟 Mobile Responsiveness

### Test Mobile View:
- [ ] Open DevTools (F12)
- [ ] Toggle device toolbar (Ctrl+Shift+M)
- [ ] Select mobile device (e.g., iPhone 12)

### Check Mobile Navigation:
- [ ] Hamburger menu appears
- [ ] Click hamburger → menu opens
- [ ] All links work
- [ ] Cart/wishlist badges visible
- [ ] Login/logout functions work
- [ ] Modal fits screen properly

### Check Product Grid:
- [ ] Products stack vertically
- [ ] Images responsive
- [ ] Buttons accessible
- [ ] Touch targets adequate

---

## 1️⃣1️⃣ Error Handling

### Test Invalid Login:
- [ ] Try login with wrong password
- [ ] ⚠️ Should show error message
- [ ] Try login with non-existent email
- [ ] ⚠️ Should show error message

### Test Empty Forms:
- [ ] Try submitting empty login form
- [ ] ✅ Toast: "Please fill in all fields"
- [ ] Try submitting registration without name
- [ ] ✅ Toast: "Please enter your name"

---

## 1️⃣2️⃣ Browser Console

### Check for Errors:
- [ ] Open Console tab in DevTools
- [ ] No red errors should appear
- [ ] ✅ All API calls log (if backend connected)
- [ ] ✅ No 404s for images
- [ ] ✅ No warning messages

---

## 1️⃣3️⃣ LocalStorage Verification

### Check Data Persistence:
- [ ] Open Application tab in DevTools
- [ ] Expand "Local Storage" → `http://localhost:5173`
- [ ] Verify these keys exist:
  - [ ] `user` - contains user data
  - [ ] `cart` - contains cart items array
  - [ ] `wishlist` - contains wishlist items array

### Verify Data Format:
```javascript
// Example user data
{
  "name": "Test User",
  "email": "test@example.com"
}

// Example cart data
[
  {
    "id": 1,
    "name": "Murukku",
    "price": 50,
    "quantity": 2,
    ...
  }
]
```

---

## 🎯 Expected Results Summary

### When NOT Logged In:
- ✅ Can browse products
- ✅ Can view product details
- ❌ Cannot add to cart (modal blocks)
- ❌ Cannot add to wishlist (modal blocks)
- ❌ Cannot checkout

### When Logged In:
- ✅ Can add to cart
- ✅ Can add to wishlist
- ✅ Can modify quantities
- ✅ Can remove items
- ✅ Can proceed to checkout
- ✅ All actions show toast notifications
- ✅ Badge counts update in real-time

---

## 🐛 Common Issues & Fixes

### Issue: "Module not found" errors
**Fix:** Run `npm install` again

### Issue: Port 5173 already in use
**Fix:** 
```bash
# Kill the process using port 5173
# Then run npm run dev again
```

### Issue: Cart/Wishlist not persisting
**Fix:** Check browser's localStorage is enabled

### Issue: Images not loading
**Fix:** Check internet connection (images are from Unsplash CDN)

### Issue: Login modal not closing
**Fix:** Check browser console for React errors

---

## ✅ All Tests Passed?

If all checkboxes are ticked, your application is working perfectly! 🎉

### Next Steps:
1. ✅ Review `SETUP_GUIDE.md` for MongoDB integration
2. ✅ Follow `BACKEND_QUICKSTART.md` to set up backend
3. ✅ Deploy to production when ready

---

## 📝 Notes

- All data is currently stored in **browser localStorage**
- Authentication is **simulated** (no actual server validation)
- Product data is **hardcoded** in `src/data/products.js`
- For production, you **must** implement proper backend

---

**Happy Testing! 🚀**
