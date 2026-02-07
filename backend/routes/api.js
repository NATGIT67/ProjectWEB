// Protected routes ที่ต้อง login ก่อน
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const { validatePrice, validateRating } = require('../utils/validators');

// ============= PRODUCTS (Public - Read Only) =============

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

// ============= PRODUCTS (Admin Only) =============

// Create product (Admin)
router.post('/products', verifyToken, verifyAdmin, async (req, res) => {
  const { product_name, description, category, price, stock, image_url } = req.body;

  if (!product_name || !price || !stock) {
    return res.status(400).json({ error: 'Product name, price, and stock required' });
  }

  if (!validatePrice(price)) {
    return res.status(400).json({ error: 'Invalid price' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO products (product_name, description, category, price, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [product_name, description || null, category || null, price, stock, image_url || null]
    );
    res.status(201).json({ message: 'Product created', product_id: result.insertId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update product (Admin)
router.put('/products/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { product_name, description, category, price, stock, image_url } = req.body;

  try {
    await pool.query(
      'UPDATE products SET product_name = ?, description = ?, category = ?, price = ?, stock = ?, image_url = ? WHERE product_id = ?',
      [product_name, description, category, price, stock, image_url, req.params.id]
    );
    res.json({ message: 'Product updated' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete product (Admin)
router.delete('/products/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE product_id = ?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= CART (Protected) =============

// Get user cart
router.get('/cart', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT c.*, p.product_name, p.price, p.image_url FROM cart c JOIN products p ON c.product_id = p.product_id WHERE c.user_id = ?',
      [req.user.user_id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add to cart
router.post('/cart', verifyToken, async (req, res) => {
  const { product_id, quantity } = req.body;

  if (!product_id || !quantity) {
    return res.status(400).json({ error: 'Product ID and quantity required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?',
      [req.user.user_id, product_id, quantity, quantity]
    );
    res.status(201).json({ message: 'Item added to cart' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update cart item
router.put('/cart/:cartId', verifyToken, async (req, res) => {
  const { quantity } = req.body;

  if (!quantity) {
    return res.status(400).json({ error: 'Quantity required' });
  }

  try {
    await pool.query('UPDATE cart SET quantity = ? WHERE cart_id = ? AND user_id = ?', [quantity, req.params.cartId, req.user.user_id]);
    res.json({ message: 'Cart updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove from cart
router.delete('/cart/:cartId', verifyToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM cart WHERE cart_id = ? AND user_id = ?', [req.params.cartId, req.user.user_id]);
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= ORDERS (Protected) =============

// Get user orders
router.get('/orders', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC',
      [req.user.user_id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order details
router.get('/orders/:orderId', verifyToken, async (req, res) => {
  try {
    const [order] = await pool.query(
      'SELECT * FROM orders WHERE order_id = ? AND user_id = ?',
      [req.params.orderId, req.user.user_id]
    );

    if (order.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const [items] = await pool.query(
      'SELECT oi.*, p.product_name, p.image_url FROM order_items oi JOIN products p ON oi.product_id = p.product_id WHERE oi.order_id = ?',
      [req.params.orderId]
    );

    res.json({ ...order[0], items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create order from cart
router.post('/orders', verifyToken, async (req, res) => {
  const { shipping_address } = req.body;

  if (!shipping_address) {
    return res.status(400).json({ error: 'Shipping address required' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Get cart items
    const [cartItems] = await connection.query(
      'SELECT c.*, p.price FROM cart c JOIN products p ON c.product_id = p.product_id WHERE c.user_id = ?',
      [req.user.user_id]
    );

    if (cartItems.length === 0) {
      await connection.rollback();
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate total price
    const total_price = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create order
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total_price, shipping_address) VALUES (?, ?, ?)',
      [req.user.user_id, total_price, shipping_address]
    );

    const order_id = orderResult.insertId;

    // Insert order items and update stock
    for (const item of cartItems) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [order_id, item.product_id, item.quantity, item.price]
      );

      await connection.query(
        'UPDATE products SET stock = stock - ? WHERE product_id = ?',
        [item.quantity, item.product_id]
      );
    }

    // Clear cart
    await connection.query('DELETE FROM cart WHERE user_id = ?', [req.user.user_id]);

    await connection.commit();
    res.status(201).json({ message: 'Order created', order_id });
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ error: error.message });
  } finally {
    connection.release();
  }
});

// ============= REVIEWS (Protected) =============

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
router.post('/reviews', verifyToken, async (req, res) => {
  const { product_id, rating, comment } = req.body;

  if (!product_id || !rating) {
    return res.status(400).json({ error: 'Product ID and rating required' });
  }

  if (!validateRating(rating)) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
      [product_id, req.user.user_id, rating, comment || null]
    );
    res.status(201).json({ message: 'Review created', review_id: result.insertId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============= USER PROFILE (Protected) =============

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  const { full_name, phone, address } = req.body;

  try {
    await pool.query(
      'UPDATE users SET full_name = ?, phone = ?, address = ? WHERE user_id = ?',
      [full_name || null, phone || null, address || null, req.user.user_id]
    );
    res.json({ message: 'Profile updated' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============= ADMIN ROUTES =============

// Get all orders (Admin)
router.get('/admin/orders', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT o.*, u.full_name, u.email FROM orders o JOIN users u ON o.user_id = u.user_id ORDER BY o.order_date DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users (Admin)
router.get('/admin/users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT user_id, username, email, phone, full_name, role, created_at FROM users ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user role (Admin)
router.put('/admin/users/:id/role', verifyToken, verifyAdmin, async (req, res) => {
  const { role } = req.body;

  if (!role || !['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    await pool.query('UPDATE users SET role = ? WHERE user_id = ?', [role, req.params.id]);
    res.json({ message: 'User role updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
