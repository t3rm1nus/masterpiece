// Script para renumerar los ids de music-chunk-3.json a partir del 532
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/music-chunks/music-chunk-3.json');
const outputPath = path.join(__dirname, '../public/music-chunks/music-chunk-3.renumbered.json');

const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

let nextId = 532;
data.recommendations = data.recommendations.map((item) => {
  if (item.id >= 532) {
    item.id = nextId++;
  }
  return item;
});

fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Renumeración completada. Archivo guardado como music-chunk-3.renumbered.json');
