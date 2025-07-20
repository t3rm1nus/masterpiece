// =============================================
// STORE GLOBAL ÚNICO DE MASTERPIECE
// Este archivo implementa el único store global de la app, usando Zustand con slices modulares.
// Toda la navegación, estado global y configuración se gestiona aquí mediante slices modernos.
// No existen stores legacy ni duplicados: cualquier estado global debe estar en un slice y documentado.
//
// CONVENCIONES Y BUENAS PRÁCTICAS:
// - Todos los estados y funciones globales deben estar en slices (ver ./themeStore, ./languageStore, ./navigationStore, ./dataStore).
// - No duplicar estados/funciones en el objeto principal: si un campo existe en un slice, no debe declararse aquí.
// - Utilidades globales deben importarse desde './utils'.
// - Los nombres de campos deben ser consistentes en todo el store y la app (ej: 'language', 'selectedCategory', 'activeSubcategory').
// - Si se agregan nuevos estados globales, documentar aquí y en el slice correspondiente.
// - Cada slice debe estar documentado en su propio archivo.
// - El store está optimizado para performance y móviles, y soporta persistencia y migración.
// =============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createThemeSlice } from './themeStore';
import { createLanguageSlice } from './languageStore';
import { createNavigationSlice } from './navigationStore';
import { createDataSlice } from './dataStore';
import { migrateAppStoreState } from '../utils/migrationHelpers';

// Tipos para el store global
export interface AppStoreState {
  // Estados básicos que NO son de navegación ni datos
  isMobile: boolean;
  isTablet: boolean;
  isDarkMode: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  searchTerm: string;
  isSearchActive: boolean;
  error: string | null;
  language: 'es' | 'en';
  translations: Record<string, any>;

  // UI/Compatibilidad
  mobileHomeStyles: {
    cardStyle: React.CSSProperties;
    imageStyle: React.CSSProperties;
  };
  desktopStyles: {
    cardStyle: React.CSSProperties;
    categoryStyle: React.CSSProperties;
    subcategoryStyle: React.CSSProperties;
    imageStyle: React.CSSProperties;
    categoryContainer: React.CSSProperties;
  };
  baseRecommendationCardClasses: string;

  // selectedItem para debug y navegación
  selectedItem?: any;

  // Funciones de navegación
  goHome: () => void;
  goToHome: () => void;
  goToDetail: (item: any) => void;
  goToCoffee: () => void;
  goToHowToDownload: () => void;
  resetToHome: () => void;
  setView: (view: any) => void;
  setSelectedItem: (item: any | null) => void;
  goBackFromDetail: () => void;
  goBackFromCoffee: () => void;

  // DataSlice
  recommendations: any[];
  categories: any[];
  filteredItems: any[];
  selectedCategory: string | null;
  activeSubcategory: string | null;
  title: string;
  isDataInitialized: boolean;
  allData: Record<string, any[]>;
  updateWithRealData: (realData: any) => void;
  getRecommendations: () => any[];
  getCategories: () => any[];
  getSubcategoriesForCategory: (categoryId: string) => any[];
  setCategory: (category: string) => void;
  setActiveSubcategory: (subcategory: string) => void;
  generateNewRecommendations: () => void;
  getDefaultTitle: (lang: string) => string;
  updateTitleForLanguage: (lang: string) => void;
  activePodcastLanguages: string[];
  togglePodcastLanguage: (lang: string) => void;
  activeDocumentaryLanguages: string[];
  toggleDocumentaryLanguage: (lang: string) => void;
  activeLanguage: string;
  setActiveLanguage: (lang: string) => void;
  resetAllFilters: () => void;
  updateFilteredItems: (items: any[]) => void;
  setTitle: (title: string) => void;

  // Funciones UI/Compatibilidad
  setViewport: (width: number | boolean) => void;
  setSearchTerm: (term: string) => void;
  setSearchActive: (active: boolean) => void;
  clearSearch: () => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Traducción centralizada
  setLanguage: (language: 'es' | 'en') => void;
  toggleLanguage: () => void;
  setTranslations: (translations: Record<string, any>) => void;
  getTranslation: (key: string, fallback?: string) => string;

