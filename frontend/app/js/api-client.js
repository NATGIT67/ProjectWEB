// API Client for Frontend
class APIClient {
  constructor(baseURL = 'http://localhost:5000/api') {
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
    const headers = {
      'Content-Type': contentType,
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic fetch method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: this.getHeaders(options.contentType || 'application/json'),
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred');
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

  async createOrder(shippingAddress) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify({ shipping_address: shippingAddress }),
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

  async updateProfile(fullName, phone, address) {
    return this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify({ full_name: fullName, phone, address }),
    });
  }

  // ============= ADMIN =============

  async getAdminOrders() {
    return this.request('/admin/orders', {
      method: 'GET',
    });
  }

  async updateOrderStatus(orderId, status) {
    return this.request(`/admin/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async getAdminUsers() {
    return this.request('/admin/users', {
      method: 'GET',
    });
  }
}

// Create global instance
const api = new APIClient();
