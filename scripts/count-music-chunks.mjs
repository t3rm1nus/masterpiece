// Script ES Modules para contar el número de elementos en los 5 archivos music-chunk-X.json
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const chunkFiles = [
  'music-chunk-1.json',
  'music-chunk-2.json',
  'music-chunk-3.json',
  'music-chunk-4.json',
  'music-chunk-5.json',
];

const baseDir = path.join(__dirname, '../public/music-chunks');

let total = 0;

for (const file of chunkFiles) {
  const filePath = path.join(baseDir, file);
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(data);
    let count = 0;
    let idCount = 0;
    if (json && Array.isArray(json.recommendations)) {
      count = json.recommendations.length;
      idCount = json.recommendations.filter(item => item && Object.prototype.hasOwnProperty.call(item, 'id')).length;
    }
    total += count;
    console.log(`${file}: ${count} elementos, ${idCount} con id`);
  } catch (err) {
    console.error(`${file}: ERROR ->`, err.message);
  }
}

console.log(`\nTotal de elementos en los 5 chunks: ${total}`);
