import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const CONFIG = {
  CHUNK_SIZE: 200,
  SOURCE_FILE: path.join(__dirname, '..', 'src', 'data', 'datos_music.json'),
  OUTPUT_DIR: path.join(__dirname, '..', 'src', 'data', 'music-chunks'),
  BACKUP_DIR: path.join(__dirname, '..', 'src', 'data', 'backups')
};

/**
 * Crea un backup del archivo original
 */
function createBackup() {
  if (!fs.existsSync(CONFIG.BACKUP_DIR)) {
    fs.mkdirSync(CONFIG.BACKUP_DIR, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(CONFIG.BACKUP_DIR, `datos_music_backup_${timestamp}.json`);
  
  fs.copyFileSync(CONFIG.SOURCE_FILE, backupPath);
  console.log(`📁 Backup created: ${backupPath}`);
  return backupPath;
}

/**
 * Valida la estructura de los datos
 */
function validateData(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data: not an object');
  }
  
  if (!Array.isArray(data.recommendations)) {
    throw new Error('Invalid data: recommendations is not an array');
  }
  
  if (data.recommendations.length === 0) {
    throw new Error('Invalid data: recommendations array is empty');
  }
  
  // Validar que cada elemento tenga id único
  const ids = new Set();
  data.recommendations.forEach((item, index) => {
    if (!item.id) {
      throw new Error(`Invalid data: item at index ${index} has no id`);
    }
    if (ids.has(item.id)) {
      throw new Error(`Invalid data: duplicate id ${item.id}`);
    }
    ids.add(item.id);
  });
  
  console.log(`✅ Data validation passed: ${data.recommendations.length} items with unique IDs`);
  return true;
}

/**
 * Limpia el directorio de chunks existente
 */
function cleanOutputDirectory() {
  if (fs.existsSync(CONFIG.OUTPUT_DIR)) {
    const files = fs.readdirSync(CONFIG.OUTPUT_DIR);
    files.forEach(file => {
      if (file.endsWith('.json') && file !== 'README.md') {
        fs.unlinkSync(path.join(CONFIG.OUTPUT_DIR, file));
      }
    });
    console.log('🧹 Cleaned existing chunks');
  } else {
    fs.mkdirSync(CONFIG.OUTPUT_DIR, { recursive: true });
  }
}

/**
 * Genera estadísticas de los datos
 */
function generateStats(data) {
  const stats = {
    totalItems: data.recommendations.length,
    subcategories: {},
    masterpieces: 0,
    artists: new Set(),
    tags: new Set()
  };
  
  data.recommendations.forEach(item => {
    // Subcategorías
    if (item.subcategory) {
      stats.subcategories[item.subcategory] = (stats.subcategories[item.subcategory] || 0) + 1;
    }
    
    // Masterpieces
    if (item.masterpiece) {
      stats.masterpieces++;
    }
    
    // Artistas
    if (item.artist) {
      stats.artists.add(item.artist);
    }
    
    // Tags
    if (item.tags && Array.isArray(item.tags)) {
      item.tags.forEach(tag => stats.tags.add(tag));
    }
  });
  
  stats.artists = stats.artists.size;
  stats.tags = stats.tags.size;
  
  return stats;
}

/**
 * Función principal
 */
async function regenerateChunks() {
  console.log('🚀 Starting music data chunk regeneration...');
  console.log(`📂 Source: ${CONFIG.SOURCE_FILE}`);
  console.log(`📦 Output: ${CONFIG.OUTPUT_DIR}`);
  console.log(`📏 Chunk size: ${CONFIG.CHUNK_SIZE}`);
  
  try {
    // Verificar que el archivo fuente existe
    if (!fs.existsSync(CONFIG.SOURCE_FILE)) {
      throw new Error(`Source file not found: ${CONFIG.SOURCE_FILE}`);
    }
    
    // Crear backup
    createBackup();
    
    // Leer y validar datos
    console.log('📖 Reading source data...');
    const rawData = fs.readFileSync(CONFIG.SOURCE_FILE, 'utf8');
    const data = JSON.parse(rawData);
    validateData(data);
    
    // Generar estadísticas
    const stats = generateStats(data);
    console.log('📊 Data statistics:');
    console.log(`   Total items: ${stats.totalItems}`);
    console.log(`   Masterpieces: ${stats.masterpieces}`);
    console.log(`   Artists: ${stats.artists}`);
    console.log(`   Tags: ${stats.tags}`);
    console.log(`   Subcategories: ${Object.keys(stats.subcategories).length}`);
    
    // Limpiar directorio de salida
    cleanOutputDirectory();
    
    // Dividir en chunks
    console.log('✂️ Splitting into chunks...');
    const chunks = [];
    const totalItems = data.recommendations.length;
    const totalChunks = Math.ceil(totalItems / CONFIG.CHUNK_SIZE);
    
    for (let i = 0; i < totalItems; i += CONFIG.CHUNK_SIZE) {
      const chunk = data.recommendations.slice(i, i + CONFIG.CHUNK_SIZE);
      chunks.push({
        recommendations: chunk
      });
    }
    
    console.log(`📦 Created ${chunks.length} chunks`);
    
    // Guardar chunks
    const chunkInfos = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const chunkFileName = `music-chunk-${i + 1}.json`;
      const chunkFilePath = path.join(CONFIG.OUTPUT_DIR, chunkFileName);
      
      fs.writeFileSync(chunkFilePath, JSON.stringify(chunk, null, 2), 'utf8');
      
      const chunkInfo = {
        fileName: chunkFileName,
        startId: chunk.recommendations[0].id,
        endId: chunk.recommendations[chunk.recommendations.length - 1].id,
        itemCount: chunk.recommendations.length
      };
      
      chunkInfos.push(chunkInfo);
      console.log(`✅ ${chunkFileName}: ${chunkInfo.itemCount} items (IDs ${chunkInfo.startId}-${chunkInfo.endId})`);
    }
    
    // Crear archivo índice
    const indexData = {
      version: "1.0.0",
      generatedAt: new Date().toISOString(),
      totalItems: totalItems,
      chunkSize: CONFIG.CHUNK_SIZE,
      totalChunks: chunks.length,
      statistics: stats,
      chunks: chunkInfos
    };
    
    const indexFilePath = path.join(CONFIG.OUTPUT_DIR, 'index.json');
    fs.writeFileSync(indexFilePath, JSON.stringify(indexData, null, 2), 'utf8');
    console.log('📋 Created index.json');
    
    // Resumen final
    console.log('\n🎉 Chunk regeneration completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   Total items: ${totalItems}`);
    console.log(`   Total chunks: ${chunks.length}`);
    console.log(`   Chunk size: ${CONFIG.CHUNK_SIZE}`);
    console.log(`   Output directory: ${CONFIG.OUTPUT_DIR}`);
    
  } catch (error) {
    console.error('❌ Error during chunk regeneration:', error.message);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  regenerateChunks();
}

export { regenerateChunks, CONFIG };
