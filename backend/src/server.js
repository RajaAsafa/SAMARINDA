const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const commentRoutes = require('./routes/commentRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ─────────────────────────────────
app.use('/api', authRoutes);
app.use('/api', newsRoutes);
app.use('/api', categoryRoutes);
app.use('/api', uploadRoutes);
app.use('/api', commentRoutes);
app.use('/api', userRoutes);

// ── Health check ───────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Samarinda Terbaru API is running', timestamp: new Date().toISOString() });
});

// ── Global error handler ───────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Terjadi kesalahan internal server.' });
});

// ── Start server ───────────────────────────
const pool = require('./config/db');

app.listen(PORT, async () => {
  console.log(`\n🚀 Samarinda Terbaru API running on http://localhost:${PORT}`);
  console.log(`📡 API Base: http://localhost:${PORT}/api`);
  
  // Test database connection
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('📦 Connected to PostgreSQL successfully at:', res.rows[0].now);
  } catch (err) {
    console.error('❌ Database connection failed!');
    console.error('Reason:', err.message);
    console.log('\n💡 TIPS:');
    console.log('1. Pastikan PostgreSQL sudah menyala (Start di Services.msc)');
    console.log('2. Pastikan database "samarinda_terbaru" sudah dibuat');
    console.log('3. Cek DB_PASSWORD di file .env\n');
  }
});

module.exports = app;
