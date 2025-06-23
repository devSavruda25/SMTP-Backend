const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const auth = require('../middleware/auth');

// Employee: Check in
router.post('/checkin', auth, async (req, res) => {
  try {
    // Check if already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existing = await Attendance.findOne({
      employee: req.user._id,
      date: { $gte: today }
    });

    if (existing) {
      return res.status(400).send({ error: 'Already checked in today' });
    }

    const attendance = new Attendance({
      employee: req.user._id,
      checkIn: new Date(),
      status: 'present'
    });

    await attendance.save();
    res.status(201).send(attendance);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Employee: Check out
router.post('/checkout', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const attendance = await Attendance.findOne({
      employee: req.user._id,
      date: { $gte: today },
      checkOut: { $exists: false }
    });

    if (!attendance) {
      return res.status(400).send({ error: 'No check-in found for today' });
    }

    attendance.checkOut = new Date();
    await attendance.save();
    res.send(attendance);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get employee's attendance records
router.get('/me', auth, async (req, res) => {
  try {
    const attendances = await Attendance.find({ employee: req.user._id })
      .sort({ date: -1 })
      .limit(30); // Last 30 days
    res.send(attendances);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;