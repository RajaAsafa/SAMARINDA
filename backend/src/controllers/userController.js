const userModel = require('../models/userModel');

module.exports = {
  async getAll(req, res) {
    try {
      const users = await userModel.getAll();
      res.json({ success: true, data: users });
    } catch (err) {
      console.error('getAll users error:', err);
      res.status(500).json({ success: false, message: 'Gagal mengambil data pengguna.' });
    }
  },

  async create(req, res) {
    try {
      const { username, password, role } = req.body;

      if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username dan password wajib diisi.' });
      }
      if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password minimal 6 karakter.' });
      }

      const existing = await userModel.findByUsername(username);
      if (existing) {
        return res.status(409).json({ success: false, message: 'Username sudah digunakan.' });
      }

      const newUser = await userModel.create(username.trim(), password, role || 'admin');

      res.status(201).json({ success: true, message: 'Pengguna berhasil dibuat.', data: newUser });
    } catch (err) {
      console.error('create user error:', err);
      res.status(500).json({ success: false, message: err.message || 'Gagal membuat pengguna.' });
    }
  },

  async remove(req, res) {
    try {
      const id = req.params.id;

      if (req.user.id === id) {
        return res.status(400).json({ success: false, message: 'Tidak bisa menghapus akun sendiri.' });
      }

      const deleted = await userModel.deleteById(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
      }

      res.json({ success: true, message: `Pengguna "${deleted.username}" berhasil dihapus.` });
    } catch (err) {
      console.error('delete user error:', err);
      res.status(500).json({ success: false, message: 'Gagal menghapus pengguna.' });
    }
  },

  async changePassword(req, res) {
    try {
      const id = req.params.id;
      const { newPassword } = req.body;

      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'Password baru minimal 6 karakter.' });
      }

      const user = await userModel.changePassword(id, newPassword);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
      }

      res.json({ success: true, message: 'Password berhasil diubah.' });
    } catch (err) {
      console.error('changePassword error:', err);
      res.status(500).json({ success: false, message: 'Gagal mengubah password.' });
    }
  },
};
