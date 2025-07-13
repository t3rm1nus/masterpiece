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
import { Language, Category } from '../types';
import { Item } from '../types/data';

// Tipos para el store
type HomeState = {
  selectedCategory: Category | null;
  activeSubcategory: string | null;
  mobilePage: number;
  desktopPage: number;
  isSpanishCinemaActive: boolean;
  isMasterpieceActive: boolean;
  isSpanishSeriesActive: boolean;
  activePodcastDocumentaryLanguage: string | null;
  searchTerm: string;
  isSearchActive: boolean;
};

type MobileHomeStyles = {
  cardStyle: React.CSSProperties;
  imageStyle: React.CSSProperties;
};

type DesktopStyles = {
  cardStyle: React.CSSProperties;
  categoryStyle: React.CSSProperties;
  subcategoryStyle: React.CSSProperties;
  imageStyle: React.CSSProperties;
  categoryContainer: React.CSSProperties;
};

type MasterpieceBadgeConfig = {
  color: string;
  icon: string;
  svg: {
    width: number;
    height: number;
    viewBox: string;
    fill: string;
    xmlns: string;
  };
  circle: {
    cx: number;
    cy: number;
    r: number;
    fill: string;
  };
  star: {
    d: string;
    fill: string;
  };
};

// Tipo para el store completo
type AppStore = {
  // Estados básicos
  isMobile: boolean;
  isTablet: boolean;
  isDarkMode: boolean;
  theme: string;
  searchTerm: string;
  isSearchActive: boolean;
  error: string | null;
  language: Language;
  translations: Record<string, any>;

  // Estilos
  mobileHomeStyles: MobileHomeStyles;
  desktopStyles: DesktopStyles;
  baseRecommendationCardClasses: string;

  // Funciones UI
  setViewport: (width: number | boolean) => void;
  setSearchTerm: (term: string) => void;
  setSearchActive: (active: boolean) => void;
  clearSearch: () => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Traducción
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  setTranslations: (translations: Record<string, any>) => void;
  getTranslation: (key: string, fallback?: string) => string;
  getMasterpieceBadgeConfig: () => MasterpieceBadgeConfig;

  // Filtros especiales
  isSpanishCinemaActive: boolean;
  toggleSpanishCinema: () => void;
  setSpanishCinemaActive: (active: boolean) => void;
  isSpanishSeriesActive: boolean;
  toggleSpanishSeries: () => void;
  setSpanishSeriesActive: (active: boolean) => void;
  isMasterpieceActive: boolean;
  toggleMasterpiece: () => void;
  setMasterpieceActive: (active: boolean) => void;

  // Filtro de idioma
  activePodcastDocumentaryLanguage: string | null;
  setActivePodcastDocumentaryLanguage: (lang: string | null) => void;
  resetActivePodcastDocumentaryLanguage: () => void;

  // Paginación
  mobilePage: number;
  desktopPage: number;
  setMobilePage: (page: number) => void;
  setDesktopPage: (page: number) => void;
  resetPagination: () => void;

  // Estado de home
  homeState: HomeState;
  saveHomeState: () => void;
  restoreHomeState: () => void;

  // Campos de slices (se agregarán dinámicamente)
  [key: string]: any;
};

// --- LIMPIEZA DE PERSISTENCIA ANTES DE CREAR EL STORE ---
if (typeof window !== 'undefined') {
  try {
    // Verificar y limpiar si es necesario
  } catch (e) {
    console.warn('Error durante limpieza inicial:', e);
  }
}

