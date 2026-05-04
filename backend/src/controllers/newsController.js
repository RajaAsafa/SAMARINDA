const newsModel = require('../models/newsModel');

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

module.exports = {
  async getAll(req, res) {
    try {
      const { search, category_id, date_from, date_to, page = 1, limit = 9 } = req.query;
      const result = await newsModel.getAllActive({ search, categoryId: category_id ? parseInt(category_id) : null, dateFrom: date_from || null, dateTo: date_to || null, page: parseInt(page), limit: parseInt(limit) });
      res.json({ success: true, ...result });
    } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'Gagal mengambil data berita.' }); }
  },

  async getFeatured(req, res) {
    try {
      const data = await newsModel.getFeatured(3);
      res.json({ success: true, data });
    } catch (err) { res.status(500).json({ success: false, message: 'Gagal mengambil berita utama.' }); }
  },

  async getById(req, res) {
    try {
      const news = await newsModel.getById(parseInt(req.params.id));
      if (!news) return res.status(404).json({ success: false, message: 'Berita tidak ditemukan.' });
      res.json({ success: true, data: news });
    } catch (err) { res.status(500).json({ success: false, message: 'Gagal mengambil detail berita.' }); }
  },

  async getBySlug(req, res) {
    try {
      const news = await newsModel.getBySlug(req.params.slug);
      if (!news) return res.status(404).json({ success: false, message: 'Berita tidak ditemukan.' });
      res.json({ success: true, data: news });
    } catch (err) { res.status(500).json({ success: false, message: 'Gagal mengambil detail berita.' }); }
  },

  async getAllAdmin(req, res) {
    try {
      const { search, category_id, status, page = 1, limit = 10 } = req.query;
      const result = await newsModel.getAllAdmin({ search, categoryId: category_id ? parseInt(category_id) : null, status: status || null, page: parseInt(page), limit: parseInt(limit) });
      res.json({ success: true, ...result });
    } catch (err) { res.status(500).json({ success: false, message: 'Gagal mengambil data berita.' }); }
  },

  async getStats(req, res) {
    try {
      const stats = await newsModel.getStats();
      res.json({ success: true, data: stats });
    } catch (err) { res.status(500).json({ success: false, message: 'Gagal mengambil statistik.' }); }
  },

  async create(req, res) {
    try {
      const { title, content, image_url, video_url, category_id, is_featured } = req.body;
      if (!title || !content) return res.status(400).json({ success: false, message: 'Judul dan konten wajib diisi.' });
      
      // Generate initial slug. Note: production app would check for uniqueness collision.
      // For this project, we'll append a timestamp or handle later in model if needed.
      const slug = `${generateSlug(title)}-${Date.now().toString().slice(-6)}`;
      
      const news = await newsModel.create({ title, slug, content, image_url, video_url, category_id: category_id ? parseInt(category_id) : null, is_featured: is_featured || false });
      res.status(201).json({ success: true, message: 'Berita berhasil ditambahkan.', data: news });
    } catch (err) {
      console.error(err);
      if (err.code === '23505' || err.message?.includes('duplicate')) {
        return res.status(409).json({ success: false, message: 'Slug berita sudah digunakan.' });
      }
      res.status(500).json({ success: false, message: 'Gagal menambahkan berita.' });
    }
  },

  async update(req, res) {
    try {
      const { title, content, image_url, video_url, category_id, is_featured } = req.body;
      let slug = undefined;
      if (title) {
        slug = `${generateSlug(title)}-${req.params.id}`;
      }
      
      const news = await newsModel.update(parseInt(req.params.id), { title, slug, content, image_url, video_url, category_id: category_id ? parseInt(category_id) : null, is_featured });
      if (!news) return res.status(404).json({ success: false, message: 'Berita tidak ditemukan.' });
      res.json({ success: true, message: 'Berita berhasil diperbarui.', data: news });
    } catch (err) {
      if (err.code === '23505' || err.message?.includes('duplicate')) {
        return res.status(409).json({ success: false, message: 'Slug berita sudah digunakan.' });
      }
      res.status(500).json({ success: false, message: 'Gagal memperbarui berita.' });
    }
  },

  async remove(req, res) {
    try {
      const news = await newsModel.softDelete(parseInt(req.params.id));
      if (!news) return res.status(404).json({ success: false, message: 'Berita tidak ditemukan.' });
      res.json({ success: true, message: 'Berita berhasil dihapus.' });
    } catch (err) { res.status(500).json({ success: false, message: 'Gagal menghapus berita.' }); }
  },

  async extend(req, res) {
    try {
      const { days = 30 } = req.body;
      const news = await newsModel.extendExpiry(parseInt(req.params.id), parseInt(days));
      if (!news) return res.status(404).json({ success: false, message: 'Berita tidak ditemukan.' });
      res.json({ success: true, message: `Masa aktif diperpanjang ${days} hari.`, data: news });
    } catch (err) { res.status(500).json({ success: false, message: 'Gagal memperpanjang masa aktif.' }); }
  },
};
