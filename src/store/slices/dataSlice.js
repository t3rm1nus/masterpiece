/**
 * Data Slice - Gestión de datos, filtros y categorías
 * Consolidación del dataStore anterior
 */

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
      Object.keys(dataMap).forEach((category) => {
        const data = dataMap[category];
        // Handle both direct arrays and objects with recommendations property
        const items = Array.isArray(data) ? data : data.recommendations || [];
        processedData[category] = processItemsWithUniqueIds(items, category);
      });
      
      set({ allData: processedData });
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

  togglePodcastLanguage: (language) => {
    const { activePodcastLanguages } = get();
    let newLanguages;
    // Si el idioma ya está activo, desactívalo (deja ambos desactivados)
    if (activePodcastLanguages.includes(language)) {
      newLanguages = [];
    } else {
      // Al activar uno, desactiva el otro (solo uno activo)
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
      newLanguages = [language];
    }
    set({ activeDocumentaryLanguages: newLanguages });
    setTimeout(() => {
      get().updateFilteredItems();
    }, 0);
  },

  // ==========================================
  // GETTERS Y UTILIDADES
  // ==========================================
  
  getCategories: (lang = 'es') => {
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
    
    return categoryTranslations[lang] || categoryTranslations.es;
  },

  getSubcategoriesForCategory: () => {
    const { allData, selectedCategory } = get();
    
    if (!selectedCategory || !allData[selectedCategory]) {
      return [];
    }
    
    const subcategories = [...new Set(
      allData[selectedCategory]
        .map(item => item.subcategory)
        .filter(sub => sub && sub !== '')
    )];
    
    return subcategories.sort();
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
  }
});
