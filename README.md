# Eloska Luxe Showcase

A complete e-commerce showcase platform with admin panel and backend API.

## Project Structure

```
eloska-luxe-showcase/
├── client/                 # Frontend website (React + Vite)
│   ├── src/
│   ├── public/
│   ├── .env               # Client environment variables
│   └── .gitignore
├── admin/                  # Admin panel (React + Vite)
│   ├── src/
│   ├── dist/
│   ├── .env               # Admin environment variables
│   └── .gitignore
├── backend/                # Backend API (Node.js + Express)
│   ├── routes/
│   ├── models/
│   ├── services/
│   ├── middleware/
│   ├── .env               # Backend environment variables
│   └── .gitignore
└── .gitignore             # Root gitignore
```

## Environment Variables

Each folder has its own `.env` file:

### Client (.env)
```env
VITE_API_BASE_URL=http://localhost:5004
```

### Admin (.env)
```env
VITE_API_BASE_URL=http://localhost:5004/api
```

### Backend (.env)
```env
PORT=5004
MONGODB_URI=mongodb://localhost:27017/eloska-admin
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=your-email@gmail.com
```

## Getting Started

1. **Backend**: `cd backend && npm install && npm start`
2. **Client**: `cd client && npm install && npm run dev`
3. **Admin**: `cd admin && npm install && npm run dev`

## Deployment

- **Client**: Deploy to any static hosting (Vercel, Netlify, etc.)
- **Admin**: Deploy to Render, Vercel, etc.
- **Backend**: Deploy to Render, Railway, etc.

## Security

All `.env` files are gitignored to protect sensitive information.
Use `.env.example` files as templates for deployment.
