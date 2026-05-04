const db = require('./db');

async function migrate() {
  try {
    console.log('🔄 Memulai migrasi slug...');
    
    // 1. Tambah kolom slug
    await db.query('ALTER TABLE news ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE');
    console.log('✅ Kolom slug berhasil ditambahkan (atau sudah ada).');

    // 2. Ambil semua berita yang belum punya slug
    const res = await db.query('SELECT id, title FROM news WHERE slug IS NULL');
    const newsItems = res.rows;

    console.log(`📝 Ditemukan ${newsItems.length} berita tanpa slug. Menghasilkan slug...`);

    for (const item of newsItems) {
      let slug = item.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Hapus karakter non-alfanumerik
        .replace(/\s+/g, '-')     // Ganti spasi dengan -
        .replace(/-+/g, '-')      // Hapus - ganda
        .trim();
      
      // Tambahkan ID di belakang untuk memastikan keunikan jika terjadi tabrakan
      const finalSlug = `${slug}-${item.id}`;
      
      await db.query('UPDATE news SET slug = $1 WHERE id = $2', [finalSlug, item.id]);
    }

    console.log('✅ Migrasi slug selesai!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Terjadi kesalahan migrasi:', err);
    process.exit(1);
  }
}

migrate();
