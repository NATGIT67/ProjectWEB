# Backend - EasyRice API Server

Express.js + MySQL REST API server สำหรับแอปพลิเคชัน EasyRice e-commerce

## 📁 Folder Structure

```
backend/
├── config/
│   └── db.js              # MySQL connection pool configuration
├── middleware/
│   └── auth.js            # JWT authentication and authorization
├── routes/
│   ├── auth.js            # Authentication endpoints (register, login, me)
│   └── api.js             # Protected API endpoints for products, orders, cart, etc.
├── utils/
│   └── validators.js      # Input validation functions
├── server.js              # Express server entry point
├── setup-db.js            # Database setup and initialization script
├── database.sql           # MySQL database schema
├── test-data.sql          # Sample test data for development
├── package.json           # npm dependencies
├── .env                   # Environment variables (created from .env.example)
├── node_modules/          # Installed npm packages
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 14+
- MySQL 8.0+
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup database:**
   ```bash
   node setup-db.js
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your MySQL credentials
   ```

4. **Start server:**
   ```bash
   npm start
   ```

Server runs on: `http://localhost:5000`

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication

**Register**
```bash
POST /auth/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123",
  "full_name": "Full Name",
  "phone": "0812345678"
}
```

**Login**
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Get Current User**
```bash
GET /auth/me
Authorization: Bearer <token>
```

### Products

**Get all products** (Public)
```bash
GET /products
```

**Get product by ID** (Public)
```bash
GET /products/:id
```

**Create product** (Admin only)
```bash
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "product_name": "Product Name",
  "description": "Product description",
  "category": "Category",
  "price": 250.00,
  "stock": 100,
  "image_url": "/images/product.jpg"
}
```

**Update product** (Admin only)
```bash
PUT /products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "product_name": "Updated Name",
  "price": 300.00,
  "stock": 80
}
```

**Delete product** (Admin only)
```bash
DELETE /products/:id
Authorization: Bearer <token>
```

### Cart

**Get user's cart** (Protected)
```bash
GET /cart
Authorization: Bearer <token>
```

**Add to cart** (Protected)
```bash
POST /cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "product_id": 1,
  "quantity": 2
}
```

**Update cart item** (Protected)
```bash
PUT /cart/:cartId
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 5
}
```

**Remove from cart** (Protected)
```bash
DELETE /cart/:cartId
Authorization: Bearer <token>
```

### Orders

**Get user's orders** (Protected)
```bash
GET /orders
Authorization: Bearer <token>
```

**Get order details** (Protected)
```bash
GET /orders/:orderId
Authorization: Bearer <token>
```

**Create order** (Protected)
```bash
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "shipping_address": "123 Street, City, State"
}
```

### Reviews

**Get product reviews** (Public)
```bash
GET /reviews/product/:productId
```

**Create review** (Protected)
```bash
POST /reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "product_id": 1,
  "rating": 5,
  "comment": "Great product!"
}
```

### Admin Routes

**Get all orders** (Admin only)
```bash
GET /admin/orders
Authorization: Bearer <admin_token>
```

**Update order status** (Admin only)
```bash
PUT /admin/orders/:orderId
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "shipped"
}
```

Valid statuses: `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`

**Get all users** (Admin only)
```bash
GET /admin/users
Authorization: Bearer <admin_token>
```

## 🗄️ Database Schema

### Tables
1. **users** - User accounts and profiles
2. **products** - Product catalog
3. **orders** - Customer orders
4. **order_items** - Line items in orders
5. **cart** - Shopping cart items
6. **categories** - Product categories
7. **reviews** - Product reviews

### Create Database
```bash
node setup-db.js
```

Or manually:
```bash
mysql -u root -p < database.sql
```

### Add Sample Data
```bash
mysql -u root -p < test-data.sql
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### How it works:
1. User registers or logs in
2. Server returns a JWT token
3. Client stores token in localStorage
4. Client sends token in `Authorization` header for protected routes

### Header Format:
```
Authorization: Bearer <your_token_here>
```

### Token Expiration
- Default: 30 days
- Configure in `routes/auth.js`

## 📝 Environment Variables

`.env` file example:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=easyrice_db
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key_here
```

**Important**: Change `JWT_SECRET` in production!

## 🧪 Testing

### Using curl
```bash
# Check health
curl http://localhost:5000/health

# Get products
curl http://localhost:5000/api/products

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123","full_name":"Test User","phone":"0812345678"}'
```

### Using Postman
Import the Postman collection from [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md)

### Using browser console
```javascript
// Assuming frontend api-client is loaded
await api.getProducts()
await api.register('username', 'email@example.com', 'password123', 'Full Name', '0812345678')
```

## 🛠️ Development

### npm Scripts
```bash
npm start      # Production (node server.js)
npm run dev    # Development (nodemon server.js)
```

### Install nodemon for auto-reload
```bash
npm install --save-dev nodemon
npm run dev
```

### Debugging
Enable debug output:
```bash
DEBUG=* npm start
```

## 📋 File Descriptions

### config/db.js
- MySQL connection pool using mysql2/promise
- Provides async/await interface
- Manages connection lifecycle

### middleware/auth.js
- JWT token verification
- Admin role checking
- Error handling for auth failures

### routes/auth.js
- `/auth/register` - New user registration
- `/auth/login` - User login
- `/auth/me` - Get current user info
- Password hashing with bcryptjs
- JWT token generation

### routes/api.js
- All protected routes (require JWT token)
- Public read-only routes
- Admin-only routes
- CRUD operations for products, orders, cart, reviews

### utils/validators.js
- Email validation
- Password strength checking
- Phone number validation
- Price validation
- Rating validation (1-5)

### server.js
- Express app initialization
- Middleware setup (CORS, JSON parsing)
- Static file serving from ../frontend/app
- Route registration
- Error handling

### setup-db.js
- Automatic database creation
- Table creation with indexes
- Connection testing

## 🐛 Troubleshooting

### "Cannot find module 'express'"
```bash
npm install
```

### "Unknown database 'easyrice_db'"
```bash
node setup-db.js
```

### "Port 5000 already in use"
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F

# Or use different port
PORT=3000 npm start
```

### "JWT Error: invalid token"
- Token may have expired
- Token format incorrect
- Secret key mismatch

Solution: User should login again to get fresh token

### Database connection refused
- Ensure MySQL is running
- Check `.env` credentials
- Verify MySQL user permissions

## 📚 File References

- [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md) - Detailed API testing
- [../STRUCTURE.md](../STRUCTURE.md) - Full project structure
- [../README.md](../README.md) - Main project documentation

## 🚀 Deployment

### Database for Production
Use cloud database services:
- JawsDB (MySQL)
- AWS RDS
- Google Cloud SQL
- DigitalOcean Managed Database

## 📖 Documentation

- [api-client.js](../frontend/app/js/api-client.js) - Frontend API client
- [error handling patterns](./routes/api.js#L1-L20) - See routes/api.js for examples

## 💡 Tips

1. **Always validate input** - Use functions in `utils/validators.js`
2. **Hash passwords** - Never store plaintext passwords
3. **Use transactions** - For multi-step operations (see orders creation)
4. **Handle errors gracefully** - Return meaningful error messages
5. **Log important events** - Add console.log for debugging

## 📄 License

MIT License - Open source for learning

---

**Happy coding! If you have questions, check the main README or API_TESTING_GUIDE.md** 🚀
