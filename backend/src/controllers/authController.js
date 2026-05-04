const { supabase } = require('../config/db');
const userModel = require('../models/userModel');

module.exports = {
  async login(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username dan password wajib diisi.' });
      }

      const email = userModel.usernameToEmail(username);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.session || !data.user) {
        return res.status(401).json({ success: false, message: 'Username atau password salah.' });
      }

      const profile = await userModel.findById(data.user.id);
      if (!profile) {
        return res.status(403).json({ success: false, message: 'Profil pengguna tidak ditemukan.' });
      }

      res.json({
        success: true,
        message: 'Login berhasil.',
        data: {
          token: data.session.access_token,
          refreshToken: data.session.refresh_token,
          user: {
            id: profile.id,
            username: profile.username,
            role: profile.role,
          },
        },
      });
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
