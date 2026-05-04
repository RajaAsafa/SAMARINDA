const { supabaseAdmin } = require('../config/db');

const categoryModel = {
  async getAll() {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async create(name) {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert({ name })
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, name) {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .update({ name, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .delete()
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getNewsCount(id) {
    const { count, error } = await supabaseAdmin
      .from('news')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', id)
      .eq('is_deleted', false);

    if (error) throw error;
    return count || 0;
  },
};

module.exports = categoryModel;
