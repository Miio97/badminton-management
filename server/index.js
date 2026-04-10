require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Routes
const authRoutes = require('./src/routes/auth');
const courtRoutes = require('./src/routes/courts');
const customerRoutes = require('./src/routes/customers');
const staffRoutes = require('./src/routes/staff');
const productRoutes = require('./src/routes/products');
const bookingRoutes = require('./src/routes/bookings');
const invoiceRoutes = require('./src/routes/invoices');
const promotionRoutes = require('./src/routes/promotions');
const dashboardRoutes = require('./src/routes/dashboard');
const accountRoutes = require('./src/routes/accounts');
const autoCrudRoutes = require('./src/routes/autoCrud');

// Middleware
const { errorHandler } = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// ========================
// GLOBAL MIDDLEWARE
// ========================
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging (dev only)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ========================
// HEALTH CHECK
// ========================
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: '🏸 Badminton Center API đang chạy!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// ========================
// API ROUTES
// ========================
app.use('/api/auth', authRoutes);
app.use('/api/courts', courtRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/products', productRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/crud', autoCrudRoutes);

// ========================
// SERVE FRONTEND (PRODUCTION)
// ========================
// Serve the statically built Vite app
const path = require('path');
app.use(express.static(path.join(__dirname, '../dist')));

// ========================
// 404 & FALLBACK HANDLER
// ========================
// For API routes, return 404 JSON
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'API Route not found' });
});

// For all other routes, send back the React index.html
app.use((_req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// ========================
// ERROR HANDLER
// ========================
app.use(errorHandler);

// ========================
// START SERVER
// ========================
app.listen(PORT, () => {
  console.log('');
  console.log('🏸 ======================================== 🏸');
  console.log(`   Badminton Center API v1.0.0`);
  console.log(`   Server: http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log('');
  console.log('   📋 API Endpoints:');
  console.log('   POST   /api/auth/login');
  console.log('   GET    /api/courts');
  console.log('   GET    /api/customers');
  console.log('   GET    /api/staff');
  console.log('   GET    /api/products');
  console.log('   GET    /api/bookings');
  console.log('   GET    /api/invoices');
  console.log('   GET    /api/promotions');
  console.log('   GET    /api/dashboard/overview');
  console.log('   GET    /api/accounts');
  console.log('   ALL    /api/crud/*        (Full CRUD for 17 models)');
  console.log('🏸 ======================================== 🏸');
  console.log('');
});
