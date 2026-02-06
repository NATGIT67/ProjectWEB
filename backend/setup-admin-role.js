// เพิ่ม role column และตั้ง admin user
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'easyrice_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function setupAdminRole() {
  try {
    const connection = await pool.getConnection();
    
    // 1. เพิ่ม role column ถ้ายังไม่มี
    console.log('🔧 กำลังตรวจสอบและเพิ่ม role column...');
    try {
      await connection.execute(
        'ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT "user"'
      );
      console.log('✅ เพิ่ม role column เสร็จแล้ว');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ role column มีอยู่แล้ว');
      } else {
        throw err;
      }
    }

    // 2. ตั้ง admin user เป็น role='admin'
    console.log('🔧 กำลังตั้ง admin@easyrice.com เป็น admin...');
    const [result] = await connection.execute(
      'UPDATE users SET role = ? WHERE email = ?',
      ['admin', 'admin@easyrice.com']
    );

    if (result.affectedRows > 0) {
      console.log('✅ ตั้ง admin@easyrice.com เป็น admin แบบ role เสร็จแล้ว');
    } else {
      console.log('⚠️  ไม่พบผู้ใช้ admin@easyrice.com');
      console.log('💡 ลองสร้างผู้ใช้ admin ก่อน');
    }

    // 3. ตรวจสอบผลลัพธ์
    const [users] = await connection.execute(
      'SELECT user_id, email, role FROM users WHERE role = ?',
      ['admin']
    );
    
    console.log('\n📋 Admin users ในระบบ:');
    users.forEach(u => {
      console.log(`   - User ID ${u.user_id}: ${u.email} (role: ${u.role})`);
    });

    connection.release();
    console.log('\n✅ ตั้งค่า admin role เสร็จแล้ว!');
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message);
    process.exit(1);
  }
}

setupAdminRole().then(() => {
  console.log('\n✨ งานเสร็จสิ้น');
  process.exit(0);
});
