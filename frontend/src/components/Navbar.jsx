import { Link, useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiMenu, FiX, FiSearch, FiUser } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../utils/helpers';
import api from '../services/api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching categories');
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?search=${encodeURIComponent(search.trim())}`);
      setIsOpen(false);
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header style={{...styles.header, ...(isScrolled ? styles.headerScrolled : {})}} className={isScrolled ? (theme === 'dark' ? 'glass-dark' : 'glass') : ''}>
      <div className="container" style={styles.container}>
        {/* Brand */}
        <Link to="/" style={styles.brand}>
          Samarinda<span style={styles.brandAccent}>Terbaru</span>
        </Link>

        {/* Desktop Nav */}
        <div style={styles.desktopNav} className="desktop-nav">
          <nav style={styles.navLinks}>
            <Link to="/" style={styles.link} className="nav-link-custom">Beranda</Link>
            <div style={styles.dropdownContainer} className="dropdown-container">
              <span style={styles.link} className="nav-link-custom">Kategori</span>
              <div style={styles.dropdownMenu} className="dropdown-menu">
                {categories.map((c) => (
                  <Link key={c.id} to={`/kategori/${c.id}`} style={styles.dropdownItem}>
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <form onSubmit={handleSearch} style={styles.searchForm}>
            <input 
              type="text" 
              placeholder="Cari berita..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
            <button type="submit" style={styles.searchBtn}>
              <FiSearch />
            </button>
          </form>

          <button onClick={toggleTheme} style={styles.iconBtn} aria-label="Toggle Theme">
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={toggleMenu} style={styles.mobileToggle}>
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div style={styles.mobileNav}>
          <form onSubmit={handleSearch} style={{...styles.searchForm, margin: '1rem'}}>
            <input 
              type="text" 
              placeholder="Cari berita..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{...styles.searchInput, width: '100%'}}
            />
            <button type="submit" style={styles.searchBtn}><FiSearch /></button>
          </form>
          <Link to="/" style={styles.mobileLink} onClick={toggleMenu}>Beranda</Link>
          <div style={styles.mobileCategoryTitle}>Kategori</div>
          <div style={styles.mobileCategoryList}>
            {categories.map((c) => (
              <Link key={c.id} to={`/kategori/${c.id}`} style={styles.mobileSubLink} onClick={toggleMenu}>
                {c.name}
              </Link>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
             <button onClick={toggleTheme} style={{...styles.iconBtn, flex: 1}} aria-label="Toggle Theme">
                {theme === 'light' ? <><FiMoon /> Dark Mode</> : <><FiSun /> Light Mode</>}
             </button>
          </div>
        </div>
      )}
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: 'var(--surface)',
    borderBottom: '1px solid var(--border-light)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    transition: 'all 0.3s ease',
  },
  headerScrolled: {
    backgroundColor: 'transparent',
    boxShadow: 'var(--shadow-sm)',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '70px',
  },
  brand: {
    fontFamily: 'var(--font-display)',
    fontSize: '24px',
    fontWeight: 900,
    color: 'var(--ink)',
  },
  brandAccent: {
    color: 'var(--blue-500)',
  },
  desktopNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
  },
  link: {
    fontSize: '15px',
    fontWeight: 500,
    color: 'var(--ink-2)',
    cursor: 'pointer',
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-md)',
    minWidth: '180px',
    display: 'none', /* Fallback for initial state before class takes over */
    flexDirection: 'column',
    padding: '8px 0',
    marginTop: '10px',
  },
  dropdownItem: {
    padding: '10px 16px',
    fontSize: '14px',
    color: 'var(--ink-2)',
  },
  searchForm: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--surface-2)',
    borderRadius: '100px',
    padding: '4px 8px 4px 16px',
  },
  searchInput: {
    border: 'none',
    background: 'transparent',
    outline: 'none',
    fontSize: '14px',
    color: 'var(--ink)',
    width: '180px',
  },
  searchBtn: {
    background: 'var(--blue-600)',
    border: 'none',
    color: '#fff',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
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
    fontSize: '16px',
  },
  authBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--blue-600)',
    padding: '8px 16px',
    backgroundColor: 'var(--blue-50)',
    borderRadius: '100px',
  },
  mobileToggle: {
    background: 'transparent',
    border: 'none',
    color: 'var(--ink)',
    cursor: 'pointer',
    display: 'none', // Overridden in global CSS via media query
  },
  mobileNav: {
    borderTop: '1px solid var(--border-light)',
    backgroundColor: 'var(--surface)',
    padding: '10px 0',
  },
  mobileLink: {
    display: 'block',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 500,
    color: 'var(--ink)',
    borderBottom: '1px solid var(--border-light)',
  },
  mobileCategoryTitle: {
    padding: '12px 24px 4px',
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
    color: 'var(--ink-4)',
    letterSpacing: '1px',
  },
  mobileCategoryList: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    padding: '8px 24px',
  },
  mobileSubLink: {
    padding: '8px 0',
    fontSize: '14px',
    color: 'var(--ink-2)',
  },
  btnPrimary: {
    background: 'var(--blue-600)',
    color: '#fff',
    padding: '10px 16px',
    borderRadius: 'var(--radius-md)',
    fontWeight: 600,
  }
};

export default Navbar;
