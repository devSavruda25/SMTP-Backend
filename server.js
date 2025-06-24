// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const chalk = require('chalk');

const authRoutes = require('./routes/authRoutes');
const emailRoutes = require('./routes/emailRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/email', emailRoutes);
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(chalk.green.bold('✅ MongoDB connected successfully!'));
    
    app.listen(5000, () => {
      console.log(chalk.blue.bold('\n🚀 Server is running at:')
        + chalk.cyanBright(` http://localhost:5000`));
      
      console.log(chalk.magenta('📡 API Endpoints:'));
      console.log(chalk.yellow('  • /api/auth'));
      console.log(chalk.yellow('  • /api/email'));
      console.log(chalk.yellow('  • /uploads\n'));
    });
  })
  .catch((err) => {
    console.error(chalk.red('❌ MongoDB connection failed:'), err.message);
  });
