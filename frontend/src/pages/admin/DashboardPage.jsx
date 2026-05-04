import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiAlertCircle, FiCheckCircle, FiStar } from 'react-icons/fi';
import { fetchAdminStats } from '../../services/adminData';

const DashboardPage = () => {
  const [stats, setStats] = useState({ total: 0, active: 0, expired: 0, featured: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await fetchAdminStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p>Memuat dashboard...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '20px', color: 'var(--ink)' }}>Dashboard Overview</h3>
        <Link to="/admin/berita/baru" className="btn btn-primary">
          + Tulis Berita Baru
        </Link>
      </div>

      <div style={styles.grid}>
        <div style={styles.statCard}>
          <div style={{...styles.iconBox, backgroundColor: 'var(--blue-50)', color: 'var(--blue-600)' }}>
            <FiFileText size={24} />
          </div>
          <div>
            <div style={styles.statLabel}>Total Berita</div>
            <div style={styles.statValue}>{stats.total}</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{...styles.iconBox, backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
            <FiCheckCircle size={24} />
          </div>
          <div>
            <div style={styles.statLabel}>Berita Aktif</div>
            <div style={styles.statValue}>{stats.active}</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{...styles.iconBox, backgroundColor: 'var(--warning-bg)', color: 'var(--warning)' }}>
            <FiAlertCircle size={24} />
          </div>
          <div>
            <div style={styles.statLabel}>Berita Expired</div>
            <div style={styles.statValue}>{stats.expired}</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{...styles.iconBox, backgroundColor: '#fef3c7', color: '#d97706' }}>
            <FiStar size={24} />
          </div>
          <div>
            <div style={styles.statLabel}>Berita Featured</div>
            <div style={styles.statValue}>{stats.featured}</div>
          </div>
        </div>
      </div>

      <div style={styles.infoBox}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--blue-700)', marginBottom: '8px' }}>
          <FiAlertCircle /> Info Auto-Expired
        </h4>
        <p style={{ fontSize: '14px', color: 'var(--ink-2)', lineHeight: 1.6 }}>
          Sistem akan secara otomatis menyembunyikan berita 30 hari setelah dipublikasikan. 
          Berita yang sudah expired tidak akan tampil di halaman publik, namun masih dapat Anda lihat 
          dan kelola di menu <strong>Manajemen Berita</strong>. Anda dapat memperpanjang masa aktif berita kapan saja.
        </p>
      </div>
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  statCard: {
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    boxShadow: 'var(--shadow-sm)',
  },
  iconBox: {
    width: '56px',
    height: '56px',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--ink-3)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '4px',
  },
  statValue: {
    fontFamily: 'var(--font-display)',
    fontSize: '32px',
    fontWeight: 900,
    color: 'var(--ink)',
    lineHeight: 1,
  },
  infoBox: {
    backgroundColor: 'var(--blue-50)',
    border: '1px solid var(--blue-200)',
    borderLeft: '4px solid var(--blue-500)',
    borderRadius: 'var(--radius-md)',
    padding: '20px',
  }
};

export default DashboardPage;
