# Render Deployment Guide

## Backend Deployment on Render

### 1. Environment Variables
Set these in your Render dashboard:

```env
NODE_ENV=production
PORT=10000

# MongoDB (use MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eloska-admin

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
ADMIN_EMAIL=your-email@gmail.com

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

### 2. Build Settings
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Node Version**: 18.x or 20.x

### 3. Health Check
- **Health Check Path**: `/api/health`

## Frontend Deployment

### Client Website
- Deploy to Vercel, Netlify, or any static hosting
- Set environment variable: `VITE_API_BASE_URL=https://your-backend-url.onrender.com`

### Admin Panel
- Deploy to Render, Vercel, or Netlify
- Set environment variable: `VITE_API_BASE_URL=https://your-backend-url.onrender.com/api`

## Common Issues Fixed

1. **Express Rate Limit Error**: Fixed with `app.set('trust proxy', 1)`
2. **Email Timeout**: Added connection timeouts and retry settings
3. **CORS Issues**: Added production URL patterns
4. **Email Failures**: Made email sending non-blocking

## Testing
After deployment, test:
1. Health check: `https://your-backend-url.onrender.com/api/health`
2. Submit inquiry from website
3. Check admin panel login
4. Verify email notifications
