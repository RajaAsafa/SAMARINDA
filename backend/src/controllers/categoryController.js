const categoryModel = require('../models/categoryModel');

module.exports = {
  async getAll(req, res) {
    try {
      const categories = await categoryModel.getAll();
      res.json({ success: true, data: categories });
    } catch (err) { res.status(500).json({ success: false, message: 'Gagal mengambil kategori.' }); }
  },

  async create(req, res) {
    try {
      const { name } = req.body;
      if (!name?.trim()) return res.status(400).json({ success: false, message: 'Nama kategori wajib diisi.' });
      const category = await categoryModel.create(name.trim());
      res.status(201).json({ success: true, message: 'Kategori berhasil ditambahkan.', data: category });
    } catch (err) {
      if (err.code === '23505' || err.message?.includes('duplicate')) return res.status(409).json({ success: false, message: 'Kategori sudah ada.' });
      res.status(500).json({ success: false, message: 'Gagal menambahkan kategori.' });
    }
  },

  async update(req, res) {
    try {
      const { name } = req.body;
      if (!name?.trim()) return res.status(400).json({ success: false, message: 'Nama kategori wajib diisi.' });
      const category = await categoryModel.update(parseInt(req.params.id), name.trim());
      if (!category) return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
      res.json({ success: true, message: 'Kategori berhasil diperbarui.', data: category });
    } catch (err) {
      if (err.code === '23505' || err.message?.includes('duplicate')) return res.status(409).json({ success: false, message: 'Nama kategori sudah ada.' });
      res.status(500).json({ success: false, message: 'Gagal memperbarui kategori.' });
    }
  },

  async remove(req, res) {
    try {
      const id = parseInt(req.params.id);
      const count = await categoryModel.getNewsCount(id);
      if (count > 0) return res.status(400).json({ success: false, message: `Tidak dapat menghapus. Masih ada ${count} berita dalam kategori ini.` });
      const category = await categoryModel.delete(id);
      if (!category) return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
      res.json({ success: true, message: 'Kategori berhasil dihapus.' });
    } catch (err) { res.status(500).json({ success: false, message: 'Gagal menghapus kategori.' }); }
  },
};
