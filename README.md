# EasyRice E-Commerce Platform

## 📋 ภาพรวม
EasyRice เป็นแพลตฟอร์มอี-คอมเมิร์สสำหรับการขายข้าวออนไลน์ โดยใช้ Node.js + MySQL + Vanilla JavaScript

## 📁 Project Structure

```
ProjectWEB/
├── backend/              # Node.js/Express API server
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   ├── package.json
│   └── database.sql
│
├── frontend/             # HTML/CSS/JavaScript frontend
│   └── app/
│       ├── index.html
│       ├── pages/
│       ├── css/
│       ├── js/
│       └── images/
│
├── STRUCTURE.md          # Detailed structure info
└── README.md            # This file
```

ดูรายละเอียดในที่อย่างสมบูรณ์: [STRUCTURE.md](STRUCTURE.md)

## 🏗️ สถาปัตยกรรม

### Backend
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Token)
- **Password Hashing**: bcryptjs

### Frontend
- **HTML/CSS/JavaScript**: Vanilla (ไม่มี Framework)
- **API Client**: Custom APIClient class

## 📦 โครงสร้าง Project

```
ProjectWEB/
├── config/
│   └── db.js                 # MySQL connection pool
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── routes/
│   ├── auth.js              # Authentication routes (register, login)
│   └── api.js               # Protected API routes
├── utils/
│   └── validators.js        # Input validation functions
├── project/
│   ├── index.html           # Homepage
│   ├── pages/
│   │   ├── product-list.html     # Product listing with API
│   │   ├── sign-in.html     # Login page with API
│   │   ├── sign-up.html     # Registration page with API
│   │   ├── checkout.html    # Checkout page
│   │   ├── admin.html       # Admin panel
│   │   └── ...
│   ├── css/
│   │   └── style.css        # Styling
│   └── js/
│       ├── api-client.js    # API client utility
│       └── easyrice.js      # Main JavaScript
├── database.sql             # Database schema
├── test-data.sql           # Sample test data
├── server.js               # Express server
├── package.json            # Dependencies
├── .env                    # Environment variables
└── vercel.json            # Vercel deployment config
```

## 🚀 ติดตั้งและรัน

### 1. ติดตั้ง Dependencies
```bash
cd backend
npm install
```

### 2. สร้าง Database
```bash
cd backend
node setup-db.js
```

### 3. สร้าง .env File
```bash
cd backend
cp .env.example .env
```

แก้ไข `backend/.env` ให้ตรงกับการ setup ของคุณ:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_PASSWORD
DB_NAME=easyrice_db
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-here
```

### 4. รัน Server
```bash
cd backend
npm start
```

Server จะทำงานบน `http://localhost:5000`

### 5. เข้าถึง Frontend
- **Homepage**: http://localhost:5000
- **Products**: http://localhost:5000/pages/product-list.html
- **Sign Up**: http://localhost:5000/pages/sign-up.html
- **Login**: http://localhost:5000/pages/sign-in.html

## 📡 API Endpoints

### Authentication
- **POST** `/api/auth/register` - สมัครสมาชิกใหม่
- **POST** `/api/auth/login` - เข้าสู่ระบบ
- **GET** `/api/auth/me` - ดึงข้อมูลผู้ใช้ปัจจุบัน (ต้อง Token)

### Products (Public)
- **GET** `/api/products` - ดึงสินค้าทั้งหมด
- **GET** `/api/products/:id` - ดึงสินค้าเฉพาะ

### Products (Admin Only)
- **POST** `/api/products` - สร้างสินค้าใหม่
- **PUT** `/api/products/:id` - อัพเดตสินค้า
- **DELETE** `/api/products/:id` - ลบสินค้า

### Cart (Protected)
- **GET** `/api/cart` - ดึงสินค้าในรถเข็น
- **POST** `/api/cart` - เพิ่มสินค้าลงรถเข็น
- **PUT** `/api/cart/:cartId` - อัพเดตจำนวนสินค้า
- **DELETE** `/api/cart/:cartId` - ลบสินค้าจากรถเข็น

