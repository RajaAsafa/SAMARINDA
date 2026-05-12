const { supabaseAdmin } = require('../config/db');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Akses ditolak. Token tidak ditemukan.' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !authData.user) {
      return res.status(401).json({ success: false, message: 'Token tidak valid atau sudah kadaluarsa.' });
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, username, role, created_at, updated_at')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
      return res.status(403).json({ success: false, message: 'Profil pengguna tidak ditemukan.' });
    }

    req.user = {
      ...profile,
      email: authData.user.email,
    };

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token tidak valid atau sudah kadaluarsa.' });
  }
};

const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Akses ditolak. Token tidak ditemukan.' });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Anda tidak memiliki akses untuk aksi ini.' });
  }

  next();
};

authMiddleware.requireRole = requireRole;
authMiddleware.requireStaff = requireRole('admin', 'author');
authMiddleware.requireAdmin = requireRole('admin');

module.exports = authMiddleware;
