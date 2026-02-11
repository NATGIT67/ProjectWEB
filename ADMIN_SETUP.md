# การตั้งค่าสิทธิ์ Admin - เสร็จสมบูรณ์ ✅

## สิ่งที่ได้รับการแก้ไข

### 1. ปัญหา Database Schema ✅
- **ปัญหา**: ตาราง `users` ไม่มีคอลัมน์ `role`
- **การแก้ไข**: เพิ่มคอลัมน์ `role` ในตาราง `users` โดยมีค่าเริ่มต้นเป็น 'user'
- **สถานะ**: ผู้ใช้ Admin (ID 6, admin@easyrice.com) ถูกกำหนด role='admin' เรียบร้อยแล้ว

### 2. ระบบยืนยันตัวตน (Authentication Backend) ✅
- **ปัญหา**: JWT tokens ถูกกำหนดค่าตายตัวให้ role='user' สำหรับทุกคน
- **การแก้ไข**: อัปเดตไฟล์ `auth.js` ให้อ่านค่า `role` จากฐานข้อมูลจริง
  - **สมัครสมาชิก**: อ่านค่า role จากฐานข้อมูลหลังจากสร้าง user เสร็จ
  - **เข้าสู่ระบบ**: ดึงค่า role จากฐานข้อมูลและใส่เข้าไปใน JWT Payload
  - **API /auth/me**: ส่งคืนข้อมูลผู้ใช้รวมถึงฟิลด์ role

### 3. การจัดการ Session ฝั่ง Frontend ✅
- **แก้ไข sign-in.html**: ทำการถอดรหัส (Decode) JWT token และบันทึก `role` ลงใน localStorage
- **แก้ไข sign-up.html**: กำหนดค่าเริ่มต้น `role='user'` ใน localStorage หลังสมัคร
- **แก้ไข easyrice.js (Navbar)**: 
  - แสดงลิงก์ "Admin" (สีแดง) เฉพาะผู้ที่มี `role='admin'`
  - ซ่อนลิงก์ Admin สำหรับผู้ใช้ทั่วไป
  - เมื่อ Logout จะลบค่า role ออกจากระบบ



## วิธีการเข้าใช้งาน Admin Panel

### วิธีที่ 1: ผ่าน Navbar (แนะนำ)
1. เข้าสู่ระบบด้วยบัญชี Admin:
   - Email: `admin@easyrice.com`
   - Password: `Admin@1234`
2. หลังจากล็อกอิน คลิกลิงก์ **Admin** สีแดง ที่แถบเมนูด้านบน (ข้างๆ โปรไฟล์)
3. ระบบจะพาไปยังหน้า Admin Dashboard ที่ `/pages/admin.html`

### วิธีที่ 2: เข้าผ่าน URL โดยตรง
1. ตรวจสอบว่าล็อกอินด้วยบัญชี Admin อยู่
2. พิมพ์ URL: `http://localhost:5000/pages/admin.html`
3. ระบบจะตรวจสอบสิทธิ์และอนุญาตให้เข้าใช้งาน

## ข้อมูลบัญชีทดสอบ (Test Credentials)

### บัญชี Admin
- **Email**: admin@easyrice.com
- **Password**: Admin@1234
- **Role**: admin

### บัญชีผู้ใช้ทั่วไป (User)
- สร้างบัญชีใหม่ผ่านหน้าสมัครสมาชิก
- จะได้รับสิทธิ์ `role='user'` โดยอัตโนมัติ
- ไม่สามารถเข้าถึงหน้า Admin Panel ได้

## ข้อมูลเชิงเทคนิค (Technical Details)

### โครงสร้าง JWT Token (สำหรับ Admin)
```
Header: {alg: "HS256", typ: "JWT"}
Payload: {
  user_id: 6,
  username: "admin",
  email: "admin@easyrice.com",
  role: "admin",  // ← ระบุสิทธิ์ตรงนี้
  iat: 1770374382,
  exp: 1772966382
}
```

