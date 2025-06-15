// Script para verificar películas sin trailer
import fs from 'fs';

try {
  const data = JSON.parse(fs.readFileSync('./datos_movies.json', 'utf8'));
  const moviesWithoutTrailer = data.recommendations.filter(item => !item.trailer);
  
  console.log('🎬 VERIFICACIÓN - PELÍCULAS SIN TRAILER:');
  console.log('=========================================');
  
  if (moviesWithoutTrailer.length === 0) {
    console.log('✅ ¡EXCELENTE! Todas las películas ahora tienen trailer.');
  } else {
    moviesWithoutTrailer.forEach((movie, index) => {
      console.log(`${index + 1}. ${movie.title.es} (${movie.year || 'Sin año'}) - ID: ${movie.id}`);
    });
  }
  
  console.log(`\n📊 RESUMEN:`);
  console.log(`   Total películas sin trailer: ${moviesWithoutTrailer.length}`);
  console.log(`   Total películas: ${data.recommendations.length}`);
  
  if (moviesWithoutTrailer.length === 0) {
    console.log(`   ✅ 100% de las películas tienen trailer!`);
  } else {
    console.log(`   Porcentaje sin trailer: ${((moviesWithoutTrailer.length / data.recommendations.length) * 100).toFixed(1)}%`);
  }
  
} catch (error) {
  console.error('Error:', error.message);
}
