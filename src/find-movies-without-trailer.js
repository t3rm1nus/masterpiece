// Script para encontrar películas sin trailer
import fs from 'fs';

try {
  const data = JSON.parse(fs.readFileSync('./datos_movies.json', 'utf8'));
  const moviesWithoutTrailer = data.recommendations.filter(item => !item.trailer);
  
  console.log('🎬 PELÍCULAS SIN TRAILER:');
  console.log('=========================');
  
  moviesWithoutTrailer.forEach((movie, index) => {
    console.log(`${index + 1}. ${movie.title.es} (${movie.year || 'Sin año'}) - ID: ${movie.id}`);
    console.log(`   Categoría: ${movie.subcategory || 'Sin subcategoría'}`);
    console.log(`   Director: ${movie.director || 'Sin director'}`);
    console.log('');
  });
  
  console.log(`📊 RESUMEN:`);
  console.log(`   Total películas sin trailer: ${moviesWithoutTrailer.length}`);
  console.log(`   Total películas: ${data.recommendations.length}`);
  console.log(`   Porcentaje sin trailer: ${((moviesWithoutTrailer.length / data.recommendations.length) * 100).toFixed(1)}%`);
  
} catch (error) {
  console.error('Error:', error.message);
}
