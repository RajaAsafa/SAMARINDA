import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import FilterPanel from '../components/FilterPanel';
import NewsCard from '../components/NewsCard';
import Pagination from '../components/Pagination';
import SkeletonCard from '../components/SkeletonCard';
import { fetchNewsList } from '../services/publicData';

const HomePage = () => {
  const [news, setNews] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get('search') || '';

  const [filters, setFilters] = useState({
    search: initialSearch,
    category_id: '',
    date_from: '',
    date_to: '',
    page: 1,
  });

  useEffect(() => {
    if (initialSearch !== filters.search) {
      setFilters(prev => ({ ...prev, search: initialSearch, page: 1 }));
    }
  }, [initialSearch]);

  useEffect(() => {
    fetchNews();
  }, [filters]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const result = await fetchNewsList({ ...filters, limit: 9 });
      setNews(result.data);
      setPagination(result.pagination);
    } catch (err) {
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 500, behavior: 'smooth' });
  };

  return (
    <>
      <Navbar />
      
      <main className="container" style={{ padding: '40px 24px' }}>
        {/* Hero Section only shows on page 1 without search/filters */}
        {filters.page === 1 && !filters.search && !filters.category_id && !filters.date_from && !filters.date_to && (
          <HeroSection />
        )}

        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--ink)' }}>
            {filters.search ? `Hasil Pencarian: "${filters.search}"` : 'Berita Terbaru'}
          </h2>
        </div>

        <FilterPanel filters={filters} onFilterChange={handleFilterChange} />

        <div style={styles.grid}>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={`skel-${i}`} />)
          ) : news.length > 0 ? (
            news.map(item => <NewsCard key={item.id} news={item} />)
          ) : (
            <div style={styles.emptyState}>
              <p>Tidak ada berita yang ditemukan.</p>
              <button 
                className="btn btn-primary"
                onClick={() => setFilters({ search: '', category_id: '', date_from: '', date_to: '', page: 1 })}
                style={{ marginTop: '16px' }}
              >
                Reset Filter
              </button>
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
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

export default HomePage;
