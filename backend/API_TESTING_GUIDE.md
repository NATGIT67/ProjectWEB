# API Testing Guide - EasyRice

## 📝 ขั้นตอนการทดสอบ

### 1️⃣ **ทดสอบ Health Check**
```bash
curl http://localhost:5000/health
```

Expected Response:
```json
{"message": "Server is running"}
```

---

### 2️⃣ **ลงทะเบียนผู้ใช้ใหม่ (Register)**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_rice",
    "email": "john@example.com",
    "password": "password123",
    "full_name": "John Farmer",
    "phone": "0812345678"
  }'
```

Expected Response:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user_id": 3
}
```

---

### 3️⃣ **เข้าสู่ระบบ (Login)**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Expected Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": 3,
    "username": "john_rice",
    "email": "john@example.com",
    "full_name": "John Farmer"
  }
}
```

**Save the token for next requests!**

---

### 4️⃣ **ดึงข้อมูลผู้ใช้ปัจจุบัน**
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 5️⃣ **ดึงสินค้าทั้งหมด (Public)**
```bash
curl http://localhost:5000/api/products
```

Expected Response:
```json
[
  {
    "product_id": 1,
    "product_name": "ข้าวหอมมะลิ 5 กิโลกรัม",
    "description": "ข้าวหอมไทยแท้ชั้นดี",
    "category": "ข้าวหอม",
    "price": "250.00",
    "stock": 100,
    "image_url": "/images/rice-jasmine.jpg",
    "created_at": "2026-02-06T10:00:00.000Z",
    "updated_at": "2026-02-06T10:00:00.000Z"
  },
  ...
]
```

---

### 6️⃣ **ดึงสินค้าเฉพาะ**
```bash
curl http://localhost:5000/api/products/1
```

---

### 7️⃣ **เพิ่มสินค้าลงรถเข็น (ต้อง Login)**
```bash
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "product_id": 1,
    "quantity": 2
  }'
```

Expected Response:
```json
{"message": "Item added to cart"}
```

---

### 8️⃣ **ดึงรถเข็น**
```bash
curl http://localhost:5000/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Expected Response:
```json
[
  {
    "cart_id": 1,
    "user_id": 3,
    "product_id": 1,
    "quantity": 2,
    "created_at": "2026-02-06T15:30:00.000Z",
    "updated_at": "2026-02-06T15:30:00.000Z",
    "product_name": "ข้าวหอมมะลิ 5 กิโลกรัม",
    "price": "250.00",
    "image_url": "/images/rice-jasmine.jpg"
  }
]
```

---

### 9️⃣ **สร้างออเดอร์จากรถเข็น**
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "shipping_address": "123 ซอย สุขสวัสดิ์ กรุงเทพ 10110"
  }'
```

Expected Response:
```json
{
  "message": "Order created",
  "order_id": 4
}
```

---

### 🔟 **ดึงออเดอร์ของผู้ใช้**
```bash
curl http://localhost:5000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 1️⃣1️⃣ **ดึงรายละเอียดออเดอร์**
```bash
curl http://localhost:5000/api/orders/4 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Expected Response:
```json
{
  "order_id": 4,
  "user_id": 3,
  "order_date": "2026-02-06T15:40:00.000Z",
  "total_price": "500.00",
  "status": "pending",
  "shipping_address": "123 ซอย สุขสวัสดิ์ กรุงเทพ 10110",
  "created_at": "2026-02-06T15:40:00.000Z",
  "updated_at": "2026-02-06T15:40:00.000Z",
  "items": [
    {
      "order_item_id": 5,
      "order_id": 4,
      "product_id": 1,
      "quantity": 2,
      "price": "250.00",
      "created_at": "2026-02-06T15:40:00.000Z",
      "product_name": "ข้าวหอมมะลิ 5 กิโลกรัม",
      "image_url": "/images/rice-jasmine.jpg"
    }
  ]
}
```

---

### 1️⃣2️⃣ **สร้างรีวิว**
```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "product_id": 1,
    "rating": 5,
    "comment": "ข้าวเม่าหอม อร่อยมาก แนะนำสำหรับทุกคน"
  }'
```

---

### 1️⃣3️⃣ **ดึงรีวิวสินค้า**
```bash
curl http://localhost:5000/api/reviews/product/1
```

---

### 1️⃣4️⃣ **อัพเดตโปรไฟล์ (Protected)**
```bash
curl -X PUT http://localhost:5000/api/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "full_name": "John Farmer Updated",
    "phone": "0898765432",
    "address": "456 ซอย จตุจักร กรุงเทพ"
  }'
```

---

## 🔐 Admin-Only Routes

ต้อง login ด้วยผู้ใช้ที่มี role `admin`

### **สร้างสินค้า**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "product_name": "ข้าวหาร 50 กิโลกรัม",
    "description": "ข้าวหาร เกษตรแท้",
    "category": "ข้าวหาร",
    "price": 2500,
    "stock": 20,
    "image_url": "/images/rice-haeng.jpg"
  }'
```

---

### **ดึงออเดอร์ทั้งหมด (Admin)**
```bash
curl http://localhost:5000/api/admin/orders \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

### **อัพเดตสถานะออเดอร์ (Admin)**
```bash
curl -X PUT http://localhost:5000/api/admin/orders/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "status": "shipped"
  }'
```

Valid statuses: `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`

---

### **ดึงผู้ใช้ทั้งหมด (Admin)**
```bash
curl http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## 🔧 Testing ด้วย Postman

### ขั้นตอน:
1. DownloadPostman: https://www.postman.com/downloads/
2. Import Collection จากไฟล์ json ด้านล่าง
3. Set environment variable `token` จากการ login
4. ทำการทดสอบ API

### Postman Collection Template:

```json
{
  "info": {
    "name": "EasyRice API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "http://localhost:5000/api/auth/register",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\"username\": \"test_user\", \"email\": \"test@example.com\", \"password\": \"password123\", \"full_name\": \"Test User\", \"phone\": \"0812345678\"}"
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "http://localhost:5000/api/auth/login",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\"email\": \"test@example.com\", \"password\": \"password123\"}"
            }
          }
        }
      ]
    }
  ]
}
```

---

## 📊 Expected HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | ✅ Success |
| 201 | ✅ Created |
| 400 | ❌ Bad Request (validation error) |
| 401 | ❌ Unauthorized (no token) |
| 403 | ❌ Forbidden (not admin) |
| 404 | ❌ Not Found |
| 500 | ❌ Server Error |

---

## 🐛 Common Errors

### Error: "No token provided"
- ตรวจสอบว่าส่ง Authorization header ในคำขอ
- Format: `Authorization: Bearer YOUR_TOKEN`

### Error: "Invalid token"
- Token อาจหมดอายุ (30 days)
- Login ใหม่เพื่อได้ token ใหม่

### Error: "Admin access required"
- ผู้ใช้ปัจจุบันไม่มีสิทธิ admin
- ต้อง setup admin account ใน database

### Error: "Cart is empty"
- ต้องเพิ่มสินค้าลงรถเข็นก่อนสร้างออเดอร์

---

## ✨ Tips

1. **Save Token**: หลังจาก login ให้ save token ไว้ใน environment variable
2. **Check Status**: ตรวจสอบ HTTP status code ของ response
3. **Read Errors**: ข้อมูล error ใน JSON response จะช่วยแก้ปัญหา
4. **Test Frontend**: ใช้ browser DevTools Console เพื่อ test api-client.js
