const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.employeeLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log('🚀 Login attempt:', email);

  try {
    const employee = await Employee.findOne({ email });

    if (!employee) {
      console.log('❌ Employee not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('🔍 Employee from DB:', employee.email);
    console.log('🔐 Hashed password:', employee.password);
    console.log('🔑 Provided password:', password);

    const match = bcrypt.compareSync(password, employee.password);
    console.log('✅ Password match:', match);

    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: employee._id, role: 'employee' },
      process.env.JWT_SECRET_EMP,
      { expiresIn: '24h' }
    );

    return res.json({ token });
  } catch (err) {
    console.error('❌ Login error:', err);
    return res.status(500).json({ message: 'Server error during login' });
  }
};


