# คู่มือการทดสอบ API - EasyRice

## 📝 ขั้นตอนการทดสอบ (Testing Steps)

### 1️⃣ **ทดสอบสถานะเซิร์ฟเวอร์ (Health Check)**
```bash
curl http://localhost:5000/health
```

ผลลัพธ์ที่คาดหวัง (Expected Response):
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

ผลลัพธ์ที่คาดหวัง:
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

ผลลัพธ์ที่คาดหวัง:
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

**สำคัญ: บันทึก Token ที่ได้ไว้เพื่อใช้ในคำสั่งถัดไป!**

---

### 4️⃣ **ดึงข้อมูลผู้ใช้ปัจจุบัน**
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 5️⃣ **ดึงสินค้าทั้งหมด (สาธารณะ)**
```bash
curl http://localhost:5000/api/products
```

ผลลัพธ์ที่คาดหวัง:
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

### 6️⃣ **ดึงสินค้าเฉพาะรายการ**
```bash
curl http://localhost:5000/api/products/1
```

---

### 7️⃣ **เพิ่มสินค้าลงตะกร้า (ต้อง Login)**
```bash
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "product_id": 1,
    "quantity": 2
  }'
```

ผลลัพธ์ที่คาดหวัง:
```json
{"message": "Item added to cart"}
```

---

### 8️⃣ **ดูตะกร้าสินค้า**
```bash
curl http://localhost:5000/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

ผลลัพธ์ที่คาดหวัง:
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

### 9️⃣ **สร้างคำสั่งซื้อจากตะกร้า**
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "shipping_address": "123 ซอย สุขสวัสดิ์ กรุงเทพ 10110"
  }'
```

ผลลัพธ์ที่คาดหวัง:
```json
{
  "message": "Order created",
  "order_id": 4
}
```

---

### 🔟 **ดูประวัติคำสั่งซื้อ**
```bash
curl http://localhost:5000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 1️⃣1️⃣ **ดูรายละเอียดคำสั่งซื้อ**
```bash
curl http://localhost:5000/api/orders/4 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

ผลลัพธ์ที่คาดหวัง:
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

### 1️⃣2️⃣ **เขียนรีวิว**
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

### 1️⃣3️⃣ **ดูรีวิวสินค้า**
```bash
curl http://localhost:5000/api/reviews/product/1
```

---

### 1️⃣4️⃣ **อัพเดตข้อมูลส่วนตัว**
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

## 🔐 สำหรับ Admin เท่านั้น (Admin-Only Routes)

ต้อง Login ด้วยบัญชีที่มี role `admin`

### **เพิ่มสินค้าใหม่**
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

### **ดูคำสั่งซื้อทั้งหมด (Admin)**
```bash
curl http://localhost:5000/api/admin/orders \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

### **อัพเดตสถานะคำสั่งซื้อ (Admin)**
```bash
curl -X PUT http://localhost:5000/api/admin/orders/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "status": "shipped"
  }'
```

สถานะที่ใช้ได้: `pending` (รอ), `confirmed` (ยืนยันแล้ว), `shipped` (จัดส่งแล้ว), `delivered` (ได้รับแล้ว), `cancelled` (ยกเลิก)

---

### **ดูรายชื่อผู้ใช้ทั้งหมด (Admin)**
```bash
curl http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## 🔧 การทดสอบด้วย Postman

### ขั้นตอน:
1. ดาวน์โหลด Postman: https://www.postman.com/downloads/
2. Import Collection จาก JSON ข้างล่าง
3. ตั้งค่า environment variable ชื่อ `token` หลังจาก Login
4. เริ่มยิง API ทดสอบได้เลย

### ตัวอย่าง Postman Collection:

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

## 📊 รหัสสถานะ HTTP (HTTP Status Codes)

| Code | ความหมาย |
|------|---------|
| 200 | ✅ สำเร็จ (Success) |
| 201 | ✅ สร้างสำเร็จ (Created) |
| 400 | ❌ คำขอไม่ถูกต้อง (Bad Request) เช่น ข้อมูลไม่ครบ |
| 401 | ❌ ไม่ได้รับอนุญาต (Unauthorized) เช่น ไม่มี Token |
| 403 | ❌ ห้ามเข้าถึง (Forbidden) เช่น ไม่ใช่ Admin |
| 404 | ❌ ไม่พบข้อมูล (Not Found) |
| 500 | ❌ เซิร์ฟเวอร์มีปัญหา (Server Error) |

---

## 🐛 ปัญหาที่พบบ่อย (Common Errors)

### Error: "No token provided"
- ตรวจสอบว่าได้แนบ Header: `Authorization` ไปหรือยัง
- รูปแบบที่ถูก: `Authorization: Bearer YOUR_TOKEN`

### Error: "Invalid token"
- Token อาจจะหมดอายุ (อายุ 30 วัน)
- ให้ทำการ Login ใหม่เพื่อนรับ Token ล่าสุด

### Error: "Admin access required"
- บัญชีที่ใช้ไม่มีสิทธิ์ Admin
- ต้องตั้งค่า role='admin' ในฐานข้อมูลก่อน

### Error: "Cart is empty"
- ต้องเพิ่มสินค้าลงตะกร้าก่อน ถึงจะกดสั่งซื้อ (Checkout) ได้

---

## ✨ เคล็ดลับเพิ่มเติม

1. **เก็บ Token**: เวลาทดสอบ ให้ก๊อปปี้ Token จาก Response Login เก็บไว้ที่ Notepad หรือ Environment Variable ของ Postman
2. **เช็ค Status Code**: ดูรหัส HTTP เสมอ ว่าเป็น 200 หรือไม่
3. **อ่าน Error**: ถ้า API พัง ให้ดูข้อความ error ใน JSON response มันจะบอกสาเหตุ
4. **ทดสอบ Frontend**: ลองใช้  `api-client.js` ใน Console ของ Browser ก็สะดวกดี (กด F12)

---
