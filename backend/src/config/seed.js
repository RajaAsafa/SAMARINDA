const userModel = require('../models/userModel');
const categoryModel = require('../models/categoryModel');
const newsModel = require('../models/newsModel');

const generateSlug = (title) => title
  .toLowerCase()
  .replace(/[^\w\s-]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')
  .trim();

async function seed() {
  try {
    console.log('Menjalankan seed data Supabase...');

    const existingAdmin = await userModel.findByUsername('admin');
    if (!existingAdmin) {
      await userModel.create('admin', 'admin123', 'admin');
      console.log('Admin user dibuat: admin / admin123');
    } else {
      console.log('Admin user sudah ada, dilewati.');
    }

    const categories = ['Politik', 'Ekonomi', 'Olahraga', 'Teknologi', 'Budaya', 'Kesehatan', 'Pendidikan'];
    const categoryIds = {};

    for (const name of categories) {
      const existing = (await categoryModel.getAll()).find((category) => category.name === name);
      const category = existing || await categoryModel.create(name);
      categoryIds[name] = category.id;
    }
    console.log('Kategori berhasil disiapkan.');

    const topics = {
      Politik: ['Pilkada Samarinda', 'Kebijakan Baru Walikota', 'Sidang DPRD Kaltim', 'Kunjungan Menteri ke Samarinda', 'Reformasi Birokrasi'],
      Ekonomi: ['Pasar Pagi Samarinda Modernisasi', 'Inflasi di Kaltim', 'Investasi Ibu Kota Baru', 'Pertumbuhan UMKM Lokal', 'Harga Sembako Stabil'],
      Olahraga: ['Pusamania Borneo FC Update', 'Persiapan PON Kaltim', 'Kejuaraan Bulu Tangkis', 'Lari Marathon Mahakam', 'Fasilitas GOR Segiri'],
      Teknologi: ['Samarinda Digital Valley', 'Startup Lokal Samarinda', 'Implementasi Smart City', 'Workshop Coding Pelajar', 'Inovasi Panel Surya'],
      Budaya: ['Festival Mahakam 2026', 'Tarian Tradisional Dayak', 'Kuliner Khas Samarinda', 'Pelestarian Cagar Budaya', 'Pameran Batik Kaltim'],
      Kesehatan: ['Vaksinasi Massal', 'Layanan RSUD AWS', 'Tips Hidup Sehat', 'Pencegahan DBD di Samarinda', 'Klinik Apung Mahakam'],
      Pendidikan: ['Beasiswa Kaltim Tuntas', 'Inovasi Guru Samarinda', 'Pembangunan Sekolah Baru', 'Lulusan SMK Siap Kerja', 'Perpustakaan Digital'],
    };

    let totalSeeded = 0;
    for (const catName of categories) {
      for (let i = 0; i < 5; i += 1) {
        const title = `${topics[catName][i]} - Berita ${i + 1}`;
        const slug = `${generateSlug(title)}-${Math.random().toString(36).substring(2, 7)}`;
        const content = `<p>Ini adalah konten berita untuk <strong>${title}</strong>. Samarinda terus berkembang dengan berbagai inovasi di sektor ${catName.toLowerCase()}.</p><p>Diharapkan dengan adanya berita ini, masyarakat dapat lebih terinformasi mengenai perkembangan terbaru di Kota Tepian.</p>`;
        const image_url = `https://picsum.photos/seed/${slug}/800/450`;

        const news = await newsModel.create({
          title,
          slug,
          content,
          image_url,
          category_id: categoryIds[catName],
          is_featured: i === 0,
        });

        if (i === 4) {
          await newsModel.update(news.id, {
            expires_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          });
        }

        totalSeeded += 1;
      }
    }

    console.log(`${totalSeeded} berita berhasil dibuat.`);
    console.log('Seed selesai. Login: admin / admin123');
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();
