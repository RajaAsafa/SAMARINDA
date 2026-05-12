const commentModel = require('../models/commentModel');
const newsModel = require('../models/newsModel');

module.exports = {
  async getByNews(req, res) {
    try {
      const { newsId } = req.params;
      const comments = await commentModel.getByNewsId(parseInt(newsId));
      res.json({ success: true, data: comments });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Gagal mengambil komentar.' });
    }
  },

  async create(req, res) {
    try {
      const { news_id, name, content } = req.body;
      if (!news_id || !name || !content) return res.status(400).json({ success: false, message: 'Berita, nama, dan komentar wajib diisi.' });
      const news = await newsModel.getById(parseInt(news_id));
      if (!news) return res.status(404).json({ success: false, message: 'Berita tidak ditemukan atau sudah expired.' });
      const comment = await commentModel.create({ news_id: parseInt(news_id), name: name.trim(), content: content.trim() });
      res.status(201).json({ success: true, message: 'Komentar berhasil ditambahkan.', data: comment });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Gagal menambahkan komentar.' });
    }
  },

  async remove(req, res) {
    try {
      const comment = await commentModel.delete(parseInt(req.params.id));
      if (!comment) return res.status(404).json({ success: false, message: 'Komentar tidak ditemukan.' });
      res.json({ success: true, message: 'Komentar berhasil dihapus.' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Gagal menghapus komentar.' });
    }
  },

  async getAllAdmin(req, res) {
    try {
      const comments = await commentModel.getAll();
      res.json({ success: true, data: comments });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Gagal mengambil semua komentar.' });
    }
  }
};
