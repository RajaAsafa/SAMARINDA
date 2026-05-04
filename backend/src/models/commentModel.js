const db = require('../config/db');

class CommentModel {
  static async create({ news_id, name, content }) {
    const result = await db.query(
      'INSERT INTO comments (news_id, name, content) VALUES ($1, $2, $3) RETURNING *',
      [news_id, name, content]
    );
    return result.rows[0];
  }

  static async getByNewsId(news_id) {
    const result = await db.query(
      'SELECT * FROM comments WHERE news_id = $1 ORDER BY created_at DESC',
      [news_id]
    );
    return result.rows;
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM comments WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }

  static async getAll() {
    const result = await db.query(
        'SELECT c.*, n.title as news_title FROM comments c JOIN news n ON c.news_id = n.id ORDER BY c.created_at DESC'
    );
    return result.rows;
  }
}

module.exports = CommentModel;
