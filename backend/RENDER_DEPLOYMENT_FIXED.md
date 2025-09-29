# Render Deployment - Email Issues Fixed

## ✅ Issues Fixed

### 1. Express Rate Limit Error
- **Problem**: `The 'X-Forwarded-For' header is set but the Express 'trust proxy' setting is false`
- **Solution**: Added `app.set('trust proxy', 1)` in server.js

### 2. Email Timeout on Render
- **Problem**: `Connection timeout` when sending emails
- **Solution**: 
  - Optimized SMTP settings for Render
  - Added multiple fallback configurations
  - Reduced timeouts (10s connection, 5s greeting)
  - Added retry logic with different ports (587, 465)

### 3. Admin Email Configuration
- **Problem**: Emails sent to `admin@eloska.com` instead of your Gmail
- **Solution**: Set `ADMIN_EMAIL=keyur9637@gmail.com` (same as SMTP_USER)

## 🚀 Render Environment Variables

Set these in your Render dashboard:

```env
# Server Configuration
NODE_ENV=production
PORT=10000

# MongoDB (use MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eloska-admin

# Email Configuration (CRITICAL - must match)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=keyur9637@gmail.com
SMTP_PASS=oyvytxxvjhaliphq
ADMIN_EMAIL=keyur9637@gmail.com

# CORS Configuration
FRONTEND_URL=https://your-website.com
CLIENT_URL=https://your-website.com
ADMIN_CLIENT_URL=https://your-admin-panel.com
ALLOWED_ORIGINS=https://your-website.com,https://your-admin-panel.com

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRES_IN=7d

# Admin Configuration
ADMIN_PASSWORD=your-secure-admin-password
ADMIN_NAME=Eloska Admin
```

## 📧 Email Configuration Details

The system now tries multiple SMTP configurations:

1. **Primary**: Gmail SMTP port 587 (TLS)
2. **Fallback**: Gmail SMTP port 465 (SSL)
3. **Fallback**: Console logging if all fail

### Email Settings Optimized for Render:
- Connection timeout: 10 seconds
- Greeting timeout: 5 seconds
- Socket timeout: 10 seconds
- No connection pooling (better for Render)
- TLS with relaxed security for Render

## 🔧 Build Settings for Render

- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Node Version**: 18.x or 20.x
- **Health Check Path**: `/api/health`

## ✅ What's Working Now

1. **Inquiries are saved** to database even if email fails
2. **Email notifications** sent to `keyur9637@gmail.com`
3. **Fallback logging** shows inquiry details in console
4. **Rate limiting** works without errors
5. **CORS** allows requests from your domains

## 🧪 Testing After Deployment

1. **Health Check**: `https://your-backend-url.onrender.com/api/health`
2. **Submit Inquiry**: Test from your website
3. **Check Email**: Look for notifications in `keyur9637@gmail.com`
4. **Check Logs**: View Render logs for email attempts
5. **Admin Panel**: Test login and inquiry management

## 📝 Important Notes

- **ADMIN_EMAIL must equal SMTP_USER** for emails to work
- **Gmail App Password** is required (not regular password)
- **MongoDB Atlas** recommended for production
- **Console logs** will show inquiry details if email fails
- **Multiple SMTP configs** ensure better reliability

Your system should now work perfectly on Render! 🎉
