// Utilidad para cargar datos reales desde JSON
export const loadRealData = async () => {
  console.log('🔄 Cargando datos reales desde JSON...');
  
  try {
    // Importar todos los archivos JSON
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
      import('/src/data/datos_music.json'),
      import('/src/data/datos_comics.json'),
      import('/src/data/datos_boardgames.json'),
      import('/src/data/datos_podcast.json'),
      import('/src/data/datos_series.json'),
      import('/src/data/datos_documentales.json')
    ]);

    console.log('📄 Datos JSON cargados:', { 
      movies: moviesData?.default?.recommendations?.length || 0,
      books: booksData?.default?.recommendations?.length || 0 
    });    // Función helper para procesar categoría
    const processCategory = (data, categoryName) => {
      // Manejo flexible de diferentes estructuras JSON
      let itemsArray = null;
      
      if (data?.default?.recommendations && Array.isArray(data.default.recommendations)) {
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
      
      return itemsArray.map((item, index) => ({
        ...item,
        id: item.id || `${categoryName}-${index}`,
        category: categoryName,
        subcategory: item.subcategory || item.categoria || 'general'
      }));
    };

    // Procesar datos de cada categoría
    const processedData = {
      movies: processCategory(moviesData, 'movies'),
      books: processCategory(booksData, 'books'),
      videogames: processCategory(videogamesData, 'videogames'),
      music: processCategory(musicData, 'music'),
      comics: processCategory(comicsData, 'comics'),
      boardgames: processCategory(boardgamesData, 'boardgames'),
      podcast: processCategory(podcastData, 'podcast'),
      series: processCategory(seriesData, 'series'),
      documentales: processCategory(documentalesData, 'documentales')
    };    // Crear lista combinada de todas las recomendaciones
    const allRecommendations = [
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
    const generateDailyRecommendations = (processedData) => {
      const categories = ['movies', 'books', 'videogames', 'music', 'comics', 'boardgames', 'podcast', 'series', 'documentales'];
      const itemsPerCategory = Math.floor(12 / categories.length); // 1 por categoría
      const remainingItems = 12 % categories.length; // 3 items extra para distribuir
      
      const dailyRecommendations = [];
      
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
    };    const dailyRecommendations = generateDailyRecommendations(processedData);

    // Extraer subcategorías únicas de cada categoría
    const extractSubcategories = (categoryData) => {
      const subcategories = new Set();
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
    const realCategories = [
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
    ];    console.log('✅ Datos reales procesados:', {
      total: allRecommendations.length,
      dailyRecommendations: dailyRecommendations.length,
      categories: realCategories.length,
      subcategoriesFound: realCategories.map(cat => `${cat.id}: ${cat.subcategories.length}`).join(', '),
      breakdown: Object.entries(processedData).map(([key, items]) => `${key}: ${items.length}`).join(', ')
    });

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
    const fallbackCategories = [
      { id: 'movies', name: 'Películas', subcategories: [] },
      { id: 'books', name: 'Libros', subcategories: [] }
    ];
    
    const fallbackRecommendations = [
      { id: 1, title: { es: 'Película de ejemplo' }, category: 'movies', image: '/favicon.png' },
      { id: 2, title: { es: 'Libro de ejemplo' }, category: 'books', image: '/favicon.png' }
    ];

    return {
      categories: fallbackCategories,
      recommendations: fallbackRecommendations,
      filteredItems: fallbackRecommendations,
      allData: { 
        all: fallbackRecommendations, 
        movies: [fallbackRecommendations[0]], 
        books: [fallbackRecommendations[1]] 
      }
    };
  }
};
