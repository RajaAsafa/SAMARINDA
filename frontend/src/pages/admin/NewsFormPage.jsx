import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiUpload, FiX } from 'react-icons/fi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { fetchCategories, createNews, updateNews } from '../../services/adminData';
import { fetchNewsBySlug } from '../../services/publicData';
import { getImageUrl } from '../../utils/helpers';

const NewsFormPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEdit = !!slug;

  const [newsId, setNewsId] = useState(null);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    content: '',
    is_featured: false,
    image_url: '',
    video_url: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');

  useEffect(() => {
    loadCategories();
    if (isEdit) {
      loadNewsDetail();
    }
  }, [slug]);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories');
    }
  };

  const loadNewsDetail = async () => {
    try {
      const news = await fetchNewsBySlug(slug);
      if (news) {
        setNewsId(news.id);
        setFormData({
          title: news.title,
          category_id: news.category_id || '',
          content: news.content,
          is_featured: news.is_featured,
          image_url: news.image_url || '',
          video_url: news.video_url || '',
        });
        if (news.image_url) {
          setImagePreview(getImageUrl(news.image_url));
        }
        if (news.video_url && !news.video_url.startsWith('http')) {
          setVideoPreview(getImageUrl(news.video_url));
        } else if (news.video_url) {
          setVideoPreview(news.video_url);
        }
      }
    } catch (err) {
      console.error('Failed to fetch news detail');
      setError('Gagal memuat data berita');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran gambar tidak boleh melebih 10MB');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 500 * 1024 * 1024) {
      alert('Ukuran video tidak boleh melebih 500MB');
      return;
    }

    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
  };

  const uploadFile = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append('file', file);
    
    // NOTE: Masih menggunakan API backend untuk upload file.
    // Jika backend mati, upload file akan gagal.
    const res = await API.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data.data.url;
  };

  const generateSlug = (text) => {
    return text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      setError('Judul dan konten wajib diisi');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      let finalImageUrl = formData.image_url;
      let finalVideoUrl = formData.video_url;
      
      if (imageFile) {
        finalImageUrl = await uploadFile(imageFile);
      }
      if (videoFile) {
        finalVideoUrl = await uploadFile(videoFile);
      }

      const payload = {
        ...formData,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        image_url: finalImageUrl,
        video_url: finalVideoUrl,
        updated_at: new Date().toISOString()
      };

      if (isEdit) {
        await updateNews(newsId, payload);
      } else {
        payload.slug = generateSlug(formData.title) + '-' + Date.now();
        payload.created_at = new Date().toISOString();
        payload.is_deleted = false;
        // Default expires_at 30 days from now
        const expires = new Date();
        expires.setDate(expires.getDate() + 30);
        payload.expires_at = expires.toISOString();
        
        await createNews(payload);
      }

      navigate('/office/berita');
    } catch (err) {
      setError('Terjadi kesalahan saat menyimpan berita ke database.');
      setSubmitting(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData({ ...formData, image_url: '' });
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview('');
    setFormData({ ...formData, video_url: '' });
  };

  if (loading) return <p>Memuat form...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/office/berita" style={styles.backLink}>
          <FiArrowLeft /> Kembali
        </Link>
        <h3 style={styles.title}>{isEdit ? 'Edit Berita' : 'Tulis Berita Baru'}</h3>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.formContext}>
        <div style={styles.mainCol}>
          <div style={styles.card}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Judul Berita *</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                style={styles.input}
                placeholder="Masukkan judul berita"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Konten Berita *</label>
              <ReactQuill 
                theme="snow" 
                value={formData.content} 
                onChange={val => setFormData({...formData, content: val})} 
                style={styles.editor}
              />
              <p style={{ fontSize: '12px', color: 'var(--ink-4)', marginTop: '8px', fontStyle: 'italic' }}>
                💡 Tips: Ketik <strong>[video]</strong> di dalam teks untuk mengatur posisi video muncul di tengah artikel. Jika tidak ada, video akan muncul di paling atas secara default.
              </p>
            </div>
          </div>
        </div>

        <div style={styles.sideCol}>
          <div style={styles.card}>
            <h4 style={styles.cardTitle}>Pengaturan</h4>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Kategori</label>
              <select 
                value={formData.category_id}
                onChange={e => setFormData({...formData, category_id: e.target.value})}
                style={styles.input}
              >
                <option value="">Pilih Kategori</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <label style={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={formData.is_featured}
                onChange={e => setFormData({...formData, is_featured: e.target.checked})}
              />
              Jadikan Berita Utama (Featured)
            </label>
          </div>

          <div style={styles.card}>
            <h4 style={styles.cardTitle}>Media</h4>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Gambar Utama</label>
              
              {imagePreview ? (
                <div style={styles.imagePreviewWrapper}>
                  <img src={imagePreview} alt="Preview" style={styles.imagePreview} />
                  <button type="button" onClick={removeImage} style={styles.removeImageBtn}>
                    <FiX /> Hapus
                  </button>
                </div>
              ) : (
                <div style={styles.uploadArea}>
                  <FiUpload size={24} style={{ color: 'var(--ink-4)', marginBottom: '8px' }} />
                  <div style={{ fontSize: '13px', color: 'var(--ink-3)', marginBottom: '8px' }}>
                    Pilih file gambar (JPG, PNG, WebP)
                  </div>
                  <input 
                    type="file" 
                    accept="image/jpeg, image/png, image/webp" 
                    onChange={handleImageChange}
                    style={{ fontSize: '12px' }}
                  />
                </div>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Video Berita</label>
              
              {videoPreview ? (
                <div style={styles.imagePreviewWrapper}>
                  <video src={videoPreview} controls style={{ width: '100%', display: 'block' }} />
                  <button type="button" onClick={removeVideo} style={styles.removeImageBtn}>
                    <FiX /> Hapus
                  </button>
                </div>
              ) : (
                <div style={styles.uploadArea}>
                  <FiUpload size={24} style={{ color: 'var(--ink-4)', marginBottom: '8px' }} />
                  <div style={{ fontSize: '13px', color: 'var(--ink-3)', marginBottom: '8px' }}>
                    Pilih file video (MP4, WebM)
                  </div>
                  <input 
                    type="file" 
                    accept="video/mp4, video/webm" 
                    onChange={handleVideoChange}
                    style={{ fontSize: '12px' }}
                  />
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={styles.submitBtn}
            disabled={submitting}
          >
            {submitting ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Publish Berita')}
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
  },
  header: {
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    color: 'var(--ink)',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--blue-600)',
    fontSize: '14px',
    fontWeight: 500,
    marginBottom: '12px',
  },
  error: {
    backgroundColor: 'var(--warning-bg)',
    color: 'var(--warning)',
    padding: '12px 16px',
    borderRadius: 'var(--radius-sm)',
    marginBottom: '24px',
    fontSize: '14px',
  },
  formContext: {
    display: 'flex',
    gap: '24px',
    alignItems: 'flex-start',
  },
  mainCol: {
    flex: '1',
  },
  sideCol: {
    width: '320px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  card: {
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    boxShadow: 'var(--shadow-sm)',
    marginBottom: '24px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid var(--border-light)',
    color: 'var(--ink)',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--ink-2)',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '14px',
    backgroundColor: 'var(--surface-2)',
    color: 'var(--ink)',
  },
  editor: {
    height: '400px',
    marginBottom: '40px', // leave space for quill toolbar
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: 'var(--ink-2)',
    cursor: 'pointer',
  },
  uploadArea: {
    border: '2px dashed var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: 'var(--surface-2)',
  },
  imagePreviewWrapper: {
    position: 'relative',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
    border: '1px solid var(--border)',
  },
  imagePreview: {
    width: '100%',
    display: 'block',
  },
  removeImageBtn: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#fff',
    border: 'none',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
  }
};

export default NewsFormPage;
