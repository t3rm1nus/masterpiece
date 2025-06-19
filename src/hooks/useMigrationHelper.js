/**
 * Hook de migración para facilitar la transición al store consolidado
 * Proporciona una interfaz compatible con los hooks anteriores
 */

import useAppStore, { 
  useAppData, 
  useAppView, 
  useAppUI, 
  useAppLanguage, 
  useAppTheme 
} from '../store/useAppStore';

/**
 * Hook de compatibilidad para reemplazar useDataStore
 * Mantiene la misma interfaz que el dataStore anterior
 */
export const useDataStoreMigration = () => {
  const dataState = useAppData();
  const { lang } = useAppLanguage();
  
  return {
    // Estados existentes
    ...dataState,
    
    // Funciones existentes con nombres compatibles
    getCategories: (language) => dataState.getCategories(language || lang),
    getSubcategoriesForCategory: dataState.getSubcategoriesForCategory,
    
    // Funciones adicionales que podrían estar siendo usadas
    resetAllFilters: useAppStore.getState().resetAllFilters,
    getDefaultTitle: (language) => {
      // Implementación compatible
      const category = dataState.selectedCategory;
      if (!category) return language === 'en' ? 'Recommendations' : 'Recomendaciones';
      
      const categoryMap = {
        es: {
          movies: 'Películas',
          videogames: 'Videojuegos',
          comics: 'Cómics',
          books: 'Libros',
          boardgames: 'Juegos de mesa',
          music: 'Música',
          podcast: 'Podcast',
          documentales: 'Documentales'
        },
        en: {
          movies: 'Movies',
          videogames: 'Video Games',
          comics: 'Comics',
          books: 'Books',
          boardgames: 'Board Games',
          music: 'Music',
          podcast: 'Podcast',
          documentales: 'Documentaries'
        }
      };
      
      return categoryMap[language || lang]?.[category] || category;
    }
  };
};

/**
 * Hook de compatibilidad para reemplazar useViewStore
 * Mantiene la misma interfaz que el viewStore anterior
 */
export const useViewStoreMigration = () => {
  const viewState = useAppView();
  const uiState = useAppUI();
  
  return {
    // Estados existentes
    ...viewState,
    ...uiState,
    
    // Funciones de navegación con nombres compatibles
    goBackFromDetail: viewState.goBackFromDetail,
    goBackFromCoffee: viewState.goBackFromCoffee,
    navigateToCoffee: () => viewState.navigate('coffee'),
    
    // Funciones deprecated marcadas para migración
    processTitle: (...args) => {
      console.warn('⚠️ processTitle is deprecated. Use useMultiLanguageData().getTitle() instead.');
      // Implementación de compatibilidad básica
      const [title, lang] = args;
      if (typeof title === 'object') {
        return title[lang] || title.es || title.en || '';
      }
      return title || '';
    },
    
    processDescription: (...args) => {
      console.warn('⚠️ processDescription is deprecated. Use useMultiLanguageData().getDescription() instead.');
      // Implementación de compatibilidad básica
      const [description, lang] = args;
      if (typeof description === 'object') {
        return description[lang] || description.es || description.en || '';
      }
      return description || '';
    }
  };
};

/**
 * Hook de compatibilidad para reemplazar useThemeStore
 */
export const useThemeStoreMigration = () => {
  const themeState = useAppTheme();
  
  return {
    ...themeState,
    
    // Funciones con nombres compatibles
    getSpecialButtonLabel: (type, lang) => {
      // Implementación compatible para etiquetas especiales
      const labels = {
        es: {
          spanish_cinema: 'Cine Español',
          masterpiece: 'Obras Maestras',
          recommended: 'Recomendado'
        },
        en: {
          spanish_cinema: 'Spanish Cinema',
          masterpiece: 'Masterpieces',
          recommended: 'Recommended'
        }
      };
      
      return labels[lang]?.[type] || type;
    }
  };
};

/**
 * Hook que proporciona acceso a todo el store para casos especiales
 */
export const useFullAppStore = () => {
  return useAppStore();
};

/**
 * Hook para verificar el estado de migración
 */
export const useMigrationStatus = () => {
  const store = useAppStore();
  
  return {
    isUsingNewStore: true,
    storeVersion: '2.0.0',
    debugInfo: store.getDebugState?.() || null,
    
    // Función para validar que la migración fue exitosa
    validateMigration: () => {
      const debug = store.getDebugState?.();
      
      const checks = {
        dataLoaded: !!debug?.data?.allDataLoaded,
        viewInitialized: !!debug?.view?.currentView,
        uiResponsive: !!debug?.ui?.isMobile !== undefined,
        languageSet: !!debug?.language?.current,
        themeSet: !!debug?.theme?.current
      };
      
      const allPassed = Object.values(checks).every(Boolean);
      
      console.log('[Migration] Validation results:', {
        allPassed,
        checks,
        debug
      });
      
      return { allPassed, checks, debug };
    }
  };
};

/**
 * Hook para facilitar la migración gradual de componentes
 */
export const useMigrationHelper = () => {
  return {
    // Funciones de migración
    migrateDataStore: useDataStoreMigration,
    migrateViewStore: useViewStoreMigration,
    migrateThemeStore: useThemeStoreMigration,
    
    // Nuevos hooks recomendados
    useNewData: useAppData,
    useNewView: useAppView,
    useNewUI: useAppUI,
    useNewLanguage: useAppLanguage,
    useNewTheme: useAppTheme,
    
    // Estado de migración
    status: useMigrationStatus()
  };
};
