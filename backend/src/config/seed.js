const pool = require('./db');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function seed() {
  try {
    // Init tables first
    const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf-8');
    await pool.query(sql);
    console.log('✅ Tables created');

    // Seed admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await pool.query(
      `INSERT INTO users (username, password, role) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING`,
      ['admin', hashedPassword, 'admin']
    );
    console.log('✅ Admin user seeded (admin / admin123)');

    // Seed categories
    const categories = ['Politik', 'Ekonomi', 'Olahraga', 'Teknologi', 'Budaya', 'Kesehatan', 'Pendidikan'];
    const categoryIds = {};
    
    for (const name of categories) {
      const res = await pool.query(`INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id`, [name]);
      categoryIds[name] = res.rows[0].id;
    }
    console.log('✅ Categories seeded');

    const generateSlug = (title) => {
      return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    };

    const topics = {
      'Politik': ['Pilkada Samarinda', 'Kebijakan Baru Walikota', 'Sidang DPRD Kaltim', 'Kunjungan Menteri ke Samarinda', 'Reformasi Birokrasi'],
      'Ekonomi': ['Pasar Pagi Samarinda Modernisasi', 'Inflasi di Kaltim', 'Investasi Ibu Kota Baru', 'Pertumbuhan UMKM Lokal', 'Harga Sembako Stabil'],
      'Olahraga': ['Pusamania Borneo FC Update', 'Persiapan PON Kaltim', 'Kejuaraan Bulu Tangkis', 'Lari Marathon Mahakam', 'Fasilitas GOR Segiri'],
      'Teknologi': ['Samarinda Digital Valley', 'Startup Lokal Samarinda', 'Implementasi Smart City', 'Workshop Coding Pelajar', 'Inovasi Panel Surya'],
      'Budaya': ['Festival Mahakam 2026', 'Tarian Tradisional Dayak', 'Kuliner Khas Samarinda', 'Pelestarian Cagar Budaya', 'Pameran Batik Kaltim'],
      'Kesehatan': ['Vaksinasi Massal', 'Layanan RSUD AWS', 'Tips Hidup Sehat', 'Pencegahan DBD di Samarinda', 'Klinik Apung Mahakam'],
      'Pendidikan': ['Beasiswa Kaltim Tuntas', 'Inovasi Guru Samarinda', 'Pembangunan Sekolah Baru', 'Lulusan SMK Siap Kerja', 'Perpustakaan Digital'],
    };

    let totalSeeded = 0;
    for (const catName of categories) {
      const catId = categoryIds[catName];
      const categoryTopics = topics[catName];

      for (let i = 0; i < 5; i++) {
        const title = `${categoryTopics[i]} - Berita ${i + 1}`;
        const slug = `${generateSlug(title)}-${Math.random().toString(36).substring(2, 7)}`;
        const content = `<p>Ini adalah konten berita untuk <strong>${title}</strong>. Samarinda terus berkembang dengan berbagai inovasi di sektor ${catName.toLowerCase()}.</p><p>Diharapkan dengan adanya berita ini, masyarakat dapat lebih terinformasi mengenai perkembangan terbaru di Kota Tepian.</p>`;
        
        // One expired article per category (the 5th one)
        const isExpired = i === 4;
        const expiryInterval = isExpired ? "'-1 day'" : "'30 days'";
        const imageUrl = `https://picsum.photos/seed/${slug}/800/450`;

        await pool.query(
          `INSERT INTO news (title, slug, content, image_url, category_id, is_featured, created_at, expired_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW() - INTERVAL '2 days', NOW() + INTERVAL ${expiryInterval})`,
          [title, slug, content, imageUrl, catId, i === 0]
        );
        totalSeeded++;
      }
    }

    console.log(`✅ ${totalSeeded} news articles seeded`);
    console.log('\n🎉 Database seeding complete!');
    console.log('   👤 Login: admin / admin123');
    console.log('   🌐 API: http://localhost:5000/api\n');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    await pool.end();
  }
}

seed();
