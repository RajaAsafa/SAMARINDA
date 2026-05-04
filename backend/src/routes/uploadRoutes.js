const express = require('express');
const path = require('path');
const router = express.Router();
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/auth');
const { supabaseAdmin } = require('../config/db');

const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'news-media';

const getFolderByMime = (mimetype) => (mimetype.startsWith('video/') ? 'videos' : 'images');

router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Tidak ada file yang diupload.' });

    const ext = path.extname(req.file.originalname || '').toLowerCase();
    const folder = getFolderByMime(req.file.mimetype);
    const filename = `${folder}/${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filename, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabaseAdmin.storage.from(BUCKET_NAME).getPublicUrl(filename);

    res.json({
      success: true,
      message: 'File berhasil diupload.',
      data: {
        url: data.publicUrl,
        filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, message: err.message || 'Gagal mengupload file.' });
  }
});

router.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ success: false, message: 'Ukuran file melebihi 500MB.' });
  if (err.message) return res.status(400).json({ success: false, message: err.message });
  next(err);
});

module.exports = router;
