/**
 * translationUtils.ts
 *
 * Utilidades avanzadas para la gestión de traducciones en la app Masterpiece.
 * Incluye validación de claves, pluralización, interpolación, merge profundo y extracción de claves.
 */
import { Language } from '../types';

// Tipos para traducciones
type TranslationObject = Record<string, any>;
type TranslationValidator = {
  validate: (key: string) => boolean;
  getMissingKeys: () => string[];
  clearMissingKeys: () => void;
};

/**
 * Crea un validador de claves de traducción.
 * Permite detectar claves faltantes durante el desarrollo.
 */
export const createTranslationValidator = (translations: TranslationObject): TranslationValidator => {
  const missingKeys = new Set();
  return {
    /**
     * Valida que una clave de traducción exista en el objeto de traducciones.
     */
    validate: (key) => {
      if (!key || typeof key !== 'string') return false;
      const keys = key.split('.');
      let current = translations;
      for (const keyPart of keys) {
        if (!current || typeof current !== 'object' || !(keyPart in current)) {
          missingKeys.add(key);
          return false;
        }
        current = current[keyPart];
      }
      return true;
    },
    /**
     * Devuelve todas las claves faltantes detectadas.
     */
    getMissingKeys: () => Array.from(missingKeys) as string[],
    /**
     * Limpia el cache de claves faltantes.
     */
    clearMissingKeys: () => missingKeys.clear()
  };
};

/**
 * Pluralización básica para inglés y español.
 * Devuelve la forma singular o plural según el conteo y el idioma.
 */
export const pluralize = (count: number, singular: string, plural: string | null = null, language: Language = 'es'): string => {
  if (typeof count !== 'number') return singular;
  if (language === 'en') {
    return count === 1 ? singular : (plural || `${singular}s`);
  } else {
    // Español: implementación básica
    return count === 1 ? singular : (plural || `${singular}s`);
  }
};

/**
 * Interpola variables en una cadena de traducción.
 * Ejemplo: formatTranslation('Hola {name}!', { name: 'Mundo' }) => 'Hola Mundo!'
 */
export const formatTranslation = (template: string, variables: Record<string, any> = {}): string => {
  if (!template || typeof template !== 'string') return template;
  if (!variables || typeof variables !== 'object') return template;
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return variables[key] !== undefined ? variables[key] : match;
  });
};

/**
 * Realiza un merge profundo entre dos objetos de traducción.
 * Útil para combinar traducciones parciales o aplicar fallbacks.
 */
export const mergeTranslations = (target: TranslationObject, source: TranslationObject): TranslationObject => {
  if (!target || typeof target !== 'object') return source;
  if (!source || typeof source !== 'object') return target;
  const result = { ...target };
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (
        result[key] &&
        typeof result[key] === 'object' &&
        !Array.isArray(result[key]) &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key])
      ) {
        result[key] = mergeTranslations(result[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  return result;
};

/**
 * Extrae todas las claves de traducción de un objeto de traducciones.
 * Útil para generar listas de claves o detectar claves no usadas.
 */
export const extractTranslationKeys = (translations: TranslationObject, prefix: string = ''): string[] => {
  const keys: string[] = [];
  if (!translations || typeof translations !== 'object') {
    return keys;
  }
  for (const key in translations) {
    if (translations.hasOwnProperty(key)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof translations[key] === 'object' && !Array.isArray(translations[key])) {
        keys.push(...extractTranslationKeys(translations[key], fullKey));
      } else {
        keys.push(fullKey);
      }
    }
  }
  return keys;
};

/**
 * Crea un wrapper de namespace para traducciones.
 * Útil para componentes que necesitan traducciones de un namespace específico.
 */
export const createTranslationNamespace = (getTranslation: (key: string, fallback?: any) => string, namespace: string) => {
  return (key: string, fallback: any = null): string => {
    const namespacedKey = namespace ? `${namespace}.${key}` : key;
    return getTranslation(namespacedKey, fallback);
  };
};

/**
 * Obtiene múltiples traducciones en una sola llamada.
 * Útil para optimizar el rendimiento en componentes.
 */
export const batchGetTranslations = (getTranslation: (key: string) => string, keys: string[] = []): Record<string, string> => {
  if (!Array.isArray(keys)) return {};
  const result: Record<string, string> = {};
  for (const key of keys) {
    if (typeof key === 'string') {
      result[key] = getTranslation(key);
    }
  }
  return result;
};

/**
 * Utilidad de caché para traducciones.
 * Permite almacenar en caché resultados de traducciones para mejorar el rendimiento.
 */
export const createTranslationCache = () => {
  const cache = new Map<string, any>();
  return {
    /**
     * Obtiene una traducción del caché o la calcula y almacena en caché.
     */
    get: (key: string, computeFn: () => any) => {
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = computeFn();
      cache.set(key, result);
      return result;
    },
    /**
     * Limpia el caché.
     */
    clear: () => cache.clear(),
    /**
     * Devuelve el tamaño del caché.
     */
    size: () => cache.size,
    /**
     * Verifica si una clave está en el caché.
     */
    has: (key: string) => cache.has(key)
  };
};

export default {
  createTranslationValidator,
  pluralize,
  formatTranslation,
  mergeTranslations,
  extractTranslationKeys,
  createTranslationNamespace,
  batchGetTranslations,
  createTranslationCache
};
