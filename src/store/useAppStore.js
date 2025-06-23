import { create } from 'zustand';

const useAppStore = create((set, get) => ({
  // Estados básicos
  recommendations: [],
  categories: [],
  filteredItems: [],
  selectedCategory: null,
  selectedSubcategory: 'all',
  title: 'Recomendaciones diarias',
  isDataInitialized: false,
  currentView: 'home',
  selectedItem: null,
  isMobile: false,
  isDarkMode: false,
  theme: 'light',
  searchTerm: '',
  isSearchActive: false,
  error: null,  language: 'es',
  translations: {},

  // Función goHome
  goHome: () => {
    set({ 
      currentView: 'home',
      selectedItem: null,
      selectedCategory: null, // CRÍTICO: null para mostrar todas las recomendaciones
      selectedSubcategory: null
    });
  },
  resetAllFilters: () => {
    set({ 
      selectedCategory: null, // CRÍTICO: null para mostrar todas las recomendaciones
      selectedSubcategory: null,
      searchTerm: '',
      isSearchActive: false,
      currentView: 'home',
      selectedItem: null
    });
  },  // Nueva función para generar nuevas recomendaciones
  generateNewRecommendations: () => {
    console.log('Generando nuevas recomendaciones...');
    const { allData } = get();

    if (allData && Object.keys(allData).length > 0) {
      // Generar nueva lista curada de 14 recomendaciones desde los datos existentes
      const categories = ['movies', 'books', 'videogames', 'music', 'comics', 'boardgames', 'podcast', 'series', 'documentales'];
      const newRecommendations = [];

      categories.forEach((category, index) => {
        const categoryData = allData[category] || [];
        if (categoryData.length > 0) {
          // Tomar 1-2 items por categoría para llegar a 14 total
          const itemsToTake = index < 5 ? 2 : 1; // Primeras 5 categorías: 2 items, resto: 1 item
          const selectedItems = categoryData
            .sort(() => 0.5 - Math.random()) // Shuffle
            .slice(0, Math.min(itemsToTake, categoryData.length));

          newRecommendations.push(...selectedItems);
        }
      });

      const finalRecommendations = newRecommendations.slice(0, 14);

      set({ 
        recommendations: finalRecommendations,
        filteredItems: finalRecommendations,
        selectedCategory: null,
        selectedSubcategory: null,
        currentView: 'home',
        selectedItem: null
      });

      console.log('✅ Nuevas recomendaciones generadas:', finalRecommendations.length);
    }
  },

  // Función para inicializar elementos filtrados
  initializeFilteredItems: () => {
    const state = get();
    set({ filteredItems: state.recommendations });
  },

  // --- Centralización de filtrado de items ---
  getFilteredItems: ({
    selectedCategory,
    activeSubcategory,
    activeLanguage,
    allData,
    recommendations,
    isSpanishCinemaActive,
    isMasterpieceActive,
    activePodcastLanguages,
    activeDocumentaryLanguages,
    isDataInitialized
  }) => {
    if (!isDataInitialized) return [];
    if (allData && Object.keys(allData).length > 0) {
      let filteredData = [];
      if (!selectedCategory || selectedCategory === 'all') {
        if (recommendations && recommendations.length > 0) {
          filteredData = recommendations;
        } else {
          // Fallback: tomar 14 items de allData si recommendations está vacío
          filteredData = Object.values(allData).flat().slice(0, 14);
        }
      } else {
        filteredData = allData[selectedCategory] || [];
      }
      if (selectedCategory && selectedCategory !== 'all') {
        if (selectedCategory === 'movies' && isSpanishCinemaActive) {
          filteredData = filteredData.filter(item => {
            const isSpanish =
              item.spanish_cinema === true ||
              item.spanishCinema === true ||
              (item.tags && item.tags.includes('spanish')) ||
              (item.director && [
                'Luis García Berlanga',
                'Pedro Almodóvar',
                'Alejandro Amenábar',
                'Fernando Trueba',
                'Icíar Bollaín',
                'Carlos Saura',
                'Víctor Erice',
              ].some(dir => item.director.includes(dir))) ||
              (item.country && item.country === 'España') ||
              (item.pais && item.pais === 'España') ||
              (item.description && (
                item.description.es?.includes('español') ||
                item.description.es?.includes('España')
              ));
            return isSpanish;
          });
        }
        if (isMasterpieceActive) {
          filteredData = filteredData.filter(item =>
            item.masterpiece === true || item.obra_maestra === true
          );
        }
        // Filtrado por idioma para podcasts y documentales
        if (selectedCategory === 'podcast' && activePodcastLanguages && activePodcastLanguages.length > 0) {
          filteredData = filteredData.filter(item =>
            activePodcastLanguages.includes(item.idioma)
          );
        }
        if (selectedCategory === 'documentales' && activeDocumentaryLanguages && activeDocumentaryLanguages.length > 0) {
          filteredData = filteredData.filter(item =>
            activeDocumentaryLanguages.includes(item.idioma)
          );
        }
        // Filtrado por subcategoría
        if (activeSubcategory && activeSubcategory !== 'all') {
          filteredData = filteredData.filter(item =>
            (item.subcategory || item.subCategory) === activeSubcategory
          );
        }
        // Filtrado por idioma general
        if (activeLanguage && activeLanguage !== 'all') {
          filteredData = filteredData.filter(item =>
            item.idioma === activeLanguage
          );
        }
      }
      return filteredData;
    }
    return [];
  },

  // Estados adicionales para compatibilidad
  activeSubcategory: null,
  setActiveSubcategory: (subcategory) => set({ activeSubcategory: subcategory }),
  isSpanishCinemaActive: false,
  toggleSpanishCinema: () => set(state => ({ isSpanishCinemaActive: !state.isSpanishCinemaActive })),
  isMasterpieceActive: false,
  toggleMasterpiece: () => set(state => ({ isMasterpieceActive: !state.isMasterpieceActive })),
  activePodcastLanguages: [],
  togglePodcastLanguage: (lang) => set(state => ({
    activePodcastLanguages: state.activePodcastLanguages.includes(lang) 
      ? state.activePodcastLanguages.filter(l => l !== lang)
      : [...state.activePodcastLanguages, lang]
  })),
  activeDocumentaryLanguages: [],
  toggleDocumentaryLanguage: (lang) => set(state => ({
    activeDocumentaryLanguages: state.activeDocumentaryLanguages.includes(lang) 
      ? state.activeDocumentaryLanguages.filter(l => l !== lang)
      : [...state.activeDocumentaryLanguages, lang]
  })),
  activeLanguage: 'all',
  setActiveLanguage: (lang) => set({ activeLanguage: lang }),
  allData: {},

  // Estilos para compatibilidad
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
  isTablet: false,
  // NOTA: Función initializeData deshabilitada - ahora se usan datos reales desde JSON
  // Esta función contenía datos mock que causaban que solo se mostraran películas
  initializeDataDisabled: () => {
    console.log('⚠️ initializeData deshabilitada - usando datos reales desde JSON');
  },  // Función para actualizar datos desde fuente externa
  updateWithRealData: (realData) => {
    let recommendations14 = realData.recommendations?.slice(0, 14) || [];
    // Si hay menos de 14, completar con items aleatorios de allData evitando duplicados
    if (recommendations14.length < 14 && realData.allData) {
      // Unir todos los items de allData en un solo array
      const allItems = Object.values(realData.allData).flat();
      // Filtrar los que ya están en recommendations14 (por id único)
      const existingIds = new Set(recommendations14.map(item => item.id));
      const candidates = allItems.filter(item => !existingIds.has(item.id));
      // Mezclar candidatos y tomar los necesarios
      for (let i = candidates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
      }
      const needed = 14 - recommendations14.length;
      recommendations14 = recommendations14.concat(candidates.slice(0, needed));
    }
    set({
      categories: realData.categories,
      recommendations: recommendations14,
      filteredItems: recommendations14,
      allData: realData.allData,
      selectedCategory: null,
      isDataInitialized: true
    });
    console.log('✅ Store actualizado con recomendaciones diarias:', recommendations14.length);
  },
  getRecommendations: () => get().recommendations,
  getCategories: () => {
    const categories = get().categories;
    const translations = get().translations;
    const language = get().language;
    
    return categories.map(cat => ({
      key: cat.id,
      label: translations?.[language]?.categories?.[cat.id] || cat.name
    }));  },
  getSubcategoriesForCategory: (categoryId) => {
    const categories = get().categories;
    const category = categories.find(cat => cat.id === categoryId);
    return category?.subcategories || [];
  },

  setCategory: (category) => set({ selectedCategory: category }),
  setSubcategory: (subcategory) => set({ selectedSubcategory: subcategory }),
  resetToHome: () => set({ 
    currentView: 'home', 
    selectedItem: null, 
    selectedCategory: null, // CRÍTICO: null para mostrar todas las recomendaciones
    selectedSubcategory: null
  }),
  updateFilteredItems: (items) => set({ filteredItems: items }),
  setTitle: (title) => set({ title }),
  setView: (view) => set({ currentView: view }),
  setSelectedItem: (item) => set({ selectedItem: item }),
  goToDetail: (item) => set({ currentView: 'detail', selectedItem: item }),
  goToHome: () => set({ currentView: 'home', selectedItem: null }),
  goToCoffee: () => set({ currentView: 'coffee' }),
  goToHowToDownload: () => {
    console.log('goToHowToDownload ejecutado');
    set({ currentView: 'howToDownload' });
  },
  setViewport: (isMobile) => set({ isMobile }),
  toggleTheme: () => set(state => ({ 
    isDarkMode: !state.isDarkMode,
    theme: state.isDarkMode ? 'light' : 'dark'
  })),
  setTheme: (theme) => set({ theme, isDarkMode: theme === 'dark' }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSearchActive: (active) => set({ isSearchActive: active }),
  clearSearch: () => set({ searchTerm: '', isSearchActive: false }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),  setLanguage: (language) => set({ language }),
  toggleLanguage: () => set(state => ({ 
    language: state.language === 'es' ? 'en' : 'es'
  })),
  setTranslations: (translations) => {
    set({ translations });
    // Actualizar título cuando se cargan las traducciones
    const state = get();
    state.updateTitleForLanguage();
  },

  // Funciones simples
  updateTitleForLanguage: () => {
    const state = get();
    const { selectedCategory, translations, language } = state;
    
    let newTitle;
    if (!selectedCategory) {
      // Título por defecto cuando no hay categoría seleccionada
      newTitle = translations?.[language]?.ui?.titles?.home_title || 'Recomendaciones diarias';
    } else {
      // Título de la categoría seleccionada
      newTitle = translations?.[language]?.categories?.[selectedCategory] || selectedCategory;
    }
    
    set({ title: newTitle });
    console.log('🔄 Título actualizado:', newTitle, 'para idioma:', language);
  },
  getDefaultTitle: (lang) => {
    const translations = get().translations;
    return translations?.[lang]?.ui?.titles?.home_title || 'Recomendaciones diarias';
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
  // Traducción centralizada: usa getTranslation del contexto de idioma
  getTranslation: (key, fallback) => {
    const translations = get().translations;
    const language = get().language;
    // Permite acceder a claves anidadas tipo 'ui.navigation.home'
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
}));

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
