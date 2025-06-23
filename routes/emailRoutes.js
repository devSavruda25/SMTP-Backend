
const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const upload = require('../middlewares/upload');

// POST /api/email/send
router.post('/send', upload.array('attachments'), emailController.sendEmail);
router.get('/groups', emailController.getEmailGroups);
router.get('/history', emailController.getHistory);

module.exports = router; 