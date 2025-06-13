/**
 * Script de prueba para verificar IDs únicos
 * Ejecutar con: node src/utils/testUniqueIds.js
 */

// Importar datos (simulando imports en Node.js)
const datosMovies = require('../datos_movies.json');
const datosVideogames = require('../datos_videogames.json');
const datosBooks = require('../datos_books.json');

// Función para generar ID único
const generateUniqueId = (item) => {
  const localId = item.id !== undefined ? item.id : item.title?.es || item.title || 'unknown';
  return `${item.category}_${localId}`;
};

// Función para procesar items
const processItemsWithUniqueIds = (items) => {
  return items.map((item, index) => ({
    ...item,
    globalId: generateUniqueId(item),
    originalId: item.id
  }));
};

// Combinar todos los items
const allItems = [
  ...datosMovies.recommendations,
  ...datosVideogames.recommendations,
  ...datosBooks.recommendations.slice(0, 5) // Solo algunos libros para prueba
];

console.log('\n=== ANTES DE PROCESAR (IDs originales) ===');
console.log('Items con ID 1:');
allItems.filter(item => item.id === 1).forEach(item => {
  console.log(`- ${item.category}: ${item.title?.es || item.title} (ID: ${item.id})`);
});

// Procesar items con IDs únicos
const processedItems = processItemsWithUniqueIds(allItems);

console.log('\n=== DESPUÉS DE PROCESAR (IDs únicos) ===');
console.log('Items que tenían ID 1:');
processedItems.filter(item => item.originalId === 1).forEach(item => {
  console.log(`- Global ID: ${item.globalId} | Original ID: ${item.originalId} | ${item.category}: ${item.title?.es || item.title}`);
});

// Verificar unicidad
const globalIds = processedItems.map(item => item.globalId);
const uniqueGlobalIds = [...new Set(globalIds)];

console.log('\n=== VERIFICACIÓN DE UNICIDAD ===');
console.log(`Total items: ${processedItems.length}`);
console.log(`IDs únicos: ${uniqueGlobalIds.length}`);
console.log(`¿Todos los IDs son únicos? ${processedItems.length === uniqueGlobalIds.length ? '✅ SÍ' : '❌ NO'}`);

if (processedItems.length !== uniqueGlobalIds.length) {
  console.log('\n❌ IDs DUPLICADOS ENCONTRADOS:');
  const duplicates = globalIds.filter((id, index) => globalIds.indexOf(id) !== index);
  [...new Set(duplicates)].forEach(dupId => {
    console.log(`- ${dupId}: aparece ${globalIds.filter(id => id === dupId).length} veces`);
  });
}

console.log('\n=== EJEMPLOS DE IDs ÚNICOS ===');
processedItems.slice(0, 10).forEach(item => {
  console.log(`${item.globalId} | ${item.category}: ${item.title?.es || item.title}`);
});
