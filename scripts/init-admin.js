const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  role: String,
}, { timestamps: true });

const Admin = mongoose.model('Admin', AdminSchema);

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/novaa-cms');
    
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const admin = new Admin({
      email: 'admin@novaa.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'super_admin',
    });
    
    await admin.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@novaa.com');
    console.log('Password: admin123');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error creating admin:', error);
  }
}

createAdmin();