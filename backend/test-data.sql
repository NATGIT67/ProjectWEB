-- Insert sample data for testing

-- Insert sample users (password: test123)
INSERT INTO users (username, email, password, full_name, phone) VALUES 
('demo_user', 'demo@example.com', '$2a$10$5K4xhLCHI6KxD4s/Q4rI5ORJhKcKR6j5v5v5v5v5v5v5v5v5v', 'Demo User', '0812345678'),
('john_farmer', 'john@example.com', '$2a$10$5K4xhLCHI6KxD4s/Q4rI5ORJhKcKR6j5v5v5v5v5v5v5v5v5v', 'John Farmer', '0898765432');

-- Insert sample categories
INSERT INTO categories (category_name, description) VALUES 
('ข้าวหอม', 'ข้าวหอมไทยแท้'),
('ข้าวเหนียว', 'ข้าวเหนียวสำหรับอีสาน'),
('ข้าวกล้อง', 'ข้าวกล้องเพื่อสุขภาพ');

-- Insert sample products
INSERT INTO products (product_name, description, category, price, stock, image_url) VALUES 
('ข้าวหอมมะลิ 5 กิโลกรัม', 'ข้าวหอมไทยแท้ชั้นดี', 'ข้าวหอม', 250.00, 100, '/images/rice-jasmine.jpg'),
('ข้าวเหนียวลาวสูง 5 กิโลกรัม', 'ข้าวเหนียวคุณภาพสูง', 'ข้าวเหนียว', 200.00, 80, '/images/rice-sticky.jpg'),
('ข้าวกล้องอุดมสมบูรณ์ 5 กิโลกรัม', 'ข้าวกล้องหลาย 5 กิโลกรัม', 'ข้าวกล้อง', 180.00, 60, '/images/rice-brown.jpg'),
('ข้าวหอมขาว 10 กิโลกรัม', 'ข้าวหอมเม่าแพค', 'ข้าวหอม', 450.00, 50, '/images/rice-jasmine-10.jpg'),
('ข้าวเหนียวม่วง 5 กิโลกรัม', 'ข้าวเหนียวม่วงแท้เลือด', 'ข้าวเหนียว', 280.00, 40, '/images/rice-purple.jpg');

-- Insert sample reviews
INSERT INTO reviews (product_id, user_id, rating, comment) VALUES 
(1, 1, 5, 'ข้าวเม่าหอม อร่อย แนะนำ'),
(1, 2, 4, 'ดีค่อยข้างมากแต่รอค่อยข้างเหมือนมากเหมือนกว่าก่อน'),
(3, 1, 5, 'ข้าวกล้องสดใจ สำหรับดูแลสุขภาพ'),
(2, 2, 5, 'เหนียวเล่อ ดีที่สุด');

-- Insert sample cart items
INSERT INTO cart (user_id, product_id, quantity) VALUES 
(1, 1, 2),
(1, 3, 1);

-- Insert sample orders
INSERT INTO orders (user_id, total_price, shipping_address, status) VALUES 
(1, 700.00, '123 ซอย สุขสวัสดิ์ กรุงเทพ', 'delivered'),
(2, 1000.00, '456 ซอย จตุจักร กรุงเทพ', 'shipped');

-- Insert sample order items
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES 
(1, 1, 2, 250.00),
(1, 3, 1, 180.00),
(2, 2, 4, 200.00),
(2, 4, 1, 450.00);