const useAppStore = create(
  persist(
    (set, get) => ({
      // Estados básicos que NO son de navegación ni datos
      // Si agregas un nuevo estado global, agrégalo en el slice correspondiente y documenta aquí.
      isMobile: false,
      isTablet: false,
      isDarkMode: false,
      theme: 'light',
      searchTerm: '',
      isSearchActive: false,
      error: null,
      language: 'es' as Language,
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
        // width puede ser un número (px) o booleano (legacy)
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
      setLanguage: (language: Language) => set({ language }),
      toggleLanguage: () => set(state => ({ language: state.language === 'es' ? 'en' : 'es' })),
      setTranslations: (translations: Record<string, any>) => {
        set({ translations });
        // Actualizar título cuando se cargan las traducciones
        const state = get() as any;
        state.updateTitleForLanguage && state.updateTitleForLanguage();
      },
      getTranslation: (key: string, fallback?: string) => {
        const state = get() as any;
        const translations = state.translations;
        const language = state.language;
        if (!translations || !language) return fallback || key;
        const keys = key.split('.');
        let value = translations[language];
        for (const k of keys) {
          if (value && typeof value === 'object' && k in value) {
            value = value[k];
          } else {
            return fallback || key;
          }
        }
        return value || fallback || key;
      },

      // --- Badge config ---
      getMasterpieceBadgeConfig: (): MasterpieceBadgeConfig => ({
        color: 'gold',
        icon: '★',
        svg: {
          width: 20,
          height: 20,
          viewBox: "0 0 20 20",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg"
        },
        circle: {
          cx: 10,
          cy: 10,
          r: 10,
          fill: "#FFD700"
        },
        star: {
          d: "M10 15l-5.5 3 1.5-6L0 7l6-.5L10 1l4 5.5L20 7l-6 5 1.5 6z",
          fill: "#FFA500"
        }
      }),

      // --- Estados especiales de filtros ---
      isSpanishCinemaActive: false,
      toggleSpanishCinema: () => set(state => ({ isSpanishCinemaActive: !state.isSpanishCinemaActive })),
      setSpanishCinemaActive: (active: boolean) => set({ isSpanishCinemaActive: !!active }),
      isSpanishSeriesActive: false,
      toggleSpanishSeries: () => set(state => ({ isSpanishSeriesActive: !state.isSpanishSeriesActive })),
      setSpanishSeriesActive: (active: boolean) => set({ isSpanishSeriesActive: !!active }),
      isMasterpieceActive: false,
      toggleMasterpiece: () => set(state => ({ isMasterpieceActive: !state.isMasterpieceActive })),
      setMasterpieceActive: (active: boolean) => set({ isMasterpieceActive: !!active }),

      // --- Filtro de idioma para podcasts/documentales ---
      activePodcastDocumentaryLanguage: null as string | null, // 'es', 'en' o null
      setActivePodcastDocumentaryLanguage: (lang: string | null) => set({ activePodcastDocumentaryLanguage: lang }),
      resetActivePodcastDocumentaryLanguage: () => set({ activePodcastDocumentaryLanguage: null }),

      // --- Estado de paginación para persistir entre navegaciones ---
      mobilePage: 1,
      desktopPage: 1,
      setMobilePage: (page: number) => set({ mobilePage: page }),
      setDesktopPage: (page: number) => set({ desktopPage: page }),
      resetPagination: () => set({ mobilePage: 1, desktopPage: 1 }),

      // --- Estado de la home que se preserva al navegar a overlays ---
      homeState: {
        selectedCategory: null as Category | null,
        activeSubcategory: null as string | null,
        mobilePage: 1,
        desktopPage: 1,
        isSpanishCinemaActive: false,
        isMasterpieceActive: false,
        isSpanishSeriesActive: false,
        activePodcastDocumentaryLanguage: null as string | null,
        searchTerm: '',
        isSearchActive: false,
      } as HomeState,
      saveHomeState: () => set((state: any) => ({
        homeState: {
          selectedCategory: state.selectedCategory,
          activeSubcategory: state.activeSubcategory,
          mobilePage: state.mobilePage || 1,
          desktopPage: state.desktopPage || 1,
          isSpanishCinemaActive: state.isSpanishCinemaActive,
          isMasterpieceActive: state.isMasterpieceActive,
          isSpanishSeriesActive: state.isSpanishSeriesActive,
          activePodcastDocumentaryLanguage: state.activePodcastDocumentaryLanguage,
          searchTerm: state.searchTerm,
          isSearchActive: state.isSearchActive,
        }
      })),
      restoreHomeState: () => set((state: any) => {
        const saved = state.homeState;
        // Restaurar otros estados (sin scroll)
        return {
          selectedCategory: saved.selectedCategory,
          activeSubcategory: saved.activeSubcategory,
          mobilePage: saved.mobilePage,
          desktopPage: saved.desktopPage,
          isSpanishCinemaActive: saved.isSpanishCinemaActive,
          isMasterpieceActive: saved.isMasterpieceActive,
          isSpanishSeriesActive: saved.isSpanishSeriesActive,
          activePodcastDocumentaryLanguage: saved.activePodcastDocumentaryLanguage,
          searchTerm: saved.searchTerm,
          isSearchActive: saved.isSearchActive,
        };
      }),

      // --- Slices externos ---
      // Todos los estados y funciones principales deben estar en slices.
      ...createThemeSlice(set, get),
      ...createLanguageSlice(set, get),
      ...createNavigationSlice(set, get),
      ...createDataSlice(set, get),
    }),
    {
      name: 'masterpiece-data', // storage key
      version: 1,
      migrate: migrateAppStoreState,
      partialize: (state: any) => ({
        // Solo persistir los campos relevantes
        // Si agregas un nuevo campo persistente, documenta aquí y en el slice correspondiente.
        selectedCategory: state.selectedCategory,
        activeSubcategory: state.activeSubcategory,
        selectedSubcategory: state.selectedSubcategory,
        activeLanguage: state.activeLanguage,
        isSpanishCinemaActive: state.isSpanishCinemaActive,
        isMasterpieceActive: state.isMasterpieceActive,
        activePodcastLanguages: state.activePodcastLanguages,
        activeDocumentaryLanguages: state.activeDocumentaryLanguages,
        // Campos básicos importantes
        isDarkMode: state.isDarkMode,
        language: state.language,
        // Menos datos para evitar QuotaExceededError
      }),
    }
  )
);

