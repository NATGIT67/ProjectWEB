# EasyRice - แพลตฟอร์มอีคอมเมิร์ซข้าว
## 📁 โครงสร้างโปรเจค (Project Structure)

```
ProjectWEB/
├── backend/                    # ส่วน Backend (Node.js + Express)
│   ├── config/
│   │   └── db.js              # ไฟล์เชื่อมต่อฐานข้อมูล MySQL
│   ├── middleware/
│   │   └── auth.js            # ระบบตรวจสอบสิทธิ์ด้วย JWT
│   ├── routes/
│   │   ├── auth.js            # API เส้นทางสำหรับการยืนยันตัวตน
│   │   └── api.js             # API เส้นทางหลัก
│   ├── utils/
│   │   └── validators.js      # ฟังก์ชันตรวจสอบข้อมูลขาเข้า (Validation)
│   ├── server.js              # จุดเริ่มต้นการทำงานของ Server (Express)
│   ├── setup-db.js            # สคริปต์ติดตั้งฐานข้อมูล
│   ├── database.sql           # ไฟล์โครงสร้างฐานข้อมูล (SQL Schema)
│   ├── test-data.sql          # ข้อมูลตัวอย่างสำหรับทดสอบ
│   ├── package.json           # รายการ Dependencies
│   ├── .env                   # ตัวแปรสภาพแวดล้อมระบบ (Environment Variables)
│   └── node_modules/          # ไลบรารีที่ติดตั้งไว้
│
├── public/                     # ส่วน Frontend (HTML/CSS/JavaScript)
│   ├── index.html             # หน้าหลัก (Homepage)
│   ├── pages/                 # หน้าเว็บย่อยต่างๆ
│   │   ├── sign-up.html       # หน้าสมัครสมาชิก
│   │   ├── sign-in.html       # หน้าเข้าสู่ระบบ
│   │   ├── product-list.html  # หน้ารายการสินค้า
│   │   ├── checkout.html      # หน้าชำระเงิน
│   │   ├── admin-panel.html   # หน้าจัดการระบบ (Admin)
│   │   ├── product.html       # หน้ารายละเอียดสินค้า
│   │   ├── about.html         # หน้าเกี่ยวกับเรา
│   │   ├── contact.html       # หน้าติดต่อเรา
│   │   ├── history.html       # หน้าประวัติการสั่งซื้อ
│   │   └── forgot-password.html # หน้าลืมรหัสผ่าน
│   ├── css/
│   │   └── style.css          # ไฟล์ CSS หลักในการตกแต่ง
│   ├── js/
│   │   ├── api-client.js      # คลาสสำหรับเชื่อมต่อ API
│   │   ├── config.js          # การตั้งค่าพื้นฐาน Frontend
│   │   └── easyrice.js        # ไฟล์ JavaScript หลัก
│   └── images/                # โฟลเดอร์เก็บรูปภาพ
│
├── README.md                  # เอกสารแนะนำโปรเจคหลัก
├── STRUCTURE.md               # เอกสารโครงสร้างโปรเจค (ไฟล์นี้)
├── .env.example              # ตัวอย่างไฟล์ Environment Variables
└── .git/                     # ข้อมูล Git Repository
```

---

## 🚀 เริ่มต้นใช้งานอย่างรวดเร็ว (Quick Start)

### สิ่งที่ต้องมีเบื้องต้น (Prerequisites)
- Node.js เวอร์ชั่น 14 ขึ้นไป
- MySQL 8.0 ขึ้นไป
- npm หรือ yarn

### ขั้นตอนการติดตั้ง (Installation)

#### 1. ติดตั้ง Backend Dependencies
```bash
cd backend
npm install
```

#### 2. ตั้งค่าฐานข้อมูล (Configure Database)
```bash
# คัดลอกไฟล์ตัวอย่าง .env
cp .env.example .env

# แก้ไขไฟล์ .env ใส่ข้อมูลการเชื่อมต่อ MySQL ของคุณให้ถูกต้อง
# จากนั้นรันคำสั่ง:
node setup-db.js
```

#### 3. รัน Backend Server
```bash
npm start
```

Server จะทำงานที่: `http://localhost:5000`

