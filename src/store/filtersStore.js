import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Importar los datos
import datosMovies from "../datos_movies.json";
import datosComics from "../datos_comics.json";
import datosBooks from "../datos_books.json";
import datosMusic from "../datos_music.json";
import datosVideogames from "../datos_videogames.json";
import datosBoardgames from "../datos_boardgames.json";
import datosPodcast from "../datos_podcast.json";

// Importar el store de datos de la app
import useAppDataStore from './appDataStore';

// Store para los filtros de la aplicación
const useFiltersStore = create(
  devtools(
    (set, get) => ({
      // Estado inicial
      selectedCategory: null,
      activeSubcategory: null,
      isSpanishCinemaActive: false,
      isMasterpieceActive: false,
      title: '',
      randomNotFoundImage: '', // Nueva propiedad para la imagen not found
      allItems: [
        ...datosMovies.recommendations,
        ...datosComics.recommendations,
        ...datosBooks.recommendations,
        ...datosMusic.recommendations,
        ...datosVideogames.recommendations,
        ...datosBoardgames.recommendations,
        ...datosPodcast.recommendations
      ],
      filteredItems: [],
      
      // Categorías disponibles (función para obtener traducciones dinámicas)
      getCategories: (lang) => [
        { key: 'movies', label: lang === 'en' ? 'Movies' : 'Películas' },
        { key: 'comics', label: lang === 'en' ? 'Comics' : 'Cómics' },
        { key: 'books', label: lang === 'en' ? 'Books' : 'Libros' },
        { key: 'music', label: lang === 'en' ? 'Music' : 'Música' },
        { key: 'videogames', label: lang === 'en' ? 'Video Games' : 'Videojuegos' },
        { key: 'boardgames', label: lang === 'en' ? 'Board Games' : 'Juegos de Mesa' },
        { key: 'podcast', label: lang === 'en' ? 'Podcasts' : 'Podcasts' }
      ],
      
      // Acción para actualizar la imagen not found
      updateNotFoundImage: () => {
        // Importar la función aquí para evitar dependencias circulares
        import('../utils/appUtils').then(module => {
          const { getRandomNotFoundImage } = module;
          set({ randomNotFoundImage: getRandomNotFoundImage() }, false, 'updateNotFoundImage');
        });
      },
      
      // Acciones
      setSelectedCategory: (category, label) => {
        set(
          {
            selectedCategory: category,
            activeSubcategory: null,
            isSpanishCinemaActive: false, // Resetear el filtro de cine español al cambiar de categoría
            title: label,
          },
          false,
          'setSelectedCategory'
        );
        // Aplicar filtros después de cambiar la categoría
        get().applyFilters();
      },
      
      setActiveSubcategory: (subcategory) => {
        set(
          (state) => ({
            activeSubcategory: state.activeSubcategory === subcategory ? null : subcategory
          }),
          false,
          'setActiveSubcategory'
        );
        // Aplicar filtros después de cambiar la subcategoría
        get().applyFilters();
      },
      
      toggleSpanishCinema: () => {
        set(
          (state) => ({
            isSpanishCinemaActive: !state.isSpanishCinemaActive
          }),
          false,
          'toggleSpanishCinema'
        );
        // Aplicar filtros después de cambiar el filtro de cine español
        get().applyFilters();
      },
      
      toggleMasterpiece: () => {
        set(
          (state) => ({
            isMasterpieceActive: !state.isMasterpieceActive
          }),
          false,
          'toggleMasterpiece'
        );
        // Aplicar filtros después de cambiar el filtro de obras maestras
        get().applyFilters();
      },
        resetCategory: (defaultTitle) => {
        set(
          {
            selectedCategory: null,
            activeSubcategory: null,
            title: defaultTitle
          },
          false,
          'resetCategory'
        );
        // Aplicar filtros después de resetear la categoría
        get().applyFilters();
      },      setTitle: (title) => {
        // Comprobamos si el título ya está establecido para evitar actualizaciones innecesarias
        if (title !== undefined && title !== null) {
          set({ title }, false, 'setTitle');
        }
      },
      
      // Función para obtener subcategorías de la categoría seleccionada
      getSubcategoriesForCategory: () => {
        const { selectedCategory, allItems } = get();
        if (!selectedCategory) return [];
        
        // Extraer subcategorías únicas de la categoría seleccionada
        const uniqueSubcategories = Array.from(
          new Set(
            allItems
              .filter(item => item.category === selectedCategory && item.subcategory)
              .map(item => {
                // Normalizar subcategorías para consistencia
                return item.subcategory.toLowerCase();
              })
          )
        );
        
        // Convertir a formato de objeto para el componente
        return uniqueSubcategories.map(sub => ({ sub }));
      },
      
      // Función para aplicar todos los filtros y actualizar los elementos filtrados
      applyFilters: () => {
        const { 
          allItems, 
          selectedCategory, 
          activeSubcategory, 
          isSpanishCinemaActive, 
          isMasterpieceActive 
        } = get();
        
        let filteredRecommendations = allItems;
        
        // Aplicar filtro de categoría
        if (selectedCategory) {
          filteredRecommendations = filteredRecommendations.filter(item => item.category === selectedCategory);
        }
        
        // Aplicar filtro de subcategoría
        if (activeSubcategory && activeSubcategory !== '__masterpieces__') {
          filteredRecommendations = filteredRecommendations.filter(item => item.subcategory === activeSubcategory);
        }
        
        // Aplicar filtro de cine español si está activo
        if (isSpanishCinemaActive) {
          filteredRecommendations = filteredRecommendations.filter(item => 
            Array.isArray(item.tags) && item.tags.includes('spanish')
          );
        }
        
        // Aplicar filtro de obras maestras si está activo
        if (isMasterpieceActive) {
          filteredRecommendations = filteredRecommendations.filter(item => item.masterpiece === true);
        }
          // Si no hay filtros activos y no hay categoría seleccionada, mostrar recomendaciones aleatorias
        if (!selectedCategory && !isSpanishCinemaActive && !isMasterpieceActive) {
          filteredRecommendations = filteredRecommendations
            .sort(() => 0.5 - Math.random())
            .slice(0, 11);
        } else if (selectedCategory) {
          // Si hay una categoría seleccionada, ordenar alfabéticamente por título para un orden consistente
          filteredRecommendations = filteredRecommendations.sort((a, b) => {
            const titleA = typeof a.title === 'object' ? (a.title.es || a.title.en || '') : (a.title || '');
            const titleB = typeof b.title === 'object' ? (b.title.es || b.title.en || '') : (b.title || '');
            return titleA.localeCompare(titleB);
          });
        }        // Actualizar los elementos filtrados en el store
        set({ filteredItems: filteredRecommendations }, false, 'applyFilters');
        
        // Si no hay resultados, actualizar la imagen not found
        if (filteredRecommendations.length === 0) {
          get().updateNotFoundImage();
        }
        
        // Para depuración
        console.log('Filter status:', {
          selectedCategory,
          activeSubcategory,
          isSpanishCinemaActive,
          isMasterpieceActive,
          totalItems: filteredRecommendations.length,
          hasResults: filteredRecommendations.length > 0,
          spanishItems: filteredRecommendations.filter(item => Array.isArray(item.tags) && item.tags.includes('spanish')).length,
          masterpieces: filteredRecommendations.filter(item => item.masterpiece).length
        });
        
        return filteredRecommendations;
      },
      
      // Inicializar las recomendaciones filtradas
      initializeFilteredItems: () => {
        const { allItems } = get();
        const randomRecommendations = allItems
          .sort(() => 0.5 - Math.random())
          .slice(0, 11);
        
        set({ filteredItems: randomRecommendations }, false, 'initializeFilteredItems');
      },
      
      // Acción para manejar automáticamente el título según idioma y categoría
      updateTitleForLanguage: (lang) => {
        const { selectedCategory } = get();
        const { getCategory, getDefaultTitle } = useAppDataStore.getState();
        
        if (selectedCategory) {
          const category = getCategory(selectedCategory, lang);
          if (category) {
            set({ title: category.label }, false, 'updateTitleForLanguage');
          }
        } else {
          set({ title: getDefaultTitle(lang) }, false, 'updateTitleForLanguage');
        }
      },      // Reset completo del estado (para "Nuevas Recomendaciones")
      resetAllFilters: (lang = 'es') => {
        const { getNewRecommendationsTitle } = useAppDataStore.getState();
        const newRecommendationsTitle = getNewRecommendationsTitle(lang);
        
        set(
          {
            selectedCategory: null,
            activeSubcategory: null,
            isSpanishCinemaActive: false,
            isMasterpieceActive: false,
            title: newRecommendationsTitle
          },
          false,
          'resetAllFilters'
        );
        
        // Aplicar filtros después del reset completo
        get().applyFilters();
      },
    }),
    { name: 'filters-store' } // Nombre para DevTools
  )
);

// Inicializar el store
const initializeStore = async () => {
  const { getRandomNotFoundImage } = await import('../utils/appUtils');
  useFiltersStore.getState().randomNotFoundImage = getRandomNotFoundImage();
  useFiltersStore.getState().initializeFilteredItems();
};

initializeStore();

export default useFiltersStore;
