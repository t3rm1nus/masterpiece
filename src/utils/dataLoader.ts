// Utilidad para cargar datos reales desde JSON
import { MusicDataLoader } from './musicDataLoader';

interface DataItem {
  id?: string | number;
  title: string | { es: string; en?: string };
  category: string;
  subcategory?: string;
  categoria?: string;
  genre?: string;
  genero?: string;
  image?: string;
  [key: string]: any;
}

interface Subcategory {
  sub: string;
  order: number;
}

interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

interface ProcessedData {
  [key: string]: DataItem[];
}

interface LoadedData {
  categories: Category[];
  recommendations: DataItem[];
  filteredItems: DataItem[];
  allData: ProcessedData & {
    all: DataItem[];
    recommendations: DataItem[];
  };
}

export const loadRealData = async (): Promise<LoadedData> => {
  try {
    // Cargar datos de música de forma chunked
    const musicDataPromise = MusicDataLoader.loadAllMusicData();
    
    // Importar todos los demás archivos JSON
    const [
      moviesData,
      booksData,
      videogamesData,
      musicData,
      comicsData,
      boardgamesData,
      podcastData,
      seriesData,
      documentalesData
    ] = await Promise.all([
      import('/src/data/datos_movies.json'),
      import('/src/data/datos_books.json'),
      import('/src/data/datos_videogames.json'),
      musicDataPromise, // Usar la nueva carga chunked
      import('/src/data/datos_comics.json'),
      import('/src/data/datos_boardgames.json'),
      import('/src/data/datos_podcast.json'),
      import('/src/data/datos_series.json'),
      import('/src/data/datos_documentales.json')
    ]);

    // Función helper para procesar categoría
    const processCategory = (data: any, categoryName: string): DataItem[] => {
      // Manejo flexible de diferentes estructuras JSON
      let itemsArray: DataItem[] | null = null;
      
      // Si es datos de música chunked, usar el array de recommendations directamente
      if (categoryName === 'music' && data?.recommendations && Array.isArray(data.recommendations)) {
        itemsArray = data.recommendations;
      } else if (data?.default?.recommendations && Array.isArray(data.default.recommendations)) {
        itemsArray = data.default.recommendations;
      } else if (data?.default?.[categoryName] && Array.isArray(data.default[categoryName])) {
        itemsArray = data.default[categoryName];
      } else if (data?.default && Array.isArray(data.default)) {
        itemsArray = data.default;
      }
      
      if (!itemsArray) {
        console.warn(`⚠️ Datos inválidos para ${categoryName}:`, data);
        return [];
      }
      
      return itemsArray.map((item: DataItem, index: number) => ({
        ...item,
        id: item.id || `${categoryName}-${index}`,
        category: categoryName,
        subcategory: item.subcategory || item.categoria || 'general'
      }));
    };

    // Procesar datos de cada categoría
    const processedData: ProcessedData = {
      movies: processCategory(moviesData, 'movies'),
      books: processCategory(booksData, 'books'),
      videogames: processCategory(videogamesData, 'videogames'),
      music: processCategory(musicData, 'music'),
      comics: processCategory(comicsData, 'comics'),
      boardgames: processCategory(boardgamesData, 'boardgames'),
      podcast: processCategory(podcastData, 'podcast'),
      series: processCategory(seriesData, 'series'),
      documentales: processCategory(documentalesData, 'documentales')
    };

    // Crear lista combinada de todas las recomendaciones
    const allRecommendations: DataItem[] = [
      ...processedData.movies,
      ...processedData.books,
      ...processedData.videogames,
      ...processedData.music,
      ...processedData.comics,
      ...processedData.boardgames,
      ...processedData.podcast,
      ...processedData.series,
      ...processedData.documentales
    ];

    // Generar lista curada de recomendaciones diarias (12 elementos)
    const generateDailyRecommendations = (processedData: ProcessedData): DataItem[] => {
      const categories = ['movies', 'books', 'videogames', 'music', 'comics', 'boardgames', 'podcast', 'series', 'documentales'];
      const itemsPerCategory = Math.floor(12 / categories.length); // 1 por categoría
      const remainingItems = 12 % categories.length; // 3 items extra para distribuir
      
      const dailyRecommendations: DataItem[] = [];
      
      categories.forEach((category, index) => {
        const categoryData = processedData[category] || [];
        if (categoryData.length > 0) {
          // Tomar 1 item por categoría, más 1 extra para las primeras 3 categorías
          const itemsToTake = itemsPerCategory + (index < remainingItems ? 1 : 0);
          
          // Seleccionar items aleatoriamente o los primeros si no hay suficientes
          const selectedItems = categoryData
            .sort(() => 0.5 - Math.random()) // Shuffle
            .slice(0, Math.min(itemsToTake, categoryData.length));
          
          dailyRecommendations.push(...selectedItems);
        }
      });
      
      // Asegurar que tenemos exactamente 12 items
      return dailyRecommendations.slice(0, 12);
    };

    const dailyRecommendations = generateDailyRecommendations(processedData);

    // Extraer subcategorías únicas de cada categoría
    const extractSubcategories = (categoryData: DataItem[]): Subcategory[] => {
      const subcategories = new Set<string>();
      categoryData.forEach(item => {
        const subcategory = item.subcategory || item.categoria || item.genre || item.genero;
        if (subcategory && subcategory !== 'general') {
          subcategories.add(subcategory);
        }
      });
      return Array.from(subcategories).map((sub, index) => ({ 
        sub, 
        order: index 
      }));
    };

    // Crear categorías con subcategorías extraídas de los datos reales
    const realCategories: Category[] = [
      { 
        id: 'movies', 
        name: 'Películas', 
        subcategories: extractSubcategories(processedData.movies) 
      },
      { 
        id: 'books', 
        name: 'Libros', 
        subcategories: extractSubcategories(processedData.books) 
      },
      { 
        id: 'videogames', 
        name: 'Videojuegos', 
        subcategories: extractSubcategories(processedData.videogames) 
      },
      { 
        id: 'music', 
        name: 'Música', 
        subcategories: extractSubcategories(processedData.music) 
      },
      { 
        id: 'comics', 
        name: 'Cómics', 
        subcategories: extractSubcategories(processedData.comics) 
      },
      { 
        id: 'boardgames', 
        name: 'Juegos de Mesa', 
        subcategories: extractSubcategories(processedData.boardgames) 
      },
      { 
        id: 'podcast', 
        name: 'Podcasts', 
        subcategories: extractSubcategories(processedData.podcast) 
      },
      { 
        id: 'series', 
        name: 'Series', 
        subcategories: extractSubcategories(processedData.series) 
      },
      { 
        id: 'documentales', 
        name: 'Documentales', 
        subcategories: extractSubcategories(processedData.documentales) 
      }
    ];

    return {
      categories: realCategories,
      recommendations: dailyRecommendations, // CRÍTICO: Solo 12 recomendaciones diarias
      filteredItems: dailyRecommendations,   // CRÍTICO: Mostrar solo las recomendaciones curadas
      allData: {
        ...processedData,
        all: allRecommendations, // Mantener todos los datos para filtrado por categorías
        recommendations: dailyRecommendations // Lista curada para la home
      }
    };

  } catch (error) {
    console.error('❌ Error cargando datos JSON:', error);
    
    // Fallback: usar datos básicos si falla la carga
    const fallbackCategories: Category[] = [
      { id: 'movies', name: 'Películas', subcategories: [] },
      { id: 'books', name: 'Libros', subcategories: [] }
    ];
    
    const fallbackRecommendations: DataItem[] = [
      { id: 1, title: { es: 'Película de ejemplo' }, category: 'movies', image: '/favicon.png' },
      { id: 2, title: { es: 'Libro de ejemplo' }, category: 'books', image: '/favicon.png' }
    ];

    return {
      categories: fallbackCategories,
      recommendations: fallbackRecommendations,
      filteredItems: fallbackRecommendations,
      allData: {
        movies: fallbackRecommendations,
        books: fallbackRecommendations,
        all: fallbackRecommendations,
        recommendations: fallbackRecommendations
      }
    };
  }
}; 