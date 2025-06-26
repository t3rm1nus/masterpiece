// src/utils/categoryPalette.js
// Fuente de verdad para colores y gradientes de categorías

export const categoryPalette = {
  movies: {
    color: '#2196f3',
    strong: '#0078d4',
    gradient: 'linear-gradient(135deg, #e3f2fd 0%, #90caf9 100%)'
  },
  videogames: {
    color: '#9c27b0',
    strong: '#7b1fa2',
    gradient: 'linear-gradient(135deg, #f3e5f5 0%, #ce93d8 100%)'
  },
  books: {
    color: '#4caf50',
    strong: '#388e3c',
    gradient: 'linear-gradient(135deg, #e8f5e9 0%, #a5d6a7 100%)'
  },
  music: {
    color: '#00bcd4',
    strong: '#0097a7',
    gradient: 'linear-gradient(135deg, #e0f2f1 0%, #80cbc4 100%)'
  },
  podcast: {
    color: '#8bc34a',
    strong: '#689f38',
    gradient: 'linear-gradient(135deg, #dcedc8 0%, #8bc34a 100%)'
  },
  boardgames: {
    color: '#e91e63',
    strong: '#c2185b',
    gradient: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)'
  },
  comics: {
    color: '#ff9800',
    strong: '#e67e22',
    gradient: 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)'
  },
  documentales: {
    color: '#e57373',
    strong: '#b71c1c',
    gradient: 'linear-gradient(135deg, #ffebee 0%, #ffab91 100%)'
  },
  series: {
    color: '#b39ddb',
    strong: '#512da8',
    gradient: 'linear-gradient(135deg, #ede7f6 0%, #b39ddb 100%)'
  }
};

export function getCategoryColor(category, variant = 'color') {
  const key = String(category).toLowerCase();
  return categoryPalette[key]?.[variant] || '#0078d4';
}

export function getCategoryGradient(category) {
  return getCategoryColor(category, 'gradient');
}

export function getCategoryStrongColor(category) {
  return getCategoryColor(category, 'strong');
}

// Para selects o usos especiales
export function getCategoryColorForSelect(category) {
  return getCategoryStrongColor(category);
}
