import { useState, useEffect } from 'react';
import { fetchCommentsByNewsId, postComment } from '../services/publicData';
import { formatDisplayDate } from '../utils/helpers';
import { FiMessageSquare, FiSend, FiUser } from 'react-icons/fi';

const CommentSection = ({ newsId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', content: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadComments();
  }, [newsId]);

  const loadComments = async () => {
    try {
      const data = await fetchCommentsByNewsId(newsId);
      setComments(data);
    } catch (err) {
      console.error('Fetch comments error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.content.trim()) {
      setError('Nama dan komentar wajib diisi.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      await postComment({
        news_id: newsId,
        name: formData.name,
        content: formData.content
      });

      setSuccess(true);
      setFormData({ name: '', content: '' });
      loadComments();
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Gagal mengirim komentar. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section style={styles.container}>
      <div style={styles.header}>
        <FiMessageSquare size={20} />
        <h3 style={styles.title}>Komentar ({comments.length})</h3>
      </div>

      <div style={styles.formCard}>
        <h4 style={styles.formTitle}>Tinggalkan Komentar</h4>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <input
              type="text"
              placeholder="Nama Anda"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={styles.input}
              disabled={submitting}
            />
          </div>
          <div style={styles.formGroup}>
            <textarea
              placeholder="Tulis komentar Anda di sini..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              style={styles.textarea}
              disabled={submitting}
            ></textarea>
          </div>
          
          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>Komentar berhasil dikirim!</p>}

          <button 
            type="submit" 
            style={styles.submitBtn} 
            disabled={submitting}
          >
            {submitting ? 'Mengirim...' : <><FiSend /> Kirim Komentar</>}
          </button>
        </form>
      </div>

      <div style={styles.list}>
        {loading ? (
          <p style={styles.info}>Memuat komentar...</p>
        ) : comments.length === 0 ? (
          <p style={styles.info}>Belum ada komentar. Jadilah yang pertama berkomentar!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} style={styles.commentItem}>
              <div style={styles.avatar}>
                <FiUser size={20} />
              </div>
              <div style={styles.commentBody}>
                <div style={styles.commentHeader}>
                  <span style={styles.commentName}>{comment.name}</span>
                  <span style={styles.commentDate}>{formatDisplayDate(comment.created_at)}</span>
                </div>
                <p style={styles.commentText}>{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

const styles = {
  container: {
    marginTop: '48px',
    paddingTop: '32px',
    borderTop: '2px solid var(--border-light)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
    color: 'var(--ink)',
  },
  title: {
    fontSize: '22px',
    fontWeight: 800,
  },
  formCard: {
    backgroundColor: 'var(--surface-2)',
    padding: '24px',
    borderRadius: 'var(--radius-lg)',
    marginBottom: '40px',
    border: '1px solid var(--border-light)',
  },
  formTitle: {
    fontSize: '16px',
    fontWeight: 700,
    marginBottom: '16px',
    color: 'var(--ink)',
  },
  formGroup: {
    marginBottom: '12px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    fontSize: '14px',
    backgroundColor: 'var(--surface)',
    color: 'var(--ink)',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    fontSize: '14px',
    backgroundColor: 'var(--surface)',
    color: 'var(--ink)',
    minHeight: '100px',
    resize: 'vertical',
    outline: 'none',
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: 'var(--blue-600)',
    color: '#fff',
    border: 'none',
    borderRadius: '100px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  error: {
    color: 'var(--accent)',
    fontSize: '13px',
    marginBottom: '12px',
    fontWeight: 500,
  },
  success: {
    color: 'var(--success)',
    fontSize: '13px',
    marginBottom: '12px',
    fontWeight: 600,
  },
  info: {
    textAlign: 'center',
    padding: '40px 0',
    color: 'var(--ink-4)',
    fontSize: '15px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  commentItem: {
    display: 'flex',
    gap: '16px',
  },
  avatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: 'var(--surface-3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--ink-3)',
    flexShrink: 0,
  },
  commentBody: {
    flex: 1,
  },
  commentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  commentName: {
    fontWeight: 700,
    color: 'var(--ink)',
    fontSize: '15px',
  },
  commentDate: {
    fontSize: '12px',
    color: 'var(--ink-4)',
  },
  commentText: {
    fontSize: '15px',
    lineHeight: 1.6,
    color: 'var(--ink-2)',
    whiteSpace: 'pre-wrap',
  }
};

export default CommentSection;
