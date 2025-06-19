/**
 * Translation Utilities
 * 
 * Additional utilities for advanced translation handling
 * beyond the core translation engine.
 */

/**
 * Create a translation key validator
 * Useful for development to ensure all translation keys exist
 */
export const createTranslationValidator = (translations) => {
  const missingKeys = new Set();
  
  return {
    /**
     * Validate that a translation key exists
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
     * Get all missing keys that were validated
     */
    getMissingKeys: () => Array.from(missingKeys),
    
    /**
     * Clear missing keys cache
     */
    clearMissingKeys: () => missingKeys.clear()
  };
};

/**
 * Pluralization utility for translations
 * Handles basic English/Spanish pluralization rules
 */
export const pluralize = (count, singular, plural = null, language = 'es') => {
  if (typeof count !== 'number') return singular;
  
  if (language === 'en') {
    return count === 1 ? singular : (plural || `${singular}s`);
  } else {
    // Spanish rules - basic implementation
    return count === 1 ? singular : (plural || `${singular}s`);
  }
};

/**
 * Format translation with interpolation
 * Example: formatTranslation("Hello {name}!", { name: "World" }) => "Hello World!"
 */
export const formatTranslation = (template, variables = {}) => {
  if (!template || typeof template !== 'string') return template;
  if (!variables || typeof variables !== 'object') return template;
  
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return variables[key] !== undefined ? variables[key] : match;
  });
};

/**
 * Deep merge translation objects
 * Useful for combining partial translations or fallbacks
 */
export const mergeTranslations = (target, source) => {
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
 * Extract all translation keys from a translation object
 * Useful for generating key lists or finding unused keys
 */
export const extractTranslationKeys = (translations, prefix = '') => {
  const keys = [];
  
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
 * Create a translation namespace wrapper
 * Useful for components that need translations from a specific namespace
 */
export const createTranslationNamespace = (getTranslation, namespace) => {
  return (key, fallback = null) => {
    const namespacedKey = namespace ? `${namespace}.${key}` : key;
    return getTranslation(namespacedKey, fallback);
  };
};

/**
 * Batch translation getter
 * Get multiple translations at once with a single call
 */
export const batchGetTranslations = (getTranslation, keys = []) => {
  if (!Array.isArray(keys)) return {};
  
  const result = {};
  for (const key of keys) {
    if (typeof key === 'string') {
      result[key] = getTranslation(key);
    }
  }
  
  return result;
};

/**
 * Translation cache utility
 * Simple memoization for translation lookups
 */
export const createTranslationCache = () => {
  const cache = new Map();
  
  return {
    /**
     * Get cached translation or compute and cache it
     */
    get: (key, computeFn) => {
      if (cache.has(key)) {
        return cache.get(key);
      }
      
      const result = computeFn();
      cache.set(key, result);
      return result;
    },
    
    /**
     * Clear cache
     */
    clear: () => cache.clear(),
    
    /**
     * Get cache size
     */
    size: () => cache.size,
    
    /**
     * Check if key is cached
     */
    has: (key) => cache.has(key)
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
