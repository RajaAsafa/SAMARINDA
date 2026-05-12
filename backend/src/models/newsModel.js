const { supabaseAdmin } = require('../config/db');

const toNewsResponse = (row) => {
  if (!row) return row;

  const expiresAt = row.expires_at || row.expired_at;
  return {
    ...row,
    category_name: row.categories?.name || row.category_name || null,
    expired_at: expiresAt,
    status: expiresAt && new Date(expiresAt) > new Date() ? 'active' : 'expired',
  };
};

const applySearch = (query, search) => {
  if (!search) return query;
  const value = String(search).replace(/[%_]/g, '\\$&');
  return query.or(`title.ilike.%${value}%,content.ilike.%${value}%`);
};

const paginate = (query, page, limit) => {
  const safePage = Math.max(parseInt(page, 10) || 1, 1);
  const safeLimit = Math.max(parseInt(limit, 10) || 10, 1);
  const from = (safePage - 1) * safeLimit;
  const to = from + safeLimit - 1;
  return {
    query: query.range(from, to),
    page: safePage,
    limit: safeLimit,
  };
};

const newsModel = {
  async getAllActive({ search, categoryId, dateFrom, dateTo, page = 1, limit = 9 }) {
    let query = supabaseAdmin
      .from('news')
      .select('*, categories(name)', { count: 'exact' })
      .eq('is_deleted', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    query = applySearch(query, search);
    if (categoryId) query = query.eq('category_id', categoryId);
    if (dateFrom) query = query.gte('created_at', dateFrom);
    if (dateTo) query = query.lte('created_at', dateTo);

    const pageQuery = paginate(query, page, limit);
    const { data, count, error } = await pageQuery.query;

    if (error) throw error;

    return {
      data: data.map(toNewsResponse),
      pagination: {
        currentPage: pageQuery.page,
        totalPages: Math.ceil((count || 0) / pageQuery.limit),
        totalItems: count || 0,
        limit: pageQuery.limit,
      },
    };
  },

  async getAllAdmin({ search, categoryId, status, page = 1, limit = 10 }) {
    let query = supabaseAdmin
      .from('news')
      .select('*, categories(name)', { count: 'exact' })
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    query = applySearch(query, search);
    if (categoryId) query = query.eq('category_id', categoryId);
    if (status === 'active') query = query.gt('expires_at', new Date().toISOString());
    if (status === 'expired') query = query.lte('expires_at', new Date().toISOString());

    const pageQuery = paginate(query, page, limit);
    const { data, count, error } = await pageQuery.query;

    if (error) throw error;

    return {
      data: data.map(toNewsResponse),
      pagination: {
        currentPage: pageQuery.page,
        totalPages: Math.ceil((count || 0) / pageQuery.limit),
        totalItems: count || 0,
        limit: pageQuery.limit,
      },
    };
  },

  async getById(id) {
    const { data, error } = await supabaseAdmin
      .from('news')
      .select('*, categories(name)')
      .eq('id', id)
      .eq('is_deleted', false)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (error) throw error;
    return toNewsResponse(data);
  },

  async getBySlug(slug) {
    const { data, error } = await supabaseAdmin
      .from('news')
      .select('*, categories(name)')
      .eq('slug', slug)
      .eq('is_deleted', false)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (error) throw error;
    return toNewsResponse(data);
  },

  async create({ title, slug, content, image_url, video_url, category_id, is_featured }) {
    const { data, error } = await supabaseAdmin
      .from('news')
      .insert({
        title,
        slug,
        content,
        image_url: image_url || null,
        video_url: video_url || null,
        category_id: category_id || null,
        is_featured: Boolean(is_featured),
      })
      .select('*, categories(name)')
      .single();

    if (error) throw error;
    return toNewsResponse(data);
  },

  async update(id, { title, slug, content, image_url, video_url, category_id, is_featured, expires_at }) {
    const payload = {
      updated_at: new Date().toISOString(),
    };

    if (title !== undefined) payload.title = title;
    if (slug !== undefined) payload.slug = slug;
    if (content !== undefined) payload.content = content;
    if (image_url !== undefined) payload.image_url = image_url || null;
    if (video_url !== undefined) payload.video_url = video_url || null;
    if (category_id !== undefined) payload.category_id = category_id || null;
    if (is_featured !== undefined) payload.is_featured = Boolean(is_featured);
    if (expires_at !== undefined) payload.expires_at = expires_at;

    const { data, error } = await supabaseAdmin
      .from('news')
      .update(payload)
      .eq('id', id)
      .eq('is_deleted', false)
      .select('*, categories(name)')
      .maybeSingle();

    if (error) throw error;
    return toNewsResponse(data);
  },

  async softDelete(id) {
    const { data, error } = await supabaseAdmin
      .from('news')
      .update({ is_deleted: true, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async extendExpiry(id, days = 30) {
    const { data: existing, error: existingError } = await supabaseAdmin
      .from('news')
      .select('expires_at, expired_at')
      .eq('id', id)
      .eq('is_deleted', false)
      .maybeSingle();

    if (existingError) throw existingError;
    if (!existing) return null;

    const currentExpiry = existing.expires_at || existing.expired_at;
    const baseDate = currentExpiry && new Date(currentExpiry) > new Date()
      ? new Date(currentExpiry)
      : new Date();
    baseDate.setDate(baseDate.getDate() + days);

    const { data, error } = await supabaseAdmin
      .from('news')
      .update({
        expires_at: baseDate.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('is_deleted', false)
      .select('*, categories(name)')
      .maybeSingle();

    if (error) throw error;
    return toNewsResponse(data);
  },

  async getFeatured(limit = 3) {
    const { data, error } = await supabaseAdmin
      .from('news')
      .select('*, categories(name)')
      .eq('is_featured', true)
      .eq('is_deleted', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data.map(toNewsResponse);
  },

  async getStats() {
    const { data, error } = await supabaseAdmin
      .from('news')
      .select('is_featured, is_deleted, expires_at');

    if (error) throw error;

    const now = new Date();
    const rows = data.filter((item) => !item.is_deleted);

    return {
      total: rows.length,
      active: rows.filter((item) => new Date(item.expires_at) > now).length,
      expired: rows.filter((item) => new Date(item.expires_at) <= now).length,
      featured: rows.filter((item) => item.is_featured && new Date(item.expires_at) > now).length,
    };
  },
};

module.exports = newsModel;
