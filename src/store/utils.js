// Funciones utilitarias centralizadas para el store

/**
 * Devuelve el título en el idioma actual o un fallback.
 */
export function processTitle(title, lang = 'es') {
  if (typeof title === 'object' && title !== null) {
    return title[lang] || title.es || title.en || 'Sin título';
  }
  return title || 'Sin título';
}

/**
 * Devuelve la descripción en el idioma actual o un fallback.
 */
export function processDescription(description, lang = 'es') {
  if (typeof description === 'object' && description !== null) {
    return description[lang] || description.es || description.en || 'Sin descripción';
  }
  return description || 'Sin descripción';
}

/**
 * Devuelve una imagen aleatoria para not found.
 */
export function randomNotFoundImage() {
  const images = [
    'notfound.webp',
    'notfound2.webp',
    'notfound3.webp',
    'notfound4.webp',
    'notfound5.webp',
    'notfound6.webp',
    'notfound7.webp',
    'notfound8.webp',
    'notfound9.webp',
    'notfound10.webp',
  ];
  const idx = Math.floor(Math.random() * images.length);
  return `/imagenes/notfound/${images[idx]}`;
}
