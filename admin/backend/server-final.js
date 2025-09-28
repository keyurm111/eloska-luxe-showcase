const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5004;

// Trust proxy for Render - MUST be set before any middleware
app.set('trust proxy', true);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:5173',
      'http://localhost:8080',
      'http://localhost:8081',
      'http://localhost:8082',
      'http://localhost:8083',
      'https://eloska-luxe-showcase.onrender.com',
      'https://eloska-admin.onrender.com'
    ];
    
    console.log('🌐 CORS Request from origin:', origin);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('✅ CORS: Origin allowed');
      callback(null, true);
    } else {
      console.log('❌ CORS: Origin blocked:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const origin = req.headers.origin;
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  res.status(200).json({
    success: true,
    status: 'OK',
    message: 'Eloska Backend API is running on Render',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    uptime: process.uptime(),
    port: PORT,
    trustProxy: app.get('trust proxy')
  });
});

// Verify token endpoint
app.get('/api/auth/verify', (req, res) => {
  try {
    const origin = req.headers.origin;
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      console.log('✅ Token verification successful');
      res.json({
        success: true,
        message: 'Token is valid',
        data: {
          admin: {
            id: 'admin-123',
            name: 'Eloska Admin',
            email: 'admin@eloska.com',
            role: 'admin'
          }
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  try {
    const origin = req.headers.origin;
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password: password ? '***' : 'undefined' });
    
    // Hardcoded admin credentials for testing
    if (email === 'admin@eloska.com' && password === 'admin123') {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiYWRtaW4tMTIzIiwiZW1haWwiOiJhZG1pbkBlbG9za2EuY29tIiwiaWF0IjoxNzU5MDcyMDAwLCJleHAiOjE3NTk2NzY4MDB9.test-token';
      
      console.log('✅ Login successful for:', email);
      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token: token,
          admin: {
            id: 'admin-123',
            name: 'Eloska Admin',
            email: 'admin@eloska.com',
            role: 'admin'
          }
        }
      });
    } else {
      console.log('❌ Login failed: Invalid credentials for:', email);
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Product inquiries endpoint
app.post('/api/product-inquiries/submit', (req, res) => {
  try {
    const origin = req.headers.origin;
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    console.log('Product inquiry received:', req.body);
    
    res.status(201).json({
      success: true,
      message: 'Product inquiry submitted successfully',
      data: {
        id: 'inquiry-' + Date.now(),
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Product inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Normal inquiries endpoint
app.post('/api/normal-inquiries/submit', (req, res) => {
  try {
    const origin = req.headers.origin;
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    console.log('Normal inquiry received:', req.body);
    
    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      data: {
        id: 'inquiry-' + Date.now(),
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Normal inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Newsletter endpoint
app.post('/api/newsletter/subscribe', (req, res) => {
  try {
    const origin = req.headers.origin;
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    console.log('Newsletter subscription received:', req.body);
    
    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter'
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Eloska Backend API - Final Render Version',
    version: '1.0.0',
    environment: 'production',
    trustProxy: app.get('trust proxy'),
    endpoints: {
      health: '/api/health',
      login: '/api/auth/login',
      verify: '/api/auth/verify',
      productInquiries: '/api/product-inquiries/submit',
      normalInquiries: '/api/normal-inquiries/submit',
      newsletter: '/api/newsletter/subscribe'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Final Render Server running on port ${PORT}`);
  console.log(`🔗 Health check: https://eloska-backend.onrender.com/api/health`);
  console.log(`🔐 Login test: https://eloska-backend.onrender.com/api/auth/login`);
  console.log(`🌐 CORS enabled for: https://eloska-admin.onrender.com`);
  console.log(`📧 Login credentials: admin@eloska.com / admin123`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`🔒 Trust proxy: ${app.get('trust proxy')}`);
});
