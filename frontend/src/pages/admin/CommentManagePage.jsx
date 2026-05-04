import { useState, useEffect } from 'react';
import { FiTrash2, FiMessageSquare } from 'react-icons/fi';
import { fetchAdminComments, deleteComment } from '../../services/adminData';
import { formatDate } from '../../utils/helpers';

const CommentManagePage = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      const data = await fetchAdminComments();
      setComments(data);
    } catch (err) {
      console.error('Fetch comments error', err);
      setError('Gagal memuat data komentar.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Hapus komentar dari "${name}"?`)) return;
    
    try {
      setError('');
      await deleteComment(id);
      setComments(comments.filter(c => c.id !== id));
    } catch (err) {
      setError('Gagal menghapus komentar.');
    }
  };

  if (loading) return <p>Memuat data...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.mainCard}>
        <div style={styles.header}>
          <div>
            <h3 style={styles.title}>Manajemen Komentar</h3>
            <p style={styles.subtitle}>Kelola dan moderasi komentar dari pengunjung.</p>
          </div>
        </div>
        
        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Pengirim</th>
                <th style={styles.th}>Komentar</th>
                <th style={styles.th}>Topik Berita</th>
                <th style={styles.th}>Tanggal</th>
                <th style={{ ...styles.th, textAlign: 'center', width: '100px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {comments.length === 0 ? (
                <tr>
                  <td colSpan="5" style={styles.emptyState}>Belum ada komentar.</td>
                </tr>
              ) : (
                comments.map(comment => (
                  <tr key={comment.id} className="admin-table-row" style={styles.tr}>
                    <td style={styles.td}>
                      <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{comment.name}</div>
                    </td>
                    <td style={{ ...styles.td, maxWidth: '250px' }}>
                      <div style={styles.contentCell}>{comment.content}</div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.newsTitle}>{comment.news_title}</div>
                    </td>
                    <td style={styles.td}>
                      <div style={{ fontSize: '13px', color: 'var(--ink-4)' }}>
                        {formatDate(comment.created_at)}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <button onClick={() => handleDelete(comment.id, comment.name)} style={{...styles.actionBtn, color: 'var(--accent)'}} title="Hapus Komentar">
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
    maxWidth: '1000px',
  },
  mainCard: {
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    boxShadow: 'var(--shadow-sm)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'end',
    marginBottom: '24px',
  },
  title: {
    fontSize: '20px',
    color: 'var(--ink)',
    marginBottom: '4px',
  },
  subtitle: {
    color: 'var(--ink-4)',
    fontSize: '14px',
  },
  error: {
    backgroundColor: 'var(--warning-bg)',
    color: 'var(--warning)',
    padding: '10px 16px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '14px',
    marginBottom: '20px',
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
    padding: '16px 20px',
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
    padding: '16px 20px',
    verticalAlign: 'top',
    color: 'var(--ink-2)',
    fontSize: '14px',
  },
  contentCell: {
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    lineHeight: 1.5,
  },
  newsTitle: {
    fontSize: '13px',
    color: 'var(--blue-600)',
    backgroundColor: 'var(--blue-50)',
    padding: '4px 8px',
    borderRadius: '4px',
    display: 'inline-block',
    lineHeight: 1.4,
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
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

export default CommentManagePage;
