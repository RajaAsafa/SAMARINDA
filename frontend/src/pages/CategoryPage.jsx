import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NewsCard from '../components/NewsCard';
import Pagination from '../components/Pagination';
import SkeletonCard from '../components/SkeletonCard';
import API from '../services/api';

const CategoryPage = () => {
  const { id } = useParams();
  const [news, setNews] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // Reset page when category changes
    setPage(1);
  }, [id]);

  useEffect(() => {
    fetchNews();
    // Try to get category name from categories list
    const fetchCategoryName = async () => {
      try {
        const res = await API.get('/categories');
        const cat = res.data.data.find(c => c.id === parseInt(id));
        if (cat) setCategoryName(cat.name);
      } catch (err) {}
    };
    fetchCategoryName();
  }, [id, page]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await API.get('/news', { 
        params: { category_id: id, limit: 9, page } 
      });
      if (res.data.success) {
        setNews(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching category news:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Navbar />
      
      <main className="container" style={{ padding: '40px 24px', minHeight: '70vh' }}>
        <div style={{ marginBottom: '40px', borderBottom: '2px solid var(--border-light)', paddingBottom: '20px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--ink)' }}>
            Kategori: <span style={{ color: 'var(--blue-600)' }}>{categoryName || 'Memuat...'}</span>
          </h1>
        </div>

        <div style={styles.grid}>
          {loading ? (
            Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={`skel-${i}`} />)
          ) : news.length > 0 ? (
            news.map(item => <NewsCard key={item.id} news={item} />)
          ) : (
            <div style={styles.emptyState}>
              <p>Belum ada berita di kategori ini.</p>
            </div>
          )}
        </div>

        {!loading && <Pagination pagination={pagination} onPageChange={handlePageChange} />}
      </main>

      <Footer />
    </>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  },
  emptyState: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: 'var(--surface)',
    borderRadius: 'var(--radius-md)',
    border: '1px dashed var(--border)',
    color: 'var(--ink-4)',
  }
};

export default CategoryPage;