// ✅ HOOKS PARA ACCEDER AL STORE
// Si agregas nuevos campos/funciones, asegúrate de exponerlos aquí y mantener la consistencia de nombres.
export const useAppView = () => {
  const currentView = useAppStore((state: any) => state.currentView);
  const selectedItem = useAppStore((state: any) => state.selectedItem);
  const isMobile = useAppStore((state: any) => state.isMobile);
  const setView = useAppStore((state: any) => state.setView);
  const setSelectedItem = useAppStore((state: any) => state.setSelectedItem);
  const goToDetail = useAppStore((state: any) => state.goToDetail);
  const goToHome = useAppStore((state: any) => state.goToHome);
  const goHome = useAppStore((state: any) => state.goHome);
  const goToCoffee = useAppStore((state: any) => state.goToCoffee);
  const goToHowToDownload = useAppStore((state: any) => state.goToHowToDownload);
  const setViewport = useAppStore((state: any) => state.setViewport);
  const mobileHomeStyles = useAppStore((state: any) => state.mobileHomeStyles);
  const desktopStyles = useAppStore((state: any) => state.desktopStyles);
  const baseRecommendationCardClasses = useAppStore((state: any) => state.baseRecommendationCardClasses);
  const isTablet = useAppStore((state: any) => state.isTablet);
  const saveHomeState = useAppStore((state: any) => state.saveHomeState);
  const restoreHomeState = useAppStore((state: any) => state.restoreHomeState);

  // Limpieza: eliminados wrappers de retrocompatibilidad innecesarios
  return {
    currentView, selectedItem, isMobile, setView, setSelectedItem,
    goToDetail, goToHome, goHome, goToCoffee, goToHowToDownload, setViewport,
    mobileHomeStyles, desktopStyles, baseRecommendationCardClasses, isTablet,
    saveHomeState, restoreHomeState
  };
};

