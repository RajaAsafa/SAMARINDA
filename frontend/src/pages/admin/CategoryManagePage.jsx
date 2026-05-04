import { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import API from '../../services/api';

const CategoryManagePage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form state
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error('Fetch categories error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    try {
      setError('');
      if (editingId) {
        // Update
        const res = await API.put(`/categories/${editingId}`, { name });
        if (res.data.success) {
          setCategories(categories.map(c => c.id === editingId ? res.data.data : c));
          cancelEdit();
        }
      } else {
        // Create
        const res = await API.post('/categories', { name });
        if (res.data.success) {
          setCategories([...categories, res.data.data]);
          setName('');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan kategori');
    }
  };

  const handleDelete = async (id, catName) => {
    if (!window.confirm(`Hapus kategori "${catName}"?`)) return;
    
    try {
      setError('');
      const res = await API.delete(`/categories/${id}`);
      if (res.data.success) {
        setCategories(categories.filter(c => c.id !== id));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menghapus kategori. Pastikan tidak ada berita yang menggunakan kategori ini.');
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setName(cat.name);
    setError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setError('');
  };

  if (loading) return <p>Memuat data...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.mainCard}>
        <h3 style={styles.title}>Manajemen Kategori</h3>
        
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input 
            type="text" 
            placeholder="Nama Kategori Baru" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Simpan Perubahan' : <><FiPlus /> Tambah Kategori</>}
          </button>
          {editingId && (
            <button type="button" className="btn" onClick={cancelEdit}>Batal</button>
          )}
        </form>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Kategori</th>
                <th style={{ width: '120px', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>Belum ada kategori.</td>
                </tr>
              ) : (
                categories.map(cat => (
                  <tr key={cat.id}>
                    <td style={{ color: 'var(--ink-4)', fontFamily: 'monospace' }}>#{cat.id}</td>
                    <td style={{ fontWeight: 500, color: 'var(--ink)' }}>{cat.name}</td>
                    <td>
                      <div style={styles.actions}>
                        <button onClick={() => startEdit(cat)} style={styles.actionBtn}>
                          <FiEdit2 />
                        </button>
                        <button onClick={() => handleDelete(cat.id, cat.name)} style={{...styles.actionBtn, color: 'var(--accent)'}}>
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
  );
};

const styles = {
  container: {
    maxWidth: '800px',
  },
  mainCard: {
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    boxShadow: 'var(--shadow-sm)',
  },
  title: {
    fontSize: '20px',
    marginBottom: '20px',
    color: 'var(--ink)',
  },
  error: {
    backgroundColor: 'var(--warning-bg)',
    color: 'var(--warning)',
    padding: '10px 16px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '14px',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    gap: '12px',
    marginBottom: '32px',
  },
  input: {
    flex: 1,
    padding: '10px 16px',
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
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  actionBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--ink-3)',
    padding: '6px',
    borderRadius: '4px',
    display: 'flex',
  }
};

export default CategoryManagePage;
