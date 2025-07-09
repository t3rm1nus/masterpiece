// Script para contar el número de elementos en los 5 archivos music-chunk-X.json
const fs = require('fs');
const path = require('path');

const chunkFiles = [
  'music-chunk-1.json',
  'music-chunk-2.json',
  'music-chunk-3.json',
  'music-chunk-4.json',
  'music-chunk-5.json',
];

const baseDir = path.join(__dirname, '../public/music-chunks');

let total = 0;

chunkFiles.forEach((file) => {
  const filePath = path.join(baseDir, file);
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const arr = JSON.parse(data);
    const count = Array.isArray(arr) ? arr.length : 0;
    total += count;
    console.log(`${file}: ${count} elementos`);
  } catch (err) {
    console.error(`${file}: ERROR ->`, err.message);
  }
});

console.log(`\nTotal de elementos en los 5 chunks: ${total}`);
