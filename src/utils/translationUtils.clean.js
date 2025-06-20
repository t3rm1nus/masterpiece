/**
 * Translation Utilities
 * 
 * Core utilities for translation handling
 * Used by languageStore for robust translation operations
 */

/**
 * Normalize a key to lowercase for case-insensitive comparison
 */
export const normalizeKey = (key) => {
  if (!key || typeof key !== 'string') return '';
  return key.toLowerCase().trim();
};

/**
 * Safe get function for nested object access
 */
export const safeGet = (obj, path, fallback = undefined) => {
  if (!obj || typeof obj !== 'object' || !path) return fallback;
  
  try {
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current === null || current === undefined) {
        return fallback;
      }
      current = current[key];
    }
    
    return current !== undefined ? current : fallback;
  } catch (error) {
    console.warn('[Translation] Safe get failed:', error);
    return fallback;
  }
};

/**
 * Check if translation data is valid
 */
export const isValidTranslationData = (data) => {
  return data && typeof data === 'object' && !Array.isArray(data);
};

/**
 * Get available languages from texts
 */
export const getAvailableLanguages = () => {
  try {
    // Import texts dynamically to avoid circular dependency
    const texts = require('../data/texts.json');
    
    const metadata = texts?.metadata;
    if (metadata?.supportedLanguages && Array.isArray(metadata.supportedLanguages)) {
      return metadata.supportedLanguages;
    }
    
    // Fallback: extract from texts object, excluding metadata
    return Object.keys(texts || {}).filter(key => key !== 'metadata');
  } catch (error) {
    console.warn('[Translation] Failed to get available languages:', error);
    return ['es', 'en']; // Fallback
  }
};

/**
 * Get default language
 */
export const getDefaultLanguage = () => {
  try {
    const texts = require('../data/texts.json');
    return texts?.metadata?.defaultLanguage || 'es';
  } catch (error) {
    console.warn('[Translation] Failed to get default language:', error);
    return 'es'; // Fallback
  }
};
