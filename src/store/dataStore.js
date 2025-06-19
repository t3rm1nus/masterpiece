import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { persist } from 'zustand/middleware';

// Importar datos JSON
import datosMovies from "../data/datos_movies.json";
import datosComics from "../data/datos_comics.json";
import datosBooks from "../data/datos_books.json";
import datosMusic from "../data/datos_music.json";
import datosVideogames from "../data/datos_videogames.json";
import datosBoardgames from "../data/datos_boardgames.json";
import datosPodcast from "../data/datos_podcast.json";
import datosDocumentales from "../data/datos_documentales.json";
import datosSeries from "../data/datos_series.json";

// Importar utilidades
import { processItemsWithUniqueIds } from '../utils/appUtils';

// Función para ordenar subcategorías de películas
const getMovieSubcategoryOrder = (subcategory) => {
  const order = {
    'action': 1,
    'adventure': 2,
    'animation': 3,
    'comedy': 4,
    'drama': 5,
    'fantasy': 6,
    'horror': 7,
    'sci-fi': 8,
    'thriller': 9,
    'war': 10,
    'western': 11
  };
  return order[subcategory] || 999;
};

// Función para ordenar subcategorías de documentales
const getDocumentarySubcategoryOrder = (subcategory) => {
  const order = {
    'nature': 1,
    'history': 2,
    'science': 3,
    'technology': 4,
    'society': 5,
    'art': 6,
    'sports': 7,
    'travel': 8,
    'biography': 9,
    'politics': 10,
    'psychology': 11,
    'crime': 12,
    'culture': 13,
    'food': 14,
    'music': 15,
    'spirituality': 16,
    'others': 999
  };
  return order[subcategory] || 999;
};

// Función para ordenar subcategorías de juegos de mesa
const getBoardgameSubcategoryOrder = (subcategory) => {
  const order = {
    'estrategia': 1,
    'familiar': 2,
    'abstracto': 3,
    'cooperativo': 4,
    'dados': 5,
    'cartas': 6,
    'civilización': 7,
    'aventura': 8,
    'party': 9,
    'deducción': 10,
    'solitario': 11
  };
  return order[subcategory] || 999;
};

// Función para ordenar subcategorías de podcasts
const getPodcastSubcategoryOrder = (subcategory) => {
  const order = {
    'news': 1,
    'crime': 2,
    'business': 3,
    'science': 4,
    'culture': 5,
    'music': 6,
    'history': 7,
    'inspiration': 8,
    'education': 9,
    'technology': 10
  };
  return order[subcategory] || 999;
};

