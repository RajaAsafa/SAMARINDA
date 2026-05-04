const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/auth');

router.post('/upload', authMiddleware, upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Tidak ada file yang diupload.' });
    res.json({
      success: true,
      message: 'File berhasil diupload.',
      data: { url: `/uploads/${req.file.filename}`, filename: req.file.filename, mimetype: req.file.mimetype, size: req.file.size },
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, message: 'Gagal mengupload file.' });
  }
});

router.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ success: false, message: 'Ukuran file melebihi 100MB.' });
  if (err.message) return res.status(400).json({ success: false, message: err.message });
  next(err);
});

module.exports = router;
