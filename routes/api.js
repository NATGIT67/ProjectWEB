// Example API routes สำหรับ database operations
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// ============= USERS =============

// Get user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create user (Register)
router.post('/users', async (req, res) => {
  const { username, email, password, full_name, phone } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, full_name, phone) VALUES (?, ?, ?, ?, ?)',
      [username, email, password, full_name, phone]
    );
    res.status(201).json({ message: 'User created', user_id: result.insertId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============= PRODUCTS =============

// Get all products
router.get('/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get product by ID
router.get('/products/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE product_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create product (Admin)
router.post('/products', async (req, res) => {
  const { product_name, description, category, price, stock, image_url } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO products (product_name, description, category, price, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [product_name, description, category, price, stock, image_url]
    );
    res.status(201).json({ message: 'Product created', product_id: result.insertId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============= ORDERS =============

// Get orders by user ID
router.get('/orders/user/:userId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT o.*, GROUP_CONCAT(oi.product_id) as products FROM orders o LEFT JOIN order_items oi ON o.order_id = oi.order_id WHERE o.user_id = ? GROUP BY o.order_id',
      [req.params.userId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create order
router.post('/orders', async (req, res) => {
  const { user_id, items, total_price, shipping_address } = req.body;
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Insert order
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total_price, shipping_address) VALUES (?, ?, ?)',
      [user_id, total_price, shipping_address]
    );
    
    const order_id = orderResult.insertId;
    
    // Insert order items
    for (const item of items) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [order_id, item.product_id, item.quantity, item.price]
      );
      
      // Update product stock
      await connection.query(
        'UPDATE products SET stock = stock - ? WHERE product_id = ?',
        [item.quantity, item.product_id]
      );
    }
    
    await connection.commit();
    res.status(201).json({ message: 'Order created', order_id });
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ error: error.message });
  } finally {
    connection.release();
  }
});

// ============= CART =============

// Get user cart
router.get('/cart/user/:userId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT c.*, p.product_name, p.price, p.image_url FROM cart c JOIN products p ON c.product_id = p.product_id WHERE c.user_id = ?',
      [req.params.userId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add to cart
router.post('/cart', async (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?',
      [user_id, product_id, quantity, quantity]
    );
    res.status(201).json({ message: 'Item added to cart' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Remove from cart
router.delete('/cart/:cartId', async (req, res) => {
  try {
    await pool.query('DELETE FROM cart WHERE cart_id = ?', [req.params.cartId]);
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= REVIEWS =============

// Get product reviews
router.get('/reviews/product/:productId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT r.*, u.full_name FROM reviews r JOIN users u ON r.user_id = u.user_id WHERE r.product_id = ? ORDER BY r.created_at DESC',
      [req.params.productId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create review
router.post('/reviews', async (req, res) => {
  const { product_id, user_id, rating, comment } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
      [product_id, user_id, rating, comment]
    );
    res.status(201).json({ message: 'Review created', review_id: result.insertId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
