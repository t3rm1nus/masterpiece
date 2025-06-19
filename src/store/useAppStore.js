import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { dataSlice } from './slices/dataSlice';
import { viewSlice } from './slices/viewSlice';
import { themeSlice } from './slices/themeSlice';
import { useCallback, useMemo } from 'react';

// Create the store
const useAppStore = create()(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        ...dataSlice(set, get),
        ...viewSlice(set, get),
        ...themeSlice(set, get),
      }))
    ),
    {
      name: 'app-store',
    }
  )
);

// Create selectors as constants to ensure stable references
const DATA_SELECTOR = (state) => ({
  recommendations: state.recommendations,
  isLoading: state.isLoading,
  error: state.error,
  loadRecommendations: state.loadRecommendations,
  clearError: state.clearError,
});

const VIEW_SELECTOR = (state) => ({
  currentView: state.currentView,
  previousView: state.previousView,
  selectedItem: state.selectedItem,
  goHome: state.goHome,
  goToDetail: state.goToDetail,
  goToAbout: state.goToAbout,
  goToContact: state.goToContact,
  setSelectedItem: state.setSelectedItem,
  goBackFromDetail: state.goBackFromDetail,
  goBackFromCoffee: state.goBackFromCoffee,
  goToCoffee: state.goToCoffee,
  canGoBack: state.canGoBack,
  goBack: state.goBack,
});

// Simple theme selector that only returns primitive values and functions
const THEME_SELECTOR = (state) => ({
  theme: state.theme,
  isDarkMode: state.isDarkMode,
  toggleTheme: state.toggleTheme,
});

const UI_SELECTOR = (state) => ({
  isLoading: state.isLoading,
  error: state.error,
  isMobileUI: state.isMobileUI || false,
});

const ERROR_SELECTOR = (state) => ({
  error: state.error,
  clearError: state.clearError,
  hasError: !!state.error,
});

const BADGE_CONFIG_SELECTOR = (state) => ({
  badgeConfig: state.badgeConfig || {},
  showBadges: state.showBadges || true,
});

const SPECIAL_BUTTON_SELECTOR = (state) => {
  return () => state.specialButtonLabel || 'Default Label';
};

// Export hooks with stable selectors
export const useAppData = () => useAppStore(DATA_SELECTOR);
export const useAppView = () => useAppStore(VIEW_SELECTOR);
export const useAppTheme = () => useAppStore(THEME_SELECTOR);
export const useAppUI = () => useAppStore(UI_SELECTOR);
export const useAppError = () => useAppStore(ERROR_SELECTOR);
export const useSpecialButtonLabel = () => useAppStore(SPECIAL_BUTTON_SELECTOR);
export const useMasterpieceBadgeConfig = () => useAppStore(BADGE_CONFIG_SELECTOR);

export default useAppStore;