  // Badge config
  getMasterpieceBadgeConfig: () => {
    color: string;
    icon: string;
    svg: React.SVGProps<SVGSVGElement>;
    circle: React.SVGProps<SVGCircleElement>;
    star: React.SVGProps<SVGPathElement>;
  };

  // Estados especiales de filtros
  isSpanishCinemaActive: boolean;
  toggleSpanishCinema: () => void;
  setSpanishCinemaActive: (active: boolean) => void;
  isSpanishSeriesActive: boolean;
  toggleSpanishSeries: () => void;
  setSpanishSeriesActive: (active: boolean) => void;
  isMasterpieceActive: boolean;
  toggleMasterpiece: () => void;
  setMasterpieceActive: (active: boolean) => void;

  // Filtro de idioma para podcasts/documentales
  activePodcastDocumentaryLanguage: 'es' | 'en' | null;
  setActivePodcastDocumentaryLanguage: (lang: 'es' | 'en' | null) => void;
  resetActivePodcastDocumentaryLanguage: () => void;

  // Estado de paginación para persistir entre navegaciones
  mobilePage: number;
  desktopPage: number;
  setMobilePage: (page: number) => void;
  setDesktopPage: (page: number) => void;
  resetPagination: () => void;

  // Estado de la home que se preserva al navegar a overlays
  homeState: {
    selectedCategory: string | null;
    activeSubcategory: string | null;
    mobilePage: number;
    desktopPage: number;
    isSpanishCinemaActive: boolean;
    isMasterpieceActive: boolean;
    isSpanishSeriesActive: boolean;
    activePodcastDocumentaryLanguage: 'es' | 'en' | null;
    searchTerm: string;
    isSearchActive: boolean;
  };
  saveHomeState: () => void;
  restoreHomeState: () => void;

  // Slices externos
  // updateTitleForLanguage?: () => void; // Eliminar si no existe realmente
}

// --- LIMPIEZA DE PERSISTENCIA ANTES DE CREAR EL STORE ---
if (typeof window !== 'undefined') {
  try {
    // Verificar y limpiar si es necesario
  } catch (e) {
    console.warn('Error durante limpieza inicial:', e);
  }
}

const useAppStore = create<AppStoreState>()(
  persist(
    (set, get) => ({
      // Estados básicos que NO son de navegación ni datos
      isMobile: false,
      isTablet: false,
      searchTerm: '',
      isSearchActive: false,
      error: null,
      language: 'es',
      translations: {},

      // --- UI/Compatibilidad ---
      mobileHomeStyles: {
        cardStyle: { marginBottom: '8px' },
        imageStyle: { width: '80px', height: '110px' }
      },
      desktopStyles: {
        cardStyle: { marginBottom: '16px' },
        categoryStyle: { fontWeight: 'bold', color: '#0078d4' },
        subcategoryStyle: { fontSize: '0.9em', color: '#666' },
        imageStyle: { width: '120px', height: '170px' },
        categoryContainer: { display: 'flex', gap: '8px', alignItems: 'center' }
      },
      baseRecommendationCardClasses: 'recommendation-card transition-all duration-300 hover:shadow-lg cursor-pointer border border-gray-200 rounded-lg overflow-hidden',

      // --- Funciones UI/Compatibilidad ---
      setViewport: (width: number | boolean) => {
        if (typeof width === 'number') {
          set({
            isMobile: width < 900,
            isTablet: width >= 900 && width < 1200,
          });
        } else {
          set({ isMobile: !!width });
        }
      },
      setSearchTerm: (term: string) => set({ searchTerm: term }),
      setSearchActive: (active: boolean) => set({ isSearchActive: active }),
      clearSearch: () => set({ searchTerm: '', isSearchActive: false }),
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null }),

      // --- Traducción centralizada ---
      setLanguage: (language: 'es' | 'en') => set({ language }),
      toggleLanguage: () => set(state => ({ language: state.language === 'es' ? 'en' : 'es' })),
      setTranslations: (translations: Record<string, any>) => {
        set({ translations });
      },
      getTranslation: (key: string, fallback?: string) => {
        const translations = get().translations;
        const language = get().language;
        if (!translations || !language) return fallback || key;
        const keys = key.split('.');
        let value: any = translations[language];
        for (const k of keys) {
          if (value && typeof value === 'object' && k in value) {
            value = value[k];
          } else {
            return fallback || key;
          }
        }
        return value || fallback || key;
      },

      // --- Slices externos ---
      ...createThemeSlice(set, get),
      ...createLanguageSlice(set, get),
      ...createNavigationSlice(set, get),
      ...createDataSlice(set, get),
    }),
    {
      name: 'masterpiece-data', // storage key
      version: 1,
      migrate: migrateAppStoreState,
      partialize: (state) => ({
        // Solo persistir los campos relevantes y existentes
        isDarkMode: state.isDarkMode,
        theme: state.theme,
        searchTerm: state.searchTerm,
        isSearchActive: state.isSearchActive,
        error: state.error,
        language: state.language,
        translations: state.translations,
        mobilePage: state.mobilePage,
        desktopPage: state.desktopPage,
        isSpanishCinemaActive: state.isSpanishCinemaActive,
        isSpanishSeriesActive: state.isSpanishSeriesActive,
        isMasterpieceActive: state.isMasterpieceActive,
        activePodcastDocumentaryLanguage: state.activePodcastDocumentaryLanguage,
        homeState: state.homeState,
      }),
    }
  )
);

