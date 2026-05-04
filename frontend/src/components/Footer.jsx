const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.gradientTop}></div>
      <div className="container" style={styles.container}>
        <div style={styles.brandGroup}>
          <div style={styles.brand}>
            <img src="/logo.png" alt="Logo" style={styles.logo} />
            <span>Samarinda<span style={styles.brandAccent}>Terbaru</span></span>
          </div>
          <p style={styles.desc}>
            Portal berita digital modern yang menyajikan informasi terkini untuk warga Samarinda, Kalimantan Timur.
          </p>
        </div>
        
        <div style={styles.linksGroup}>
          <div>
            <h4 style={styles.heading}>Kategori</h4>
            <ul style={styles.list}>
              <li><a href="/kategori/1" style={styles.link}>Politik</a></li>
              <li><a href="/kategori/2" style={styles.link}>Ekonomi</a></li>
              <li><a href="/kategori/3" style={styles.link}>Olahraga</a></li>
            </ul>
          </div>
          <div>
            <h4 style={styles.heading}>Perusahaan</h4>
            <ul style={styles.list}>
              <li><a href="#" style={styles.link}>Tentang Kami</a></li>
              <li><a href="#" style={styles.link}>Redaksi</a></li>
              <li><a href="#" style={styles.link}>Kontak</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div style={styles.bottom}>
        <div className="container" style={styles.bottomInner}>
          <p>&copy; {new Date().getFullYear()} Samarinda Terbaru. Hak Cipta Dilindungi<a href="/staff-only" style={{ color: 'inherit', textDecoration: 'none', cursor: 'default' }}>.</a></p>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: 'var(--blue-950)',
    color: 'var(--ink-3)',
    paddingTop: '60px',
    marginTop: '60px',
    position: 'relative',
  },
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, var(--blue-600), var(--blue-400), var(--blue-600))',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '40px',
    marginBottom: '40px',
  },
  brandGroup: {
    maxWidth: '350px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontFamily: 'var(--font-display)',
    fontSize: '24px',
    fontWeight: 900,
    color: '#fff',
    marginBottom: '16px',
  },
  logo: {
    height: '32px',
    width: 'auto',
  },
  brandAccent: {
    color: 'var(--blue-400)',
  },
  desc: {
    fontSize: '14px',
    lineHeight: 1.7,
    color: '#8c959f',
  },
  linksGroup: {
    display: 'flex',
    gap: '60px',
  },
  heading: {
    color: '#fff',
    fontSize: '15px',
    fontWeight: 600,
    marginBottom: '20px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  link: {
    color: '#8c959f',
    fontSize: '14px',
    transition: 'color 0.2s',
  },
  bottom: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    padding: '20px 0',
  },
  bottomInner: {
    fontSize: '13px',
    color: '#57606a',
    textAlign: 'center',
  }
};

export default Footer;
