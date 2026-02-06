# EasyRice - E-Commerce Platform
## 📁 Project Structure

```
ProjectWEB/
├── backend/                    # Backend (Node.js + Express)
│   ├── config/
│   │   └── db.js              # MySQL connection
│   ├── middleware/
│   │   └── auth.js            # JWT authentication
│   ├── routes/
│   │   ├── auth.js            # Auth endpoints
│   │   └── api.js             # API endpoints
│   ├── utils/
│   │   └── validators.js      # Input validation
│   ├── server.js              # Express server entry
│   ├── setup-db.js            # Database setup script
│   ├── database.sql           # Database schema
│   ├── test-data.sql          # Sample data
│   ├── package.json           # Dependencies
│   ├── .env                   # Environment variables
│   └── node_modules/          # Installed packages
│
├── frontend/                   # Frontend (HTML/CSS/JavaScript)
│   └── app/
│       ├── index.html         # Homepage
│       ├── pages/
│       │   ├── sign-up.html
│       │   ├── sign-in.html
│       │   ├── product-list.html
│       │   ├── checkout.html
│       │   ├── admin-panel.html
│       │   ├── product.html
│       │   ├── about.html
│       │   ├── contact.html
│       │   ├── history.html
│       │   └── forgot-password.html
│       ├── css/
│       │   └── style.css      # Main styling
│       ├── js/
│       │   ├── api-client.js  # API client
│       │   ├── config.js      # Frontend config
│       │   └── easyrice.js    # Main JavaScript
│       └── images/            # Images folder
│
├── README.md                  # Main documentation
├── .env.example              # Environment template
└── .git/                     # Git repository
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 14+
- MySQL 8.0+
- npm or yarn

### Installation

#### 1. Setup Backend
```bash
cd backend
npm install
```

#### 2. Configure Database
```bash
# Copy environment file
cp .env.example .env

# Edit .env with your MySQL credentials
# Then run:
node setup-db.js
```

#### 3. Start Backend Server
```bash
npm start
```

Server runs on: `http://localhost:5000`

#### 4. Access Frontend
- **Homepage**: http://localhost:5000
- **Products**: http://localhost:5000/pages/product-list.html
- **Sign Up**: http://localhost:5000/pages/sign-up.html
- **Login**: http://localhost:5000/pages/sign-in.html
- **Admin**: http://localhost:5000/pages/admin-panel.html

---

## 📋 Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT
- **Password**: bcryptjs

### Frontend
- **Languages**: HTML5, CSS3, JavaScript (Vanilla)
- **Fonts**: Google Fonts (Kanit)
- **Icons**: Font Awesome
- **API**: Custom REST API

---

## 🗄️ Database

### Tables (7 Total)
1. **users** - User accounts
2. **products** - Product catalog
3. **orders** - Customer orders
4. **order_items** - Line items in orders
5. **cart** - Shopping cart
6. **categories** - Product categories
7. **reviews** - Product reviews

Setup:
```bash
cd backend
node setup-db.js
```

---

## 📡 API Endpoints

Base URL: `http://localhost:5000/api`

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

### Products
- `GET /products` - List all products
- `GET /products/:id` - Get product details
- `POST /products` - Create product (Admin)
- `PUT /products/:id` - Update product (Admin)
- `DELETE /products/:id` - Delete product (Admin)

### Cart
- `GET /cart` - View cart
- `POST /cart` - Add to cart
- `PUT /cart/:cartId` - Update quantity
- `DELETE /cart/:cartId` - Remove from cart

### Orders
- `GET /orders` - User's orders
- `GET /orders/:orderId` - Order details
- `POST /orders` - Create order

### Reviews
- `GET /reviews/product/:productId` - Product reviews
- `POST /reviews` - Create review

### Admin
- `GET /admin/orders` - All orders
- `PUT /admin/orders/:orderId` - Update status
- `GET /admin/users` - All users

---

## 🔐 Authentication

Frontend sends token in header:
```
Authorization: Bearer <token>
```

Token is stored in localStorage after login/register.

---

## 📝 Environment Variables

`.env` file in backend/:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=easyrice_db
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key
```

---

## 🧪 Testing the API

See [backend/API_TESTING_GUIDE.md](backend/API_TESTING_GUIDE.md) for detailed API testing instructions.

### Quick Test
```bash
# Check health
curl http://localhost:5000/health

# Get products
curl http://localhost:5000/api/products
```

---

## 📦 Frontend Features

- ✅ Responsive design (mobile-first)
- ✅ User authentication
- ✅ Product browsing & search
- ✅ Shopping cart
- ✅ Checkout
- ✅ Order history
- ✅ Product reviews
- ✅ Admin panel
- ✅ User profile

---

## 🛠️ Development

### Useful Commands

```bash
# Backend
cd backend
npm start          # Production
npm run dev        # Development (with nodemon)

# Run database setup
node setup-db.js

# Add sample data
mysql -u root -p < database.sql
mysql -u root -p < test-data.sql
```

---

## 📚 File Descriptions

### Backend Files
| File | Purpose |
|------|---------|
| `server.js` | Express server entry point |
| `config/db.js` | MySQL connection pool |
| `middleware/auth.js` | JWT verification |
| `routes/auth.js` | Authentication routes |
| `routes/api.js` | Protected API routes |
| `utils/validators.js` | Input validation |

### Frontend Files
| File | Purpose |
|------|---------|
| `js/api-client.js` | API wrapper class |
| `js/config.js` | Frontend configuration |
| `js/easyrice.js` | Main JavaScript |
| `pages/*.html` | Page templates |
| `css/style.css` | Styling |

---

## 🚢 Deployment

### Deploy Backend to Vercel
1. Push code to GitHub
2. Connect GitHub to Vercel
3. Set root directory to `backend/`
4. Add environment variables
5. Deploy!

### Database for Production
Use cloud database:
- JawsDB (MySQL)
- AWS RDS
- Google Cloud SQL
- Heroku Postgres

---

## 🐛 Troubleshooting

### "Unknown database 'easyrice_db'"
```bash
cd backend
node setup-db.js
```

### "Cannot find module 'express'"
```bash
cd backend
npm install
```

### "Module not found: api-client.js"
Check that paths are relative:
- Pages in `pages/` → use `../js/api-client.js`
- Root files → use `./js/api-client.js`

### Port 5000 already in use
```bash
# Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## 📖 Documentation

- [README.md](README.md) - Main project info
- [backend/README.md](backend/README.md) - Backend documentation
- [backend/API_TESTING_GUIDE.md](backend/API_TESTING_GUIDE.md) - API testing guide

---

## 👨‍💻 Development Tips

1. **Hot Reload**: Use nodemon in backend
   ```bash
   npm run dev
   ```

2. **Debug API**: Open browser DevTools (F12) → Console
   ```javascript
   // Test API in console
   const result = await api.getProducts();
   console.log(result);
   ```

3. **Check Database**: Use MySQL Workbench or CLI
   ```bash
   mysql -u root -p -e "USE easyrice_db; SHOW TABLES;"
   ```

4. **Inspect Tokens**: 
   ```javascript
   // In console
   console.log(localStorage.getItem('token'));
   ```

---

## 📝 License

MIT License - Open source project for learning purposes

---

## ⚡ Next Steps

1. ✅ Setup backend server
2. ✅ Create database
3. ✅ Test API endpoints
4. ✅ Built frontend
5. Next: Deploy to production!

---

**Happy coding! 🚀**
