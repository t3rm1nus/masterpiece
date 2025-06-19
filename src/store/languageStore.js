import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import texts from '../data/texts.json';

/**
 * Robust Translation Engine Store
 * 
 * Provides a stable, Debian-like translation system with:
 * - Comprehensive error handling
 * - Case-insensitive lookups
 * - Fallback mechanisms
 * - Normalized key handling
 * - Category-aware subcategory translations
 */

// Utility functions for robust translation handling
const translationUtils = {
  /**
   * Normalize a key for consistent lookups
   */
  normalizeKey: (key) => {
    if (!key || typeof key !== 'string') return '';
    return key.toLowerCase().trim();
  },

  /**
   * Safe object navigation with dot notation
   */
  safeGet: (obj, path, fallback = undefined) => {
    if (!obj || !path) return fallback;
    
    try {
      const keys = path.split('.');
      let current = obj;
      
      for (const key of keys) {
        if (current === null || current === undefined || typeof current !== 'object') {
          return fallback;
        }
        current = current[key];
      }
      
      return current !== undefined ? current : fallback;
    } catch (error) {
      console.warn('[Translation] Safe get failed:', error);
      return fallback;
    }
  },

  /**
   * Check if translation data is valid
   */
  isValidTranslationData: (data) => {
    return data && typeof data === 'object' && !Array.isArray(data);
  },

  /**
   * Get available languages from texts
   */
  getAvailableLanguages: () => {
    const metadata = texts?.metadata;
    if (metadata?.supportedLanguages && Array.isArray(metadata.supportedLanguages)) {
      return metadata.supportedLanguages;
    }
    
    // Fallback: extract from texts object, excluding metadata
    return Object.keys(texts || {}).filter(key => key !== 'metadata');
  },

  /**
   * Get default language
   */
  getDefaultLanguage: () => {
    return texts?.metadata?.defaultLanguage || 'es';
  }
};

