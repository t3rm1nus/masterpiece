import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Importar todos los datos JSON
import datosMovies from "../datos_movies.json";
import datosComics from "../datos_comics.json";
import datosBooks from "../datos_books.json";
import datosMusic from "../datos_music.json";
import datosVideogames from "../datos_videogames.json";
import datosBoardgames from "../datos_boardgames.json";
import datosPodcast from "../datos_podcast.json";

// Store para datos estáticos y configuración de la aplicación
const useAppDataStore = create(
  devtools(
    (set, get) => ({
      // Configuración de categorías
      categories: [
        { key: 'movies', es: 'Películas', en: 'Movies' },
        { key: 'comics', es: 'Cómics', en: 'Comics' },
        { key: 'books', es: 'Libros', en: 'Books' },
        { key: 'music', es: 'Música', en: 'Music' },
        { key: 'videogames', es: 'Videojuegos', en: 'Video Games' },
        { key: 'boardgames', es: 'Juegos de Mesa', en: 'Board Games' },
        { key: 'podcast', es: 'Podcasts', en: 'Podcasts' }
      ],
      
      // Datasets organizados por categoría
      datasetsByCategory: {
        movies: { recommendations: datosMovies.recommendations },
        comics: datosComics,
        books: datosBooks,
        music: datosMusic,
        videogames: datosVideogames,
        boardgames: datosBoardgames,
        podcast: datosPodcast
      },
      
      // Obtener dataset por categoría
      getDatasetByCategory: (category) => {
        const { datasetsByCategory } = get();
        return datasetsByCategory[category] || null;
      },
      
      // Obtener categorías con traducciones
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
      },      // Configuración de títulos por defecto (mismo que nuevas recomendaciones)
      getDefaultTitle: (lang = 'es') => {
        return lang === 'en' ? 'New Recommendations' : 'Nuevas Recomendaciones';
      },
      
      // Título para nuevas recomendaciones (usa el mismo que el defecto)
      getNewRecommendationsTitle: (lang = 'es') => {
        return get().getDefaultTitle(lang);
      }
    }),
    { name: 'app-data-store' }
  )
);

export default useAppDataStore;
