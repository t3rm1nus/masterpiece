// src/utils/categoryPalette.js
// Fuente de verdad para colores y gradientes de categorías

export const categoryPalette = {
  movies: {
    color: '#B3D1FF', // Azul pastel (antes era rojo)
    strong: '#64B5F6',
    gradient: 'linear-gradient(135deg, #E5F0FF 0%, #B3D1FF 100%)'
  },
  videogames: {
    color: '#FFB3B3', // Rojo pastel (antes era azul)
    strong: '#E57373',
    gradient: 'linear-gradient(135deg, #FFE5E5 0%, #FFB3B3 100%)'
  },
  books: {
    color: '#FFF9B3', // Amarillo pastel
    strong: '#FFF176',
    gradient: 'linear-gradient(135deg, #FFFFE5 0%, #FFF9B3 100%)'
  },
  music: {
    color: '#B3FFB3', // Verde pastel
    strong: '#81C784',
    gradient: 'linear-gradient(135deg, #E5FFE5 0%, #B3FFB3 100%)'
  },
  podcast: {
    color: '#FFD9B3', // Naranja pastel
    strong: '#FFB74D',
    gradient: 'linear-gradient(135deg, #FFF3E5 0%, #FFD9B3 100%)'
  },
  boardgames: {
    color: '#E0B3FF', // Violeta pastel
    strong: '#BA68C8',
    gradient: 'linear-gradient(135deg, #F5E5FF 0%, #E0B3FF 100%)'
  },
  comics: {
    color: '#D2B48C', // Marrón pastel
    strong: '#A1887F',
    gradient: 'linear-gradient(135deg, #F5EDE5 0%, #D2B48C 100%)'
  },
  documentales: {
    color: '#B3FFFF', // Cian pastel
    strong: '#4DD0E1',
    gradient: 'linear-gradient(135deg, #E5FFFF 0%, #B3FFFF 100%)'
  },
  series: {
    color: '#FFB3E6', // Magenta pastel
    strong: '#F06292',
    gradient: 'linear-gradient(135deg, #FFE5F5 0%, #FFB3E6 100%)'
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

// Devuelve un gradiente animado con todos los colores pastel de las categorías
export function getAllCategoriesAnimatedGradient() {
  const stops = [
    categoryPalette.movies.color,
    categoryPalette.videogames.color,
    categoryPalette.books.color,
    categoryPalette.music.color,
    categoryPalette.podcast.color,
    categoryPalette.boardgames.color,
    categoryPalette.comics.color,
    categoryPalette.documentales.color,
    categoryPalette.series.color
  ];
  return `linear-gradient(270deg, ${stops.join(', ')}, ${stops[0]})`;
}

// Devuelve un gradiente animado solo con los tonos de una categoría
export function getCategoryAnimatedGradient(category) {
  const key = String(category).toLowerCase();
  const base = categoryPalette[key]?.color || '#fffbe6';
  const strong = categoryPalette[key]?.strong || '#ffe082';
  return `linear-gradient(270deg, ${base}, ${strong}, ${base})`;
}

// Devuelve un gradiente animado SOLO con los tonos dorados de masterpiece, grises y blancos
export function getMasterpieceAnimatedGradient() {
  // Dorados, grises y blancos
  const stops = [
    '#fffbe6', // dorado claro
    '#ffe082', // dorado medio
    '#ffd700', // dorado fuerte
    '#fff',    // blanco
    '#e0e0e0', // gris claro
    '#bdbdbd', // gris medio
    '#ffd700', // dorado fuerte
    '#fffbe6', // dorado claro
    '#fff',    // blanco
  ];
  return `linear-gradient(270deg, ${stops.join(', ')}, ${stops[0]})`;
}
