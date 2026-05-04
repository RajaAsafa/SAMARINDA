import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { currentPage, totalPages } = pagination;
  
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div style={styles.container}>
      <button 
        style={styles.btn} 
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <FiChevronLeft />
      </button>

      {pages.map(page => (
        <button 
          key={page}
          style={page === currentPage ? styles.activeBtn : styles.btn}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button 
        style={styles.btn} 
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <FiChevronRight />
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    marginTop: '40px',
  },
  btn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '36px',
    height: '36px',
    padding: '0 12px',
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--ink-2)',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  activeBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '36px',
    height: '36px',
    padding: '0 12px',
    backgroundColor: 'var(--blue-600)',
    border: '1px solid var(--blue-600)',
    borderRadius: 'var(--radius-sm)',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'default',
  }
};

export default Pagination;
