// controllers/authController.js
const Admin = require('../models/Admin');
// const Employee = require('../models/Employee'); // Assuming you have an Employee model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin || !bcrypt.compareSync(password, admin.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
};
// exports.emplogin = async (req, res) => {
//   const { email, password } = req.body;
//   const Employee = await Employee.findOne({ email });
//   if (!Employee || !bcrypt.compareSync(password, Employee.password)) {  
//     return res.status(401).json({ message: 'Invalid credentials' });
//   }
//   const token = jwt.sign({ id: Employee._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//   res.json({ token });
// };