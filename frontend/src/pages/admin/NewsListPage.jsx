import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiClock, FiPlus, FiStar } from 'react-icons/fi';
import api from '../../services/api';
import Pagination from '../../components/Pagination';
import { formatDate } from '../../utils/helpers';

const NewsListPage = () => {
  const [news, setNews] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    page: 1,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
  }, [filters]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/news', { params: { ...filters, limit: 10 } });
      if (res.data.success) {
        setNews(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Fetch admin news error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Hapus berita "${title}"?`)) return;
    try {
      const res = await api.delete(`/news/${id}`);
      if (res.data.success) fetchNews();
    } catch (err) {
      alert('Gagal menghapus berita');
    }
  };

  const handleExtend = async (id) => {
    if (!window.confirm('Perpanjang masa aktif berita ini selama 30 hari?')) return;
    try {
      const res = await api.patch(`/news/${id}/extend`, { days: 30 });
      if (res.data.success) {
        alert('Masa aktif berhasil diperpanjang');
        fetchNews();
      }
    } catch (err) {
      alert('Gagal memperpanjang masa aktif');
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.4s ease forwards' }}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>Manajemen Berita</h3>
          <p style={styles.subtitle}>Kelola semua artikel, berita, dan postingan publikasi.</p>
        </div>
        <Link to="/office/berita/baru" className="btn btn-primary" style={styles.addBtn}>
          <FiPlus /> Tulis Berita
        </Link>
      </div>

      <div style={styles.filterBox}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Pencarian Judul</label>
          <input 
            type="text" 
            name="search"
            placeholder="Ketik kata kunci..." 
            value={filters.search}
            onChange={handleFilterChange}
            style={styles.input}
          />
        </div>
        
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Filter Status</label>
          <select 
            name="status" 
            value={filters.status} 
            onChange={handleFilterChange}
            style={styles.select}
          >
            <option value="">Semua Status Berita</option>
            <option value="active">🟢 Sedang Aktif</option>
            <option value="expired">🔴 Sudah Expired</option>
          </select>
        </div>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Informasi Berita</th>
              <th style={styles.th}>Kategori</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Timeline</th>
              <th style={{ ...styles.th, textAlign: 'center', width: '150px' }}>Tindakan</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={styles.emptyState}>Memuat data berita...</td></tr>
            ) : news.length === 0 ? (
              <tr><td colSpan="5" style={styles.emptyState}>Belum ada berita yang ditemukan dengan filter saat ini.</td></tr>
            ) : (
              news.map(item => (
                <tr key={item.id} className="admin-table-row" style={styles.tr}>
                  <td style={styles.td}>
                    <div style={styles.titleCell}>
                      {item.is_featured && <FiStar style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px', filter: 'drop-shadow(0 2px 4px rgba(245,158,11,0.3))' }} />}
                      <div>
                        <div style={styles.newsTitle}>{item.title}</div>
                        <div style={styles.newsId}>ID: #{item.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.categoryTag}>{item.category_name || 'Uncategorized'}</span>
                  </td>
                  <td style={styles.td}>
                    {item.status === 'active' 
                      ? <span style={styles.badgeActive}>Aktif</span>
                      : <span style={styles.badgeExpired}>Expired</span>
                    }
                  </td>
                  <td style={styles.td}>
                    <div style={styles.dateBlock}>
                      <span style={styles.dateLabel}>Upload:</span> {formatDate(item.created_at)}
                    </div>
                    <div style={{ ...styles.dateBlock, color: item.status === 'expired' ? 'var(--accent)' : 'inherit', marginTop: '4px' }}>
                      <span style={styles.dateLabel}>Expired:</span> {formatDate(item.expired_at)}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      {item.status === 'expired' && (
                        <button onClick={() => handleExtend(item.id)} style={{...styles.actionBtn, color: 'var(--success)', backgroundColor: 'var(--success-bg)'}} title="Perpanjang 30 Hari">
                          <FiClock />
                        </button>
                      )}
                      <button onClick={() => navigate(`/office/berita/edit/${item.slug}`)} style={{...styles.actionBtn, color: 'var(--blue-600)', backgroundColor: 'var(--blue-50)'}} title="Edit Berita">
                        <FiEdit2 />
                      </button>
                      <button onClick={() => handleDelete(item.id, item.title)} style={{...styles.actionBtn, color: 'var(--accent)', backgroundColor: '#ffe4e6'}} title="Hapus Berita">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination pagination={pagination} onPageChange={(p) => setFilters({...filters, page: p})} />
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'end',
    marginBottom: '32px',
    borderBottom: '1px solid var(--border-light)',
    paddingBottom: '20px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '28px',
    fontWeight: 800,
    color: 'var(--ink)',
    marginBottom: '4px',
  },
  subtitle: {
    color: 'var(--ink-4)',
    fontSize: '14px',
  },
  addBtn: {
    padding: '12px 20px',
    borderRadius: '100px',
    boxShadow: 'var(--shadow-sm)',
    fontWeight: 600,
  },
  filterBox: {
    display: 'flex',
    gap: '24px',
    marginBottom: '24px',
    backgroundColor: 'var(--surface)',
    padding: '24px',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-light)',
    boxShadow: 'var(--shadow-sm)',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
    maxWidth: '400px',
  },
  filterLabel: {
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--ink-4)',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    fontSize: '14px',
    backgroundColor: 'var(--surface-2)',
    color: 'var(--ink)',
    transition: 'all 0.2s',
    outline: 'none',
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    fontSize: '14px',
    backgroundColor: 'var(--surface-2)',
    color: 'var(--ink)',
    cursor: 'pointer',
    outline: 'none',
  },
  tableWrapper: {
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-lg)',
    overflowX: 'auto',
    boxShadow: 'var(--shadow-sm)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    whiteSpace: 'nowrap',
  },
  th: {
    padding: '16px 24px',
    backgroundColor: 'var(--surface-2)',
    color: 'var(--ink-3)',
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '2px solid var(--border-light)',
  },
  tr: {
    borderBottom: '1px solid var(--border-light)',
    transition: 'background-color 0.2s',
  },
  td: {
    padding: '20px 24px',
    verticalAlign: 'middle',
    color: 'var(--ink-2)',
    fontSize: '14px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
    color: 'var(--ink-4)',
    fontSize: '15px',
    fontStyle: 'italic',
  },
  titleCell: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    whiteSpace: 'normal',
    maxWidth: '450px',
  },
  newsTitle: {
    fontWeight: 700,
    color: 'var(--ink)',
    fontSize: '15px',
    lineHeight: 1.4,
    marginBottom: '4px',
  },
  newsId: {
    fontSize: '12px',
    color: 'var(--ink-4)',
    fontFamily: 'monospace',
  },
  categoryTag: {
    backgroundColor: 'var(--surface-3)',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--ink-2)',
  },
  badgeActive: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: 'var(--success-bg)',
    color: 'var(--success)',
    padding: '6px 12px',
    borderRadius: '100px',
    fontSize: '12px',
    fontWeight: 700,
  },
  badgeExpired: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: 'var(--warning-bg)',
    color: 'var(--warning)',
    padding: '6px 12px',
    borderRadius: '100px',
    fontSize: '12px',
    fontWeight: 700,
  },
  dateBlock: {
    fontSize: '13px',
    color: 'var(--ink-3)',
  },
  dateLabel: {
    fontWeight: 600,
    color: 'var(--ink-4)',
    display: 'inline-block',
    width: '60px',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  actionBtn: {
    border: 'none',
    cursor: 'pointer',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    transition: 'all 0.2s',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  }
};

export default NewsListPage;
