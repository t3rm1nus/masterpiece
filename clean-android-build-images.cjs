const fs = require('fs');
const path = require('path');

const buildImagesDir = path.join(
  __dirname,
  'android',
  'app',
  'src',
  'main',
  'assets',
  'public',
  'imagenes'
);

// Lista de subcarpetas a borrar
const subfolders = [
  'comics',
  'descargas',
  'documentales',
  'juegos_de_mesa',
  'libros',
  'musica',
  'notfound',
  'peliculas',
  'podcasts',
  'series',
  'videojuegos'
];

subfolders.forEach(folder => {
  const dir = path.join(buildImagesDir, folder);
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`Borrada: ${dir}`);
  } else {
    console.log(`No existe: ${dir}`);
  }
}); 