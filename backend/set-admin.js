// สคริปต์ตั้ง role เป็น admin
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

async function setAdmin(email) {
  try {
    const connection = await pool.getConnection();
    
    const [result] = await connection.execute(
      'UPDATE users SET role = ? WHERE email = ?',
      ['admin', email]
    );
    
    if (result.affectedRows > 0) {
      console.log(`✅ ตั้ง ${email} เป็น admin เสร็จแล้ว`);
    } else {
      console.log(`❌ ไม่พบผู้ใช้ ${email}`);
    }
    
    connection.release();
    process.exit(0);
  } catch (err) {
    console.error('❌ เกิดข้อผิดพลาด:', err.message);
    process.exit(1);
  }
}

const email = process.argv[2] || 'admin@easyrice.com';
setAdmin(email);
