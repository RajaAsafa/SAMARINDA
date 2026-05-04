import { useState, useEffect } from 'react';
import { fetchCategories } from '../services/publicData';

const FilterPanel = ({ filters, onFilterChange }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories for filter');
      }
    };
    loadCategories();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const handleReset = () => {
    onFilterChange({ category_id: '', date_from: '', date_to: '' });
  };

  return (
    <div style={styles.panel}>
      <div style={styles.group}>
        <label style={styles.label}>Kategori</label>
        <select 
          name="category_id" 
          value={filters.category_id || ''} 
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Semua Kategori</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div style={styles.group}>
        <label style={styles.label}>Dari Tanggal</label>
        <input 
          type="date" 
          name="date_from" 
          value={filters.date_from || ''} 
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.group}>
        <label style={styles.label}>Sampai Tanggal</label>
        <input 
          type="date" 
          name="date_to" 
          value={filters.date_to || ''} 
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={{...styles.group, alignSelf: 'flex-end'}}>
        <button onClick={handleReset} style={styles.resetBtn}>
          Reset Filter
        </button>
      </div>
    </div>
  );
};

const styles = {
  panel: {
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-md)',
    padding: '20px',
    marginBottom: '30px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    alignItems: 'center',
    boxShadow: 'var(--shadow-sm)'
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: '1 1 200px',
  },
  label: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--ink-3)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  input: {
    padding: '10px 14px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'var(--surface-2)',
    color: 'var(--ink)',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
  },
  resetBtn: {
    padding: '10px 16px',
    backgroundColor: 'transparent',
    border: '1px solid var(--border)',
    color: 'var(--ink-2)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.2s',
  }
};

export default FilterPanel;
