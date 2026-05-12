import { useEffect, useState } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
};

export const getImageUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/800x450.png?text=Samarinda+Terbaru';
  if (url.startsWith('http')) return url;
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) return url;
  return `${apiUrl.replace(/\/api\/?$/, '')}${url}`;
};

export const sanitizeHtml = (html = '') => {
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(String(html), 'text/html');
  const blockedTags = new Set([
    'script',
    'style',
    'iframe',
    'object',
    'embed',
    'form',
    'input',
    'button',
    'textarea',
    'select',
    'option',
    'meta',
    'link',
    'base',
    'svg',
    'math',
  ]);
  const urlAttrs = new Set(['href', 'src', 'cite', 'poster']);

  doc.body.querySelectorAll('*').forEach((node) => {
    if (blockedTags.has(node.tagName.toLowerCase())) {
      node.remove();
      return;
    }

    Array.from(node.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase();
      const value = attr.value.trim();

      if (name.startsWith('on') || name === 'style' || name === 'srcdoc') {
        node.removeAttribute(attr.name);
        return;
      }

      if (urlAttrs.has(name) && /^(javascript|vbscript|data):/i.test(value)) {
        node.removeAttribute(attr.name);
      }
    });
  });

  return doc.body.innerHTML;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('id-ID', options);
};

export const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};
