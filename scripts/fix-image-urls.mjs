#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Función para procesar un archivo JSON
function processJsonFile(filePath) {
  console.log(`📁 Procesando: ${path.basename(filePath)}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    
    let changes = 0;
    
    // Procesar recommendations si existe
    const items = data.recommendations || data;
    
    items.forEach(item => {
      if (item.image && item.image.includes('raw.githubusercontent.com')) {
        const oldUrl = item.image;
        // Cambiar de GitHub Raw a URL de producción
        item.image = item.image.replace(
          'https://raw.githubusercontent.com/t3rm1nus/masterpiece/main/public/imagenes/',
          'https://masterpiece.es/imagenes/'
        );
        console.log(`  ✅ ${item.title?.es || item.title || item.name || item.id}: ${oldUrl} → ${item.image}`);
        changes++;
      }
    });
    
    if (changes > 0) {
      // Escribir el archivo actualizado
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      console.log(`  📝 ${changes} URLs actualizadas en ${path.basename(filePath)}`);
    } else {
      console.log(`  ⏭️  No se encontraron URLs de GitHub Raw en ${path.basename(filePath)}`);
    }
    
    return changes;
  } catch (error) {
    console.error(`  ❌ Error procesando ${path.basename(filePath)}:`, error.message);
    return 0;
  }
}

// Función principal
function main() {
  console.log('🔄 Iniciando corrección de URLs de imágenes...\n');
  
  const dataDir = path.join(__dirname, '../public/data');
  const files = [
    'datos_boardgames.json',
    'datos_books.json', 
    'datos_comics.json',
    'datos_documentales.json',
    'datos_movies.json',
    'datos_podcast.json',
    'datos_series.json',
    'datos_videogames.json'
  ];
  
  let totalChanges = 0;
  
  files.forEach(file => {
    const filePath = path.join(dataDir, file);
    if (fs.existsSync(filePath)) {
      totalChanges += processJsonFile(filePath);
    } else {
      console.log(`⚠️  Archivo no encontrado: ${file}`);
    }
  });
  
  console.log(`\n🎉 Proceso completado. Total de URLs actualizadas: ${totalChanges}`);
  console.log('\n📋 URLs cambiadas de:');
  console.log('   https://raw.githubusercontent.com/t3rm1nus/masterpiece/main/public/imagenes/');
  console.log('   a:');
  console.log('   https://masterpiece.es/imagenes/');
  console.log('\n🚀 Ahora haz un deploy para que los cambios surtan efecto en LinkedIn y otras redes sociales.');
}

main(); 