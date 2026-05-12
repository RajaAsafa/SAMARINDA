/**
 * adminData.js
 * Service layer untuk halaman admin.
 * Melakukan query langsung ke Supabase.
 */
import { supabase } from './supabase';

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

export async function fetchAdminNews({ search, category_id, status, page = 1, limit = 10 } = {}) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');

  let query = supabase
    .from('news')
    .select('*, categories(name)', { count: 'exact' })
    .eq('is_deleted', false)
    .order('created_at', { ascending: false });

  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
  }
  if (category_id) query = query.eq('category_id', category_id);
  
  const now = new Date().toISOString();
  if (status === 'active') query = query.gt('expires_at', now);
  if (status === 'expired') query = query.lte('expires_at', now);

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;
  if (error) throw error;

  return {
    data: (data || []).map(toNewsResponse),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil((count || 0) / limit),
      totalItems: count || 0,
      limit,
    },
  };
}

export async function fetchAdminNewsBySlug(slug) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');

  const { data, error } = await supabase
    .from('news')
    .select('*, categories(name)')
    .eq('slug', slug)
    .eq('is_deleted', false)
    .maybeSingle();

  if (error) throw error;
  return toNewsResponse(data);
}

export async function deleteNews(id) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');

  const { error } = await supabase
    .from('news')
    .update({ is_deleted: true, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export async function createNews(payload) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');

  const { data, error } = await supabase
    .from('news')
    .insert([payload])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateNews(id, payload) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');

  const { data, error } = await supabase
    .from('news')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function extendNews(id, days = 30) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');

  const newDate = new Date();
  newDate.setDate(newDate.getDate() + days);
  const { data, error } = await supabase
    .from('news')
    .update({ 
      expires_at: newDate.toISOString(),
      updated_at: new Date().toISOString() 
    })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchAdminStats() {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');

  const { data, error } = await supabase
    .from('news')
    .select('is_featured, is_deleted, expires_at');
  if (error) throw error;

  const now = new Date();
  const rows = data.filter(item => !item.is_deleted);

  return {
    total: rows.length,
    active: rows.filter(item => new Date(item.expires_at) > now).length,
    expired: rows.filter(item => new Date(item.expires_at) <= now).length,
    featured: rows.filter(item => item.is_featured && new Date(item.expires_at) > now).length,
  };
}

// ─── Categories ────────────────────────────────────────────────────────────────

export async function fetchCategories() {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });
  if (error) throw error;
  return data;
}

export async function createCategory(name) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');

  const { data, error } = await supabase
    .from('categories')
    .insert([{ name }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCategory(id, name) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');

  const { data, error } = await supabase
    .from('categories')
    .update({ name, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(id) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ─── Comments ──────────────────────────────────────────────────────────────────

export async function fetchAdminComments() {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');

  const { data, error } = await supabase
    .from('comments')
    .select('*, news(title)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  
  return (data || []).map(c => ({
    ...c,
    news_title: c.news?.title || 'Unknown News'
  }));
}

export async function deleteComment(id) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
