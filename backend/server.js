const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

dotenv.config();

// Auto-Run DB Migration for new columns
(async () => {
  try {
    const pool = require('./config/db');
    const connection = await pool.getConnection();
    console.log('Checking database schema...');

    // Check/Add payment_type
    try {
      await connection.query("ALTER TABLE orders ADD COLUMN payment_type ENUM('full', 'deposit') DEFAULT 'full'");
      console.log('Added payment_type column');
    } catch (e) {
      // Ignore if exists
    }

    // Check/Add paid_amount
    try {
      await connection.query("ALTER TABLE orders ADD COLUMN paid_amount DECIMAL(10, 2) DEFAULT 0.00");
      console.log('Added paid_amount column');
    } catch (e) {
      // Ignore if exists
    }

    // Check/Add remark
    try {
      await connection.query("ALTER TABLE orders ADD COLUMN remark TEXT");
      console.log('Added remark column');
    } catch (e) {
      // Ignore if exists
    }

    // Check/Add remark
    try {
      await connection.query("ALTER TABLE orders ADD COLUMN remark TEXT");
      console.log('Added remark column');
    } catch (e) {
      // Ignore if exists
    }

    // Check/Add profile_picture
    try {
      await connection.query("ALTER TABLE users ADD COLUMN profile_picture VARCHAR(255) DEFAULT NULL");
      console.log('Added profile_picture column');
    } catch (e) {
      // Ignore if exists
    }

    connection.release();
  } catch (e) {
    console.error('DB Schema check failed (non-fatal):', e.message);
  }
})();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static frontend files from ../public
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Serve pages/index.html for root and any non-existent routes (SPA)
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  } else {
    res.status(404).json({ error: 'Route not found' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`\n==================================================`);
  console.log(`Server is running!`);
  console.log(`--------------------------------------------------`);
  console.log(`Local (You):      http://localhost:${PORT}`);
  console.log(`Network (Friend): http://${require('os').networkInterfaces()['Wi-Fi']?.find(i => i.family === 'IPv4')?.address || 'YOUR_IP'}:${PORT}`);
  console.log(`==================================================\n`);
});
