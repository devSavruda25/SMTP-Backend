// models/Employee.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // Hashed password
  role: {
    type: String,
    enum: ['hr', 'pm', 'developer', 'accountant', 'designer'],
    required: true,
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // admin reference
});

module.exports = mongoose.model('Employee', employeeSchema);
