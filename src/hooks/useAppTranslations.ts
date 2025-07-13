import { useLanguage } from '../LanguageContext';
import { Language, Category } from '../types';

// =============================================
// useAppTranslations: Hook para gestión centralizada de traducciones y labels
// Centraliza la gestión de traducciones y labels de filtros, idiomas y UI, optimizando la internacionalización y la experiencia de usuario.
// =============================================

// Tipos para las traducciones
type FilterLabels = {
  spanishCinema: string;
  masterpieces: string;
  spanish: string;
  english: string;
  allLanguages: string;
};

type LanguageToggleLabels = {
  spanish: string;
  english: string;
};

type UILabels = {
  back: string;
  close: string;
  home: string;
  loading: string;
  noResults: string;
  error: string;
  search: string;
  filter: string;
};

type AppTranslationsReturn = {
  getSpecialFilterLabel: (filterType: string) => string;
  getLanguageLabel: (languageCode: string) => string;
  getCategoryLanguageLabel: (category: Category, languageCode: string) => string;
  getFilterLabels: () => FilterLabels;
  getLanguageToggleLabels: () => LanguageToggleLabels;
  getUILabels: () => UILabels;
  currentLanguage: Language;
  t: (key: string, fallback?: string) => string;
};

export const useAppTranslations = (): AppTranslationsReturn => {
  const { getTranslation, lang } = useLanguage();

  /**
   * Obtiene la traducción para filtros especiales
   */
  const getSpecialFilterLabel = (filterType: string): string => {
    return getTranslation(`filters.special.${filterType}`, filterType);
  };

  /**
   * Obtiene la traducción para idiomas
   */
  const getLanguageLabel = (languageCode: string): string => {
    return getTranslation(`filters.languages.${languageCode}`, languageCode);
  };

  /**
   * Obtiene todas las traducciones comunes usadas en filtros
   */
  const getFilterLabels = (): FilterLabels => {
    return {
      spanishCinema: getSpecialFilterLabel('spanish_cinema'),
      masterpieces: getSpecialFilterLabel('masterpieces'),
      spanish: getLanguageLabel('es'),
      english: getLanguageLabel('en'),
      allLanguages: getLanguageLabel('all')
    };
  };

  /**
   * Obtiene el texto para los botones de cambio de idioma
   */
  const getLanguageToggleLabels = (): LanguageToggleLabels => {
    return {
      spanish: getLanguageLabel('es'),
      english: getLanguageLabel('en')
    };
  };

  /**
   * Obtiene etiquetas para acciones comunes de UI
   */
  const getUILabels = (): UILabels => {
    return {
      back: getTranslation('ui.navigation.back', 'Volver'),
      close: getTranslation('ui.navigation.close', 'Cerrar'),
      home: getTranslation('ui.navigation.home', 'Inicio'),
      loading: getTranslation('ui.states.loading', 'Cargando...'),
      noResults: getTranslation('ui.states.noResults', 'No se encontraron resultados'),
      error: getTranslation('ui.states.error', 'Error'),
      search: getTranslation('ui.actions.search', 'Buscar'),
      filter: getTranslation('ui.actions.filter', 'Filtrar')
    };
  };

  /**
   * Función helper para construir labels de botones de idioma específicos por categoría
   */
  const getCategoryLanguageLabel = (category: Category, languageCode: string): string => {
    // Para categorías específicas como podcasts y documentales
    if (category === 'podcasts' || category === 'documentales') {
      return getLanguageLabel(languageCode);
    }
    return getLanguageLabel(languageCode);
  };

  return {
    // Funciones específicas
    getSpecialFilterLabel,
    getLanguageLabel,
    getCategoryLanguageLabel,
    
    // Objetos de conveniencia
    getFilterLabels,
    getLanguageToggleLabels,
    getUILabels,
    
    // Estado del idioma actual
    currentLanguage: lang,
    
    // Función genérica de traducción
    t: getTranslation
  };
};

export default useAppTranslations;
