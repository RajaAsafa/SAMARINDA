const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const commentRoutes = require('./routes/commentRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', authRoutes);
app.use('/api', newsRoutes);
app.use('/api', categoryRoutes);
app.use('/api', uploadRoutes);
app.use('/api', commentRoutes);
app.use('/api', userRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Samarinda Terbaru API is running with Supabase',
    timestamp: new Date().toISOString(),
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Terjadi kesalahan internal server.' });
});

app.listen(PORT, () => {
  console.log(`Samarinda Terbaru API running on http://localhost:${PORT}`);
  console.log(`API Base: http://localhost:${PORT}/api`);
  console.log('Backend database/auth/storage: Supabase');
});

module.exports = app;
