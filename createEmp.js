const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Employee = require('./models/Employee'); // Adjust the path if needed

async function createEmployee() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const hashedPassword = bcrypt.hashSync('employee123', 10); // Default password

    const employee = new Employee({
      name: 'John Doe',
      email: 'employee@example.com',
      password: hashedPassword,
      role: 'employee', // ✅ Matches the enum: ['admin', 'employee']
    });

    await employee.save();
    console.log('Employee created successfully:', {
      name: employee.name,
      email: employee.email,
      role: employee.role,
      id: employee._id
    });

  } catch (error) {
    console.error('Error creating employee:', error.message);
    if (error.code === 11000) {
      console.error('Error: Email already exists');
    }
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
}

createEmployee();
