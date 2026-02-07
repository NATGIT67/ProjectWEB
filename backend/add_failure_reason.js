const pool = require('./config/db');

async function addFailureReasonColumn() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to database...');

    // Check if column exists
    const [columns] = await connection.query("SHOW COLUMNS FROM orders LIKE 'failure_reason'");

    if (columns.length === 0) {
      console.log('Adding failure_reason column...');
      await connection.query("ALTER TABLE orders ADD COLUMN failure_reason TEXT AFTER status");
      console.log('Column added successfully.');
    } else {
      console.log('Column failure_reason already exists.');
    }

    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('Error adding column:', error);
    process.exit(1);
  }
}

addFailureReasonColumn();
