const pool = require('../config/db');

const newsModel = {
  async getAllActive({ search, categoryId, dateFrom, dateTo, page = 1, limit = 9 }) {
    const offset = (page - 1) * limit;
    let conditions = ['n.is_deleted = false', 'n.expired_at > NOW()'];
    let params = [];
    let i = 1;

    if (search) { conditions.push(`(n.title ILIKE $${i} OR n.content ILIKE $${i})`); params.push(`%${search}%`); i++; }
    if (categoryId) { conditions.push(`n.category_id = $${i}`); params.push(categoryId); i++; }
    if (dateFrom) { conditions.push(`n.created_at >= $${i}`); params.push(dateFrom); i++; }
    if (dateTo) { conditions.push(`n.created_at <= $${i}`); params.push(dateTo); i++; }

    const where = 'WHERE ' + conditions.join(' AND ');
    const countResult = await pool.query(`SELECT COUNT(*) FROM news n ${where}`, params);
    const totalItems = parseInt(countResult.rows[0].count);

    params.push(limit, offset);
    const dataResult = await pool.query(
      `SELECT n.*, c.name as category_name FROM news n LEFT JOIN categories c ON n.category_id = c.id ${where} ORDER BY n.created_at DESC LIMIT $${i} OFFSET $${i + 1}`,
      params
    );

    return { data: dataResult.rows, pagination: { currentPage: page, totalPages: Math.ceil(totalItems / limit), totalItems, limit } };
  },

  async getAllAdmin({ search, categoryId, status, page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    let conditions = ['n.is_deleted = false'];
    let params = [];
    let i = 1;

    if (search) { conditions.push(`(n.title ILIKE $${i} OR n.content ILIKE $${i})`); params.push(`%${search}%`); i++; }
    if (categoryId) { conditions.push(`n.category_id = $${i}`); params.push(categoryId); i++; }
    if (status === 'active') conditions.push('n.expired_at > NOW()');
    else if (status === 'expired') conditions.push('n.expired_at <= NOW()');

    const where = 'WHERE ' + conditions.join(' AND ');
    const countResult = await pool.query(`SELECT COUNT(*) FROM news n ${where}`, params);
    const totalItems = parseInt(countResult.rows[0].count);

    params.push(limit, offset);
    const dataResult = await pool.query(
      `SELECT n.*, c.name as category_name, CASE WHEN n.expired_at > NOW() THEN 'active' ELSE 'expired' END as status FROM news n LEFT JOIN categories c ON n.category_id = c.id ${where} ORDER BY n.created_at DESC LIMIT $${i} OFFSET $${i + 1}`,
      params
    );

    return { data: dataResult.rows, pagination: { currentPage: page, totalPages: Math.ceil(totalItems / limit), totalItems, limit } };
  },

  async getById(id) {
    const result = await pool.query(
      `SELECT n.*, c.name as category_name, CASE WHEN n.expired_at > NOW() THEN 'active' ELSE 'expired' END as status FROM news n LEFT JOIN categories c ON n.category_id = c.id WHERE n.id = $1 AND n.is_deleted = false`,
      [id]
    );
    return result.rows[0];
  },

  async getBySlug(slug) {
    const result = await pool.query(
      `SELECT n.*, c.name as category_name, CASE WHEN n.expired_at > NOW() THEN 'active' ELSE 'expired' END as status FROM news n LEFT JOIN categories c ON n.category_id = c.id WHERE n.slug = $1 AND n.is_deleted = false`,
      [slug]
    );
    return result.rows[0];
  },

  async create({ title, slug, content, image_url, video_url, category_id, is_featured }) {
    const result = await pool.query(
      `INSERT INTO news (title, slug, content, image_url, video_url, category_id, is_featured, created_at, expired_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW() + INTERVAL '30 days') RETURNING *`,
      [title, slug, content, image_url || null, video_url || null, category_id || null, is_featured || false]
    );
    return result.rows[0];
  },

  async update(id, { title, slug, content, image_url, video_url, category_id, is_featured }) {
    const result = await pool.query(
      `UPDATE news SET title=COALESCE($1,title), slug=COALESCE($2,slug), content=COALESCE($3,content), image_url=COALESCE($4,image_url), video_url=$5, category_id=$6, is_featured=COALESCE($7,is_featured) WHERE id=$8 AND is_deleted=false RETURNING *`,
      [title, slug, content, image_url, video_url || null, category_id || null, is_featured, id]
    );
    return result.rows[0];
  },

  async softDelete(id) {
    const result = await pool.query('UPDATE news SET is_deleted = true WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },

  async extendExpiry(id, days = 30) {
    const result = await pool.query(
      `UPDATE news SET expired_at = GREATEST(expired_at, NOW()) + INTERVAL '1 day' * $1 WHERE id = $2 AND is_deleted = false RETURNING *`,
      [days, id]
    );
    return result.rows[0];
  },

  async getFeatured(limit = 3) {
    const result = await pool.query(
      `SELECT n.*, c.name as category_name FROM news n LEFT JOIN categories c ON n.category_id = c.id WHERE n.is_featured = true AND n.is_deleted = false AND n.expired_at > NOW() ORDER BY n.created_at DESC LIMIT $1`,
      [limit]
    );
    return result.rows;
  },

  async getStats() {
    const result = await pool.query(
      `SELECT COUNT(*) FILTER (WHERE is_deleted=false) as total, COUNT(*) FILTER (WHERE is_deleted=false AND expired_at>NOW()) as active, COUNT(*) FILTER (WHERE is_deleted=false AND expired_at<=NOW()) as expired, COUNT(*) FILTER (WHERE is_featured=true AND is_deleted=false AND expired_at>NOW()) as featured FROM news`
    );
    return result.rows[0];
  },
};

module.exports = newsModel;
