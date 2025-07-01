import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer el archivo original
const originalFilePath = path.join(__dirname, '..', 'src', 'data', 'datos_music.json');
const originalData = JSON.parse(fs.readFileSync(originalFilePath, 'utf8'));

console.log(`Total items: ${originalData.recommendations.length}`);

// Configuración
const CHUNK_SIZE = 200;
const chunks = [];

// Dividir en chunks
for (let i = 0; i < originalData.recommendations.length; i += CHUNK_SIZE) {
  const chunk = originalData.recommendations.slice(i, i + CHUNK_SIZE);
  chunks.push({
    recommendations: chunk
  });
}

console.log(`Created ${chunks.length} chunks`);

// Crear directorio para los chunks si no existe
const chunksDir = path.join(__dirname, '..', 'src', 'data', 'music-chunks');
if (!fs.existsSync(chunksDir)) {
  fs.mkdirSync(chunksDir, { recursive: true });
}

// Guardar cada chunk
chunks.forEach((chunk, index) => {
  const chunkFileName = `music-chunk-${index + 1}.json`;
  const chunkFilePath = path.join(chunksDir, chunkFileName);
  
  fs.writeFileSync(chunkFilePath, JSON.stringify(chunk, null, 2), 'utf8');
  console.log(`Created ${chunkFileName} with ${chunk.recommendations.length} items`);
});

// Crear un archivo de índice que lista todos los chunks
const indexData = {
  totalItems: originalData.recommendations.length,
  chunkSize: CHUNK_SIZE,
  totalChunks: chunks.length,
  chunks: chunks.map((chunk, index) => ({
    fileName: `music-chunk-${index + 1}.json`,
    startId: chunk.recommendations[0].id,
    endId: chunk.recommendations[chunk.recommendations.length - 1].id,
    itemCount: chunk.recommendations.length
  }))
};

const indexFilePath = path.join(chunksDir, 'index.json');
fs.writeFileSync(indexFilePath, JSON.stringify(indexData, null, 2), 'utf8');
console.log('Created index.json');

console.log('Music data split completed successfully!');
