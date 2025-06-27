/**
 * DATA SLICE OFICIAL
 * Centraliza toda la lógica de datos, filtrado, inicialización, subcategorías y utilidades relacionadas con recomendaciones, categorías y filtros.
 * - Todas las funciones y estados de datos deben declararse aquí, no en el store principal.
 * - Utilidades como processTitle, processDescription y randomNotFoundImage deben importarse desde '../utils' y usarse aquí.
 * - Si se requiere lógica de demo, debe estar claramente documentada y no usarse en producción.
 * - Si se agregan nuevos campos globales de datos, documentar aquí y en el store principal.
 */

/**
 * Data Slice - Gestión de datos, filtros y categorías
 * Consolidación del dataStore anterior
 */

// =============================================
// ATENCIÓN: LÓGICA DE DEMO
// La función generateNewRecommendations y cualquier dato mock generado aquí
// solo debe usarse en desarrollo, pruebas o entornos de demo.
// Nunca debe invocarse ni importarse en producción real.
// Si necesitas datos de ejemplo, asegúrate de condicionar su uso a process.env.NODE_ENV !== 'production'.
// =============================================

// =============================================
// SLICE DE DATOS PRINCIPAL
// Este slice contiene toda la lógica y estados relacionados con los datos de la app (recomendaciones, categorías, filtros, etc).
//
// CONVENCIONES:
// - Todos los estados y funciones de datos deben declararse aquí, no en el store principal.
// - Los nombres de campos deben ser consistentes con el resto de la app y otros slices.
// - Si se agregan nuevos campos globales de datos, documentar aquí y en el store principal.
// - Utilidades globales deben importarse desde '../utils'.
// =============================================

// Importar datos JSON
import datosMovies from "../../data/datos_movies.json";
import datosComics from "../../data/datos_comics.json";
import datosBooks from "../../data/datos_books.json";
import datosMusic from "../../data/datos_music.json";
import datosVideogames from "../../data/datos_videogames.json";
import datosBoardgames from "../../data/datos_boardgames.json";
import datosPodcast from "../../data/datos_podcast.json";
import datosDocumentales from "../../data/datos_documentales.json";
import datosSeries from "../../data/datos_series.json";
import { processItemsWithUniqueIds } from '../../utils/appUtils';
import { processTitle, processDescription, randomNotFoundImage } from '../utils';

