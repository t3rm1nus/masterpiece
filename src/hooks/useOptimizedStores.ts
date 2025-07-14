import { useMemo, useCallback } from 'react';
import { useAppView, useAppData, useAppTheme, useAppUI } from '../store/useAppStore';
import { useMultiLanguageData } from './useMultiLanguageData';

interface Item {
  [key: string]: any;
  title?: string | { [lang: string]: string };
  name?: string;
  description?: string | { [lang: string]: string };
}

interface UseOptimizedStoresReturn {
  isMobile: boolean;
  currentView: string;
  selectedCategory: string | null;
  isDarkTheme: boolean;
  filteredItems: Item[];
  homeRecommendations: Item[];
  badgeConfig: any;
  handleItemClick: (item: Item) => void;
  processItemTitle: (item: Item) => string;
  processItemDescription: (item: Item) => string;
  isHomeView: boolean;
  hasFilteredItems: boolean;
  hasHomeRecommendations: boolean;
}

export const useOptimizedStores = (): UseOptimizedStoresReturn => {
  const { goToDetail, currentView } = useAppView();
  const { filteredItems, homeRecommendations, selectedCategory } = useAppData();
  const { isDarkTheme, getMasterpieceBadgeConfig } = useAppTheme();
  const { isMobile } = useAppUI();
  const { getTitle: processTitle, getDescription: processDescription } = useMultiLanguageData();

  const badgeConfig = useMemo(() => getMasterpieceBadgeConfig(), [getMasterpieceBadgeConfig]);

  const handleItemClick = useCallback((item: Item) => {
    goToDetail(item);
  }, [goToDetail]);

  const processItemTitle = useCallback((item: Item) => {
    return processTitle(item.title ?? '', item.name ?? '');
  }, [processTitle]);

  const processItemDescription = useCallback((item: Item) => {
    return processDescription(item.description ?? '');
  }, [processDescription]);

  const isHomeView = useMemo(() => currentView === 'home', [currentView]);
  const hasFilteredItems = useMemo(() => filteredItems && filteredItems.length > 0, [filteredItems]);
  const hasHomeRecommendations = useMemo(() => homeRecommendations && homeRecommendations.length > 0, [homeRecommendations]);

  return {
    isMobile,
    currentView,
    selectedCategory,
    isDarkTheme,
    filteredItems,
    homeRecommendations,
    badgeConfig,
    handleItemClick,
    processItemTitle,
    processItemDescription,
    isHomeView,
    hasFilteredItems,
    hasHomeRecommendations
  };
};

interface UseOptimizedStylesReturn {
  containerStyles: React.CSSProperties;
  cardStyles: React.CSSProperties;
  textStyles: {
    primary: React.CSSProperties;
    secondary: React.CSSProperties;
  };
  isDarkTheme: boolean;
  isMobile: boolean;
}

export const useOptimizedStyles = (): UseOptimizedStylesReturn => {
  const { isDarkTheme } = useAppTheme();
  const { isMobile } = useAppUI();

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