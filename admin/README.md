# Eloska Admin Panel

A comprehensive admin panel for managing Eloska website inquiries and newsletter subscriptions.

## Features

### 📊 Dashboard
- Overview statistics
- Recent inquiries display
- Quick action buttons
- Real-time data visualization

### 📝 Product Inquiries Management
- View all product inquiries
- Filter by status, category, date
- Update inquiry status
- Add admin notes
- Export data to CSV
- Detailed inquiry view

### 💬 Normal Inquiries Management
- General inquiry management
- Status tracking
- Search and filter functionality
- Bulk operations
- Export capabilities

### 📧 Newsletter Management
- Subscriber management
- Status tracking (Active, Unsubscribed, Bounced)
- Bulk operations
- Newsletter sending
- Export subscriber lists

## Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

### Backend (Required)
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Nodemailer** - Email service

## Installation

### Prerequisites
- Node.js 18+ 
- MongoDB
- npm or yarn

### Frontend Setup

1. **Navigate to admin directory**
   ```bash
   cd admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp env.example .env
   ```

4. **Update environment variables**
   ```bash
   # Edit .env file
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Access admin panel**
   ```
   http://localhost:3001
   ```

### Backend Setup

You'll need to create a backend API server. Here's a basic structure:

```javascript
// Example backend structure
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/product-inquiries', require('./routes/productInquiries'));
app.use('/api/normal-inquiries', require('./routes/normalInquiries'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/dashboard', require('./routes/dashboard'));

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
```

## Database Schema

### Product Inquiries
```javascript
{
  _id: ObjectId,
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

### Normal Inquiries
```javascript
{
  _id: ObjectId,
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

### Newsletter Emails
```javascript
{
  _id: ObjectId,
  email: String,
  status: String, // active, unsubscribed, bounced
  subscribedAt: Date,
  unsubscribedAt: Date,
  source: String, // website, admin, import
  tags: [String]
}
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/verify` - Verify token

### Product Inquiries
- `GET /api/product-inquiries` - Get all inquiries
- `GET /api/product-inquiries/:id` - Get single inquiry
- `PATCH /api/product-inquiries/:id/status` - Update status
- `DELETE /api/product-inquiries/:id` - Delete inquiry
- `GET /api/product-inquiries/export` - Export data

### Normal Inquiries
- `GET /api/normal-inquiries` - Get all inquiries
- `GET /api/normal-inquiries/:id` - Get single inquiry
- `PATCH /api/normal-inquiries/:id/status` - Update status
- `DELETE /api/normal-inquiries/:id` - Delete inquiry
- `GET /api/normal-inquiries/export` - Export data

### Newsletter
- `GET /api/newsletter` - Get all subscribers
- `GET /api/newsletter/:id` - Get single subscriber
- `PATCH /api/newsletter/:id/status` - Update status
- `PATCH /api/newsletter/bulk-update` - Bulk update
- `DELETE /api/newsletter/:id` - Delete subscriber
- `POST /api/newsletter/send` - Send newsletter
- `GET /api/newsletter/export` - Export data

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Features Overview

### 🔐 Authentication
- Secure admin login
- JWT token-based authentication
- Automatic token refresh
- Protected routes

### 📊 Dashboard
- Real-time statistics
- Recent activity feed
- Quick action buttons
- Visual data representation

### 🔍 Search & Filter
- Global search functionality
- Status-based filtering
- Category filtering
- Date range filtering
- Real-time search

### 📤 Export & Import
- CSV export functionality
- Filtered data export
- Bulk operations
- Data validation

### 📱 Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop enhancement
- Touch-friendly interface

### 🎨 UI/UX
- Modern design system
- Consistent styling
- Smooth animations
- Intuitive navigation
- Loading states
- Error handling

## Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Project Structure
```
admin/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── types/         # TypeScript types
│   ├── lib/           # Utility functions
│   └── main.tsx       # Entry point
├── public/            # Static assets
├── package.json       # Dependencies
└── README.md         # Documentation
```

## Deployment

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Update API base URL in production

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Deploy backend API to your server
3. Configure environment variables
4. Set up email service (SMTP)

## Security Considerations

- JWT token expiration
- Input validation
- SQL injection prevention
- CORS configuration
- Rate limiting
- HTTPS enforcement

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary to Eloska World.

## Support

For support and questions, contact the development team.
