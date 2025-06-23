const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const EmailHistory = require("../models/EmailHistory");

// Helper function to load email groups
const loadEmailGroups = () => {
  const groups = {};
  const files = ['broteincmm.json', 'broteinabs.json', 'Savruda.json','kenso.json']; // Your JSON files
  
  files.forEach(file => {
    try {
      const groupName = path.basename(file, '.json');
      groups[groupName] = JSON.parse(fs.readFileSync(`./${file}`, "utf-8"));
    } catch (err) {
      console.error(`Error loading ${file}:`, err);
      groups[groupName] = [];
    }
  });
  
  return groups;
};

// Get available email groups
exports.getEmailGroups = async (req, res) => {
  try {
    const groups = loadEmailGroups();
    res.json({
      groups: Object.keys(groups),
      counts: Object.fromEntries(
        Object.entries(groups).map(([emails]) => [emails.length])
    )});
  } catch (err) {
    res.status(500).json({ message: 'Failed to load email groups' });
  }
};

// Send email to selected groups
exports.sendEmail = async (req, res) => {
  try {
    const { subject, text, selectedGroups } = req.body;
    
    if (!selectedGroups || selectedGroups.length === 0) {
      return res.status(400).json({ message: "No groups selected" });
    }

    // Load all groups
    const allGroups = loadEmailGroups();
    
    // Combine emails from selected groups, removing duplicates
    const receivers = [...new Set(
      selectedGroups.flatMap(group => allGroups[group] || [])
    )];
      
    if (receivers.length === 0) {
      return res.status(400).json({ message: "No valid emails found in selected groups" });
    }

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASS,
      },
    });

    // Handle attachments
    const attachments = req.files?.map((file) => ({
      filename: file.originalname,
      path: file.path,
    })) || [];

    let info = await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: receivers.join(","),
      subject,
      text,
      attachments,
    });

    // Save to history
    await EmailHistory.create({
      subject,
      text,
      to: receivers,
      sentToGroups: selectedGroups,
      attachments: attachments.map((a) => a.filename),
    });

    res.json({ 
      message: "Email sent successfully",
      info,
      receiversCount: receivers.length
    });

  } catch (err) {
    console.error("SendMail Error:", err);
    res.status(500).json({ 
      message: "Failed to send email", 
      error: err.message 
    });
  }
};

// Get email history
exports.getHistory = async (req, res) => {
  try {
    const history = await EmailHistory.find().sort({ sentAt: -1 });
    const count = await EmailHistory.countDocuments(); // Count total emails
    res.json({
      count,
      history
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch email history' });
  }
};