### ขั้นตอนการตรวจสอบสิทธิ์ Admin
1. ผู้ใช้คลิกลิงก์ "Admin"
2. หน้า `admin.html` โหลดและเรียก API `GET /api/auth/me`
3. Backend ส่งข้อมูลผู้ใช้กลับมาพร้อม `role='admin'`
4. JavaScript ตรวจสอบเงื่อนไข: `if (user.role === 'admin')`
5. ถ้าเป็น Admin → แสดงหน้า Dashboard
6. ถ้าไม่ใช่ → ดีดกลับไปหน้าหลัก (Home)

### API Endpoints สำหรับ Admin (Protected)
Endpoints เหล่านี้ต้องใช้ `role='admin'` เท่านั้น:
- `GET /api/admin/users` - ดูรายชื่อผู้ใช้ทั้งหมด
- `GET /api/admin/orders` - ดูคำสั่งซื้อทั้งหมด
- `POST /api/products` - เพิ่มสินค้าใหม่
- `PUT /api/products/:id` - แก้ไขสินค้า
- `DELETE /api/products/:id` - ลบสินค้า

## การแก้ปัญหาเบื้องต้น (Troubleshooting)

### "ลิงก์ Admin ไม่ขึ้นใน Navbar?"
1. ล้าง localStorage: กด F12 → Application → Clear all
2. ล็อกอินใหม่ด้วยบัญชี admin
3. ตรวจสอบ localStorage ว่ามีค่า `role: "admin"` หรือไม่
4. กด F5 เพื่อรีเฟรชหน้าเว็บ

### "เข้าหน้า Admin แล้วโดนเด้งออก?"
1. ตรวจสอบการล็อกอิน: ดู localStorage ว่า `is_logged_in: "true"`
2. ตรวจสอบ role: ต้องเป็น `"admin"` เท่านั้น ห้ามเป็น `"user"`
3. ลองนำ Token ไปแปะในเว็บ jwt.io เพื่อดูไส้ใน
4. ดู Error ใน Console (F12)

### "Admin API ขึ้น Error 403 Forbidden?"
1. Backend ปฏิเสธการเข้าถึงเพราะสิทธิ์ไม่ถึง
2. ตรวจสอบว่า Token มี `role='admin'`
3. ตรวจสอบ Header ตอนส่ง Request: `Authorization: Bearer <token>`

## ขั้นตอนต่อไปสำหรับ Production

### สิ่งที่ต้องเตรียม:
1. เตรียมฐานข้อมูล Production (เช่น PlanetScale, Supabase, หรือ Railway MySQL)
2. ตั้งค่า Environment Variables:
   - `DB_HOST` (Host ของฐานข้อมูลจริง)
   - `DB_USER` (User ของฐานข้อมูลจริง)
   - `DB_PASSWORD` (Password ของฐานข้อมูลจริง)
   - `JWT_SECRET` (ตั้งรหัสลับใหม่ที่ยาวและซับซ้อน)
3. สร้างบัญชี Admin ในฐานข้อมูลจริง
4. ทดสอบระบบ Admin
5. อัปเดต API URLs ใน Frontend หากใช้ Custom Domain

### วิธีสร้าง Admin ใน Production:
ยิง API เพื่อสมัครสมาชิกก่อน:
```bash
curl -X POST https://your-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@yourcompany.com",
    "password": "SecurePassword123",
    "full_name": "Admin User",
    "phone": "0800000000"
  }'
```

จากนั้นเข้าไปแก้ role ใน Database:
```sql
UPDATE users SET role='admin' WHERE email='admin@yourcompany.com';
```

## สรุปสถานะ (Status Summary)

✅ ระบบสิทธิ์ Admin ใช้งานได้
✅ ปรับปรุง Database Schema แล้ว
✅ JWT Token มีการระบุ Role
✅ Frontend แสดงลิงก์ Admin ถูกต้องตามสิทธิ์
✅ API ฝั่ง Admin มีการป้องกัน

⏳ เหลือแค่ตั้งค่า Database ใน Production (ผู้ใช้ต้องทำเอง)

---
แก้ไขล่าสุด: 2026-02-11
