const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function createDatabase() {
  try {
    console.log('🔧 กำลังเชื่อมต่อ MySQL...');
    
    // เชื่อมต่อแรก (ไม่มี database)
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '1234'
    });

    console.log('✅ เชื่อมต่อสำเร็จ');

    // อ่าน SQL file
    const sqlPath = path.join(__dirname, 'database.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log('📝 กำลังรัน SQL script...');
    
    // Split ด้วย ; และ run แต่ละ statement
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const statement of statements) {
      try {
        await connection.query(statement);
        console.log('✅', statement.substring(0, 60) + '...');
      } catch (err) {
        console.error('❌ Error:', err.message);
      }
    }

    // ensure role column exists (in case database was created before the column existed)
    try {
      await connection.query(
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'user'"
      );
      console.log('🔧 ตรวจสอบ role column: มีหรือสร้างแล้ว');
    } catch (err) {
      console.error('❌ ไม่สามารถตรวจสอบ/เพิ่ม role column:', err.message);
    }

    await connection.end();
    console.log('\n✨ Database สร้างเสร็จแล้ว!');
    console.log('📊 Database: easyrice_db');
    console.log('📋 Tables: users, products, orders, order_items, cart, categories, reviews');
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message);
    process.exit(1);
  }
}

createDatabase();
