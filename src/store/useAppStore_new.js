import { create } from 'zustand';
import seriesData from '../data/datos_series.json';

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
  error: null,
  language: 'es',
  translations: {},

  // Función goHome
  goHome: () => {
    set({ 
      currentView: 'home',
      selectedItem: null,
      selectedCategory: 'all',
      selectedSubcategory: 'all'
    });
  },

  resetAllFilters: () => {
    set({ 
      selectedCategory: 'all',
      selectedSubcategory: 'all',
      searchTerm: '',
      isSearchActive: false,
      currentView: 'home',
      selectedItem: null
    });
  },

  // Nueva función para generar nuevas recomendaciones
  generateNewRecommendations: () => {
    const mockRecommendations = [
      { id: Date.now() + 1, title: 'Blade Runner 2049', category: 'movies', description: 'Ciencia ficción épica', image: '/favicon.png' },
      { id: Date.now() + 2, title: 'El Hobbit', category: 'books', description: 'Fantasía de Tolkien', image: '/favicon.png' },
      { id: Date.now() + 3, title: 'Breath of the Wild', category: 'videogames', description: 'Mundo abierto', image: '/favicon.png' },
      { id: Date.now() + 4, title: 'Thriller', category: 'music', description: 'Álbum de Michael Jackson', image: '/favicon.png' }
    ];

    const newAllData = {
      movies: mockRecommendations.filter(r => r.category === 'movies'),
      books: mockRecommendations.filter(r => r.category === 'books'),
      videogames: mockRecommendations.filter(r => r.category === 'videogames'),
      music: mockRecommendations.filter(r => r.category === 'music'),
      all: mockRecommendations
    };

    set({ 
      recommendations: mockRecommendations,
      filteredItems: mockRecommendations,
      allData: newAllData,
      selectedCategory: 'all',
      selectedSubcategory: 'all',
      currentView: 'home',
      selectedItem: null
    });
  },

  // Función para inicializar elementos filtrados
  initializeFilteredItems: () => {
    const state = get();
    set({ filteredItems: state.recommendations });
  },

  // Estados adicionales para compatibilidad
  activeSubcategory: null,
  setActiveSubcategory: (subcategory) => set({ activeSubcategory: subcategory }),
  isSpanishCinemaActive: false,
  toggleSpanishCinema: () => set(state => ({ isSpanishCinemaActive: !state.isSpanishCinemaActive })),
  isMasterpieceActive: false,
  toggleMasterpiece: () => set(state => ({ isMasterpieceActive: !state.isMasterpieceActive })),
  activePodcastLanguages: [],
  togglePodcastLanguage: (lang) => set(state => {
    let newLangs;
    // Si el idioma ya está activo, desactívalo (deja vacío)
    if (state.activePodcastLanguages.length === 1 && state.activePodcastLanguages[0] === lang) {
      newLangs = [];
    } else {
      newLangs = [lang];
    }
    return { activePodcastLanguages: newLangs };
  }),
  activeDocumentaryLanguages: [],
  toggleDocumentaryLanguage: (lang) => set(state => {
    let newLangs;
    if (state.activeDocumentaryLanguages.includes(lang)) {
      newLangs = [];
    } else {
      newLangs = [lang];
    }
    // Filtrar inmediatamente tras cambiar idioma
    const selectedCategory = get().selectedCategory;
    let filteredData = get().allData[selectedCategory] || [];
    if (selectedCategory === 'documentales') {
      if (newLangs.length === 0) {
        filteredData = [];
      } else {
        filteredData = filteredData.filter(item =>
          newLangs.includes(item.language) ||
          newLangs.includes(item.idioma)
        );
      }
    }
    set({ filteredItems: filteredData });
    return { activeDocumentaryLanguages: newLangs };
  }),
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

  // Función de inicialización con datos realistas
  initializeData: () => {
    // Leer subcategorías únicas de series desde el JSON real
    let seriesSubcats = [];
    if (seriesData && Array.isArray(seriesData.series)) {
      const subcatSet = new Set();
      seriesData.series.forEach((serie, idx) => {
        if (serie.subcategoria && typeof serie.subcategoria === 'string') {
          // Permitir múltiples subcategorías separadas por coma
          serie.subcategoria.split(',').forEach(sub => {
            const cleanSub = sub.trim().toLowerCase();
            if (cleanSub) {
              subcatSet.add(cleanSub);
            }
          });
        }
      });
      seriesSubcats = Array.from(subcatSet).map(sub => ({ sub, label: sub }));
    } 
    const categories = [
      { id: 'movies', name: 'Películas', subcategories: [] },
      { id: 'series', name: 'Series', subcategories: seriesSubcats },
      { id: 'books', name: 'Libros', subcategories: [] },
      { id: 'music', name: 'Música', subcategories: [] },
      { id: 'videogames', name: 'Videojuegos', subcategories: [] },
      { id: 'podcast', name: 'Podcasts', subcategories: [] },
      { id: 'comics', name: 'Cómics', subcategories: [] },
      { id: 'boardgames', name: 'Juegos de Mesa', subcategories: [] },
      { id: 'documentales', name: 'Documentales', subcategories: [] }
    ];
    
    // Datos con estructura similar a los JSONs reales
    const allRecommendations = [
      {
        id: 1,
        category: "movies",
        subcategory: "action",
        title: { es: "300", en: "300" },
        description: { es: "Película épica sobre la batalla de las Termópilas", en: "Epic film about the Battle of Thermopylae" },
        director: "Zack Snyder",
        image: "/imagenes/peliculas/300.jpg",
        year: 2006,
        masterpiece: true
      },
      {
        id: 2,
        category: "movies", 
        subcategory: "drama",
        title: { es: "El Padrino", en: "The Godfather" },
        description: { es: "Una saga familiar sobre el poder y la corrupción", en: "A family saga about power and corruption" },
        director: "Francis Ford Coppola",
        image: "/imagenes/peliculas/el-padrino.jpg",
        year: 1972,
        masterpiece: true
      },
      {
        id: 3,
        category: "books",
        subcategory: "Terror",
        title: "Misery",
        author: "Stephen King",
        year: 1987,
        description: { es: "Un novelista atrapado por su fan más obsesiva", en: "A novelist trapped by his most obsessive fan" },
        image: "/imagenes/libros/misery.jpg",
        masterpiece: true
      },
      {
        id: 4,
        category: "books",
        subcategory: "Realismo Mágico",
        title: "Cien años de soledad",
        author: "Gabriel García Márquez",
        year: 1967,
        description: { es: "La saga de la familia Buendía en Macondo", en: "The saga of the Buendía family in Macondo" },
        image: "/imagenes/libros/cien-anos-soledad.jpg",
        masterpiece: true
      },
      {
        id: 5,
        category: "videogames",
        subcategory: "mundo abierto",
        title: "The Legend of Zelda: Breath of the Wild",
        author: "Nintendo",
        year: 2017,
        description: { es: "Una aventura épica en el reino de Hyrule", en: "An epic adventure in the kingdom of Hyrule" },
        image: "/imagenes/videojuegos/The_Legend_of_Zelda_Breath_of_the_Wild.jpg",
        platforms: "Nintendo Switch, Wii U",
        masterpiece: true
      },
      {
        id: 6,
        category: "music",
        subcategory: "Rock",
        title: "Abbey Road",
        author: "The Beatles",
        year: 1969,
        description: { es: "Uno de los mejores álbumes de todos los tiempos", en: "One of the greatest albums of all time" },
        image: "/imagenes/musica/abbey-road.jpg",
        masterpiece: true
      },
      {
        id: 7,
        category: "series",
        subcategory: "Drama",
        title: "Breaking Bad",
        author: "Vince Gilligan",
        year: 2008,
        description: { es: "La transformación de Walter White", en: "The transformation of Walter White" },
        image: "/imagenes/series/breaking-bad.jpg",
        masterpiece: true
      },
      {
        id: 8,
        category: "podcast",
        subcategory: "Investigación",
        title: "Serial",
        author: "Sarah Koenig",
        year: 2014,
        description: { es: "Podcast de investigación criminal", en: "True crime investigation podcast" },
        image: "/imagenes/podcasts/serial.jpg"
      }
    ];

    const allData = {
      movies: allRecommendations.filter(r => r.category === 'movies'),
      series: allRecommendations.filter(r => r.category === 'series'),
      books: allRecommendations.filter(r => r.category === 'books'),
      music: allRecommendations.filter(r => r.category === 'music'),
      videogames: allRecommendations.filter(r => r.category === 'videogames'),
      podcast: allRecommendations.filter(r => r.category === 'podcast'),
      comics: allRecommendations.filter(r => r.category === 'comics'),
      boardgames: allRecommendations.filter(r => r.category === 'boardgames'),
      documentales: allRecommendations.filter(r => r.category === 'documentales'),
      all: allRecommendations
    };

    set({ 
      categories,
      recommendations: allRecommendations,
      filteredItems: allRecommendations,
      allData,
      selectedCategory: 'all',
      isDataInitialized: true 
    });
    const catSeries = categories.find(cat => cat.id === 'series');
  },

  // Resto de funciones
  getRecommendations: () => get().recommendations,
  getCategories: () => {
    const categories = get().categories;
    return categories.map(cat => ({
      key: cat.id,
      label: cat.name
    }));
  },
  getSubcategoriesForCategory: (categoryId) => {
    const categories = get().categories;
    const category = categories.find(cat => cat.id === categoryId);
    if (categoryId === 'series') {
    }
    return category?.subcategories || [];
  },

  setCategory: (category) => set({ selectedCategory: category }),
  setSubcategory: (subcategory) => set({ selectedSubcategory: subcategory }),
  resetToHome: () => set({ 
    currentView: 'home', 
    selectedItem: null, 
    selectedCategory: 'all', 
    selectedSubcategory: 'all'
  }),
  updateFilteredItems: (items) => set({ filteredItems: items }),
  setTitle: (title) => set({ title }),
  setView: (view) => set({ currentView: view }),
  setSelectedItem: (item) => set({ selectedItem: item }),
  goToDetail: (item) => set({ currentView: 'detail', selectedItem: item }),
  goToHome: () => set({ currentView: 'home', selectedItem: null }),
  goToCoffee: () => set({ currentView: 'coffee' }),
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
  clearError: () => set({ error: null }),
  setLanguage: (language) => set({ language }),
  toggleLanguage: () => set(state => ({ 
    language: state.language === 'es' ? 'en' : 'es'
  })),

  // Funciones simples
  updateTitleForLanguage: () => {},
  randomNotFoundImage: () => '/imagenes/notfound/not-found-1.jpg',
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
  getMasterpieceBadgeConfig: () => ({ color: 'gold', icon: '★' }),
  getTranslation: (key) => key,
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
  const setViewport = useAppStore(state => state.setViewport);
  const processTitle = useAppStore(state => state.processTitle);
  const processDescription = useAppStore(state => state.processDescription);
  
  // Estilos para compatibilidad
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
  
  return {
    currentView, selectedItem, isMobile, setView, setSelectedItem,
    goToDetail, goToHome, goHome, goToCoffee, setViewport, processTitle, processDescription,
    goBackFromDetail, goBackFromCoffee, mobileHomeStyles, desktopStyles, 
    baseRecommendationCardClasses, isTablet
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
  const initializeData = useAppStore(state => state.initializeData);
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
  const randomNotFoundImage = useAppStore(state => state.randomNotFoundImage);
  
  // Estados adicionales para compatibilidad
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
    title, isDataInitialized, initializeData, getRecommendations, getCategories,
    getSubcategoriesForCategory, setCategory, setSubcategory, resetToHome, resetAllFilters,
    generateNewRecommendations, initializeFilteredItems,
    updateFilteredItems, setTitle, updateTitleForLanguage, randomNotFoundImage,
    // Estados adicionales
    activeSubcategory, setActiveSubcategory, isSpanishCinemaActive, toggleSpanishCinema,
    isMasterpieceActive, toggleMasterpiece, activePodcastLanguages, togglePodcastLanguage,
    activeDocumentaryLanguages, toggleDocumentaryLanguage, activeLanguage, setActiveLanguage,
    allData
  };
};

// Inicialización automática
const store = useAppStore.getState();

// Limpiar selecciones especiales SOLO en reload completo (Ctrl+F5)
if (window && window.sessionStorage) {
  if (!sessionStorage.getItem('mp_specials_initialized')) {
    // Limpiar estados especiales
    useAppStore.setState({
      isMasterpieceActive: false,
      isSpanishCinemaActive: false,
      activePodcastLanguages: [],
      activeDocumentaryLanguages: []
    });
    sessionStorage.setItem('mp_specials_initialized', '1');
  }
}

if (!store.isDataInitialized) {
  store.initializeData();
}

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
  const toggleLanguage = useAppStore(state => state.toggleLanguage);
  const getTranslation = useAppStore(state => state.getTranslation);
  
  return { language, translations, setLanguage, toggleLanguage, getTranslation };
};

export default useAppStore;
