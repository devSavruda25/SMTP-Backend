const mongoose = require('mongoose');
require('dotenv').config();
const Employee = require('./models/Employee');

async function createEmployee() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const employee = new Employee({
      name: 'John Doe',
      email: 'prathamesh0755@gmail.com',
      password: 'emp123', // 🔥 plain password only
      role: 'employee',
    });

    await employee.save();
    console.log('✅ Employee created successfully');
  } catch (err) {
    console.error('❌ Error creating employee:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

createEmployee();
