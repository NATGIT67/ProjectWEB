# EasyRice Admin Access - Setup Complete ✅

## What Was Fixed

### 1. Database Schema Issue ✅
- **Problem**: Users table didn't have a 'role' column
- **Solution**: Added 'role' column to users table with default value 'user'
- **Status**: Admin user (ID 6, admin@easyrice.com) now has role='admin'

### 2. Authentication Backend ✅
- **Problem**: JWT tokens hardcoded role='user' for all users
- **Solution**: Updated auth.js to read role from database for each user
  - Register: Reads role from database after user creation
  - Login: Queries role from database and includes in JWT
  - /auth/me: Returns user data including role field

### 3. Frontend Session Management ✅
- **Updated sign-in.html**: Decodes JWT token and stores role in localStorage
- **Updated sign-up.html**: Sets default role='user' in localStorage  
- **Updated easyrice.js navbar**: 
  - Shows "Admin" link in red only for users with role='admin'
  - Hides admin link for regular users
  - Logout clears role field

### 4. Vercel Configuration ✅
- Created `vercel.json` for proper Vercel deployment
- Created `.env.production` template for production database setup

## How to Access Admin Panel

### Method 1: Via Navbar (Recommended)
1. Login with admin account:
   - Email: `admin@easyrice.com`
   - Password: `Admin@1234`
2. After login, click the red **Admin** link in navbar (appears next to Profile)
3. This opens the admin dashboard at `/pages/admin.html`

### Method 2: Direct URL
1. Make sure you're logged in as admin
2. Navigate to: `http://localhost:5000/pages/admin.html`
3. The page will verify your role and grant access

## Test Credentials

### Admin Account
- **Email**: admin@easyrice.com
- **Password**: Admin@1234
- **Role**: admin

### Regular User (for testing)
- Create new account via sign-up page
- Will have role='user' by default
- Cannot access admin panel

## Technical Details

### JWT Token Structure (Admin)
```
Header: {alg: "HS256", typ: "JWT"}
Payload: {
  user_id: 6,
  username: "admin",
  email: "admin@easyrice.com",
  role: "admin",  // ← Now includes role
  iat: 1770374382,
  exp: 1772966382
}
```

### Admin Verification Flow
1. User clicks "Admin" link in navbar
2. admin.html loads and calls `GET /api/auth/me`
3. Backend returns user data including role='admin'
4. JavaScript checks: `if (user.role === 'admin')`
5. If admin → Show dashboard
6. If not admin → Redirect to home

### Admin API Endpoints (Protected)
All these endpoints require role='admin':
- `GET /api/admin/users` - List all users
- `GET /api/admin/orders` - View all orders
- `POST /api/products` - Add new product
- `PUT /api/products/:id` - Edit product
- `DELETE /api/products/:id` - Delete product

## Troubleshooting

### "Admin link not showing in navbar?"
1. Clear browser localStorage: Press F12 → Application → Clear all
2. Login again with admin account
3. Check that `role: "admin"` is in localStorage
4. F5 to refresh page

### "Cannot access admin page?"
1. Verify you're logged in: Check localStorage for `is_logged_in: "true"`
2. Check role value: It should be `"admin"` not `"user"`
3. Check JWT token by decoding it on jwt.io
4. Look at browser console for errors (F12)

### "Admin API returns 403 Forbidden?"
1. The backend is correctly rejecting non-admin access
2. Verify your JWT token includes role='admin'
3. Check Authorization header format: `Bearer <token>`

## Next Steps for Production

### Before Deploying to Vercel:
1. Set up production database (PlanetScale, Supabase, or Railway MySQL)
2. Update environment variables in Vercel Dashboard:
   - DB_HOST (production database host)
   - DB_USER (production database user)
   - DB_PASSWORD (production database password)
   - JWT_SECRET (new random string for production)
3. Create admin account on production database
4. Test admin access on Vercel deployment
5. Update frontend API URLs if using custom domain

### Create Admin on Production:
```bash
curl -X POST https://your-domain.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@yourcompany.com",
    "password": "SecurePassword123",
    "full_name": "Admin User",
    "phone": "0800000000"
  }'
```

Then promote to admin via database:
```sql
UPDATE users SET role='admin' WHERE email='admin@yourcompany.com';
```

## Files Modified

1. **backend/routes/auth.js**
   - Register: Read role from database
   - Login: Include role in JWT
   - /auth/me: Return role in response

2. **backend/setup-admin-role.js** (New)
   - Added role column to users table
   - Promoted admin@easyrice.com to admin role

3. **frontend/app/pages/sign-in.html**
   - Decode JWT and extract role field
   - Save role to localStorage

4. **frontend/app/pages/sign-up.html**
   - Set default role='user' in localStorage

5. **frontend/app/js/easyrice.js**
   - Check role and show admin link only for admins
   - Clear role on logout

6. **vercel.json** (New)
   - Configure Vercel deployment

7. **.env.production** (New)
   - Template for production environment variables

## Status Summary

✅ Admin role system working
✅ Database schema updated
✅ JWT tokens include role
✅ Frontend displays admin link
✅ Admin API endpoints protected
✅ Vercel configuration created
⏳ Production database setup needed (user's responsibility)

Last Updated: 2026-02-06
