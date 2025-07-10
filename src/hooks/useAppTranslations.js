import { useLanguage } from '../LanguageContext';

// =============================================
// useAppTranslations: Hook para gestión centralizada de traducciones y labels
// Centraliza la gestión de traducciones y labels de filtros, idiomas y UI, optimizando la internacionalización y la experiencia de usuario.
// =============================================
export const useAppTranslations = () => {
  const { getTranslation, lang } = useLanguage();

  /**
   * Obtiene la traducción para filtros especiales
   */
  const getSpecialFilterLabel = (filterType) => {
    return getTranslation(`filters.special.${filterType}`, filterType);
  };

  /**
   * Obtiene la traducción para idiomas
   */
  const getLanguageLabel = (languageCode) => {
    return getTranslation(`filters.languages.${languageCode}`, languageCode);
  };

  /**
   * Obtiene todas las traducciones comunes usadas en filtros
   */
  const getFilterLabels = () => {
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
  const getLanguageToggleLabels = () => {
    return {
      spanish: getLanguageLabel('es'),
      english: getLanguageLabel('en')
    };
  };

  /**
   * Obtiene etiquetas para acciones comunes de UI
   */
  const getUILabels = () => {
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
  const getCategoryLanguageLabel = (category, languageCode) => {
    // Para categorías específicas como podcast y documentales
    if (category === 'podcast' || category === 'documentales') {
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
