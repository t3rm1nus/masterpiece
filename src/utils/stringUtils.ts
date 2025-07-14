// Helpers para strings

interface LocalizedString {
  es?: string;
  en?: string;
  [key: string]: string | undefined;
}

export function ensureString(value: any, lang: string = 'es'): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    const localizedValue = value as LocalizedString;
    return localizedValue[lang] || localizedValue.es || localizedValue.en || JSON.stringify(value);
  }
  return String(value || '');
}

// Normaliza una clave a minúsculas y sin espacios para comparación case-insensitive
export function normalizeKey(key: any): string {
  if (!key || typeof key !== 'string') return '';
  return key.toLowerCase().trim();
} 