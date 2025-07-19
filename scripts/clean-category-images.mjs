#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carpetas a excluir del build
const EXCLUDED_FOLDERS = [
  'comics',
  'movies', 
  'musica',
  'peliculas',
  'podcasts',
  'documentales',
  'videojuegos',
  'series',
  'libros',
  'juegos_de_mesa'
];

// Función para crear build sin imágenes de categorías
function createBuildWithoutCategoryImages() {
  const publicDir = path.join(__dirname, '..', 'public', 'imagenes');
  const buildDir = path.join(__dirname, '..', 'dist', 'client', 'imagenes');
  
  console.log('🏗️  Creando build sin imágenes de categorías...');
  
  // Crear directorio de build si no existe
  if (!fs.existsSync(path.dirname(buildDir))) {
    fs.mkdirSync(path.dirname(buildDir), { recursive: true });
  }
  
  // Copiar todas las carpetas de imágenes
  const allFolders = fs.readdirSync(publicDir);
  
  allFolders.forEach(folder => {
    const sourcePath = path.join(publicDir, folder);
    const destPath = path.join(buildDir, folder);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      // Si es una carpeta excluida, crear solo con .gitkeep
      if (EXCLUDED_FOLDERS.includes(folder)) {
        fs.mkdirSync(destPath, { recursive: true });
        const gitkeepPath = path.join(destPath, '.gitkeep');
        fs.writeFileSync(gitkeepPath, '');
        console.log(`📁 Carpeta ${folder} excluida del build (solo .gitkeep)`);
      } else {
        // Si no es excluida, copiar todo el contenido
        fs.mkdirSync(destPath, { recursive: true });
        copyDirectory(sourcePath, destPath);
        console.log(`✅ Carpeta ${folder} copiada al build`);
      }
    }
  });
  
  // También copiar archivos individuales importantes
  const importantFiles = ['splash_image.png', 'icono.png', 'favicon.png', 'masterpiece-star.png'];
  importantFiles.forEach(file => {
    const sourceFile = path.join(publicDir, file);
    const destFile = path.join(buildDir, file);
    if (fs.existsSync(sourceFile)) {
      fs.copyFileSync(sourceFile, destFile);
      console.log(`✅ Archivo ${file} copiado al build`);
    }
  });
  
  console.log('🎉 Build sin imágenes de categorías creado');
}

// Función para copiar directorio recursivamente
function copyDirectory(source, destination) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }
  
  const files = fs.readdirSync(source);
  
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  });
}

// Función para limpiar el build temporal
function cleanBuildDirectory() {
  const buildDir = path.join(__dirname, '..', 'dist', 'client', 'imagenes');
  
  if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true, force: true });
    console.log('🧹 Directorio de build temporal limpiado');
  }
}

// Función para restaurar las carpetas (para desarrollo)
function restoreCategoryImages() {
  const publicDir = path.join(__dirname, '..', 'public', 'imagenes');
  
  console.log('🔄 Verificando carpetas de imágenes de categorías...');
  
  EXCLUDED_FOLDERS.forEach(folder => {
    const folderPath = path.join(publicDir, folder);
    
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`📁 Carpeta ${folder} creada`);
    }
  });
  
  console.log('✅ Verificación completada');
}

// Ejecutar según el argumento
const command = process.argv[2];

if (command === 'restore') {
  restoreCategoryImages();
} else if (command === 'clean') {
  cleanBuildDirectory();
} else {
  createBuildWithoutCategoryImages();
} 