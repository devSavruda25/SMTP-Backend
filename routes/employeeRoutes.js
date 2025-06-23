const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
// const auth = require('../middleware/auth');
const adminAuth = require('../middlewares/authMiddleware');

// Admin: Add new employee
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const employee = new Employee({ name, email, password, role: 'employee' });
    await employee.save();
    res.status(201).send(employee);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Admin: Get all employees
router.get('/', adminAuth, async (req, res) => {
  try {
    const employees = await Employee.find({ role: 'employee' });
    res.send(employees);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;