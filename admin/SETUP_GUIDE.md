# 🚀 **Admin Panel Setup Guide**

## ✅ **Mock Data Removed Successfully!**

The admin panel has been completely cleaned of all mock and dummy data. It now requires a real database and proper setup.

## 📋 **Setup Instructions:**

### **1. Environment Setup**

Create a `.env` file in `admin/backend/` directory:

```bash
cd admin/backend
cp env.example .env
```

Edit the `.env` file with your configuration:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/eloska-admin

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### **2. Install Dependencies**

```bash
# Backend dependencies
cd admin/backend
npm install

# Frontend dependencies
cd ../admin
npm install
```

### **3. Start MongoDB**

Make sure MongoDB is running on your system:

```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# On Windows
net start MongoDB
```

### **4. Create Admin User**

Run the admin creation script:

```bash
cd admin/backend
node create-admin.js
```

This will create an admin user with:
- **Email:** `admin@eloska.com`
- **Password:** `admin123`

### **5. Start the Servers**

**Option A: Start Both Servers (Recommended)**
```bash
cd admin
chmod +x start-dev.sh
./start-dev.sh
```

**Option B: Start Separately**

Terminal 1 (Backend):
```bash
cd admin/backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd admin
npm run dev
```

### **6. Access the Admin Panel**

- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:5000

**Login Credentials:**
- **Email:** `admin@eloska.com`
- **Password:** `admin123`

## 🔧 **Troubleshooting:**

### **Error: "Token received: undefined"**
- This means the frontend is not sending a token
- Make sure you're logged in with valid credentials
- Check browser console for errors

### **Error: "Cast to ObjectId failed"**
- This means there are still mock data references
- Restart both servers to clear any cached code
- Check that all mock data has been removed

### **Error: "Cannot connect to server"**
- Make sure the backend is running on port 5000
- Check MongoDB connection
- Verify environment variables

### **Error: "Admin not found"**
- Run the admin creation script: `node create-admin.js`
- Check MongoDB connection
- Verify admin user exists in database

## 📊 **Database Schema:**

The admin panel uses these MongoDB collections:

- **admins** - Admin user accounts
- **productinquiries** - Product inquiry submissions
- **normalinquiries** - General inquiry submissions  
- **newsletteremails** - Newsletter subscribers

## 🎯 **Features Available:**

- ✅ **Dashboard** - Statistics and overview
- ✅ **Product Inquiries** - Manage product quote requests
- ✅ **Normal Inquiries** - Manage general inquiries
- ✅ **Newsletter** - Manage email subscribers
- ✅ **Authentication** - Secure JWT-based login
- ✅ **Export** - CSV export functionality

## 🚨 **Important Notes:**

- **No Mock Data:** All data comes from real database
- **Production Ready:** Suitable for production deployment
- **Secure:** Uses proper JWT authentication
- **Scalable:** Built with MongoDB for scalability

---

**🎉 The admin panel is now ready for real-world use!**
