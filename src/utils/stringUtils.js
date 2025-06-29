// Helpers para strings

export function ensureString(value, lang = 'es') {
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    return value[lang] || value.es || value.en || JSON.stringify(value);
  }
  return String(value || '');
}

// Normaliza una clave a minúsculas y sin espacios para comparación case-insensitive
export function normalizeKey(key) {
  if (!key || typeof key !== 'string') return '';
  return key.toLowerCase().trim();
}
