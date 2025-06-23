import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createThemeSlice } from './themeStore';
import { createLanguageSlice } from './languageStore';
import { createNavigationSlice } from './navigationStore';
import { createDataSlice } from './dataStore';
import { migrateAppStoreState } from '../utils/migrationHelpers';

const useAppStore = create(
  persist(
    (set, get) => ({
      // Estados básicos que NO son de navegación ni datos
      isMobile: false,
      isTablet: false,
      isDarkMode: false,
      theme: 'light',
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
      setViewport: (width) => {
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
      setSearchTerm: (term) => set({ searchTerm: term }),
      setSearchActive: (active) => set({ isSearchActive: active }),
      clearSearch: () => set({ searchTerm: '', isSearchActive: false }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // --- Traducción centralizada ---
      setLanguage: (language) => set({ language }),
      toggleLanguage: () => set(state => ({ language: state.language === 'es' ? 'en' : 'es' })),
      setTranslations: (translations) => {
        set({ translations });
        // Actualizar título cuando se cargan las traducciones
        const state = get();
        state.updateTitleForLanguage && state.updateTitleForLanguage();
      },
      getTranslation: (key, fallback) => {
        const translations = get().translations;
        const language = get().language;
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
      getMasterpieceBadgeConfig: () => ({
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

      // --- Procesadores de título/descripción ---
      processTitle: (title) => {
        if (typeof title === 'object' && title !== null) {
          const lang = get().language;
          return title[lang] || title.es || title.en || 'Sin título';
        }
        return title || 'Sin título';
      },
      processDescription: (description) => {
        if (typeof description === 'object' && description !== null) {
          const lang = get().language;
          return description[lang] || description.es || description.en || 'Sin descripción';
        }
        return description || 'Sin descripción';
      },
      randomNotFoundImage: () => {
        const images = [
          'notfound.webp',
          'notfound2.webp',
          'notfound3.webp',
          'notfound4.webp',
          'notfound5.webp',
          'notfound6.webp',
          'notfound7.webp',
          'notfound8.webp',
          'notfound9.webp',
          'notfound10.webp',
        ];
        const idx = Math.floor(Math.random() * images.length);
        return `/imagenes/notfound/${images[idx]}`;
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
        // Solo persistir los campos relevantes
        recommendations: state.recommendations,
        categories: state.categories,
        filteredItems: state.filteredItems,
        selectedCategory: state.selectedCategory,
        activeSubcategory: state.activeSubcategory,
        selectedSubcategory: state.selectedSubcategory,
        activeLanguage: state.activeLanguage,
        isSpanishCinemaActive: state.isSpanishCinemaActive,
        isMasterpieceActive: state.isMasterpieceActive,
        activePodcastLanguages: state.activePodcastLanguages,
        activeDocumentaryLanguages: state.activeDocumentaryLanguages,
        title: state.title,
        allData: state.allData,
        // Puedes agregar más campos globales si lo deseas
      }),
    }
  )
);

// ✅ HOOKS PARA ACCEDER AL STORE
export const useAppView = () => {
  const currentView = useAppStore(state => state.currentView);
  const selectedItem = useAppStore(state => state.selectedItem);
  const isMobile = useAppStore(state => state.isMobile);
  const setView = useAppStore(state => state.setView);
  const setSelectedItem = useAppStore(state => state.setSelectedItem);
  const goToDetail = useAppStore(state => state.goToDetail);
  const goToHome = useAppStore(state => state.goToHome);
  const goHome = useAppStore(state => state.goHome);
  const goToCoffee = useAppStore(state => state.goToCoffee);
  const goToHowToDownload = useAppStore(state => state.goToHowToDownload);
  const setViewport = useAppStore(state => state.setViewport);
  const processTitle = useAppStore(state => state.processTitle);
  const processDescription = useAppStore(state => state.processDescription);
  const mobileHomeStyles = useAppStore(state => state.mobileHomeStyles);
  const desktopStyles = useAppStore(state => state.desktopStyles);
  const baseRecommendationCardClasses = useAppStore(state => state.baseRecommendationCardClasses);
  const isTablet = useAppStore(state => state.isTablet);

  // Funciones adicionales para compatibilidad
  const goBackFromDetail = () => {
    useAppStore.getState().setView('home');
    useAppStore.getState().setSelectedItem(null);
  };

  const goBackFromCoffee = () => {
    useAppStore.getState().setView('home');
  };

  // Limpieza: eliminados wrappers de retrocompatibilidad innecesarios
  return {
    currentView, selectedItem, isMobile, setView, setSelectedItem,
    goToDetail, goToHome, goHome, goToCoffee, goToHowToDownload, setViewport, processTitle, processDescription,
    mobileHomeStyles, desktopStyles, baseRecommendationCardClasses, isTablet,
    goBackFromDetail, goBackFromCoffee
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
  const randomNotFoundImage = useAppStore(state => state.randomNotFoundImage);
  // Estados adicionales para compatibilidad (solo los centralizados)
  const activeSubcategory = useAppStore(state => state.activeSubcategory);
  const setActiveSubcategory = useAppStore(state => state.setActiveSubcategory);
  const isSpanishCinemaActive = useAppStore(state => state.isSpanishCinemaActive);
  const toggleSpanishCinema = useAppStore(state => state.toggleSpanishCinema);
  const isMasterpieceActive = useAppStore(state => state.isMasterpieceActive);
  const toggleMasterpiece = useAppStore(state => state.toggleMasterpiece);
  const activePodcastLanguages = useAppStore(state => state.activePodcastLanguages);
  const togglePodcastLanguage = useAppStore(state => state.togglePodcastLanguage);
  const activeDocumentaryLanguages = useAppStore(state => state.activeDocumentaryLanguages);
  const toggleDocumentaryLanguage = useAppStore(state => state.toggleDocumentaryLanguage);
  const activeLanguage = useAppStore(state => state.activeLanguage);
  const setActiveLanguage = useAppStore(state => state.setActiveLanguage);
  const allData = useAppStore(state => state.allData);

  return {
    recommendations, categories, filteredItems, selectedCategory, selectedSubcategory,
    title, isDataInitialized, updateWithRealData, getRecommendations, getCategories,
    getSubcategoriesForCategory, setCategory, setSubcategory, resetToHome, resetAllFilters,
    generateNewRecommendations, initializeFilteredItems, updateFilteredItems, setTitle, updateTitleForLanguage, getDefaultTitle, randomNotFoundImage,
    // Estados adicionales
    activeSubcategory, setActiveSubcategory, isSpanishCinemaActive, toggleSpanishCinema,
    isMasterpieceActive, toggleMasterpiece, activePodcastLanguages, togglePodcastLanguage,
    activeDocumentaryLanguages, toggleDocumentaryLanguage, activeLanguage, setActiveLanguage,
    allData
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
