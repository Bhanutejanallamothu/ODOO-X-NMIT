const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const leaveRoutes = require('./routes/leave.routes');
const payrollRoutes = require('./routes/payroll.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend development server
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static profile images if needed
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/payroll', payrollRoutes);

// Root path diagnostic
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Dayflow HRMS API Service is running.',
    timestamp: new Date()
  });
});

// Catch-all 404 Route
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Error handling middleware
app.use(errorHandler);

// Initialize DB and start server
const startServer = async () => {
  console.log('Connecting to PostgreSQL...');
  await initDB();
  
  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`  Dayflow HRMS Server listening on port ${PORT}`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`==================================================`);
  });
};

startServer().catch(err => {
  console.error('Failed to start Dayflow HRMS Server:', err);
  process.exit(1);
});
