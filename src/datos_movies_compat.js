/**
 * Backward Compatibility Layer for datos_movies.json
 * 
 * This file provides the same interface as the original large datos_movies.json
 * but uses the new modular movie loader under the hood.
 * 
 * Used for maintaining compatibility with existing code while providing
 * the benefits of modular loading.
 */

import { moviesLoader } from './data/moviesLoader.js';

// Cache for loaded data
let cachedMoviesData = null;
let loadingPromise = null;

/**
 * Load all movies data in the original format
 */
async function loadMoviesData() {
  if (cachedMoviesData) {
    return cachedMoviesData;
  }
  
  if (loadingPromise) {
    return loadingPromise;
  }
  
  loadingPromise = moviesLoader.loadAll().then(data => {
    cachedMoviesData = data;
    loadingPromise = null;
    return data;
  }).catch(error => {
    loadingPromise = null;
    throw error;
  });
  
  return loadingPromise;
}

/**
 * Synchronous fallback for immediate access (returns empty until loaded)
 */
function getMoviesDataSync() {
  if (cachedMoviesData) {
    return cachedMoviesData;
  }
  
  // Return empty structure for initial renders
  return {
    recommendations: []
  };
}

// Start loading immediately
loadMoviesData().catch(error => {
  console.error('Error preloading movies data:', error);
});

// Export in original format for drop-in replacement
const datosMovies = {
  get recommendations() {
    return getMoviesDataSync().recommendations;
  }
};

// Async getter for fully loaded data
datosMovies.load = loadMoviesData;

// For ES modules
export default datosMovies;

// For CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = datosMovies;
}
