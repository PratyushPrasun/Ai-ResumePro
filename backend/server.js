require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin:'*'
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/generator', require('./routes/generatorRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT}`));
