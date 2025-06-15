// Script para verificar trailers en castellano actualizados
import fs from 'fs';

try {
  const data = JSON.parse(fs.readFileSync('./datos_movies.json', 'utf8'));
  
  // IDs de las películas que actualizamos
  const updatedMovieIds = [28, 29, 30, 31, 32, 33, 34, 50, 51, 133, 155, 156];
  
  console.log('🎬 TRAILERS EN CASTELLANO ACTUALIZADOS:');
  console.log('=====================================');
  
  updatedMovieIds.forEach((id, index) => {
    const movie = data.recommendations.find(item => item.id === id);
    if (movie) {
      console.log(`${index + 1}. ${movie.title.es} (${movie.year})`);
      console.log(`   ES: ${movie.trailer.es}`);
      console.log(`   EN: ${movie.trailer.en}`);
      console.log('');
    }
  });
  
  console.log(`✅ ${updatedMovieIds.length} películas actualizadas con trailers en castellano`);
  
} catch (error) {
  console.error('Error:', error.message);
}