// ✅ HOOKS PARA ACCEDER AL STORE
// Si agregas nuevos campos/funciones, asegúrate de exponerlos aquí y mantener la consistencia de nombres.
export const useAppView = () => {
  const isMobile = useAppStore(state => state.isMobile);
  const mobileHomeStyles = useAppStore(state => state.mobileHomeStyles);
  const desktopStyles = useAppStore(state => state.desktopStyles);
  const baseRecommendationCardClasses = useAppStore(state => state.baseRecommendationCardClasses);
  const isTablet = useAppStore(state => state.isTablet);
  const saveHomeState = useAppStore(state => state.saveHomeState);
  const restoreHomeState = useAppStore(state => state.restoreHomeState);
  const selectedItem = useAppStore(state => state.selectedItem);
  // Funciones de navegación
  const goHome = useAppStore(state => state.goHome);
  const goBackFromDetail = useAppStore(state => state.goBackFromDetail);
  const goBackFromCoffee = useAppStore(state => state.goBackFromCoffee);
  const goToCoffee = useAppStore(state => state.goToCoffee);
  const goToHowToDownload = useAppStore(state => state.goToHowToDownload);
  const setSelectedItem = useAppStore(state => state.setSelectedItem);

  return {
    isMobile, mobileHomeStyles, desktopStyles, baseRecommendationCardClasses,
    isTablet, saveHomeState, restoreHomeState, selectedItem,
    goHome, goBackFromDetail, goBackFromCoffee, goToCoffee, goToHowToDownload,
    setSelectedItem
  };
};

