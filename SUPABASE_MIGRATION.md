# Migrasi PostgreSQL Lokal ke Supabase

Dokumen ini merangkum langkah migrasi project `web_berita` ke Supabase untuk database, auth, storage, dan Cloudflare Pages untuk frontend.

## 1. Install Package

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

Package Supabase yang dipakai:

```bash
npm install @supabase/supabase-js
```

## 2. Setup Supabase

1. Buat project baru di Supabase.
2. Buka `SQL Editor`.
3. Jalankan isi file `backend/src/config/init.sql`.
4. Pastikan bucket Storage `news-media` muncul di menu Storage.
5. Ambil nilai `Project URL`, `anon public key`, dan `service_role secret key` dari Project Settings > API.

Catatan keamanan: `SUPABASE_SERVICE_ROLE_KEY` hanya boleh berada di backend. Jangan pernah masukkan key ini ke Cloudflare Pages atau frontend.

## 3. Environment Backend

Buat `backend/.env` berdasarkan `backend/.env.example`:

```env
PORT=5000
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=news-media
JWT_SECRET=
```

`JWT_SECRET` disimpan sebagai kompatibilitas konfigurasi lama, tetapi login sekarang memakai access token dari Supabase Auth.

## 4. Environment Frontend

Buat `frontend/.env` berdasarkan `frontend/.env.example`:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_SUPABASE_STORAGE_BUCKET=news-media
VITE_API_URL=http://localhost:5000/api
```

Untuk Cloudflare Pages, masukkan environment variable berikut:

```env
VITE_SUPABASE_URL=https://PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=SUPABASE_ANON_PUBLIC_KEY
VITE_SUPABASE_STORAGE_BUCKET=news-media
VITE_API_URL=https://domain-backend-anda.com/api
```

Jangan masukkan `SUPABASE_SERVICE_ROLE_KEY` ke Cloudflare Pages.

Catatan: halaman publik, login admin, data berita, kategori, komentar, dan upload media berjalan langsung ke Supabase dari Cloudflare Pages. `VITE_API_URL` hanya wajib untuk fitur yang masih membutuhkan backend Node.js dengan `SUPABASE_SERVICE_ROLE_KEY`, seperti manajemen pengguna.

## 5. Test Lokal

Jalankan backend:

```bash
cd backend
npm run dev
```

Cek health endpoint:

```bash
curl http://localhost:5000/api/health
```

Jalankan frontend:

```bash
cd frontend
npm run dev
```

Build frontend:

```bash
cd frontend
npm run build
```

Output build berada di folder `frontend/dist`.

## 6. Seed Admin Opsional

Setelah schema Supabase dibuat dan `.env` backend lengkap, jalankan:

```bash
cd backend
npm run seed
```

Default login seed:

```text
username: admin
password: admin123
```

Segera ganti password setelah login.

## 7. Deploy Frontend ke Cloudflare Pages

Konfigurasi Cloudflare Pages:

```text
Framework preset: Vite
Build command: npm run build
Build output directory: dist
Root directory: frontend
```

Jika repository dihubungkan dari root monorepo, set root directory ke `frontend`. File `frontend/_redirects` sudah disiapkan agar route React seperti `/berita/:slug` dan `/office` tetap masuk ke `index.html`.

## 8. Backend Deploy

Cloudflare Pages hanya men-deploy frontend statis. Backend Express tetap perlu di-deploy ke platform Node.js seperti Render, Railway, Fly.io, VPS, atau Cloudflare Workers dengan adaptasi terpisah.

Jika ingin memakai fitur manajemen pengguna dari dashboard, backend Express harus online. Setelah backend online, ubah `VITE_API_URL` di Cloudflare Pages menjadi URL backend production, misalnya:

```env
VITE_API_URL=https://api.domain-anda.com/api
```
