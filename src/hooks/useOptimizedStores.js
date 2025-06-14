import { useMemo, useCallback } from 'react';
import { useViewStore } from '../store/viewStore';
import { useDataStore } from '../store/dataStore';
import { useThemeStore } from '../store/themeStore';

/**
 * Hook personalizado para optimizar el rendimiento de componentes
 * que necesitan múltiples funciones de los stores
 */
export const useOptimizedStores = () => {
  // Selectores específicos para evitar re-renders innecesarios
  const isMobile = useViewStore(state => state.isMobile);
  const currentView = useViewStore(state => state.currentView);
  const navigateToDetail = useViewStore(state => state.navigateToDetail);
  const processTitle = useViewStore(state => state.processTitle);
  const processDescription = useViewStore(state => state.processDescription);
  
  const filteredItems = useDataStore(state => state.filteredItems);
  const homeRecommendations = useDataStore(state => state.homeRecommendations);
  const selectedCategory = useDataStore(state => state.selectedCategory);
  
  const isDarkTheme = useThemeStore(state => state.isDarkTheme);
  const getMasterpieceBadgeConfig = useThemeStore(state => state.getMasterpieceBadgeConfig);

  // Memoizar configuraciones que no cambian frecuentemente
  const badgeConfig = useMemo(() => getMasterpieceBadgeConfig(), [getMasterpieceBadgeConfig]);
  
  // Callbacks optimizados
  const handleItemClick = useCallback((item) => {
    navigateToDetail(item);
  }, [navigateToDetail]);

  const processItemTitle = useCallback((item) => {
    return processTitle(item);
  }, [processTitle]);

  const processItemDescription = useCallback((item) => {
    return processDescription(item);
  }, [processDescription]);

  // Selectores computados memoizados
  const isHomeView = useMemo(() => currentView === 'home', [currentView]);
  const hasFilteredItems = useMemo(() => filteredItems && filteredItems.length > 0, [filteredItems]);
  const hasHomeRecommendations = useMemo(() => homeRecommendations && homeRecommendations.length > 0, [homeRecommendations]);

  return {
    // Estados básicos
    isMobile,
    currentView,
    selectedCategory,
    isDarkTheme,
    
    // Datos
    filteredItems,
    homeRecommendations,
    
    // Configuraciones memoizadas
    badgeConfig,
    
    // Callbacks optimizados
    handleItemClick,
    processItemTitle,
    processItemDescription,
    
    // Selectores computados
    isHomeView,
    hasFilteredItems,
    hasHomeRecommendations
  };
};

/**
 * Hook para optimizar el manejo de estilos condicionales
 */
export const useOptimizedStyles = () => {
  const isDarkTheme = useThemeStore(state => state.isDarkTheme);
  const isMobile = useViewStore(state => state.isMobile);

  const containerStyles = useMemo(() => ({
    backgroundColor: isDarkTheme ? '#1e1e1e' : '#ffffff',
    color: isDarkTheme ? '#ffffff' : '#000000',
    minHeight: '100vh',
    padding: isMobile ? '10px' : '20px'
  }), [isDarkTheme, isMobile]);

  const cardStyles = useMemo(() => ({
    backgroundColor: isDarkTheme ? '#2d2d2d' : '#ffffff',
    border: isDarkTheme ? '1px solid #333' : '1px solid #e0e0e0',
    boxShadow: isDarkTheme 
      ? '0 2px 8px rgba(0,0,0,0.3)' 
      : '0 2px 8px rgba(0,0,0,0.1)'
  }), [isDarkTheme]);

  const textStyles = useMemo(() => ({
    primary: {
      color: isDarkTheme ? '#ffffff' : '#000000'
    },
    secondary: {
      color: isDarkTheme ? '#cccccc' : '#666666'
    }
  }), [isDarkTheme]);

  return {
    containerStyles,
    cardStyles,
    textStyles,
    isDarkTheme,
    isMobile
  };
};