export const useAppData = () => {
  const recommendations = useAppStore(state => state.recommendations);
  const categories = useAppStore(state => state.categories);
  const filteredItems = useAppStore(state => state.filteredItems);
  const title = useAppStore(state => state.title);
  const isDataInitialized = useAppStore(state => state.isDataInitialized);
  const updateWithRealData = useAppStore(state => state.updateWithRealData);
  const getRecommendations = useAppStore(state => state.getRecommendations);
  const getCategories = useAppStore(state => state.getCategories);
  const getSubcategoriesForCategory = useAppStore(state => state.getSubcategoriesForCategory);
  const setCategory = useAppStore(state => state.setCategory);
  const setActiveSubcategory = useAppStore(state => state.setActiveSubcategory);
  const setTitle = useAppStore(state => state.setTitle);
  const allData = useAppStore(state => state.allData);
  const selectedCategory = useAppStore(state => state.selectedCategory);
  const activeSubcategory = useAppStore(state => state.activeSubcategory);
  const isSpanishCinemaActive = useAppStore(state => state.isSpanishCinemaActive);
  const toggleSpanishCinema = useAppStore(state => state.toggleSpanishCinema);
  const setSpanishCinemaActive = useAppStore(state => state.setSpanishCinemaActive);
  const isSpanishSeriesActive = useAppStore(state => state.isSpanishSeriesActive);
  const toggleSpanishSeries = useAppStore(state => state.toggleSpanishSeries);
  const setSpanishSeriesActive = useAppStore(state => state.setSpanishSeriesActive);
  const isMasterpieceActive = useAppStore(state => state.isMasterpieceActive);
  const toggleMasterpiece = useAppStore(state => state.toggleMasterpiece);
  const setMasterpieceActive = useAppStore(state => state.setMasterpieceActive);
  const activePodcastDocumentaryLanguage = useAppStore(state => state.activePodcastDocumentaryLanguage);
  const setActivePodcastDocumentaryLanguage = useAppStore(state => state.setActivePodcastDocumentaryLanguage);
  const resetActivePodcastDocumentaryLanguage = useAppStore(state => state.resetActivePodcastDocumentaryLanguage);
  const mobilePage = useAppStore(state => state.mobilePage);
  const desktopPage = useAppStore(state => state.desktopPage);
  const setMobilePage = useAppStore(state => state.setMobilePage);
  const setDesktopPage = useAppStore(state => state.setDesktopPage);
  const resetPagination = useAppStore(state => state.resetPagination);
  const getDefaultTitle = useAppStore(state => state.getDefaultTitle);
  const resetAllFilters = useAppStore(state => state.resetAllFilters);
  const generateNewRecommendations = useAppStore(state => state.generateNewRecommendations);
  const updateFilteredItems = useAppStore(state => state.updateFilteredItems);
  const updateTitleForLanguage = useAppStore(state => state.updateTitleForLanguage);

  return {
    recommendations, categories, filteredItems,
    title, isDataInitialized, updateWithRealData, getRecommendations,
    getCategories, getSubcategoriesForCategory, setCategory, setActiveSubcategory, setTitle,
    allData, selectedCategory, activeSubcategory,
    isSpanishCinemaActive, toggleSpanishCinema, setSpanishCinemaActive,
    isSpanishSeriesActive, toggleSpanishSeries, setSpanishSeriesActive, isMasterpieceActive,
    toggleMasterpiece, setMasterpieceActive, activePodcastDocumentaryLanguage, setActivePodcastDocumentaryLanguage,
    resetActivePodcastDocumentaryLanguage, mobilePage, desktopPage, setMobilePage, setDesktopPage, resetPagination,
    getDefaultTitle, resetAllFilters, generateNewRecommendations, updateFilteredItems,
    updateTitleForLanguage
  };
};

export const useAppTheme = () => {
  const isDarkMode = useAppStore(state => state.isDarkMode);
  const theme = useAppStore(state => state.theme);
  // toggleTheme y setTheme existen en el ThemeSlice, así que los mantenemos
  const toggleTheme = useAppStore(state => state.toggleTheme);
  const setTheme = useAppStore(state => state.setTheme);
  const getMasterpieceBadgeConfig = useAppStore(state => state.getMasterpieceBadgeConfig);

  return { isDarkMode, theme, toggleTheme, setTheme, getMasterpieceBadgeConfig };
};

export const useAppUI = () => {
  const searchTerm = useAppStore(state => state.searchTerm);
  const isSearchActive = useAppStore(state => state.isSearchActive);
  const setSearchTerm = useAppStore(state => state.setSearchTerm);
  const setSearchActive = useAppStore(state => state.setSearchActive);
  const clearSearch = useAppStore(state => state.clearSearch);
  const getMasterpieceBadgeConfig = useAppStore(state => state.getMasterpieceBadgeConfig);

  return {
    searchTerm, isSearchActive, setSearchTerm, setSearchActive, clearSearch, getMasterpieceBadgeConfig
  };
};

export const useAppError = () => {
  const error = useAppStore(state => state.error);
  const setError = useAppStore(state => state.setError);
  const clearError = useAppStore(state => state.clearError);

  return { error, setError, clearError };
};

export const useAppLanguage = () => {
  const language = useAppStore(state => state.language);
  const translations = useAppStore(state => state.translations);
  const setLanguage = useAppStore(state => state.setLanguage);
  const toggleLanguage = useAppStore(state => state.toggleLanguage);
  const setTranslations = useAppStore(state => state.setTranslations);
  const getTranslation = useAppStore(state => state.getTranslation);

  return {
    language, translations, setLanguage, toggleLanguage, setTranslations, getTranslation
  };
};

export default useAppStore; 