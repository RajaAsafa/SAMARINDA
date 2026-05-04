import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../utils/helpers';
import { FiHome, FiFileText, FiTag, FiLogOut, FiSun, FiMoon, FiMessageSquare, FiUsers } from 'react-icons/fi';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/office' && location.pathname === '/office') return true;
    if (path !== '/office' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          Admin<span style={{ color: 'var(--blue-400)' }}>Panel</span>
        </div>
        
        <div style={styles.userInfo}>
          <div style={styles.avatar}>{user?.username?.charAt(0).toUpperCase()}</div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{user?.username}</div>
          </div>
        </div>

        <nav style={styles.nav}>
          <div style={styles.navSection}>Menu Admin</div>
          
          <Link to="/office" style={isActive('/office') ? styles.activeLink : styles.link}>
            <FiHome style={styles.icon} /> Dashboard
          </Link>
          
          <Link to="/office/berita" style={isActive('/office/berita') ? styles.activeLink : styles.link}>
            <FiFileText style={styles.icon} /> Manajemen Berita
          </Link>
          
          <Link to="/office/kategori" style={isActive('/office/kategori') ? styles.activeLink : styles.link}>
            <FiTag style={styles.icon} /> Kategori
          </Link>
          
          <Link to="/office/komentar" style={isActive('/office/komentar') ? styles.activeLink : styles.link}>
            <FiMessageSquare style={styles.icon} /> Komentar
          </Link>

          <Link to="/office/pengguna" style={isActive('/office/pengguna') ? styles.activeLink : styles.link}>
            <FiUsers style={styles.icon} /> Pengguna
          </Link>
        </nav>

        <div style={styles.sidebarBottom}>
          <Link to="/" style={styles.backLink}>&larr; Ke Web Publik</Link>
        </div>
      </aside>

      {/* Main Content */}
      <div style={styles.main}>
        {/* Top Header */}
        <header style={styles.topbar}>
          <h2 style={styles.pageTitle}>Samarinda Terbaru</h2>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button onClick={toggleTheme} style={styles.iconBtn}>
              {theme === 'light' ? <FiMoon /> : <FiSun />}
            </button>
            <button onClick={logout} style={styles.logoutBtn}>
              <FiLogOut /> Logout
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div style={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: 'var(--surface-2)',
  },
  sidebar: {
    width: '260px',
    backgroundColor: 'var(--blue-900)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
  },
  brand: {
    padding: '24px',
    fontFamily: 'var(--font-display)',
    fontSize: '22px',
    fontWeight: 700,
    color: '#fff',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  userInfo: {
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'var(--blue-600)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 700,
  },
  nav: {
    padding: '20px 0',
    flex: 1,
  },
  navSection: {
    fontSize: '10px',
    fontWeight: 700,
    color: 'var(--blue-400)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    padding: '0 24px 10px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 24px',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.2s',
    borderLeft: '3px solid transparent',
  },
  activeLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 24px',
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.08)',
    fontSize: '14px',
    fontWeight: 500,
    borderLeft: '3px solid var(--blue-400)',
  },
  icon: {
    fontSize: '18px',
  },
  sidebarBottom: {
    padding: '20px 24px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  backLink: {
    color: 'var(--blue-300)',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  main: {
    flex: 1,
    marginLeft: '260px',
    display: 'flex',
    flexDirection: 'column',
  },
  topbar: {
    height: '70px',
    backgroundColor: 'var(--surface)',
    borderBottom: '1px solid var(--border-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  pageTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: 'var(--ink)',
  },
  iconBtn: {
    background: 'transparent',
    border: '1px solid var(--border)',
    color: 'var(--ink-2)',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--accent)',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  content: {
    padding: '32px',
    flex: 1,
  }
};

export default AdminLayout;
