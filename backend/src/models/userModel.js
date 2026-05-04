const { supabaseAdmin } = require('../config/db');

const ADMIN_EMAIL_DOMAIN = process.env.ADMIN_EMAIL_DOMAIN || 'samarinda-terbaru.local';

const usernameToEmail = (username) => {
  const value = String(username || '').trim().toLowerCase();
  return value.includes('@') ? value : `${value}@${ADMIN_EMAIL_DOMAIN}`;
};

const userModel = {
  usernameToEmail,

  async findByUsername(username) {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id, username, role, created_at, updated_at')
      .eq('username', username)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async findById(id) {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id, username, role, created_at, updated_at')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async create(username, password, role = 'admin') {
    const email = usernameToEmail(username);
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        username,
        role,
      },
    });

    if (authError) throw authError;

    const profile = {
      id: authData.user.id,
      username,
      role,
    };

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .insert(profile)
      .select('id, username, role, created_at, updated_at')
      .single();

    if (error) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw error;
    }

    return data;
  },

  async getAll() {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id, username, role, created_at, updated_at')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  async deleteById(id) {
    const existing = await this.findById(id);
    if (!existing) return null;

    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (error) throw error;

    return existing;
  },

  async changePassword(id, newPassword) {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, {
      password: newPassword,
    });

    if (error) throw error;
    return data.user;
  },
};

module.exports = userModel;