// Store para gestionar el idioma y las traducciones
const useLanguageStore = create(
  devtools(
    (set, get) => ({
      // Estado inicial
      lang: translationUtils.getDefaultLanguage(),
      translations: texts[translationUtils.getDefaultLanguage()] || {},
      availableLanguages: translationUtils.getAvailableLanguages(),
        // Acciones
      setLanguage: (lang) => {
        console.log('[LanguageStore] Setting language:', lang);
        const normalizedLang = translationUtils.normalizeKey(lang);
        const availableLanguages = get().availableLanguages;
        
        // Verificar que el idioma es válido
        if (!normalizedLang) {
          console.warn('[LanguageStore] Invalid language provided:', lang);
          return;
        }
        
        // Buscar idioma de forma case-insensitive
        const targetLang = availableLanguages.find(
          availableLang => translationUtils.normalizeKey(availableLang) === normalizedLang
        );
        
        if (targetLang && texts[targetLang]) {
          console.log('[LanguageStore] Language changed successfully:', targetLang);
          set(
            { 
              lang: targetLang,
              translations: texts[targetLang]
            },
            false,
            'setLanguage'
          );
        } else {
          console.warn('[LanguageStore] Language not found:', lang, 'Available:', availableLanguages);
        }
      },
      
      /**
       * Método robusto para obtener traducciones con dot notation
       * Ejemplo: getTranslation('ui.navigation.home')
       */
      getTranslation: (key, fallback = null) => {
        const translations = get().translations;
        
        if (!key || typeof key !== 'string') {
          return fallback || key;
        }
        
        const result = translationUtils.safeGet(translations, key);
        
        if (result !== undefined) {
          return result;
        }
        
        // Si no se encuentra, intentar búsqueda case-insensitive en el último nivel
        const keys = key.split('.');
        if (keys.length > 1) {
          const parentPath = keys.slice(0, -1).join('.');
          const lastKey = translationUtils.normalizeKey(keys[keys.length - 1]);
          const parent = translationUtils.safeGet(translations, parentPath);
          
          if (translationUtils.isValidTranslationData(parent)) {
            const foundKey = Object.keys(parent).find(
              k => translationUtils.normalizeKey(k) === lastKey
            );
            if (foundKey) {
              return parent[foundKey];
            }
          }
        }
        
        return fallback || key;
      },
      
      /**
       * Método robusto para obtener traducciones de categorías
       */
      getCategoryTranslation: (category, fallback = null) => {
        if (!category || typeof category !== 'string') {
          return fallback || category;
        }
        
        const translations = get().translations;
        const normalizedCategory = translationUtils.normalizeKey(category);
        
        // Intento directo
        const directResult = translationUtils.safeGet(translations, `categories.${category}`);
        if (directResult !== undefined) {
          return directResult;
        }
        
        // Búsqueda case-insensitive
        const categories = translationUtils.safeGet(translations, 'categories', {});
        if (translationUtils.isValidTranslationData(categories)) {
          const foundKey = Object.keys(categories).find(
            key => translationUtils.normalizeKey(key) === normalizedCategory
          );
          
          if (foundKey) {
            return categories[foundKey];
          }
        }
        
        return fallback || category;
      },
      
      /**
       * Método robusto para obtener traducciones de subcategorías
       * Busca primero en subcategorías organizadas por categoría, luego en subcategorías generales
       */
      getSubcategoryTranslation: (subcategory, category = null, fallback = null) => {
        if (!subcategory || typeof subcategory !== 'string') {
          return fallback || subcategory;
        }
        
        const translations = get().translations;
        const normalizedSubcategory = translationUtils.normalizeKey(subcategory);
        
        // 1. Si se proporciona categoría, buscar en subcategorías específicas de esa categoría
        if (category && typeof category === 'string') {
          const normalizedCategory = translationUtils.normalizeKey(category);
          
          // Búsqueda directa por categoría
          const categorySubcategories = translationUtils.safeGet(
            translations, 
            `subcategories.${category}`, 
            {}
          );
          
          if (translationUtils.isValidTranslationData(categorySubcategories)) {
            // Intento directo
            if (categorySubcategories[subcategory]) {
              return categorySubcategories[subcategory];
            }
            
            // Búsqueda case-insensitive
            const foundKey = Object.keys(categorySubcategories).find(
              key => translationUtils.normalizeKey(key) === normalizedSubcategory
            );
            
            if (foundKey) {
              return categorySubcategories[foundKey];
            }
          }
          
          // Búsqueda case-insensitive por categoría
          const subcategoriesObj = translationUtils.safeGet(translations, 'subcategories', {});
          if (translationUtils.isValidTranslationData(subcategoriesObj)) {
            const foundCategoryKey = Object.keys(subcategoriesObj).find(
              key => translationUtils.normalizeKey(key) === normalizedCategory
            );
            
            if (foundCategoryKey && translationUtils.isValidTranslationData(subcategoriesObj[foundCategoryKey])) {
              const categorySubcats = subcategoriesObj[foundCategoryKey];
              const foundSubKey = Object.keys(categorySubcats).find(
                key => translationUtils.normalizeKey(key) === normalizedSubcategory
              );
              
              if (foundSubKey) {
                return categorySubcats[foundSubKey];
              }
            }
          }
        }
        
        // 2. Búsqueda general en todas las subcategorías (fallback)
        const subcategoriesObj = translationUtils.safeGet(translations, 'subcategories', {});
        if (translationUtils.isValidTranslationData(subcategoriesObj)) {
          // Buscar en todas las categorías
          for (const categoryKey of Object.keys(subcategoriesObj)) {
            const categorySubcats = subcategoriesObj[categoryKey];
            if (translationUtils.isValidTranslationData(categorySubcats)) {
              // Intento directo
              if (categorySubcats[subcategory]) {
                return categorySubcats[subcategory];
              }
              
              // Búsqueda case-insensitive
              const foundKey = Object.keys(categorySubcats).find(
                key => translationUtils.normalizeKey(key) === normalizedSubcategory
              );
              
              if (foundKey) {
                return categorySubcats[foundKey];
              }
            }
          }
        }
        
        return fallback || subcategory;
      },

      /**
       * Método de utilidad para verificar si una traducción existe
       */
      hasTranslation: (key) => {
        const result = get().getTranslation(key, null);
        return result !== null && result !== key;
      },

      /**
       * Método para obtener metadatos de traducciones
       */
      getTranslationMetadata: () => {
        return texts?.metadata || {};
      }
    }),
    { name: 'language-store' } // Nombre para DevTools
  )
);

export default useLanguageStore;
