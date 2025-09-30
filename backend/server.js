const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5004;

// Trust proxy for production (Render, Heroku, etc.)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(compression()); // Enable gzip compression
// Configure CORS with environment variables
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3001',
  process.env.CLIENT_URL || 'http://localhost:8084',
  process.env.ADMIN_CLIENT_URL || 'http://localhost:3003',
  'http://localhost:3002', // Admin panel port 3002
  'https://eloska.onrender.com',
  'https://eloska-admin.onrender.com',
  'http://localhost:5173', // Vite dev server (main website)
  'http://localhost:8080', // Alternative Vite dev server port
  'http://localhost:8083', // Client website port 8083
  'http://localhost:3000'  // Alternative React dev server
];

// Add additional origins from environment variable if provided
if (process.env.ALLOWED_ORIGINS) {
  const additionalOrigins = process.env.ALLOWED_ORIGINS.split(',');
  allowedOrigins.push(...additionalOrigins);
}

// Add production URLs if they exist
if (process.env.NODE_ENV === 'production') {
  // Add common production patterns
  allowedOrigins.push(
    'https://*.render.com',
    'https://*.vercel.app',
    'https://*.netlify.app'
  );
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Rate limiting - more lenient for development
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // 1000 requests in dev, 100 in prod
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// More lenient rate limiting for admin panel
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 200 : 2000, // 2000 requests in dev, 200 in prod
  message: 'Too many admin requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply different rate limits to different routes
app.use('/api/products', adminLimiter);
app.use('/api/categories', adminLimiter);
app.use('/api/', generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory with CORS headers
app.use('/uploads', (req, res, next) => {
  // Set CORS headers for static files
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  // Remove restrictive CORS policy headers
  res.removeHeader('Cross-Origin-Resource-Policy');
  res.removeHeader('Cross-Origin-Opener-Policy');
  next();
}, express.static('uploads'));

// Performance monitoring middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 1000) { // Log slow requests (>1s)
      console.log(`🐌 Slow request: ${req.method} ${req.path} - ${duration}ms`);
    } else if (duration > 500) { // Log medium requests (>500ms)
      console.log(`⚡ Request: ${req.method} ${req.path} - ${duration}ms`);
    }
  });
  next();
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eloska-admin')
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/product-inquiries', require('./routes/productInquiries'));
app.use('/api/normal-inquiries', require('./routes/normalInquiries'));
app.use('/api/newsletter', require('./routes/newsletter'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Test email endpoint
app.post('/api/test-email', async (req, res) => {
  try {
    const emailService = require('./services/emailService');
    const result = await emailService.testEmailConfiguration();
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Test email sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send test email',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Test email failed',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Admin panel: http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
