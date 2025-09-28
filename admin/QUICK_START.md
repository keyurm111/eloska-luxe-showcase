# 🚀 Quick Start Guide - Eloska Admin Panel

## ✅ **Login Issue Fixed!**

The admin panel now works with **mock data** for development and testing.

## 🔑 **Login Credentials (Development Mode)**

```
Email: admin@eloska.com
Password: admin123
```

## 🏃‍♂️ **Quick Start (Frontend Only)**

### 1. **Start the Admin Panel**
```bash
cd admin
npm install
npm run dev
```

### 2. **Access the Panel**
- Open: http://localhost:3001
- Login with the credentials above
- The panel will work with mock data

## 🎯 **What Works Now**

### ✅ **Dashboard**
- Real-time statistics
- Recent inquiries display
- Quick action buttons

### ✅ **Product Inquiries**
- View all inquiries
- Filter by status/category
- Update status
- Search functionality
- Mock data included

### ✅ **Normal Inquiries**
- General inquiry management
- Status tracking
- Search and filter

### ✅ **Newsletter Management**
- Subscriber management
- Status tracking
- Bulk operations

## 🔧 **Backend Setup (Optional)**

If you want to use the real backend with MongoDB:

### 1. **Start MongoDB**
```bash
# Install MongoDB locally or use MongoDB Atlas
# Update MONGODB_URI in backend/.env
```

### 2. **Start Backend**
```bash
cd admin/backend
npm install
cp env.example .env
# Configure your .env file
npm run dev
```

### 3. **Create Admin User**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@eloska.com",
    "password": "admin123",
    "role": "super_admin"
  }'
```

## 🎨 **Features Available**

### **Mock Data Included:**
- 3 Product Inquiries
- 2 Normal Inquiries  
- 3 Newsletter Subscribers
- Dashboard Statistics

### **Full Functionality:**
- ✅ Login/Logout
- ✅ Dashboard with stats
- ✅ Product inquiry management
- ✅ Normal inquiry management
- ✅ Newsletter management
- ✅ Search and filtering
- ✅ Status updates
- ✅ Responsive design

## 🐛 **Troubleshooting**

### **Login Not Working?**
1. Make sure you're using: `admin@eloska.com` / `admin123`
2. Check browser console for errors
3. Clear localStorage and try again

### **Data Not Loading?**
- The panel uses mock data by default
- Check console for any errors
- Backend is optional for development

### **Styling Issues?**
- Make sure Tailwind CSS is working
- Check if all dependencies are installed

## 📱 **Mobile Support**
- Fully responsive design
- Touch-friendly interface
- Works on all devices

## 🎯 **Next Steps**

1. **Test the panel** with mock data
2. **Set up backend** if needed
3. **Customize** the design
4. **Add real data** from your website

## 📞 **Support**

If you encounter any issues:
1. Check the browser console
2. Verify all dependencies are installed
3. Make sure you're using the correct credentials

---

**🎉 You're all set! The admin panel is now working with mock data.**