#### 4. เข้าใช้งาน Frontend
- **หน้าหลัก**: http://localhost:5000
- **รายการสินค้า**: http://localhost:5000/pages/product-list.html
- **สมัครสมาชิก**: http://localhost:5000/pages/sign-up.html
- **เข้าสู่ระบบ**: http://localhost:5000/pages/sign-in.html
- **Admin Panel**: http://localhost:5000/pages/admin-panel.html

---

## 📋 เทคโนโลยีที่ใช้ (Technology Stack)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Token)
- **Password**: bcryptjs (เข้ารหัสรหัสผ่าน)

### Frontend
- **Languages**: HTML5, CSS3, JavaScript (Vanilla - ไม่ใช้ Framework)
- **Fonts**: Google Fonts (Kanit)
- **Icons**: Font Awesome
- **API**: Custom REST API Client

---

## 🗄️ ฐานข้อมูล (Database)

### ตารางข้อมูล (7 ตาราง)
1. **users** - ข้อมูลผู้ใช้งาน
2. **products** - รายการสินค้า
3. **orders** - คำสั่งซื้อของลูกค้า
4. **order_items** - รายการสินค้าในแต่ละคำสั่งซื้อ
5. **cart** - ตะกร้าสินค้าชั่วคราว
6. **categories** - หมวดหมู่สินค้า
7. **reviews** - รีวิวสินค้า

คำสั่งติดตั้งฐานข้อมูล:
```bash
cd backend
node setup-db.js
```

---

## 📡 API Endpoints

URL หลัก: `http://localhost:5000/api`

### การยืนยันตัวตน (Authentication)
- `POST /auth/register` - สมัครสมาชิกใหม่
- `POST /auth/login` - เข้าสู่ระบบ
- `GET /auth/me` - ดึงข้อมูลผู้ใช้ปัจจุบัน

### สินค้า (Products)
- `GET /products` - แสดงรายการสินค้าทั้งหมด
- `GET /products/:id` - ดูรายละเอียดสินค้าตาม ID
- `POST /products` - สร้างสินค้าใหม่ (Admin)
- `PUT /products/:id` - แก้ไขสินค้า (Admin)
- `DELETE /products/:id` - ลบสินค้า (Admin)

### ตะกร้าสินค้า (Cart)
- `GET /cart` - ดูสินค้าในตะกร้า
- `POST /cart` - เพิ่มสินค้าลงตะกร้า
- `PUT /cart/:cartId` - อัพเดตจำนวนสินค้า
- `DELETE /cart/:cartId` - ลบสินค้าออกจากตะกร้า

### คำสั่งซื้อ (Orders)
- `GET /orders` - ประวัติการสั่งซื้อของฉัน
- `GET /orders/:orderId` - รายละเอียดคำสั่งซื้อ
- `POST /orders` - สร้างคำสั่งซื้อใหม่

### รีวิว (Reviews)
- `GET /reviews/product/:productId` - ดูรีวิวของสินค้า
- `POST /reviews` - เขียนรีวิว

### ผู้ดูแลระบบ (Admin)
- `GET /admin/orders` - ดูคำสั่งซื้อทั้งหมดในระบบ
- `PUT /admin/orders/:orderId` - อัพเดตสถานะคำสั่งซื้อ
- `GET /admin/users` - ดูรายชื่อผู้ใช้ทั้งหมด

---

## 🔐 ระบบ Authentication

Frontend จะส่ง Token ไปใน HTTP Header:
```
Authorization: Bearer <token>
```

Token จะถูกเก็บไว้ใน `localStorage` ของ Browser หลังจาก Login สำเร็จ

---

## 📝 ตัวแปรสภาพแวดล้อม (Environment Variables)

ไฟล์ `.env` ในโฟลเดอร์ `backend/` ควรมีค่าดังนี้:
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

## 🧪 การทดสอบ API

ดูรายละเอียดเพิ่มเติมที่ [backend/API_TESTING_GUIDE.md](backend/API_TESTING_GUIDE.md)

### ทดสอบเบื้องต้น
```bash
# ตรวจสอบสถานะ Server
curl http://localhost:5000/health

# ดึงรายการสินค้า
curl http://localhost:5000/api/products
```

---

