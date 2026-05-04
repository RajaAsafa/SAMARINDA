import { Link } from 'react-router-dom';
import { getImageUrl, formatDate } from '../utils/helpers';
import { FiClock, FiTag } from 'react-icons/fi';

const NewsCard = ({ news }) => {
  return (
    <div className="card hover-lift" style={styles.container}>
      <Link to={`/berita/${news.slug}`} style={styles.imageLink}>
        <div className="image-zoom-target" style={{...styles.imageContainer, backgroundImage: `url(${getImageUrl(news.image_url)})`}}>
          {news.category_name && (
            <span style={styles.badge}>{news.category_name}</span>
          )}
        </div>
      </Link>
      
      <div style={styles.content}>
        <div style={styles.meta}>
          <span style={styles.date}>
            <FiClock style={styles.icon} /> {formatDate(news.created_at)}
          </span>
        </div>
        
        <Link to={`/berita/${news.slug}`} style={styles.titleWrapper}>
          <h3 style={styles.title}>{news.title}</h3>
        </Link>
        
        <p style={styles.snippet}>
          {news.content.replace(/<[^>]+>/g, '').substring(0, 100)}...
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  imageLink: {
    display: 'block',
    overflow: 'hidden',
  },
  imageContainer: {
    height: '200px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    transition: 'transform 0.3s ease',
  },
  badge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'var(--blue-600)',
    color: '#fff',
    fontSize: '11px',
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  content: {
    padding: '20px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '10px',
  },
  date: {
    fontSize: '12px',
    color: 'var(--ink-4)',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: '4px',
  },
  titleWrapper: {
    marginBottom: '8px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--ink)',
    lineHeight: 1.4,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  snippet: {
    fontSize: '14px',
    color: 'var(--ink-3)',
    marginBottom: 0,
    marginTop: 'auto',
  }
};

export default NewsCard;
