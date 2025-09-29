# Render Backend 502 Error - COMPLETE FIX

## 🚨 Current Status
- ✅ **Admin Panel**: https://eloska-admin.onrender.com (Working)
- ✅ **Website**: https://eloska.onrender.com (Working)
- ❌ **Backend**: https://eloska-backend.onrender.com (502 Bad Gateway)

## 🔧 Backend 502 Error Fix

### 1. Check Render Backend Service
1. Go to your Render dashboard
2. Find your backend service (eloska-backend)
3. Check the **Logs** tab for error messages
4. Look for these common issues:

### 2. Common 502 Causes & Fixes

#### A. Environment Variables Missing
Make sure these are set in your Render backend service:

```env
# Server Configuration
NODE_ENV=production
PORT=10000

# MongoDB (use MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eloska-admin

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=keyur9637@gmail.com
SMTP_PASS=oyvytxxvjhaliphq

# Admin Configuration
ADMIN_EMAIL=admin@eloska.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=Eloska Admin

# Email Recipient
NOTIFICATION_EMAIL=keyur9637@gmail.com

# CORS Configuration
FRONTEND_URL=https://eloska.onrender.com
CLIENT_URL=https://eloska.onrender.com
ADMIN_CLIENT_URL=https://eloska-admin.onrender.com
ALLOWED_ORIGINS=https://eloska.onrender.com,https://eloska-admin.onrender.com

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRES_IN=7d
```

#### B. Build Command Issues
Make sure your build settings are:
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Node Version**: 18.x or 20.x

#### C. File Structure Issues
Ensure your backend files are in the correct location:
```
backend/
├── server.js
├── package.json
├── .env
├── models/
├── routes/
├── services/
└── middleware/
```

### 3. Update CORS for Production URLs

Update your backend server.js to include your production URLs:

```javascript
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:8084',
  process.env.CLIENT_URL || 'http://localhost:8084',
  process.env.ADMIN_CLIENT_URL || 'http://localhost:3003',
  'https://eloska.onrender.com',
  'https://eloska-admin.onrender.com',
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:3000'
];

if (process.env.ALLOWED_ORIGINS) {
  const additionalOrigins = process.env.ALLOWED_ORIGINS.split(',');
  allowedOrigins.push(...additionalOrigins);
}

if (process.env.NODE_ENV === 'production') {
  allowedOrigins.push(
    'https://*.render.com',
    'https://*.vercel.app',
    'https://*.netlify.app'
  );
}
```

### 4. Update Admin Panel Environment

In your admin panel Render service, set:
```env
VITE_API_BASE_URL=https://eloska-backend.onrender.com/api
```

### 5. Update Website Environment

In your website Render service, set:
```env
VITE_API_BASE_URL=https://eloska-backend.onrender.com
```

## 🧪 Testing Steps

### 1. Test Backend Health
```bash
curl https://eloska-backend.onrender.com/api/health
```

### 2. Test Admin Login
```bash
curl -X POST https://eloska-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@eloska.com","password":"admin123"}'
```

### 3. Test Website Connection
1. Go to https://eloska.onrender.com
2. Try to submit an inquiry
3. Check if it reaches the backend

## 🔍 Debugging Steps

### 1. Check Render Logs
1. Go to Render dashboard
2. Select your backend service
3. Click "Logs" tab
4. Look for error messages

### 2. Common Error Messages
- **"Cannot find module"**: Missing dependencies
- **"Port already in use"**: Wrong PORT environment variable
- **"MongoDB connection failed"**: Wrong MONGODB_URI
- **"Email configuration not found"**: Missing SMTP variables

### 3. Restart Service
1. Go to your backend service in Render
2. Click "Manual Deploy" → "Deploy latest commit"
3. Wait for deployment to complete

## ✅ Expected Results

After fixing:
- ✅ Backend health check: `https://eloska-backend.onrender.com/api/health`
- ✅ Admin login: `https://eloska-admin.onrender.com` (admin@eloska.com / admin123)
- ✅ Website inquiries: `https://eloska.onrender.com`
- ✅ Email notifications: Sent to keyur9637@gmail.com

## 🚀 Quick Fix Checklist

1. ✅ Check Render backend logs
2. ✅ Verify environment variables
3. ✅ Update CORS origins
4. ✅ Update admin panel API URL
5. ✅ Update website API URL
6. ✅ Restart backend service
7. ✅ Test all endpoints

Your backend should work perfectly after these fixes! 🎉