export const useAppData = () => {
  const recommendations = useAppStore(state => state.recommendations);
  const categories = useAppStore(state => state.categories);
  const filteredItems = useAppStore(state => state.filteredItems);
  const selectedCategory = useAppStore(state => state.selectedCategory);
  const selectedSubcategory = useAppStore(state => state.selectedSubcategory);
  const title = useAppStore(state => state.title);
  const isDataInitialized = useAppStore(state => state.isDataInitialized);
  const updateWithRealData = useAppStore(state => state.updateWithRealData);
  const getRecommendations = useAppStore(state => state.getRecommendations);
  const getCategories = useAppStore(state => state.getCategories);
  const getSubcategoriesForCategory = useAppStore(state => state.getSubcategoriesForCategory);
  const setCategory = useAppStore(state => state.setCategory);
  const setSubcategory = useAppStore(state => state.setSubcategory);
  const resetToHome = useAppStore(state => state.resetToHome);
  const resetAllFilters = useAppStore(state => state.resetAllFilters);
  const generateNewRecommendations = useAppStore(state => state.generateNewRecommendations);
  const initializeFilteredItems = useAppStore(state => state.initializeFilteredItems);
  const updateFilteredItems = useAppStore(state => state.updateFilteredItems);
  const setTitle = useAppStore(state => state.setTitle);
  const updateTitleForLanguage = useAppStore(state => state.updateTitleForLanguage);
  const getDefaultTitle = useAppStore(state => state.getDefaultTitle);
  // Estados adicionales para compatibilidad (solo los centralizados)
  const activeSubcategory = useAppStore(state => state.activeSubcategory);
  const setActiveSubcategory = useAppStore(state => state.setActiveSubcategory);
  const isSpanishCinemaActive = useAppStore(state => state.isSpanishCinemaActive);
  const toggleSpanishCinema = useAppStore(state => state.toggleSpanishCinema);
  const isSpanishSeriesActive = useAppStore(state => state.isSpanishSeriesActive);
  const toggleSpanishSeries = useAppStore(state => state.toggleSpanishSeries);
  const isMasterpieceActive = useAppStore(state => state.isMasterpieceActive);
  const toggleMasterpiece = useAppStore(state => state.toggleMasterpiece);
  const activePodcastLanguages = useAppStore(state => state.activePodcastLanguages);
  const activeDocumentaryLanguages = useAppStore(state => state.activeDocumentaryLanguages);
  const activeLanguage = useAppStore(state => state.activeLanguage);
  const setActiveLanguage = useAppStore(state => state.setActiveLanguage);
  const allData = useAppStore(state => state.allData);
  const setSpanishCinemaActive = useAppStore(state => state.setSpanishCinemaActive);
  const setSpanishSeriesActive = useAppStore(state => state.setSpanishSeriesActive);
  const setMasterpieceActive = useAppStore(state => state.setMasterpieceActive);
  const setActivePodcastLanguages = useAppStore(state => state.setActivePodcastLanguages);
  const setActiveDocumentaryLanguages = useAppStore(state => state.setActiveDocumentaryLanguages);
  const activePodcastDocumentaryLanguage = useAppStore(state => state.activePodcastDocumentaryLanguage);
  const setActivePodcastDocumentaryLanguage = useAppStore(state => state.setActivePodcastDocumentaryLanguage);
  const resetActivePodcastDocumentaryLanguage = useAppStore(state => state.resetActivePodcastDocumentaryLanguage);
  
  // Estado de paginación
  const mobilePage = useAppStore(state => state.mobilePage);
  const desktopPage = useAppStore(state => state.desktopPage);
  const setMobilePage = useAppStore(state => state.setMobilePage);
  const setDesktopPage = useAppStore(state => state.setDesktopPage);
  const resetPagination = useAppStore(state => state.resetPagination);

  return {
    recommendations, categories, filteredItems, selectedCategory, selectedSubcategory,
    title, isDataInitialized, updateWithRealData, getRecommendations, getCategories,
    getSubcategoriesForCategory, setCategory, setSubcategory, resetToHome, resetAllFilters,
    generateNewRecommendations, initializeFilteredItems, updateFilteredItems, setTitle, updateTitleForLanguage, getDefaultTitle,
    // Estados adicionales
    activeSubcategory, setActiveSubcategory, isSpanishCinemaActive, toggleSpanishCinema,
    isSpanishSeriesActive, toggleSpanishSeries,
    isMasterpieceActive, toggleMasterpiece, activePodcastLanguages, activeDocumentaryLanguages, activeLanguage, setActiveLanguage,
    allData,
    setSpanishCinemaActive,
    setSpanishSeriesActive,
    setMasterpieceActive,
    setActivePodcastLanguages,
    setActiveDocumentaryLanguages,
    activePodcastDocumentaryLanguage, setActivePodcastDocumentaryLanguage, resetActivePodcastDocumentaryLanguage,
    // Estado de paginación
    mobilePage, desktopPage, setMobilePage, setDesktopPage, resetPagination
  };
};

export const useAppTheme = () => {
  const isDarkMode = useAppStore(state => state.isDarkMode);
  const theme = useAppStore(state => state.theme);
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
  return { searchTerm, isSearchActive, setSearchTerm, setSearchActive, clearSearch };
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
  const setTranslations = useAppStore(state => state.setTranslations);
  const toggleLanguage = useAppStore(state => state.toggleLanguage);
  const getTranslation = useAppStore(state => state.getTranslation);
  return { language, translations, setLanguage, setTranslations, toggleLanguage, getTranslation };
};

export default useAppStore;
