const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
require('dotenv').config();

module.exports = {
  async login(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) return res.status(400).json({ success: false, message: 'Username dan password wajib diisi.' });

      const user = await userModel.findByUsername(username);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ success: false, message: 'Username atau password salah.' });
      }

      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '24h' });
      res.json({ success: true, message: 'Login berhasil.', data: { token, user: { id: user.id, username: user.username, role: user.role } } });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
    }
  },

  async me(req, res) {
    try {
      const user = await userModel.findById(req.user.id);
      if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
      res.json({ success: true, data: user });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error.' });
    }
  },
};
