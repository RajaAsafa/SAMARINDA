/**
 * publicData.js
 * Service layer untuk halaman publik.
 * Query langsung ke Supabase agar frontend yang di-deploy di Cloudflare Pages
 * tetap bisa menampilkan data tanpa backend Express.
 *
 * Halaman admin tetap menggunakan API (backend) karena butuh service_role_key.
 */
import { supabase } from './supabase';

// ─── helpers ───────────────────────────────────────────────────────────────────

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

// ─── news ──────────────────────────────────────────────────────────────────────

export async function fetchNewsList({ search, category_id, date_from, date_to, page = 1, limit = 9 } = {}) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');

  let query = supabase
    .from('news')
    .select('*, categories(name)', { count: 'exact' })
    .eq('is_deleted', false)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false });

  if (search) {
    const value = String(search).replace(/[%_]/g, '\\$&');
    query = query.or(`title.ilike.%${value}%,content.ilike.%${value}%`);
  }
  if (category_id) query = query.eq('category_id', parseInt(category_id));
  if (date_from) query = query.gte('created_at', date_from);
  if (date_to) query = query.lte('created_at', date_to);

  const safePage = Math.max(parseInt(page, 10) || 1, 1);
  const safeLimit = Math.max(parseInt(limit, 10) || 9, 1);
  const from = (safePage - 1) * safeLimit;
  const to = from + safeLimit - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;
  if (error) throw error;

  return {
    data: (data || []).map(toNewsResponse),
    pagination: {
      currentPage: safePage,
      totalPages: Math.ceil((count || 0) / safeLimit),
      totalItems: count || 0,
      limit: safeLimit,
    },
  };
}

export async function fetchFeaturedNews(limit = 3) {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('news')
    .select('*, categories(name)')
    .eq('is_featured', true)
    .eq('is_deleted', false)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []).map(toNewsResponse);
}

export async function fetchNewsBySlug(slug) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('news')
    .select('*, categories(name)')
    .eq('slug', slug)
    .eq('is_deleted', false)
    .maybeSingle();

  if (error) throw error;
  return toNewsResponse(data);
}

// ─── categories ────────────────────────────────────────────────────────────────

export async function fetchCategories() {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data || [];
}

// ─── comments ──────────────────────────────────────────────────────────────────

export async function fetchCommentsByNewsId(newsId) {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('news_id', newsId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function postComment({ news_id, name, content }) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');

  const { data, error } = await supabase
    .from('comments')
    .insert({ news_id, name, content })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}