export const dataSlice = (set, get) => ({
  // ==========================================
  // ESTADO DE DATOS
  // ==========================================
  
  // Datos principales
  allData: {},
  filteredItems: [],
  homeRecommendations: [],
  
  // Filtros y categorías
  selectedCategory: null,
  activeSubcategory: null,
  activeLanguage: 'all',
  availableLanguages: [],
  
  // Estados especiales de filtros
  isSpanishCinemaActive: false,
  isMasterpieceActive: false,
  podcastLanguage: 'all',
  documentaryLanguage: 'all',
  activePodcastLanguages: [],
  activeDocumentaryLanguages: [],
  
  // Metadatos
  title: '',
  randomNotFoundImage: null,

  // Estado para subcategorías únicas por categoría
  categorySubcategories: {},

  // ==========================================
  // ACCIONES DE INICIALIZACIÓN
  // ==========================================
  
  initializeData: () => {
    const { allData } = get();
    
    if (Object.keys(allData).length === 0) {
      const dataMap = {
        peliculas: datosMovies,
        comics: datosComics,
        libros: datosBooks,
        musica: datosMusic,
        videojuegos: datosVideogames,
        juegos_de_mesa: datosBoardgames,
        podcast: datosPodcast,
        documentales: datosDocumentales,
        series: datosSeries,
      };
        const processedData = {};
      const categorySubcategories = {};
      Object.keys(dataMap).forEach((category) => {
        const data = dataMap[category];
        // Handle both direct arrays and objects with recommendations property
        const items = Array.isArray(data) ? data : data.recommendations || [];
        processedData[category] = processItemsWithUniqueIds(items, category);
        // Subcategorías únicas para la categoría
        const subcatSet = new Set();
        items.forEach(item => {
          if (item.subcategory || item.subcategoria) {
            // Permitir múltiples subcategorías separadas por coma
            const raw = item.subcategory || item.subcategoria;
            (typeof raw === 'string' ? raw.split(',') : [raw]).forEach(sub => {
              const clean = (sub || '').trim().toLowerCase();
              if (clean) subcatSet.add(clean);
            });
          }
        });
        categorySubcategories[category] = Array.from(subcatSet).sort();
      });
      
      set({ allData: processedData, categorySubcategories });
    }
  },

  initializeFilteredItems: () => {
    const { allData, selectedCategory } = get();
    
    if (selectedCategory && allData[selectedCategory]) {
      set({ filteredItems: allData[selectedCategory] });
    } else {
      set({ filteredItems: [] });
    }
  },

  updateFilteredItems: () => {
    const { 
      allData, 
      selectedCategory, 
      activeSubcategory, 
      activeLanguage,
      isSpanishCinemaActive,
      isMasterpieceActive,
      activePodcastLanguages,
      activeDocumentaryLanguages
    } = get();
    
    if (!selectedCategory || !allData[selectedCategory]) {
      set({ filteredItems: [] });
      return;
    }
    
    let items = [...allData[selectedCategory]];
    
    // Filtro por subcategoría
    if (activeSubcategory && activeSubcategory !== 'all') {
      items = items.filter(item => item.subcategory === activeSubcategory);
    }
    
    // Filtro por idioma general
    if (activeLanguage && activeLanguage !== 'all') {
      items = items.filter(item => {
        if (item.language) {
          return Array.isArray(item.language) 
            ? item.language.includes(activeLanguage)
            : item.language === activeLanguage;
        }
        return true;
      });
    }
    
    // Filtros especiales por categoría
    if (selectedCategory === 'peliculas' && isSpanishCinemaActive) {
      items = items.filter(item => item.country === 'España');
    }
    
    if (isMasterpieceActive) {
      items = items.filter(item => item.masterpiece === true);
    }
    
    // Filtro específico para podcasts
    if (selectedCategory === 'podcast' && activePodcastLanguages.length > 0) {
      items = items.filter(item => {
        if (item.language) {
          const itemLangs = Array.isArray(item.language) ? item.language : [item.language];
          return activePodcastLanguages.some(lang => itemLangs.includes(lang));
        }
        return true;
      });
    }
    
    // Filtro específico para documentales
    if (selectedCategory === 'documentales' && activeDocumentaryLanguages.length > 0) {
      items = items.filter(item => {
        if (item.language) {
          const itemLangs = Array.isArray(item.language) ? item.language : [item.language];
          return activeDocumentaryLanguages.some(lang => itemLangs.includes(lang));
        }
        return true;
      });
    }
    
    set({ filteredItems: items });
  },

  // ==========================================
  // ACCIONES DE CATEGORÍAS Y FILTROS
  // ==========================================
  
  setSelectedCategory: (category) => {
    set({ 
      selectedCategory: category,
      activeSubcategory: null,
      activeLanguage: 'all',
      isSpanishCinemaActive: false,
      isMasterpieceActive: false
      // No inicializar activePodcastLanguages ni activeDocumentaryLanguages aquí
    });
    setTimeout(() => {
      get().updateFilteredItems();
    }, 0);
  },

  setActiveSubcategory: (subcategory) => {
    set({ activeSubcategory: subcategory });
    get().updateFilteredItems();
  },

  setActiveLanguage: (language) => {
    set({ activeLanguage: language });
    get().updateFilteredItems();
  },

  // ==========================================
  // FILTROS ESPECIALES
  // ==========================================
  
  toggleSpanishCinema: () => {
    const { isSpanishCinemaActive } = get();
    set({ isSpanishCinemaActive: !isSpanishCinemaActive });
    get().updateFilteredItems();
  },

  toggleMasterpiece: () => {
    const { isMasterpieceActive } = get();
    set({ isMasterpieceActive: !isMasterpieceActive });
    get().updateFilteredItems();
  },

  setPodcastLanguage: (language) => {
    set({ podcastLanguage: language });
    get().updateFilteredItems();
  },

  // Permite máximo dos idiomas activos al entrar en la categoría, pero solo uno tras seleccionar
  togglePodcastLanguage: (language) => {
    const { activePodcastLanguages } = get();
    let newLanguages;
    if (activePodcastLanguages.includes(language)) {
      newLanguages = [];
    } else {
      // Si hay dos activos, solo deja el nuevo
      newLanguages = [language];
    }
    set({ activePodcastLanguages: newLanguages });
    setTimeout(() => {
      get().updateFilteredItems();
    }, 0);
  },

  toggleDocumentaryLanguage: (language) => {
    const { activeDocumentaryLanguages } = get();
    let newLanguages;
    if (activeDocumentaryLanguages.includes(language)) {
      newLanguages = [];
    } else {
      // Si hay dos activos, solo deja el nuevo
      newLanguages = [language];
    }
    set({ activeDocumentaryLanguages: newLanguages });
    setTimeout(() => {
      get().updateFilteredItems();
    }, 0);
  },

  // Al entrar en la categoría, permite dos activos (por ejemplo, 'es' y 'en')
  setActivePodcastLanguages: (langs) => {
    let arr = Array.isArray(langs) ? langs.slice(0, 2) : [];
    set({ activePodcastLanguages: arr });
  },
  setActiveDocumentaryLanguages: (langs) => {
    let arr = Array.isArray(langs) ? langs.slice(0, 2) : [];
    set({ activeDocumentaryLanguages: arr });
  },

  // ==========================================
  // GETTERS Y UTILIDADES
  // ==========================================
  
  getCategories: (lang = 'es', asArray = false) => {
    const categoryTranslations = {
      es: {
        peliculas: 'Películas',
        series: 'Series',
        libros: 'Libros',
        comics: 'Comics',
        musica: 'Música',
        videojuegos: 'Videojuegos',
        juegos_de_mesa: 'Juegos de Mesa',
        podcast: 'Podcast',
        documentales: 'Documentales'
      },
      en: {
        peliculas: 'Movies',
        series: 'TV Series',
        libros: 'Books',
        comics: 'Comics',
        musica: 'Music',
        videojuegos: 'Video Games',
        juegos_de_mesa: 'Board Games',
        podcast: 'Podcast',
        documentales: 'Documentaries'
      }
    };
    const map = categoryTranslations[lang] || categoryTranslations.es;
    if (asArray) {
      return Object.entries(map).map(([key, label]) => ({ key, label }));
    }
    return map;
  },

  getSubcategoriesForCategory: (category) => {
    const { categorySubcategories } = get();
    return categorySubcategories[category] || [];
  },

  // ==========================================
  // GESTIÓN DE TÍTULOS
  // ==========================================
  
  getDefaultTitle: (lang = 'es') => {
    const titles = {
      es: 'Masterpiece - Recomendaciones Culturales',
      en: 'Masterpiece - Cultural Recommendations'
    };
    return titles[lang] || titles.es;
  },

  setTitle: (title) => {
    set({ title });
  },

  updateTitleForLanguage: (lang) => {
    const { selectedCategory } = get();
    const categories = get().getCategories(lang);
    
    if (selectedCategory && categories[selectedCategory]) {
      const newTitle = `Masterpiece - ${categories[selectedCategory]}`;
      set({ title: newTitle });
    } else {
      const defaultTitle = get().getDefaultTitle(lang);
      set({ title: defaultTitle });
    }
  },

  // ==========================================
  // UTILIDADES ADICIONALES
  // ==========================================
  
  resetAllFilters: () => {
    set({
      selectedCategory: null,
      activeSubcategory: null,
      activeLanguage: 'all',
      isSpanishCinemaActive: false,
      isMasterpieceActive: false,
      podcastLanguage: 'all',
      activePodcastLanguages: [],
      activeDocumentaryLanguages: [],
      filteredItems: [],
      title: ''
    });
  },

  generateRandomNotFoundImage: () => {
    const images = [
      '/imagenes/notfound/notfound1.webp',
      '/imagenes/notfound/notfound2.webp',
      '/imagenes/notfound/notfound3.webp',
      '/imagenes/notfound/notfound4.webp',
      '/imagenes/notfound/notfound5.webp'
    ];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    set({ randomNotFoundImage: randomImage });
    return randomImage;
  },

  // Utilidades centralizadas para títulos y not found
  processTitle: (title, lang = 'es') => processTitle(title, lang),
  processDescription: (description, lang = 'es') => processDescription(description, lang),
  randomNotFoundImage: () => randomNotFoundImage(),

  // =============================================
  // FUNCIÓN DE DEMO: generateNewRecommendations
  // Esta función solo debe usarse en entornos de desarrollo/demo.
  // Genera recomendaciones mock y estructura allData para pruebas rápidas.
  // =============================================
  
  generateNewRecommendations: () => {
    const mockRecommendations = [
      { id: Date.now() + 1, title: 'Blade Runner 2049', category: 'peliculas', description: 'Ciencia ficción épica', image: '/favicon.png' },
      { id: Date.now() + 2, title: 'El Hobbit', category: 'libros', description: 'Fantasía de Tolkien', image: '/favicon.png' },
      { id: Date.now() + 3, title: 'Breath of the Wild', category: 'videojuegos', description: 'Mundo abierto', image: '/favicon.png' },
      { id: Date.now() + 4, title: 'Thriller', category: 'musica', description: 'Álbum de Michael Jackson', image: '/favicon.png' }
    ];
    const newAllData = {
      peliculas: mockRecommendations.filter(r => r.category === 'peliculas'),
      libros: mockRecommendations.filter(r => r.category === 'libros'),
      videojuegos: mockRecommendations.filter(r => r.category === 'videojuegos'),
      musica: mockRecommendations.filter(r => r.category === 'musica'),
      all: mockRecommendations
    };
    set({
      recommendations: mockRecommendations,
      filteredItems: mockRecommendations,
      allData: newAllData,
      selectedCategory: 'all',
      activeSubcategory: null,
      currentView: 'home',
      selectedItem: null
    });
  },
});
