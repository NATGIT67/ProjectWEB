// API Client for Frontend
class APIClient {
  constructor(baseURL = '/api') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  // Set token
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // Get token
  getToken() {
    return this.token;
  }

  // Clear token
  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Headers with token
  getHeaders(contentType = 'application/json') {
    const headers = {};

    // For FormData, let browser set Content-Type
    if (contentType !== 'multipart/form-data') {
      headers['Content-Type'] = contentType;
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic fetch method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    // Determine content type
    let contentType = 'application/json';
    if (options.body instanceof FormData) {
      contentType = 'multipart/form-data';
    } else if (options.contentType) {
      contentType = options.contentType;
    }

    const config = {
      ...options,
      headers: this.getHeaders(contentType),
    };

    try {
      const response = await fetch(url, config);
      const text = await response.text();

      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (err) {
        console.error('Invalid JSON response:', text);
        throw new Error('Server error (Invalid JSON): ' + text.substring(0, 100));
      }

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred: ' + response.status);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error.message);
      throw error;
    }
  }

  // ============= AUTH =============

  async register(username, email, password, fullName = '', phone = '') {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, full_name: fullName, phone }),
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me', {
      method: 'GET',
    });
  }

  // ============= PRODUCTS =============

  async getProducts() {
    return this.request('/products', {
      method: 'GET',
    });
  }

  async getProduct(productId) {
    return this.request(`/products/${productId}`, {
      method: 'GET',
    });
  }

  async createProduct(productName, description, category, price, stock, imageUrl = '') {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify({ product_name: productName, description, category, price, stock, image_url: imageUrl }),
    });
  }

  async updateProduct(productId, productName, description, category, price, stock, imageUrl) {
    return this.request(`/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ product_name: productName, description, category, price, stock, image_url: imageUrl }),
    });
  }

  async deleteProduct(productId) {
    return this.request(`/products/${productId}`, {
      method: 'DELETE',
    });
  }

  // ============= CART =============

  async getCart() {
    return this.request('/cart', {
      method: 'GET',
    });
  }

  async addToCart(productId, quantity) {
    return this.request('/cart', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  }

  async updateCartItem(cartId, quantity) {
    return this.request(`/cart/${cartId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(cartId) {
    return this.request(`/cart/${cartId}`, {
      method: 'DELETE',
    });
  }

  // ============= ORDERS =============

  async getOrders() {
    return this.request('/orders', {
      method: 'GET',
    });
  }

  async getOrder(orderId) {
    return this.request(`/orders/${orderId}`, {
      method: 'GET',
    });
  }

  async createOrder(shippingAddress, paymentSlip = null, paymentType = 'full') {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify({
        shipping_address: shippingAddress,
        payment_slip: paymentSlip,
        payment_type: paymentType
      }),
    });
  }

  // ============= REVIEWS =============

  async getReviews(productId) {
    return this.request(`/reviews/product/${productId}`, {
      method: 'GET',
    });
  }

  async createReview(productId, rating, comment = '') {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, rating, comment }),
    });
  }

  // ============= PROFILE =============

  // ============= PROFILE =============

  async updateProfile(data) {
    // Check if data is FormData
    const isFormData = data instanceof FormData;

    return this.request('/profile', {
      method: 'PUT',
      body: isFormData ? data : JSON.stringify(data),
      contentType: isFormData ? 'multipart/form-data' : 'application/json'
    });
  }

  // ============= ADMIN =============

  async getAdminOrders() {
    return this.request('/admin/orders', {
      method: 'GET',
    });
  }

  async updateOrderStatus(orderId, status, remark = null) {
    return this.request(`/admin/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({ status, remark }),
    });
  }

  async deleteOrder(orderId) {
    return this.request(`/admin/orders/${orderId}`, {
      method: 'DELETE',
    });
  }

  async getAdminUsers() {
    return this.request('/admin/users', {
      method: 'GET',
    });
  }

  async updateUserRole(userId, role) {
    return this.request(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  async deleteUser(userId) {
    return this.request(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async getReports() {
    return this.request('/admin/reports', {
      method: 'GET',
    });
  }

  async getStats() {
    return this.request('/admin/stats', { method: 'GET' });
  }

  async sendReport(data) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// Create global instance
const api = new APIClient();
