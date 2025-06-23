const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  checkIn: { type: Date },
  checkOut: { type: Date },
  date: { type: Date, required: true, default: Date.now },
  status: { 
    type: String, 
    enum: ['present', 'absent', 'late', 'half_day'], 
    default: 'absent' 
  }
});

module.exports = mongoose.model('Attendance', attendanceSchema);