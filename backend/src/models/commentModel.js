const { supabaseAdmin } = require('../config/db');

class CommentModel {
  static async create({ news_id, name, content }) {
    const { data, error } = await supabaseAdmin
      .from('comments')
      .insert({ news_id, name, content })
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  static async getByNewsId(news_id) {
    const { data: news, error: newsError } = await supabaseAdmin
      .from('news')
      .select('id')
      .eq('id', news_id)
      .eq('is_deleted', false)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (newsError) throw newsError;
    if (!news) return [];

    const { data, error } = await supabaseAdmin
      .from('comments')
      .select('*')
      .eq('news_id', news_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async delete(id) {
    const { data, error } = await supabaseAdmin
      .from('comments')
      .delete()
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async getAll() {
    const { data, error } = await supabaseAdmin
      .from('comments')
      .select('*, news(title)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map((comment) => ({
      ...comment,
      news_title: comment.news?.title || null,
    }));
  }
}

module.exports = CommentModel;
