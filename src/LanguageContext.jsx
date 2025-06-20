import React, { createContext, useContext, useEffect, useState } from "react";
import { useAppLanguage } from "./store/useAppStore";
import textsData from "./data/texts.json";

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
  // Usamos el store de idioma unificado
  const { 
    language, 
    setLanguage,
    setTranslations: updateStoreTranslations
  } = useAppLanguage();

  // Estado para las traducciones cargadas
  const [translations, setTranslations] = useState({});  // Cargar traducciones al inicio
  useEffect(() => {
    if (textsData && textsData[language]) {
      console.log('Cargando traducciones para:', language, textsData[language]);
      setTranslations(textsData[language]);
      // Actualizar el store con las traducciones completas
      updateStoreTranslations(textsData);
    } else {
      console.warn('No se encontraron traducciones para:', language);
    }
  }, [language, updateStoreTranslations]);
  // Crear objeto t con las traducciones
  const t = translations;
  const lang = language; // Alias para compatibilidad
  const availableLanguages = ['es', 'en'];// Wrapper function para setLanguage con validación adicional
  const changeLanguage = (lng) => {
    if (!lng || typeof lng !== 'string') {
      console.warn('[LanguageContext] Invalid language provided to changeLanguage:', lng);
      return;
    }
    
    setLanguage(lng);
  };
  // Funciones de traducción con datos reales
  const getTranslation = (key, fallback = key) => {
    try {
      const keys = key.split('.');
      let value = translations;
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) break;
      }
      return value || fallback;
    } catch (error) {
      console.warn('[LanguageContext] Error getting translation for key:', key, error);
      return fallback;
    }
  };

  const getCategoryTranslation = (category, fallback = category) => {
    return getTranslation(`categories.${category}`, fallback);
  };

  const getSubcategoryTranslation = (subcategory, category = null, fallback = subcategory) => {
    if (category) {
      return getTranslation(`subcategories.${category}.${subcategory}`, fallback);
    }
    return getTranslation(`subcategories.${subcategory}`, fallback);
  };

  // Método de conveniencia para traducir con fallback automático a la clave
  const translate = (key, fallback = null) => {
    return getTranslation(key, fallback || key);
  };

  // Método de conveniencia para traducir categorías
  const translateCategory = (category, fallback = null) => {
    return getCategoryTranslation(category, fallback || category);
  };

  // Método de conveniencia para traducir subcategorías con contexto de categoría
  const translateSubcategory = (subcategory, category = null, fallback = null) => {
    return getSubcategoryTranslation(subcategory, category, fallback || subcategory);
  };
  // Crear funciones de utilidad locales para reemplazar las eliminadas del store
  const hasTranslation = (key) => {
    return key && key !== ''; // Simplificado
  };

  const getTranslationMetadata = () => {
    return {
      currentLanguage: lang,
      availableLanguages: availableLanguages,
      totalLanguages: availableLanguages.length
    };
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
