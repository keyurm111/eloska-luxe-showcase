# Eloska Admin Backend API

Backend API server for the Eloska Admin Panel with MongoDB integration.

## Features

- **Authentication**: JWT-based admin authentication
- **Product Inquiries**: CRUD operations for product inquiries
- **Normal Inquiries**: CRUD operations for general inquiries
- **Newsletter Management**: Subscriber management and email sending
- **Dashboard**: Statistics and analytics
- **Export**: CSV export functionality
- **Security**: Rate limiting, input validation, CORS protection

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Nodemailer** - Email service
- **Express Validator** - Input validation
- **Helmet** - Security headers
- **Rate Limiting** - API protection

## Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. **Navigate to backend directory**
   ```bash
   cd admin/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp env.example .env
   ```

4. **Configure environment variables**
   ```bash
   # Edit .env file with your configuration
   MONGODB_URI=mongodb://localhost:27017/eloska-admin
   JWT_SECRET=your-super-secret-jwt-key
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

6. **Server will run on**
   ```
   http://localhost:5000
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/verify` - Verify token
- `POST /api/auth/register` - Register admin (initial setup)

### Product Inquiries
- `GET /api/product-inquiries` - Get all inquiries (paginated)
- `GET /api/product-inquiries/:id` - Get single inquiry
- `PATCH /api/product-inquiries/:id/status` - Update status
- `DELETE /api/product-inquiries/:id` - Delete inquiry
- `GET /api/product-inquiries/export` - Export to CSV

### Normal Inquiries
- `GET /api/normal-inquiries` - Get all inquiries (paginated)
- `GET /api/normal-inquiries/:id` - Get single inquiry
- `PATCH /api/normal-inquiries/:id/status` - Update status
- `DELETE /api/normal-inquiries/:id` - Delete inquiry
- `GET /api/normal-inquiries/export` - Export to CSV

### Newsletter
- `GET /api/newsletter` - Get all subscribers (paginated)
- `GET /api/newsletter/:id` - Get single subscriber
- `PATCH /api/newsletter/:id/status` - Update status
- `PATCH /api/newsletter/bulk-update` - Bulk update
- `DELETE /api/newsletter/:id` - Delete subscriber
- `POST /api/newsletter/send` - Send newsletter
- `GET /api/newsletter/export` - Export to CSV

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Health Check
- `GET /api/health` - Server health status

## Database Models

### ProductInquiry
```javascript
{
  name: String,
  email: String,
  phone: String,
  company: String,
  productName: String,
  productCode: String,
  category: String,
  subcategory: String,
  quantity: Number,
  message: String,
  status: String, // pending, processing, completed, cancelled
  adminNotes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### NormalInquiry
```javascript
{
  name: String,
  email: String,
  phone: String,
  company: String,
  subject: String,
  message: String,
  status: String, // pending, processing, completed, cancelled
  adminNotes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### NewsletterEmail
```javascript
{
  email: String,
  status: String, // active, unsubscribed, bounced
  subscribedAt: Date,
  unsubscribedAt: Date,
  source: String, // website, admin, import
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Admin
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  role: String, // admin, super_admin
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Query Parameters

### Pagination
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

### Filtering
- `status` - Filter by status
- `category` - Filter by category (product inquiries)
- `search` - Text search

### Sorting
- Default: Created date (newest first)
- Text search uses MongoDB text index

## Security Features

### Rate Limiting
- 100 requests per 15 minutes per IP
- Applied to all API routes

### Input Validation
- Express Validator for all inputs
- Sanitization and validation
- Error handling

### Authentication
- JWT tokens
- Password hashing with bcrypt
- Token expiration
- Protected routes

### CORS
- Configured for frontend URL
- Credentials enabled

### Security Headers
- Helmet.js for security headers
- XSS protection
- Content Security Policy

## Email Configuration

### SMTP Setup
```javascript
{
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
}
```

### Gmail Setup
1. Enable 2-factor authentication
2. Generate app password
3. Use app password in SMTP_PASS

## Initial Setup

### Create Admin User
```bash
# Register first admin user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@eloska.com",
    "password": "admin123",
    "role": "super_admin"
  }'
```

### Database Indexes
The following indexes are automatically created:
- Email fields for fast lookups
- Status fields for filtering
- Created date for sorting
- Text search indexes

## Error Handling

### Standard Error Response
```javascript
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors if any
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Available Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests
```

### Project Structure
```
backend/
├── models/         # MongoDB models
├── routes/         # API routes
├── middleware/     # Custom middleware
├── server.js       # Main server file
└── package.json    # Dependencies
```

## Deployment

### Environment Variables
Set the following in production:
- `NODE_ENV=production`
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Strong secret key
- `SMTP_*` - Email configuration

### MongoDB Atlas
1. Create MongoDB Atlas account
2. Create cluster
3. Get connection string
4. Update MONGODB_URI

### Server Deployment
1. Deploy to your preferred platform
2. Set environment variables
3. Ensure MongoDB is accessible
4. Configure domain and SSL

## Monitoring

### Health Check
- `GET /api/health` - Server status
- Returns uptime and timestamp

### Logging
- Console logging for errors
- Request/response logging
- Error stack traces

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

This project is proprietary to Eloska World.