// Store consolidado para datos y filtros
const useDataStore = create(
  devtools(
    persist(
      (set, get) => ({
        // ==========================================
        // CONFIGURACIÓN DE CATEGORÍAS Y DATOS
        // ==========================================
        categories: [
          { key: 'movies', es: 'Películas', en: 'Movies' },
          { key: 'comics', es: 'Cómics', en: 'Comics' },
          { key: 'books', es: 'Libros', en: 'Books' },
          { key: 'music', es: 'Música', en: 'Music' },
          { key: 'videogames', es: 'Videojuegos', en: 'Videogames' },
          { key: 'boardgames', es: 'Juegos de Mesa', en: 'Board Games' },
          { key: 'podcast', es: 'Podcasts', en: 'Podcasts' },
          { key: 'documentales', es: 'Documentales', en: 'Documentaries' },
          { key: 'series', es: 'Series', en: 'TV Shows' }
        ],        // Estado inicial
        allData: {
          movies: processItemsWithUniqueIds(datosMovies.recommendations || []),
          comics: processItemsWithUniqueIds(datosComics.recommendations || []),
          books: processItemsWithUniqueIds(datosBooks.recommendations || []),
          music: processItemsWithUniqueIds(datosMusic.recommendations || []),
          videogames: processItemsWithUniqueIds(datosVideogames.recommendations || []),
          boardgames: processItemsWithUniqueIds(datosBoardgames.recommendations || []),
          podcast: processItemsWithUniqueIds(datosPodcast.recommendations || []),
          documentales: processItemsWithUniqueIds(datosDocumentales.recommendations || []),
          series: processItemsWithUniqueIds(datosSeries.recommendations || [])
        },
        selectedCategory: null,
        activeSubcategory: null,
        activeLanguage: 'all',
        filteredItems: [],
        darkMode: false,
        language: 'es',

        // ==========================================
        // ESTADO DE FILTROS
        // ==========================================
        isSpanishCinemaActive: false,
        isMasterpieceActive: false,
        podcastLanguage: 'es',
        documentaryLanguage: 'es',
        title: '',
        randomNotFoundImage: '',

        // ==========================================
        // GETTERS CONSOLIDADOS
        // ==========================================
        
        // Obtener categorías traducidas
        getCategories: (lang = 'es') => {
          const { categories } = get();
          return categories.map(cat => ({
            key: cat.key,
            label: cat[lang] || cat.es
          }));
        },

        // Obtener una categoría específica
        getCategory: (key, lang = 'es') => {
          const { categories } = get();
          const category = categories.find(cat => cat.key === key);
          return category ? {
            key: category.key,
            label: category[lang] || category.es
          } : null;
        },

        // Obtener título por defecto
        getDefaultTitle: (lang = 'es') => {
          return lang === 'en' ? 'New Recommendations' : 'Nuevas Recomendaciones';
        },

        // Obtener subcategorías para la categoría seleccionada
        getSubcategoriesForCategory: () => {
          const { selectedCategory, allData } = get();
          if (!selectedCategory || !allData[selectedCategory]) return [];
          
          // Obtener todas las subcategorías únicas
          const subcategories = [...new Set(
            allData[selectedCategory]
              .map(item => {
                // Para documentales, usar la propiedad 'categoria' como subcategoría
                if (selectedCategory === 'documentales') {
                  return item.categoria || 'others';
                }
                return item.subcategory || 'others';
              })
              .filter(Boolean)
          )];
          
          // Ordenar subcategorías según la categoría
          if (selectedCategory === 'movies') {
            return subcategories.map(sub => ({ sub, order: getMovieSubcategoryOrder(sub) }));
          } else if (selectedCategory === 'documentales') {
            return subcategories.map(sub => ({ sub, order: getDocumentarySubcategoryOrder(sub) }));
          } else if (selectedCategory === 'boardgames') {
            return subcategories.map(sub => ({ sub, order: getBoardgameSubcategoryOrder(sub) }));
          } else if (selectedCategory === 'podcast') {
            return subcategories.map(sub => ({ sub, order: getPodcastSubcategoryOrder(sub) }));
          }
          
          return subcategories.map(sub => ({ sub, order: 0 }));
        },

        // Obtener todos los elementos de una categoría
        getAllItemsForCategory: (category) => {
          const { allData } = get();
          return allData[category] || [];
        },

        // ==========================================
        // FUNCIONES AUXILIARES
        // ==========================================
        
        // Generar imagen not found aleatoria
        generateRandomNotFoundImage: () => {
          return `/imagenes/notfound/notfound${Math.floor(Math.random() * 10) + 1}.webp`;
        },

        // ==========================================
        // LÓGICA DE FILTRADO CONSOLIDADA
        // ==========================================
        
        // Filtrar elementos según criterios activos
        getFilteredItems: () => {
          const state = get();
          const { 
            selectedCategory, 
            activeSubcategory, 
            isSpanishCinemaActive, 
            isMasterpieceActive,
            podcastLanguage,
            documentaryLanguage,
            allData 
          } = state;
          // Si no hay categoría seleccionada, mostrar elementos aleatorios de todas las categorías
          if (!selectedCategory) {
            return state.getRandomItemsFromAllCategories();
          }
          // Obtener elementos de la categoría seleccionada
          let items = allData[selectedCategory] || [];

          // Filtrar por subcategoría
          if (activeSubcategory) {
            items = items.filter(item => item.subcategory === activeSubcategory);
          }

          // Filtrar por Cine Español (se puede combinar con otros filtros)
          if (isSpanishCinemaActive && selectedCategory === 'movies') {
            console.log('Filtering Spanish Cinema. Items before filter:', items.length);
            items = items.filter(item => 
              (item.tags && item.tags.includes('spanish')) ||
              item.subcategory === 'spanish cinema' || 
              item.subcategory === 'cine español'
            );
            console.log('Items after Spanish Cinema filter:', items.length);
          }

          // Filtrar por idioma del podcast
          if (podcastLanguage && selectedCategory === 'podcast') {
            items = items.filter(item => item.language === podcastLanguage || !item.language);
          }

          // Filtrar por idioma de documentales
          if (documentaryLanguage && selectedCategory === 'documentales') {
            items = items.filter(item => item.idioma === documentaryLanguage || !item.idioma);
          }

          // Filtrar por obras maestras
          if (isMasterpieceActive) {
            items = items.filter(item => item.masterpiece === true);
          }

          return items;
        },        // Obtener elementos aleatorios de todas las categorías para la home
        getRandomItemsFromAllCategories: () => {
          const { allData } = get();
          const allItems = [];
          
          // Validar que allData existe y que cada categoría es un array válido
          if (allData && typeof allData === 'object') {
            Object.values(allData).forEach(categoryItems => {
              if (Array.isArray(categoryItems)) {
                allItems.push(...categoryItems);
              }
            });
          }
          
          // Verificar que tenemos elementos para devolver
          if (allItems.length === 0) {
            return [];
          }
          
          // Mezclar y tomar los primeros 20 elementos
          const shuffled = allItems.sort(() => 0.5 - Math.random());
          return shuffled.slice(0, 20);
        },

        // ==========================================
        // ACCIONES CONSOLIDADAS
        // ==========================================
          // Establecer categoría seleccionada
        setSelectedCategory: (category, label) => {
          set(
            { 
              selectedCategory: category,
              title: label || category,
              activeSubcategory: null,
              isSpanishCinemaActive: false
            },
            false,          'setSelectedCategory'
          );
          
          // Actualizar elementos filtrados
          get().updateFilteredItems();
        },// Establecer subcategoría activa
        setActiveSubcategory: (subcategory) => {
          set(
            { 
              activeSubcategory: subcategory
            },
            false,
            'setActiveSubcategory'
          );
          
          get().updateFilteredItems();
        },// Alternar Cine Español
        toggleSpanishCinema: () => {
          const { isSpanishCinemaActive, selectedCategory } = get();
          console.log('toggleSpanishCinema called. Current state:', isSpanishCinemaActive, 'Selected category:', selectedCategory);
          set(
            { 
              isSpanishCinemaActive: !isSpanishCinemaActive
            },
            false,
            'toggleSpanishCinema'
          );
          
          get().updateFilteredItems();
          console.log('toggleSpanishCinema completed. New state:', !isSpanishCinemaActive);
        },        // Alternar podcasts por idioma
        setPodcastLanguage: (language) => {
          const { podcastLanguage } = get();
          // Si se hace clic en el mismo idioma, desactivar el filtro
          const newLanguage = podcastLanguage === language ? null : language;
          set(
            { 
              podcastLanguage: newLanguage
            },
            false,
            'setPodcastLanguage'
          );
          
          get().updateFilteredItems();
        },

        // Establecer idioma activo para documentales
        setActiveLanguage: (language) => {
          set(
            { 
              activeLanguage: language
            },
            false,
            'setActiveLanguage'
          );
          
          get().updateFilteredItems();
        },

        // Alternar obras maestras
        toggleMasterpiece: () => {
          const { isMasterpieceActive } = get();
          set(
            { isMasterpieceActive: !isMasterpieceActive },
            false,
            'toggleMasterpiece'
          );
          
          get().updateFilteredItems();
        },

        // Establecer título
        setTitle: (title) => {
          set({ title }, false, 'setTitle');
        },      // Actualizar título para idioma
        updateTitleForLanguage: (lang) => {
          const { selectedCategory, allData } = get();
          if (!selectedCategory) {
            const defaultTitle = get().getDefaultTitle(lang);
            set({ title: defaultTitle }, false, 'updateTitleForLanguage');
          } else {
            // Si hay una categoría seleccionada, actualizar su título traducido
            const categoryData = allData[selectedCategory];
            if (categoryData && categoryData.length > 0) {
              const categoryNames = {
                movies: lang === 'en' ? 'Movies' : 'Películas',
                videogames: lang === 'en' ? 'Video Games' : 'Videojuegos',
                comics: lang === 'en' ? 'Comics' : 'Cómics',
                books: lang === 'en' ? 'Books' : 'Libros',
                boardgames: lang === 'en' ? 'Board Games' : 'Juegos de Mesa',
                music: lang === 'en' ? 'Music' : 'Música',
                podcast: lang === 'en' ? 'Podcasts' : 'Podcasts',
                documentales: lang === 'en' ? 'Documentaries' : 'Documentales'
              };
              const translatedTitle = categoryNames[selectedCategory] || selectedCategory;
              set({ title: translatedTitle }, false, 'updateTitleForLanguage');
            }
          }
        },

        // Resetear categoría
        resetCategory: () => {
          set(
            { 
              selectedCategory: null,
              activeSubcategory: null,
              isSpanishCinemaActive: false
            },
            false,
            'resetCategory'
          );
          
          get().updateFilteredItems();
        },

        // Resetear todos los filtros
        resetAllFilters: (lang = 'es') => {
          const defaultTitle = get().getDefaultTitle(lang);
          set(
            { 
              selectedCategory: null,
              activeSubcategory: null,
              isSpanishCinemaActive: false,
              isMasterpieceActive: false,
              title: defaultTitle
            },
            false,
            'resetAllFilters'
          );
            get().updateFilteredItems();
        },

        // Actualizar elementos filtrados
        updateFilteredItems: () => {
          const { 
            selectedCategory, 
            activeSubcategory, 
            activeLanguage,
            allData,
            isSpanishCinemaActive,
            isMasterpieceActive,
            podcastLanguage,
            documentaryLanguage
          } = get();
          
          if (!selectedCategory) {
            get().initializeFilteredItems();
            return;
          }

          // Verificar que existe la categoría y que es un array
          const categoryData = allData[selectedCategory];
          if (!categoryData || !Array.isArray(categoryData)) {
            console.error(`Category data for "${selectedCategory}" is not an array:`, categoryData);
            set({ filteredItems: [] }, false, 'updateFilteredItems');
            return;
          }
          
          let filtered = [...categoryData];
          
          // Aplicar filtros según la categoría
          if (selectedCategory === 'movies' && isSpanishCinemaActive) {
            filtered = filtered.filter(item => item.spanishCinema);
          }
          
          if (isMasterpieceActive) {
            filtered = filtered.filter(item => item.masterpiece);
          }
          
          if (selectedCategory === 'podcast') {
            filtered = filtered.filter(item => {
              if (podcastLanguage === 'es') {
                return item.language === 'es' || !item.language;
              } else {
                return item.language === 'en';
              }
            });
          }          if (selectedCategory === 'documentales') {
            if (activeLanguage !== 'all') {
              filtered = filtered.filter(item => {
                return item.language === activeLanguage || 
                       item.idioma === activeLanguage ||
                       (!item.language && !item.idioma && activeLanguage === 'es');
              });
            }
          }
            if (activeSubcategory) {
            filtered = filtered.filter(item => item.subcategory === activeSubcategory);
          }
          
          // Asegurar que siempre tenemos un array válido
          const finalFiltered = Array.isArray(filtered) ? filtered : [];
          set({ filteredItems: finalFiltered }, false, 'updateFilteredItems');
        },// Inicializar elementos filtrados
        initializeFilteredItems: () => {
          const filteredItems = get().getRandomItemsFromAllCategories();
          const randomNotFoundImage = get().generateRandomNotFoundImage();
          const defaultTitle = get().getDefaultTitle('es');
          
          set(
            { 
              filteredItems, 
              randomNotFoundImage,
              title: defaultTitle
            },
            false,
            'initializeFilteredItems'
          );        },

        // ==========================================
        // FUNCIONES DE RESET CONSOLIDADAS
        // ==========================================        // Inicializar datos
        initializeData: () => {
          const { allData } = get();
          if (!allData || Object.keys(allData).length === 0) {
            set({ 
              allData: {
                movies: processItemsWithUniqueIds(datosMovies.recommendations || []),
                comics: processItemsWithUniqueIds(datosComics.recommendations || []),
                books: processItemsWithUniqueIds(datosBooks.recommendations || []),
                music: processItemsWithUniqueIds(datosMusic.recommendations || []),
                videogames: processItemsWithUniqueIds(datosVideogames.recommendations || []),
                boardgames: processItemsWithUniqueIds(datosBoardgames.recommendations || []),
                podcast: processItemsWithUniqueIds(datosPodcast.recommendations || []),
                documentales: processItemsWithUniqueIds(datosDocumentales.recommendations || []),
                series: processItemsWithUniqueIds(datosSeries.recommendations || [])
              }
            });
          }
        },
      }),
      {
        name: 'data-storage',
        partialize: (state) => ({
          selectedCategory: state.selectedCategory,
          activeSubcategory: state.activeSubcategory,
          activeLanguage: state.activeLanguage,
          darkMode: state.darkMode,
          language: state.language
        })
      }
    )
  )
);

// Inicializar el store al importarlo
useDataStore.getState().initializeFilteredItems();

export default useDataStore;
