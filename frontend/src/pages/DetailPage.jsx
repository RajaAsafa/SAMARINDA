import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CommentSection from '../components/CommentSection';
import API from '../services/api';
import { getImageUrl, formatDisplayDate } from '../utils/helpers';
import { FiClock, FiTag, FiArrowLeft } from 'react-icons/fi';

const DetailPage = () => {
  const { slug } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await API.get(`/news/slug/${slug}`);
        if (res.data.success) {
          setNews(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching details:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetail();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <>
         <Navbar />
         <div className="container" style={{ padding: '40px 24px', minHeight: '60vh' }}>
            <div className="skeleton" style={{ height: '40px', width: '70%', marginBottom: '20px' }}></div>
            <div className="skeleton" style={{ height: '400px', width: '100%', marginBottom: '30px' }}></div>
            <div className="skeleton" style={{ height: '20px', width: '100%', marginBottom: '10px' }}></div>
            <div className="skeleton" style={{ height: '20px', width: '90%', marginBottom: '10px' }}></div>
         </div>
         <Footer />
      </>
    );
  }

  if (!news) {
    return (
      <>
         <Navbar />
         <div className="container" style={{ padding: '100px 24px', textAlign: 'center', minHeight: '60vh' }}>
            <h2>Berita tidak ditemukan</h2>
            <Link to="/" className="btn btn-primary" style={{ marginTop: '20px' }}>Kembali ke Beranda</Link>
         </div>
         <Footer />
      </>
    );
  }

  // Function to render video component
  const renderVideo = () => {
    if (!news.video_url) return null;
    return (
      <div style={styles.videoWrapper} className="video-component">
        <video controls style={styles.video}>
          <source src={getImageUrl(news.video_url)} type="video/mp4" />
          Browser Anda tidak mendukung tag video.
        </video>
      </div>
    );
  };

  // Logic to handle content with or without video placeholder
  const renderContent = () => {
    const hasPlaceholder = news.content.includes('[video]');
    
    if (hasPlaceholder && news.video_url) {
      const parts = news.content.split('[video]');
      return (
        <>
          <div style={styles.content} className="rich-text-content" dangerouslySetInnerHTML={{ __html: parts[0] }} />
          {renderVideo()}
          <div style={styles.content} className="rich-text-content" dangerouslySetInnerHTML={{ __html: parts[1] }} />
        </>
      );
    }

    return (
      <div 
        style={styles.content} 
        className="rich-text-content"
        dangerouslySetInnerHTML={{ __html: news.content }} 
      />
    );
  };

  const videoPlaceholderActive = news.content.includes('[video]') && news.video_url;

  return (
    <>
      <Navbar />
      
      <main className="container animate-fade-in" style={styles.main}>
        <div style={styles.breadcrumb}>
          <Link to="/" style={styles.backLink}><FiArrowLeft /> Kembali</Link>
        </div>

        <article style={styles.article}>
          <header style={styles.header}>
            <div style={styles.meta}>
              <span style={styles.category}><FiTag /> {news.category_name || 'Umum'}</span>
              <span style={styles.date}><FiClock /> {formatDisplayDate(news.created_at)}</span>
            </div>
            <h1 style={styles.title}>{news.title}</h1>
          </header>

          <div style={styles.mediaContainer}>
            {news.image_url && (
              <img src={getImageUrl(news.image_url)} alt={news.title} style={styles.image} />
            )}
            
            {!videoPlaceholderActive && renderVideo()}
          </div>

          {renderContent()}
        </article>

        <CommentSection newsId={news.id} />
      </main>

      <Footer />
    </>
  );
};

const styles = {
  main: {
    padding: '40px 24px',
    maxWidth: '900px',
  },
  breadcrumb: {
    marginBottom: '32px',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--blue-600)',
  },
  article: {
    backgroundColor: 'var(--surface)',
    borderRadius: 'var(--radius-lg)',
    padding: '40px',
    border: '1px solid var(--border-light)',
    boxShadow: 'var(--shadow-sm)',
  },
  header: {
    marginBottom: '32px',
    textAlign: 'center',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '16px',
    fontSize: '14px',
    color: 'var(--ink-4)',
  },
  category: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'var(--blue-600)',
    fontWeight: 600,
  },
  date: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '42px',
    fontWeight: 900,
    color: 'var(--ink)',
    lineHeight: 1.2,
  },
  mediaContainer: {
    marginBottom: '40px',
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: 'var(--radius-md)',
    objectFit: 'cover',
    maxHeight: '450px',
  },
  videoWrapper: {
    marginTop: '20px',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    maxHeight: '500px',
    display: 'block',
  },
  content: {
    fontSize: '17px',
    lineHeight: 1.8,
    color: 'var(--ink-2)',
  }
};

export default DetailPage;
