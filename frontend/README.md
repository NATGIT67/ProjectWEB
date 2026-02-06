# Frontend - EasyRice E-Commerce Application

HTML5 + CSS3 + Vanilla JavaScript frontend สำหรับแอปพลิเคชัน EasyRice e-commerce

## 📁 Folder Structure

```
frontend/app/
├── index.html             # Homepage
├── pages/
│   ├── sign-up.html      # User registration
│   ├── sign-in.html      # User login
│   ├── product-list.html # Browse products
│   ├── product.html      # Product details
│   ├── checkout.html     # Shopping cart & checkout
│   ├── history.html      # Order history
│   ├── admin-panel.html  # Admin dashboard
│   ├── about.html        # About page
│   ├── contact.html      # Contact page
│   └── forgot-password.html # Password reset
├── css/
│   └── style.css         # All styling (responsive design)
├── js/
│   ├── api-client.js     # API client wrapper class
│   ├── config.js         # Frontend configuration
│   └── easyrice.js       # Main JavaScript utilities
├── images/               # Image assets
└── README.md             # This file
```

## 🎨 Design & Layout

### Responsive Design
- Mobile-first approach
- Breakpoints: 768px (tablet), 1024px (desktop)
- CSS Grid and Flexbox for layouts
- Touch-friendly buttons and inputs

### Color Scheme
```css
--primary-color: #2e7d32     /* Dark Green */
--secondary-color: #4CAF50   /* Light Green */
--accent-color: #fbc02d      /* Gold Yellow */
--dark-color: #212121        /* Dark Text */
--light-color: #F5F5F5       /* Light Background */
```

### Fonts
- Primary: Kanit (Thai font from Google Fonts)
- Icons: Font Awesome 6.4.0

## 🚀 How to Run

### 1. Backend must be running
```bash
cd backend
npm start
```

Server: `http://localhost:5000`

### 2. Frontend is automatically served
Open browser:
```
http://localhost:5000
```

or specific pages:
```
http://localhost:5000/pages/product-list.html
http://localhost:5000/pages/sign-up.html
http://localhost:5000/pages/sign-in.html
```

## 📄 Pages & Features

### Home Page (index.html)
- Hero banner
- Featured products
- Newsletter signup
- Call-to-action buttons

### Sign Up (pages/sign-up.html)
- User registration form
- Email validation
- Password strength checking
- Form validation
- API integration for registration

### Sign In (pages/sign-in.html)
- Login form
- Email/password authentication
- "Remember me" option
- Forgot password link
- API integration for login

### Product List (pages/product-list.html)
- Display all products in grid
- Search functionality
- Filter by category
- Add to cart
- View product details
- Responsive product cards

### Product Details (pages/product.html)
- Product information
- Reviews and ratings
- Add to cart with quantity
- Related products
- Customer reviews section

### Shopping Cart & Checkout (pages/checkout.html)
- View cart items
- Update quantities
- Remove items
- Apply coupon (if available)
- Shipping address form
- Checkout process
- Order confirmation

### Order History (pages/history.html)
- View all user orders
- Order status tracking
- Order details
- Cancel order option
- Reorder functionality

### Admin Panel (pages/admin-panel.html)
- Product management
  - Add product
  - Edit product
  - Delete product
- Order management
  - View all orders
  - Update order status
  - Customer information
- User management
  - View all users
  - User registration date
  - User contact info
- Dashboard stats
  - Total users
  - Total products
  - Total orders
  - Revenue

### About Page (pages/about.html)
- Company information
- Mission statement
- History
- Team

### Contact Page (pages/contact.html)
- Contact form
- Contact information
- Map/location
- Customer service info

## 🔐 Authentication

### Login/Register Flow
1. User registers or logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. Token sent in API requests
5. User redirected to home page

### Token Management
```javascript
// Check if logged in
const token = localStorage.getItem('token');
if (!token) {
  // Redirect to login
  window.location.href = '/pages/sign-in.html';
}

// Logout
localStorage.removeItem('token');
api.clearToken();
```

### Protected Pages
- Shopping cart & checkout (requires login)
- Order history (requires login)
- Admin panel (requires admin role)

## 📡 API Integration

### API Client Usage

**In HTML head:**
```html
<script src="../js/api-client.js"></script>
```

**In JavaScript:**
```javascript
// Get all products
const products = await api.getProducts();

// Register user
await api.register('username', 'email@example.com', 'password', 'Full Name', '0812345678');

// Login
const result = await api.login('email@example.com', 'password');
api.setToken(result.token);

// Add to cart
await api.addToCart(productId, quantity);

// Get cart
const cart = await api.getCart();

// Create order
await api.createOrder('shipping address');

// Get orders
const orders = await api.getOrders();
```

## 🎯 User Flows

### Registration Flow
1. Click "Sign Up"
2. Fill registration form
3. Validate inputs
4. Send to `/api/auth/register`
5. Receive token
6. Auto-login and redirect to home