### Orders (Protected)
- **GET** `/api/orders` - ดึงออเดอร์ของผู้ใช้
- **GET** `/api/orders/:orderId` - ดึงรายละเอียดออเดอร์
- **POST** `/api/orders` - สร้างออเดอร์จากรถเข็น

### Reviews (Protected)
- **GET** `/api/reviews/product/:productId` - ดึงรีวิวของสินค้า
- **POST** `/api/reviews` - สร้างรีวิวใหม่

### Profile (Protected)
- **PUT** `/api/profile` - อัพเดตข้อมูลโปรไฟล์

### Admin Routes (Admin Only)
- **GET** `/api/admin/orders` - ดึงออเดอร์ทั้งหมด
- **PUT** `/api/admin/orders/:orderId` - อัพเดตสถานะออเดอร์

## 🔐 Authentication

### วิธีใช้ JWT

1. **Register/Login** → ได้รับ `token`
2. **เก็บ Token** ใน localStorage
3. **ส่ง Token** ใน Header: `Authorization: Bearer <token>`

ตัวอย่าง:
```javascript
// Login
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: 'password123' })
});
const { token } = await response.json();
localStorage.setItem('token', token);

// Use token
const cartResponse = await fetch('http://localhost:5000/api/cart', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 🗄️ Database Schema

### 7 Tables หลัก:
1. **users** - ข้อมูลผู้ใช้
2. **products** - สินค้า
3. **orders** - ใบสั่งซื้อ
4. **order_items** - รายการสินค้าในออเดอร์
5. **cart** - รถเข็นช้อปปิ้ง
6. **categories** - หมวดหมู่สินค้า
7. **reviews** - รีวิวสินค้า

## 📝 Usage Examples

### Frontend API Client

```javascript
// อิมพอร์ต
<script src="js/api-client.js"></script>

// Register
const result = await api.register('username', 'email@example.com', 'password123', 'Full Name', '0812345678');

// Login
const loginResult = await api.login('email@example.com', 'password123');
api.setToken(loginResult.token);

// Get products
const products = await api.getProducts();

// Add to cart
await api.addToCart(productId, quantity);

// Create order
await api.createOrder('123 Main Street, Bangkok');

// Get orders
const orders = await api.getOrders();
```

## 🛠️ Development

### npm Scripts
```bash
npm start      # เริ่มรัน server
npm run dev    # รัน server ด้วย nodemon (auto-restart)
```

### Debugging
เปิด Chrome DevTools (F12) → Console เพื่อดู error messages

## 📱 Mobile Responsive
- Design ใช้ CSS Grid และ Flexbox
- Mobile-first approach
- Responsive hamburger menu

## 🔒 Security Notes
- ✅ Passwords hashed with bcryptjs
- ✅ JWT for stateless authentication
- ✅ Input validation on all endpoints
- ✅ CORS enabled
- ⚠️ เปลี่ยน JWT_SECRET ก่อนใช้งาน production

## 🚀 Deployment

### Vercel Deploy
1. Push code to GitHub
2. Connect GitHub repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

เนื่องจาก Vercel ไม่รองรับ MySQL แนะนำให้ใช้:
- MySQL: JawsDB (มี free tier)
- หรือ Cloud Database อื่น

## 🐛 Common Issues

### Error: ECONNREFUSED (Cannot connect to MySQL)
- ตรวจสอบ MySQL service กำลังรันอยู่
- ตรวจสอบ `.env` มี credentials ถูกต้อง

### Error: Unknown database 'easyrice_db'
- รัน: `mysql -u root -p < database.sql`

### Token expired
- ลบ localStorage และ login ใหม่

## 📚 Resources
- [Express.js Docs](https://expressjs.com/)
- [MySQL2 Docs](https://github.com/sidorares/node-mysql2)
- [JWT Docs](https://jwt.io/)

## 👨‍💻 Author
Created for learning purposes

## 📄 License
MIT License
