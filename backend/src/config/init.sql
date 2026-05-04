-- Samarinda Terbaru — Database Schema
-- ================================================

DROP TABLE IF EXISTS news CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(300) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  image_url VARCHAR(500),
  video_url VARCHAR(500),
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  expired_at TIMESTAMP DEFAULT (NOW() + INTERVAL '30 days')
);

CREATE INDEX IF NOT EXISTS idx_news_expired_at ON news(expired_at);
CREATE INDEX IF NOT EXISTS idx_news_category_id ON news(category_id);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_is_deleted ON news(is_deleted);
