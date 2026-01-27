// EasyRice JavaScript Utilities
// This file contains common functions used across the website

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