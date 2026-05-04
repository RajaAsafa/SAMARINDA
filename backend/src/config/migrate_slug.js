const { supabaseAdmin } = require('./db');

const generateSlug = (title) => title
  .toLowerCase()
  .replace(/[^\w\s-]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')
  .trim();

async function migrate() {
  try {
    console.log('Memulai migrasi slug Supabase...');

    const { data, error } = await supabaseAdmin
      .from('news')
      .select('id, title')
      .is('slug', null);

    if (error) throw error;

    for (const item of data) {
      const slug = `${generateSlug(item.title)}-${item.id}`;
      const { error: updateError } = await supabaseAdmin
        .from('news')
        .update({ slug })
        .eq('id', item.id);

      if (updateError) throw updateError;
    }

    console.log(`Migrasi slug selesai. ${data.length} berita diperbarui.`);
    process.exit(0);
  } catch (err) {
    console.error('Terjadi kesalahan migrasi:', err);
    process.exit(1);
  }
}

migrate();
