const pool = require('./config/db');

async function addColumn() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to database.');

        // Check if column exists
        const [columns] = await connection.query("SHOW COLUMNS FROM orders LIKE 'payment_slip'");
        if (columns.length > 0) {
            console.log('Column payment_slip already exists.');
        } else {
            await connection.query("ALTER TABLE orders ADD COLUMN payment_slip LONGTEXT");
            console.log('Column payment_slip added successfully.');
        }

        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('Error adding column:', error);
        process.exit(1);
    }
}

addColumn();
