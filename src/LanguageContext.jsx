import React, { createContext, useContext } from "react";
import useLanguageStore from "./store/languageStore";

/**
 * Robust Language Context
 * 
 * Provides a stable interface for the translation system with:
 * - Error boundaries for translation failures
 * - Comprehensive translation methods
 * - Backward compatibility
 */

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // Usamos el store de idioma robusto
  const { 
    lang, 
    translations: t, 
    availableLanguages,
    setLanguage, 
    getTranslation, 
    getCategoryTranslation,
    getSubcategoryTranslation,
    hasTranslation,
    getTranslationMetadata
  } = useLanguageStore();

  console.log('[LanguageProvider] Current state:', {
    lang,
    hasTranslations: !!t && Object.keys(t).length > 0,
    translationsKeys: t ? Object.keys(t) : [],
    availableLanguages,
    coffeeTranslations: t?.coffee || 'missing'
  });
  // Wrapper function para setLanguage con validación adicional
  const changeLanguage = (lng) => {
    console.log('[LanguageContext] Language change requested:', lng);
    console.log('[LanguageContext] Current language:', lang);
    
    if (!lng || typeof lng !== 'string') {
      console.warn('[LanguageContext] Invalid language provided to changeLanguage:', lng);
      return;
    }
    
    console.log('[LanguageContext] Calling setLanguage with:', lng);
    setLanguage(lng);
  };

  // Método de conveniencia para traducir con fallback automático a la clave
  const translate = (key, fallback = null) => {
    return getTranslation(key, fallback);
  };

  // Método de conveniencia para traducir categorías
  const translateCategory = (category, fallback = null) => {
    return getCategoryTranslation(category, fallback);
  };

  // Método de conveniencia para traducir subcategorías con contexto de categoría
  const translateSubcategory = (subcategory, category = null, fallback = null) => {
    return getSubcategoryTranslation(subcategory, category, fallback);
  };

  // Método para verificar si el idioma actual está disponible
  const isLanguageAvailable = (language) => {
    return availableLanguages.includes(language);
  };

  // Método para obtener la lista de idiomas disponibles
  const getAvailableLanguages = () => {
    return [...availableLanguages]; // Retorna una copia para evitar mutaciones
  };

  // Valor del contexto con compatibilidad hacia atrás y nuevas funcionalidades
  const contextValue = {
    // Estado básico
    lang, 
    t, 
    availableLanguages,
    
    // Funciones de cambio de idioma
    changeLanguage,
    setLanguage: changeLanguage, // Alias para compatibilidad
    
    // Funciones de traducción (métodos originales)
    getTranslation,
    getCategoryTranslation,
    getSubcategoryTranslation,
    
    // Funciones de traducción (métodos de conveniencia)
    translate,
    translateCategory,
    translateSubcategory,
    
    // Funciones de utilidad
    hasTranslation,
    isLanguageAvailable,
    getAvailableLanguages,
    getTranslationMetadata
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  
  if (!context) {
    console.error('[LanguageContext] useLanguage must be used within a LanguageProvider');
    // Retornar un objeto de fallback para evitar crashes
    return {
      lang: 'es',
      t: {},
      availableLanguages: ['es', 'en'],
      changeLanguage: () => {},
      setLanguage: () => {},
      getTranslation: (key) => key,
      getCategoryTranslation: (category) => category,
      getSubcategoryTranslation: (subcategory) => subcategory,
      translate: (key) => key,
      translateCategory: (category) => category,
      translateSubcategory: (subcategory) => subcategory,
      hasTranslation: () => false,
      isLanguageAvailable: () => false,
      getAvailableLanguages: () => ['es', 'en'],
      getTranslationMetadata: () => ({})
    };
  }
  
  return context;
}
