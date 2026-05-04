import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl, formatDisplayDate } from '../utils/helpers';
import API from '../services/api';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const HeroSection = () => {
  const [featured, setFeatured] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await API.get('/news/featured');
        if (res.data.success) {
          setFeatured(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch featured news');
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    if (featured.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featured.length]);

  if (featured.length === 0) return null;

  const currentNews = featured[currentIndex];

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % featured.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length);

  return (
    <div style={styles.heroContainer}>
      <div 
        style={{
          ...styles.heroBackground,
          backgroundImage: `url(${getImageUrl(currentNews.image_url)})`
        }}
      >
        <div style={styles.heroOverlay}>
          <div className="container" style={styles.contentContainer}>
            <div style={styles.meta}>
              {currentNews.category_name && (
                <span style={styles.badge}>{currentNews.category_name}</span>
              )}
              <span style={styles.date}>{formatDisplayDate(currentNews.created_at)}</span>
            </div>
            
            <Link to={`/berita/${currentNews.slug}`}>
              <h1 style={styles.title}>{currentNews.title}</h1>
            </Link>
            
            <p style={styles.snippet}>
              {currentNews.content.replace(/<[^>]+>/g, '').substring(0, 150)}...
            </p>

            <Link to={`/berita/${currentNews.slug}`} className="btn btn-primary" style={styles.readMore}>
              Baca Selengkapnya
            </Link>
          </div>
        </div>
      </div>

      {featured.length > 1 && (
        <div style={styles.controls}>
          <button onClick={prevSlide} style={styles.controlBtn} aria-label="Previous image">
            <FiChevronLeft size={24} />
          </button>
          <div style={styles.dots}>
            {featured.map((_, idx) => (
              <span 
                key={idx} 
                onClick={() => setCurrentIndex(idx)}
                style={{
                  ...styles.dot, 
                  backgroundColor: idx === currentIndex ? 'var(--blue-400)' : 'rgba(255,255,255,0.4)',
                  width: idx === currentIndex ? '24px' : '8px'
                }}
              />
            ))}
          </div>
          <button onClick={nextSlide} style={styles.controlBtn} aria-label="Next image">
            <FiChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  heroContainer: {
    position: 'relative',
    height: '500px',
    width: '100%',
    overflow: 'hidden',
    backgroundColor: 'var(--blue-900)',
    borderRadius: 'var(--radius-lg)',
    marginBottom: '40px',
    boxShadow: 'var(--shadow-md)'
  },
  heroBackground: {
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'background-image 0.5s ease-in-out',
  },
  heroOverlay: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to top, rgba(3, 13, 26, 0.9) 0%, rgba(3, 13, 26, 0.4) 50%, rgba(3, 13, 26, 0.1) 100%)',
    display: 'flex',
    alignItems: 'flex-end',
    paddingBottom: '60px',
  },
  contentContainer: {
    maxWidth: '800px',
    margin: '0', 
    padding: '0 40px',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px',
  },
  badge: {
    backgroundColor: 'var(--blue-500)',
    color: '#fff',
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  date: {
    color: '#dceafe',
    fontSize: '14px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '36px',
    fontWeight: 700,
    color: '#fff',
    lineHeight: 1.2,
    marginBottom: '16px',
    textShadow: '0 4px 12px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.8)',
    transition: 'text-shadow 0.3s ease',
  },
  snippet: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '16px',
    lineHeight: 1.6,
    marginBottom: '24px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  readMore: {
    padding: '10px 24px',
  },
  controls: {
    position: 'absolute',
    bottom: '24px',
    right: '40px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  controlBtn: {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: '#fff',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  dots: {
    display: 'flex',
    gap: '8px',
  },
  dot: {
    height: '8px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  }
};

export default HeroSection;
