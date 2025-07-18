// Funciones utilitarias centralizadas para el store

/**
 * Devuelve el título en el idioma actual o un fallback.
 */
export function processTitle(title: string | Record<string, string> | null | undefined, lang: string = 'es'): string {
  if (typeof title === 'object' && title !== null) {
    return title[lang] || title.es || title.en || 'Sin título';
  }
  return title || 'Sin título';
}

/**
 * Devuelve la descripción en el idioma actual o un fallback.
 */
export function processDescription(description: string | Record<string, string> | null | undefined, lang: string = 'es'): string {
  if (typeof description === 'object' && description !== null) {
    return description[lang] || description.es || description.en || 'Sin descripción';
  }
  return description || 'Sin descripción';
}

/**
 * Devuelve una imagen aleatoria para not found.
 */
export function randomNotFoundImage(): string {
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
  return `https://raw.githubusercontent.com/t3rm1nus/masterpiece/refs/heads/main/public/imagenes/notfound/${images[idx]}`;
} 