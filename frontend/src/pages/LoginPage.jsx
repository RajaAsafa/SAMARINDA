import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLock, FiUser, FiArrowLeft } from 'react-icons/fi';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/office';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(username, password);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.backLink}><FiArrowLeft /> Ke Beranda</Link>
      
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Admin Login</h2>
          <p style={styles.subtitle}>Samarinda Terbaru Portal</p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <div style={styles.inputWrapper}>
              <FiUser style={styles.icon} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
                placeholder="Masukkan username"
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <FiLock style={styles.icon} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                placeholder="Masukkan password"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? 'Memproses...' : 'Login Sekarang'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--surface-2)',
    padding: '20px',
  },
  backLink: {
    position: 'absolute',
    top: '30px',
    left: '30px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--ink-3)',
    fontSize: '14px',
    fontWeight: 500,
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: 'var(--surface)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    padding: '40px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '28px',
    fontWeight: 700,
    color: 'var(--ink)',
    marginBottom: '8px',
  },
  subtitle: {
    color: 'var(--ink-4)',
    fontSize: '14px',
  },
  errorBox: {
    backgroundColor: 'var(--warning-bg)',
    color: 'var(--warning)',
    padding: '12px 16px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '13px',
    fontWeight: 500,
    marginBottom: '20px',
    borderLeft: '4px solid #f59e0b',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--ink-2)',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    left: '14px',
    color: 'var(--ink-4)',
  },
  input: {
    width: '100%',
    padding: '12px 16px 12px 40px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'var(--surface)',
    color: 'var(--ink)',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  submitBtn: {
    marginTop: '10px',
    width: '100%',
    padding: '12px',
    fontSize: '15px',
  }
};

export default LoginPage;
