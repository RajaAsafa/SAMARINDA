import { useState, useEffect } from 'react';
import { FiTrash2, FiUserPlus, FiUser } from 'react-icons/fi';
import api from '../../services/api';
import { formatDate } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

const UserManagePage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Custom hook for auth user could be used to prevent self deletion, 
  // but we already protect it on backend. Let's just fetch standard logged in user if needed.
  // const { user: currentUser } = useAuth(); // Assuming useAuth exposes the logged in user

  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error('Fetch users error', err);
      setError('Gagal memuat data pengguna.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    
    try {
      setError('');
      setSuccess('');
      const res = await api.post('/admin/users', { username, password, role });
      if (res.data.success) {
        setUsers([...users, res.data.data]);
        setUsername('');
        setPassword('');
        setRole('admin');
        setSuccess('Pengguna berhasil ditambahkan.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menambahkan pengguna.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Hapus akun pengguna "${name}"? TINDAKAN INI TIDAK BISA DIBATALKAN.`)) return;
    
    try {
      setError('');
      setSuccess('');
      const res = await api.delete(`/admin/users/${id}`);
      if (res.data.success) {
        setUsers(users.filter(u => u.id !== id));
        setSuccess(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menghapus pengguna.');
    }
  };

  if (loading) return <p>Memuat data...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>Manajemen Pengguna</h3>
          <p style={styles.subtitle}>Kelola akun admin dan penulis aplikasi.</p>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={{...styles.error, backgroundColor: 'var(--success-bg)', color: 'var(--success)'}}>{success}</div>}

      <div style={styles.layout}>
        {/* Kolom Tabel User */}
        <div style={styles.tableCol}>
          <div style={styles.card}>
            <h4 style={styles.cardTitle}><FiUser /> Daftar Pengguna</h4>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Username</th>
                    <th style={styles.th}>Role</th>
                    <th style={styles.th}>Terdaftar</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={styles.emptyState}>Belum ada pengguna.</td>
                    </tr>
                  ) : (
                    users.map(u => (
                      <tr key={u.id} className="admin-table-row" style={styles.tr}>
                        <td style={styles.td}>
                          <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{u.username}</div>
                        </td>
                        <td style={styles.td}>
                          <span style={u.role === 'admin' ? styles.badgeAdmin : styles.badgeAuthor}>
                            {u.role}
                          </span>
                        </td>
                        <td style={styles.td}>
                           <div style={{ fontSize: '13px', color: 'var(--ink-4)' }}>
                             {new Date(u.created_at).toLocaleDateString('id-ID')}
                           </div>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.actions}>
                            <button onClick={() => handleDelete(u.id, u.username)} style={{...styles.actionBtn, color: 'var(--accent)'}} title="Hapus Pengguna">
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
          </div>
        </div>

        {/* Kolom Form Tambah */}
        <div style={styles.formCol}>
          <div style={styles.card}>
             <h4 style={styles.cardTitle}><FiUserPlus /> Tambah Pengguna</h4>
             <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Username</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                    placeholder="Masukkan username unik"
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Password</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    placeholder="Minimal 6 karakter"
                    required
                    minLength={6}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Role</label>
                  <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={styles.select}
                  >
                    <option value="admin">Administrator</option>
                    <option value="author">Penulis / Author</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                  Simpan Pengguna
                </button>
             </form>
          </div>
        </div>

      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
  },
  header: {
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    color: 'var(--ink)',
    marginBottom: '4px',
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
  },
  subtitle: {
    color: 'var(--ink-4)',
    fontSize: '14px',
  },
  layout: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  tableCol: {
    flex: '2 1 600px',
  },
  formCol: {
    flex: '1 1 300px',
  },
  card: {
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    boxShadow: 'var(--shadow-sm)',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 700,
    marginBottom: '20px',
    color: 'var(--ink)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  error: {
    backgroundColor: 'var(--warning-bg)',
    color: 'var(--warning)',
    padding: '12px 16px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '14px',
    marginBottom: '24px',
    borderLeft: '4px solid #f59e0b',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--ink-2)',
  },
  input: {
    padding: '10px 14px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '14px',
    backgroundColor: 'var(--surface-2)',
    color: 'var(--ink)',
  },
  select: {
    padding: '10px 14px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '14px',
    backgroundColor: 'var(--surface-2)',
    color: 'var(--ink)',
  },
  tableWrapper: {
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '14px',
  },
  th: {
    padding: '14px 20px',
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
    padding: '14px 20px',
    verticalAlign: 'middle',
    color: 'var(--ink-2)',
    fontSize: '14px',
  },
  badgeAdmin: {
    backgroundColor: 'var(--blue-50)',
    color: 'var(--blue-600)',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  badgeAuthor: {
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  emptyState: {
    textAlign: 'center',
    padding: '30px',
    color: 'var(--ink-4)',
    fontStyle: 'italic',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtn: {
    background: '#ffe4e6',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '6px',
    display: 'flex',
    transition: 'opacity 0.2s',
  }
};

export default UserManagePage;
