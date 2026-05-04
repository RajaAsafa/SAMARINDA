const pool = require('../config/db');

const userModel = {
  async findByUsername(username) {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
  },
  async findById(id) {
    const result = await pool.query('SELECT id, username, role, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },
  async create(username, hashedPassword, role = 'admin') {
    const result = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, hashedPassword, role]
    );
    return result.rows[0];
  },

  async getAll() {
    const result = await pool.query('SELECT id, username, role, created_at FROM users ORDER BY created_at ASC');
    return result.rows;
  },

  async deleteById(id) {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id, username', [id]);
    return result.rows[0];
  },
};

module.exports = userModel;
