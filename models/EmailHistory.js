const mongoose = require('mongoose');

const emailHistorySchema = new mongoose.Schema({
  subject: String,
  text: String,
  to: [String],
  sentToGroups: [String], 
  attachments: [String],
  sentAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('EmailHistory', emailHistorySchema);