import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
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

interface TranslationData {
  [key: string]: any;
}

interface LanguageContextType {
  // Estado básico
  lang: string;
  t: TranslationData;
  availableLanguages: string[];
  
  // Funciones de cambio de idioma
  changeLanguage: (lng: string) => void;
  setLanguage: (lng: string) => void;
  
  // Funciones de traducción (métodos originales)
  getTranslation: (key: string, fallback?: string) => string;
  getCategoryTranslation: (category: string, fallback?: string) => string;
  getSubcategoryTranslation: (subcategory: string, category?: string | null, fallback?: string) => string;
  
  // Funciones de traducción (métodos de conveniencia)
  translate: (key: string, fallback?: string | null) => string;
  translateCategory: (category: string, fallback?: string | null) => string;
  translateSubcategory: (subcategory: string, category?: string | null, fallback?: string | null) => string;
  
  // Funciones de utilidad
  hasTranslation: (key: string) => boolean;
  isLanguageAvailable: (language: string) => boolean;
  getAvailableLanguages: () => string[];
  getTranslationMetadata: () => {
    currentLanguage: string;
    availableLanguages: string[];
    totalLanguages: number;
  };
}

interface LanguageProviderProps {
  children: ReactNode;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: LanguageProviderProps) {
  // Usamos el store de idioma unificado
  const { 
    language, 
    setLanguage,
    setTranslations: updateStoreTranslations
  } = useAppLanguage();

  // Estado para las traducciones cargadas
  const [translations, setTranslations] = useState<TranslationData>({});

  // Cargar traducciones al inicio
  useEffect(() => {
    if (textsData && (textsData as any)[language]) {
      setTranslations((textsData as any)[language]);
      // Actualizar el store con las traducciones completas
      updateStoreTranslations(textsData as any);
    } else {
      console.warn('No se encontraron traducciones para:', language);
    }
  }, [language, updateStoreTranslations]);

  // Crear objeto t con las traducciones
  const t = translations;
  const lang = language; // Alias para compatibilidad
  const availableLanguages = ['es', 'en'];

  // Wrapper function para setLanguage con validación adicional
  const changeLanguage = (lng: string): void => {
    if (!lng || typeof lng !== 'string') {
      console.warn('[LanguageContext] Invalid language provided to changeLanguage:', lng);
      return;
    }
    
    setLanguage(lng as 'es' | 'en');
  };

  // Funciones de traducción con datos reales
  const getTranslation = (key: string, fallback: string = key): string => {
    try {
      const keys = key.split('.');
      let value: any = translations;
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

  const getCategoryTranslation = (category: string, fallback: string = category): string => {
    return getTranslation(`categories.${category}`, fallback);
  };

  const getSubcategoryTranslation = (subcategory: string, category: string | null = null, fallback: string = subcategory): string => {
    if (category) {
      const result = getTranslation(`subcategories.${category}.${subcategory}`, fallback);
      // Asegurar que nunca devuelva un objeto
      if (typeof result === 'object' && result !== null) {
        return fallback;
      }
      return result;
    }
    // Si no hay categoría, devolver el fallback directamente
    return fallback;
  };

  // Método de conveniencia para traducir con fallback automático a la clave
  const translate = (key: string, fallback: string | null = null): string => {
    return getTranslation(key, fallback || key);
  };

  // Método de conveniencia para traducir categorías
  const translateCategory = (category: string, fallback: string | null = null): string => {
    return getCategoryTranslation(category, fallback || category);
  };

  // Método de conveniencia para traducir subcategorías con contexto de categoría
  const translateSubcategory = (subcategory: string, category: string | null = null, fallback: string | null = null): string => {
    return getSubcategoryTranslation(subcategory, category, fallback || subcategory);
  };

  // Crear funciones de utilidad locales para reemplazar las eliminadas del store
  const hasTranslation = (key: string): boolean => {
    return Boolean(key && key !== ''); // Simplificado
  };

  const getTranslationMetadata = () => {
    return {
      currentLanguage: lang,
      availableLanguages: availableLanguages,
      totalLanguages: availableLanguages.length
    };
  };

  // Método para verificar si el idioma actual está disponible
  const isLanguageAvailable = (language: string): boolean => {
    return availableLanguages.includes(language);
  };

  // Método para obtener la lista de idiomas disponibles
  const getAvailableLanguages = (): string[] => {
    return [...availableLanguages]; // Retorna una copia para evitar mutaciones
  };

  // Valor del contexto con compatibilidad hacia atrás y nuevas funcionalidades
  const contextValue: LanguageContextType = {
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

export function useLanguage(): LanguageContextType {
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
      getTranslation: (key: string) => key,
      getCategoryTranslation: (category: string) => category,
      getSubcategoryTranslation: (subcategory: string) => subcategory,
      translate: (key: string) => key,
      translateCategory: (category: string) => category,
      translateSubcategory: (subcategory: string) => subcategory,
      hasTranslation: () => false,
      isLanguageAvailable: () => false,
      getAvailableLanguages: () => ['es', 'en'],
      getTranslationMetadata: () => ({ currentLanguage: 'es', availableLanguages: ['es', 'en'], totalLanguages: 2 })
    };
  }
  
  return context;
} 