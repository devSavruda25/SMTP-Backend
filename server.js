const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const chalk = require('chalk');

const authRoutes = require('./routes/authRoutes');
const emailRoutes = require('./routes/emailRoutes');
const employeeAuthRoutes = require('./routes/employeeAuth');
const empbyid = require('./routes/employeeRoutes')
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/employee', employeeAuthRoutes,empbyid); // 👈 Employee login route
app.use('/api/email', emailRoutes);
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(chalk.green.bold('✅ MongoDB connected successfully!'));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(chalk.blue.bold('\n🚀 Server is running at:') + chalk.cyanBright(` http://localhost:${PORT}`));
      console.log(chalk.magenta('📡 API Endpoints:'));
      console.log(chalk.yellow('  • /api/auth'));
      console.log(chalk.yellow('  • /api/employee'));
      console.log(chalk.yellow('  • /api/email'));
      console.log(chalk.yellow('  • /uploads\n'));
    });
  })
  .catch((err) => {
    console.error(chalk.red('❌ MongoDB connection failed:'), err.message);
  });
