// EasyRice JavaScript Utilities
// This file contains common functions used across the website

// ============ SHOPPING CART ============
class ShoppingCart {
    static init() {
        this.loadCart();
    }

    static loadCart() {
        const saved = localStorage.getItem('easyrice_cart');
        return saved ? JSON.parse(saved) : [];
    }

    static saveCart(cart) {
        localStorage.setItem('easyrice_cart', JSON.stringify(cart));
    }

    static addToCart(product, quantity = 1) {
        const cart = this.loadCart();
        const existing = cart.find(item => item.id === product.id);
        
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({ ...product, quantity });
        }
        
        this.saveCart(cart);
        this.showNotification(`เพิ่ม ${product.name} ลงตะกร้าแล้ว`, 'success');
        return true;
    }

    static removeFromCart(productId) {
        const cart = this.loadCart();
        const filtered = cart.filter(item => item.id !== productId);
        this.saveCart(filtered);
        this.showNotification('ลบออกจากตะกร้าแล้ว', 'success');
        return filtered;
    }

    static updateQuantity(productId, quantity) {
        const cart = this.loadCart();
        const item = cart.find(i => i.id === productId);
        if (item) {
            item.quantity = quantity;
            if (quantity <= 0) {
                return this.removeFromCart(productId);
            }
        }
        this.saveCart(cart);
        return cart;
    }

    static getTotal() {
        return this.loadCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    static getCount() {
        return this.loadCart().reduce((sum, item) => sum + item.quantity, 0);
    }

    static showNotification(msg, type = 'info') {
        const div = document.createElement('div');
        div.textContent = msg;
        div.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 8px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 3000);
    }
}

// ============ FORM VALIDATION ============
class FormValidator {
    static email(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    static phone(phone) {
        return /^[0-9]{9,10}$/.test(phone.replace(/-/g, ''));
    }

    static validate(form) {
        const errors = [];
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                errors.push(`${input.getAttribute('name') || input.placeholder} ต้องกรอก`);
            }
            if (input.type === 'email' && input.value && !this.email(input.value)) {
                errors.push('อีเมลไม่ถูกต้อง');
            }
        });

        return errors;
    }

    static showErrors(errors) {
        if (errors.length === 0) return true;
        alert(errors.join('\n'));
        return false;
    }
}

// ============ CONFIRMATION DIALOG ============
function showConfirm(message, callback) {
    const div = document.createElement('div');
    div.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;

    div.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 12px; max-width: 400px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); text-align: center;">
            <p style="margin: 0 0 20px 0; font-size: 1.05rem; color: #333;">${message}</p>
            <div style="display: flex; gap: 10px;">
                <button id="confirmYes" style="flex: 1; padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">ยืนยัน</button>
                <button id="confirmNo" style="flex: 1; padding: 10px; background: #999; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">ยกเลิก</button>
            </div>
        </div>
    `;

    document.body.appendChild(div);

    document.getElementById('confirmYes').addEventListener('click', () => {
        document.body.removeChild(div);
        if (callback) callback(true);
    });

    document.getElementById('confirmNo').addEventListener('click', () => {
        document.body.removeChild(div);
        if (callback) callback(false);
    });
}

// ============ LOADING SPINNER ============
function showLoading(show = true) {
    let spinner = document.getElementById('loadingSpinner');
    if (!spinner) {
        spinner = document.createElement('div');
        spinner.id = 'loadingSpinner';
        spinner.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 9999;
        `;
        spinner.innerHTML = `
            <div style="
                width: 50px;
                height: 50px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #4CAF50;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            "></div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        document.body.appendChild(spinner);
    }
    spinner.style.display = show ? 'block' : 'none';
}

class EasyRiceUtils {
    static getCurrentUser() {
        return JSON.parse(localStorage.getItem('current_user'));
    }

    static isLoggedIn() {
        return this.getCurrentUser() !== null;
    }

    static logout() {
        localStorage.removeItem('current_user');
        window.location.href = 'sign-in.html';
    }

    static updateNavbar() {
        const user = this.getCurrentUser();
        const navbars = document.querySelectorAll('.navbar');

        navbars.forEach(navbar => {
            const signinBtn = navbar.querySelector('.btn-signin');
            const navUl = navbar.querySelector('nav ul');

            if (user) {
                // User is logged in
                if (signinBtn) {
                    signinBtn.outerHTML = `
                        <div class="user-profile">
                            <span>สวัสดี, ${user.fullname.split(' ')[0]}</span>
                            <button onclick="EasyRiceUtils.logout()" class="btn-signin" style="margin-left:10px;">ออกจากระบบ</button>
                        </div>
                    `;
                }

                // Add history link if not exists
                if (navUl && !navUl.innerHTML.includes('history.html')) {
                    const historyLi = document.createElement('li');
                    historyLi.innerHTML = '<a href="history.html">ประวัติ</a>';
                    navUl.appendChild(historyLi);
                }
            } else {
                // User not logged in
                if (!signinBtn) {
                    const container = navbar.querySelector('.container');
                    const signinLink = document.createElement('a');
                    signinLink.href = 'sign-in.html';
                    signinLink.className = 'btn-signin';
                    signinLink.textContent = 'เข้าสู่ระบบ';
                    container.appendChild(signinLink);
                }
            }
        });
    }

    static formatCurrency(amount) {
        return '฿' + amount.toLocaleString();
    }

    static formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH');
    }

    static showAlert(message, type = 'info') {
        // Create alert element
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;

        // Add styles
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            max-width: 400px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;

        // Set colors based on type
        switch(type) {
            case 'success':
                alertDiv.style.backgroundColor = '#4CAF50';
                break;
            case 'error':
                alertDiv.style.backgroundColor = '#f44336';
                break;
            case 'warning':
                alertDiv.style.backgroundColor = '#ff9800';
                break;
            default:
                alertDiv.style.backgroundColor = '#2196F3';
        }

        document.body.appendChild(alertDiv);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentElement) {
                alertDiv.remove();
            }
        }, 5000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    EasyRiceUtils.updateNavbar();
    
    // Update sign-in button based on login status
    updateSignInButton();
});

function updateSignInButton() {
    const isLoggedIn = localStorage.getItem('easyrice_logged_in');
    const isAdmin = localStorage.getItem('easyrice_admin_logged_in');
    const btn = document.querySelector('.btn-signin');
    
    if (!btn) return;
    
    if (isAdmin) {
        // Admin logged in - don't change navbar button for admin pages
        if (!window.location.pathname.includes('admin.html')) {
            btn.href = '#';
            btn.textContent = 'ออกจากระบบ';
            btn.style.background = '#ff5252';
            btn.style.color = 'white';
            btn.onclick = (e) => {
                e.preventDefault();
                localStorage.removeItem('easyrice_admin_logged_in');
                localStorage.removeItem('easyrice_admin_name');
                alert('ออกจากระบบแล้ว');
                location.href = 'index.html';
            };
        }
    } else if (isLoggedIn) {
        // User logged in
        btn.href = '#';
        btn.textContent = 'ออกจากระบบ';
        btn.style.background = '#ff5252';
        btn.style.color = 'white';
        btn.onclick = (e) => {
            e.preventDefault();
            localStorage.removeItem('easyrice_logged_in');
            localStorage.removeItem('current_user');
            localStorage.removeItem('easyrice_user_name');
            alert('ออกจากระบบแล้ว');
            location.href = 'index.html';
        };
    }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    ShoppingCart.init();
});