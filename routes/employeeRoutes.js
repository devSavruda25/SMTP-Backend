// routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const empAuth = require('../middlewares/authEmployee');

router.get('/debug', (req, res) => {
  res.json({ message: 'Employee API is working', time: new Date() });
});


router.get('/:id', empAuth, async (req, res) => {
  try {
    // Validate ID format first
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid employee ID format' });
    }

    const emp = await Employee.findById(req.params.id).select('name email');
    if (!emp) {
      return res.status(404).json({ 
        message: 'Employee not found',
        receivedId: req.params.id
      });
    }
    
    res.json({
      success: true,
      data: emp
    });
  } catch (err) {
    console.error('Error fetching employee:', err);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;
