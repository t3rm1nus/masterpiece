import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔄 Starting recombination process...');

const chunksDir = path.join(__dirname, '..', 'src', 'data', 'music-chunks');
const outputFile = path.join(__dirname, '..', 'src', 'data', 'datos_music.json');

console.log('📁 Chunks directory:', chunksDir);
console.log('📤 Output file:', outputFile);

// Verificar que el directorio existe
if (!fs.existsSync(chunksDir)) {
  console.error('❌ Chunks directory does not exist');
  process.exit(1);
}

// Leer archivos
const files = fs.readdirSync(chunksDir);
console.log('📋 Files in chunks directory:', files);

const chunkFiles = files.filter(file => file.startsWith('music-chunk-') && file.endsWith('.json'));
console.log('🎵 Chunk files found:', chunkFiles);

// Cargar chunks
const allRecommendations = [];

for (const file of chunkFiles.sort()) {
  const chunkPath = path.join(chunksDir, file);
  console.log(`📖 Reading ${file}...`);
  
  try {
    const chunkData = JSON.parse(fs.readFileSync(chunkPath, 'utf8'));
    
    if (chunkData.recommendations && Array.isArray(chunkData.recommendations)) {
      allRecommendations.push(...chunkData.recommendations);
      console.log(`✅ Loaded ${chunkData.recommendations.length} items from ${file}`);
    } else {
      console.warn(`⚠️ No recommendations array in ${file}`);
    }
  } catch (error) {
    console.error(`❌ Error reading ${file}:`, error.message);
  }
}

console.log(`📊 Total recommendations: ${allRecommendations.length}`);

// Ordenar por ID
allRecommendations.sort((a, b) => (a.id || 0) - (b.id || 0));

// Crear archivo combinado
const combinedData = {
  recommendations: allRecommendations
};

// Escribir archivo
try {
  fs.writeFileSync(outputFile, JSON.stringify(combinedData, null, 2), 'utf8');
  console.log(`🎉 Successfully created ${outputFile} with ${allRecommendations.length} recommendations`);
} catch (error) {
  console.error('❌ Error writing file:', error.message);
}