## 📦 ฟีเจอร์ของ Frontend (Frontend Features)

- ✅ Responsive Design รองรับการใช้งานผ่านมือถือ
- ✅ ระบบสมาชิก (สมัคร/เข้าสู่ระบบ)
- ✅ ค้นหาและดูสินค้า
- ✅ ตะกร้าสินค้า
- ✅ ระบบชำระเงิน (จำลอง)
- ✅ ประวัติการสั่งซื้อ
- ✅ รีวิวสินค้า
- ✅ ระบบ Admin จัดการหลังบ้าน
- ✅ หน้าแก้ไขโปรไฟล์ผู้ใช้

---

## 🛠️ การพัฒนา (Development)

### คำสั่งที่ใช้บ่อย
```bash
# เริ่มต้น Backend
cd backend
npm start          # โหมด Production
npm run dev        # โหมด Development (รีสตาร์ทอัตโนมัติด้วย nodemon)

# ติดตั้งฐานข้อมูลใหม่
node setup-db.js

# เพิ่มข้อมูลตัวอย่าง
mysql -u root -p < database.sql
mysql -u root -p < test-data.sql
```

---

## 📚 รายละเอียดไฟล์สำคัญ

### Backend Files
| ชื่อไฟล์ | หน้าที่ |
|------|---------|
| `server.js` | จุดเริ่มต้นการทำงานของ Express Server |
| `config/db.js` | การตั้งค่าเชื่อมต่อฐานข้อมูล MySQL |
| `middleware/auth.js` | ตรวจสอบความถูกต้องของ JWT Token |
| `routes/auth.js` | เส้นทาง API สำหรับ Authentication |
| `routes/api.js` | เส้นทาง API ที่ต้องล็อกอิน |
| `utils/validators.js` | ฟังก์ชันตรวจสอบความถูกต้องของข้อมูล |

### Frontend Files
| ชื่อไฟล์ | หน้าที่ |
|------|---------|
| `js/api-client.js` | คลาสช่วยเรียกใช้ API |
| `js/config.js` | ค่าคงที่และการตั้งค่า Frontend |
| `js/easyrice.js` | โค้ด JavaScript หลักควบคุมหน้าเว็บ |
| `pages/*.html` | ไฟล์หน้าเว็บต่างๆ |
| `css/style.css` | ไฟล์ตกแต่งหน้าเว็บ |

---



---

## 🐛 การแก้ปัญหาเบื้องต้น (Troubleshooting)

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
ตรวจสอบ Path การอิมพอร์ตไฟล์ให้ถูกต้อง:
- ในไฟล์ `pages/` → ใช้ `../js/api-client.js`
- ในไฟล์ Root → ใช้ `./js/api-client.js`

### Port 5000 ใช้งานไม่ได้ (Already in use)
```bash
# ค้นหา Process
netstat -ano | findstr :5000
# ปิด Process
taskkill /PID <PID> /F
```

---

## 📖 เอกสารอ้างอิง

- [README.md](README.md) - ข้อมูลโปรเจคหลัก
- [backend/README.md](backend/README.md) - เอกสาร Backend
- [backend/API_TESTING_GUIDE.md](backend/API_TESTING_GUIDE.md) - คู่มือทดสอบ API

---

## 👨‍💻 เคล็ดลับการพัฒนา

1. **Hot Reload**: ใช้ `npm run dev` ใน backend เพื่อให้ Server รีสตาร์ทเองเมื่อแก้โค้ด
   
2. **Debug API**: เปิด Chrome DevTools (F12) → Console เพื่อดูผลลัพธ์
   ```javascript
   // ทดลองเรียก API ใน Console
   const result = await api.getProducts();
   console.log(result);
   ```

3. **Check Database**: ใช้ MySQL Workbench ตรวจสอบข้อมูล
   ```sql
   USE easyrice_db; 
   SHOW TABLES;
   ```

4. **Inspect Tokens**: ดู Token ที่เก็บไว้
   ```javascript
   console.log(localStorage.getItem('token'));
   ```

---

## 📝 License
MIT License - โปรเจค Open Source เพื่อการเรียนรู้

---

**ขอให้สนุกกับการเขียนโค้ด! 🚀**
