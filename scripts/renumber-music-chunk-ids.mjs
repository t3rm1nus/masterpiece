// Script ES module para renumerar los ids de music-chunk-3.json a partir del 532 y sobreescribir el archivo
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../public/music-chunks/music-chunk-3.json');

const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

let nextId = 532;
data.recommendations = data.recommendations.map((item) => {
  if (item.id >= 532) {
    item.id = nextId++;
  }
  return item;
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('Renumeración completada. Archivo sobrescrito.');
