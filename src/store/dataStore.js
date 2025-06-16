import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Importar datos JSON (excepto movies que ahora es modular)
import datosComics from "../datos_comics.json";
import datosBooks from "../datos_books.json";
import datosMusic from "../datos_music.json";
import datosVideogames from "../datos_videogames.json";
import datosBoardgames from "../datos_boardgames.json";
import datosPodcast from "../datos_podcast.json";

// Importar el nuevo loader modular para películas
import { moviesLoader } from "../data/moviesLoader.js";

// Importar utilidades
import { processItemsWithUniqueIds } from '../utils/appUtils';

// Store consolidado para datos y filtros
const useDataStore = create(
  devtools(
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
        { key: 'podcast', es: 'Podcasts', en: 'Podcasts' }      ],      
      
      // Datos procesados con IDs únicos (movies se cargan dinámicamente)
      allData: {
        movies: [], // Se cargará dinámicamente con moviesLoader
        comics: processItemsWithUniqueIds(datosComics.recommendations || []),
        books: processItemsWithUniqueIds(datosBooks.recommendations || []),
        music: processItemsWithUniqueIds(datosMusic.recommendations || []),
        videogames: processItemsWithUniqueIds(datosVideogames.recommendations || []),
        boardgames: processItemsWithUniqueIds(datosBoardgames.recommendations || []),
        podcast: processItemsWithUniqueIds(datosPodcast.recommendations || [])
      },

      // Estado de carga para datos modulares
      isLoadingMovies: false,
      moviesLoadError: null,

      // ==========================================
      // ESTADO DE FILTROS
      // ==========================================
      selectedCategory: null,
      activeSubcategory: null,
      isSpanishCinemaActive: false,
      isMasterpieceActive: false,
      title: '',
      randomNotFoundImage: '',
      filteredItems: [],

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
        
        const items = allData[selectedCategory];
        const subcategoriesSet = new Set();
        
        items.forEach(item => {
          if (item.subcategory) {
            subcategoriesSet.add(item.subcategory);
          }
        });
        
        return Array.from(subcategoriesSet).map(sub => ({ sub }));
      },

      // Obtener todos los elementos de una categoría
      getAllItemsForCategory: (category) => {
        const { allData } = get();
        return allData[category] || [];
      },      // ==========================================
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
          allData 
        } = state;        // Si no hay categoría seleccionada, mostrar elementos aleatorios de todas las categorías
        if (!selectedCategory) {
          return state.getRandomItemsFromAllCategories();
        }        // Obtener elementos de la categoría seleccionada
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

        // Filtrar por obras maestras
        if (isMasterpieceActive) {
          items = items.filter(item => item.masterpiece === true);
        }

        return items;
      },

      // Obtener elementos aleatorios de todas las categorías para la home
      getRandomItemsFromAllCategories: () => {
        const { allData } = get();
        const allItems = [];
        
        Object.values(allData).forEach(categoryItems => {
          allItems.push(...categoryItems);
        });
        
        // Mezclar y tomar los primeros 20 elementos
        const shuffled = allItems.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 20);
      },

      // ==========================================
      // ACCIONES CONSOLIDADAS
      // ==========================================
        // Establecer categoría seleccionada
      setSelectedCategory: async (category, label) => {
        set(
          { 
            selectedCategory: category,
            title: label || category,
            activeSubcategory: null,
            isSpanishCinemaActive: false
          },
          false,
          'setSelectedCategory'
        );
        
        // Si es movies, cargar datos modulares automáticamente
        if (category === 'movies') {
          try {
            await get().ensureMoviesLoaded();
          } catch (error) {
            console.error('Error loading movies for category:', error);
          }
        }
        
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
              podcast: lang === 'en' ? 'Podcasts' : 'Podcasts'
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
      },      // Actualizar elementos filtrados
      updateFilteredItems: () => {
        const filteredItems = get().getFilteredItems();
        
        // Si no hay resultados, generar una nueva imagen not found aleatoria
        if (!filteredItems || filteredItems.length === 0) {
          const randomNotFoundImage = get().generateRandomNotFoundImage();
          set({ filteredItems, randomNotFoundImage }, false, 'updateFilteredItems');
        } else {
          set({ filteredItems }, false, 'updateFilteredItems');
        }
      },      // Inicializar elementos filtrados
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
        );
      },

      // ==========================================
      // FUNCIONES DE CARGA MODULAR PARA PELÍCULAS
      // ==========================================
      
      // Cargar todas las películas (backward compatibility)
      loadAllMovies: async () => {
        set({ isLoadingMovies: true, moviesLoadError: null }, false, 'loadAllMovies:start');
        
        try {
          console.log('🎬 Loading all movies modularly...');
          const moviesData = await moviesLoader.loadAll();
          const processedMovies = processItemsWithUniqueIds(moviesData.recommendations || []);
          
          set(
            (state) => ({
              allData: {
                ...state.allData,
                movies: processedMovies
              },
              isLoadingMovies: false
            }),
            false,
            'loadAllMovies:success'
          );
          
          // Actualizar filtros si movies está seleccionado
          const currentState = get();
          if (currentState.selectedCategory === 'movies') {
            currentState.updateFilteredItems();
          }
          
          console.log(`✅ Loaded ${processedMovies.length} movies modularly`);
          return processedMovies;
          
        } catch (error) {
          console.error('❌ Error loading movies:', error);
          set({ 
            isLoadingMovies: false, 
            moviesLoadError: error.message 
          }, false, 'loadAllMovies:error');
          throw error;
        }
      },
      
      // Cargar subcategorías específicas de películas
      loadMovieSubcategories: async (subcategories) => {
        set({ isLoadingMovies: true, moviesLoadError: null }, false, 'loadMovieSubcategories:start');
        
        try {
          console.log(`🎬 Loading movie subcategories: ${subcategories.join(', ')}`);
          const moviesData = await moviesLoader.loadSubcategories(subcategories);
          const processedMovies = processItemsWithUniqueIds(moviesData.recommendations || []);
          
          set(
            (state) => ({
              allData: {
                ...state.allData,
                movies: processedMovies
              },
              isLoadingMovies: false
            }),
            false,
            'loadMovieSubcategories:success'
          );
          
          // Actualizar filtros si movies está seleccionado
          const currentState = get();
          if (currentState.selectedCategory === 'movies') {
            currentState.updateFilteredItems();
          }
          
          console.log(`✅ Loaded ${processedMovies.length} movies from ${subcategories.length} subcategories`);
          return processedMovies;
          
        } catch (error) {
          console.error('❌ Error loading movie subcategories:', error);
          set({ 
            isLoadingMovies: false, 
            moviesLoadError: error.message 
          }, false, 'loadMovieSubcategories:error');
          throw error;
        }
      },
      
      // Cargar películas dinámicamente cuando se selecciona la categoría
      ensureMoviesLoaded: async () => {
        const { allData, isLoadingMovies } = get();
        
        // Si las películas ya están cargadas o se están cargando, no hacer nada
        if (allData.movies.length > 0 || isLoadingMovies) {
          return allData.movies;
        }
        
        // Cargar todas las películas
        return await get().loadAllMovies();
      },
      
      // Buscar películas con criterios específicos
      searchMovies: async (criteria) => {
        try {
          await get().ensureMoviesLoaded();
          const moviesData = await moviesLoader.searchMovies(criteria);
          return processItemsWithUniqueIds(moviesData.recommendations || []);
        } catch (error) {
          console.error('❌ Error searching movies:', error);
          throw error;
        }
      },

      // ==========================================
      // FUNCIONES DE RESET CONSOLIDADAS
      // ==========================================
    }),
    { name: 'data-store' }
  )
);

// Inicializar el store al importarlo
useDataStore.getState().initializeFilteredItems();

export default useDataStore;