### Shopping Flow
1. Browse products on `/pages/product-list.html`
2. Click "Add to Cart"
3. View cart on `/pages/checkout.html`
4. Enter shipping address
5. Submit order
6. View order confirmation
7. Track order on `/pages/history.html`

### Admin Flow
1. Login as admin
2. Go to `/pages/admin-panel.html`
3. Manage products/orders/users
4. Update order statuses
5. Add new products

## 💾 Local Storage

Data stored in browser:
```javascript
// Authentication
localStorage.setItem('token', jwt_token);
localStorage.getItem('token');

// User data
localStorage.setItem('easyrice_user', JSON.stringify(user));
localStorage.getItem('easyrice_user');
```

## 🛠️ Key Components

### api-client.js
Wrapper class for backend API
- Authentication methods
- Product operations
- Cart management
- Order handling
- User profile
- Admin operations

### config.js
Frontend configuration
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
const APP_NAME = 'EasyRice';
```

### easyrice.js
Utility functions
- DOM manipulation
- Formatting (numbers, dates)
- Validation helpers
- UI interactions

### style.css
Complete styling for:
- Navigation bar
- Forms
- Buttons
- Cards
- Responsive layouts
- Mobile menu
- Dark/light modes (if applicable)

## 📱 Responsive Breakpoints

```css
/* Mobile First */
/* Default: 320px - 767px */

/* Tablet */
@media (min-width: 768px) {
  /* 768px - 1023px */
}

/* Desktop */
@media (min-width: 1024px) {
  /* 1024px and above */
}
```

## 🎨 Form Styling

All forms follow same pattern:
- Consistent field spacing
- Clear labels
- Error messages in red
- Success messages in green
- Submit button styling

### Form Validation
```javascript
// Email validation
validateEmail(email)

// Password strength
validatePassword(password)

// Phone validation
validatePhone(phone)
```

## 🔄 State Management

Simple state management using:
- localStorage for persistence
- JavaScript classes for organization
- Event listeners for reactivity

**Example:**
```javascript
class ShoppingCart {
  constructor() {
    this.items = this.loadFromStorage();
  }
  
  addItem(product, quantity) {
    // Add item logic
    this.saveToStorage();
  }
  
  saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }
  
  loadFromStorage() {
    return JSON.parse(localStorage.getItem('cart')) || [];
  }
}
```

## 🧪 Testing

### Manual Testing
1. Open DevTools (F12)
2. Go to Console tab
3. Test API calls:
   ```javascript
   await api.getProducts()
   await api.login('email@example.com', 'password123')
   ```

### Visual Testing
1. Test all pages in different browsers
2. Check responsive design:
   - Ctrl+Shift+M (toggle device toolbar)
   - Test on phone/tablet sizes
3. Check form validation
4. Check error messages

## 🐛 Common Issues

### "API endpoint not found"
- Ensure backend is running
- Check API_BASE_URL in config.js
- Verify backend routes exist

### "Token is missing/invalid"
- Check localStorage for token
- Try logging in again
- Check token expiration

### CSS not loading
- Verify relative path: `../css/style.css`
- Check file exists in correct folder
- Clear browser cache

### JavaScript errors
- Open DevTools Console (F12)
- Check error messages
- Verify script tags are in correct order

## 📚 Best Practices

### Code Organization
- Keep functions small and focused
- Use descriptive variable names
- Add comments for complex logic
- Follow DRY principle (Don't Repeat Yourself)

### Performance
- Minimize API calls
- Cache data when possible
- Use async/await properly
- Load images efficiently

### Security
- Never expose tokens in code
- Validate input on frontend (and backend)
- Use HTTPS in production
- Handle errors securely

### Accessibility
- Use semantic HTML
- Add alt text to images
- Ensure keyboard navigation
- Use proper color contrast

## 📖 Documentation

- [../Backend/README.md](../backend/README.md) - Backend documentation
- [../STRUCTURE.md](../STRUCTURE.md) - Full project structure
- [../README.md](../README.md) - Main documentation

## 🚀 Deployment

### Deploy to Vercel

1. **Create vercel.json in root:**
   ```json
   {
     "version": 2,
     "public": true,
     "builds": [{ "src": "backend/server.js", "use": "@vercel/node" }],
     "routes": [{ "src": "/(.*)", "dest": "backend/server.js" }]
   }
   ```

2. Push to GitHub

3. Connect to Vercel and deploy

4. Update API_BASE_URL to:
   ```javascript
   const API_BASE_URL = 'https://your-domain.vercel.app/api';
   ```

## 💡 Tips

1. **Test on real device** - Use ngrok to test on phone
2. **Use browser DevTools** - Network tab shows API calls
3. **Check console** - Console tab shows JavaScript errors
4. **Responsive design** - Always test on different screen sizes
5. **Cache busting** - Add timestamp to CSS/JS for fresh load

## 📝 License

MIT License - Open source for learning

---

**Happy building! For more info, check the main README or contact support.** 🚀
