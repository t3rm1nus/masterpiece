import React from 'react';
import datosMovies from "./datos_movies.json";

// Función para normalizar subcategorías
const normalizeSubcategory = (subcategory, lang) => {
  if (!subcategory) return '';
  const normalizedSubcategory = subcategory.toLowerCase().trim();
  if (lang === 'es') {
    switch (normalizedSubcategory) {
      case 'action': return 'acción';
      case 'animation': return 'animación';
      case 'fantasy': return 'fantasía';
      case 'comedy': return 'comedia';
      case 'adventure': return 'aventura';
      default: return normalizedSubcategory;
    }
  } else {
    switch (normalizedSubcategory) {
      case 'acción': return 'action';
      case 'animación': return 'animation';
      case 'fantasía': return 'fantasy';
      case 'comedia': return 'comedy';
      case 'aventura': return 'adventure';
      default: return normalizedSubcategory;
    }
  }
};

// Función para filtrar películas por subcategoría
const filterMoviesBySubcategory = (movies, subcategory, lang) => {
  const normalizedSubcategory = normalizeSubcategory(subcategory, lang);
  return movies.filter(movie => 
    normalizeSubcategory(movie.subcategory, lang) === normalizedSubcategory
  );
};

// Prueba con las películas de Mad Max
const madMaxMovies = datosMovies.recommendations.filter(movie => 
  movie.title.es.includes('Mad Max') || movie.title.en.includes('Mad Max')
);

console.log('Películas de Mad Max:', madMaxMovies);
console.log('Subcategorías:', madMaxMovies.map(m => m.subcategory));

// Prueba de filtrado
const actionMovies = filterMoviesBySubcategory(datosMovies.recommendations, 'acción', 'es');
console.log('Películas de acción:', actionMovies.map(m => m.title.es));

const animationMovies = filterMoviesBySubcategory(datosMovies.recommendations, 'animación', 'es');
console.log('Películas de animación:', animationMovies.map(m => m.title.es)); 