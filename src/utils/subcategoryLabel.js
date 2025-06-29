// Utilidad para obtener el literal traducido de subcategoría
// Uso: getSubcategoryLabel(subKey, category, t, lang)
import { normalizeKey } from './stringUtils';

export function getSubcategoryLabel(subKey, category, t, lang) {
  if (!subKey || !category || !t) return subKey;
  // Normaliza la key
  const key = normalizeKey(subKey);
  // Busca el literal en texts.json
  if (t.subcategories && t.subcategories[category] && t.subcategories[category][key]) {
    return t.subcategories[category][key];
  }
  // Fallback: solo la key
  return key;
}
