const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eloska-admin');
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (existingAdmin) {
      console.log('⚠️ Admin already exists:', existingAdmin.email);
      return;
    }

    // Create new admin
    const admin = new Admin({
      name: process.env.ADMIN_NAME || 'Eloska Admin',
      email: process.env.ADMIN_EMAIL || 'admin@eloska.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'super_admin'
    });

    await admin.save();
    console.log('✅ Admin created successfully:', admin.email);
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password:', process.env.ADMIN_PASSWORD || 'admin123');
    
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

createAdmin();
