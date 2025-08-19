import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const AdminSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  role: String,
}, { timestamps: true });

const Admin = mongoose.model('Admin', AdminSchema);

async function createAdmin() {
  try {
    console.log(process.env.MONGODB_URI)
    await mongoose.connect(process.env.MONGODB_URI);
    
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const admin = new Admin({
      email: 'admin@nova.com',
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