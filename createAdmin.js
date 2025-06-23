const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('./models/Admin');

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const hashedPassword = bcrypt.hashSync('admin123', 10); // you can change password
  const admin = new Admin({
    email: 'admin1@example.com', // your login email
    password: hashedPassword,
  });

  await admin.save();
  console.log('Admin created:', admin);
  process.exit();
}

createAdmin();
