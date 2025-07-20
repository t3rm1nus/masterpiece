import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import gracefulFs from 'graceful-fs';
gracefulFs.gracefulify(fs);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resolve = p => path.resolve(__dirname, p);

const app = express();

// Redirige /[lang]/assets/* a /assets/* para servir correctamente los assets en rutas internacionalizadas
app.use((req, res, next) => {
  console.log('NUEVO LOG 1 *************************************************************************************');
  req.url = req.url.replace(/^\/[a-z]{2}(?:-[A-Z]{2})?(?=\/assets\/)/, '');
  next();
});

// Servir archivos estáticos desde dist/client (build de producción)
app.use(express.static(resolve('dist/client')));

// Servir archivos estáticos desde public (para desarrollo)
app.use(express.static(path.join(__dirname, 'public')));

// SSR handler
app.get('*', async (req, res) => {
  console.log('NUEVO LOG 2 *************************************************************************************');
  let template = fs.readFileSync(path.join(__dirname, 'dist/client/index.html'), 'utf-8');
  const renderModule = await import('./dist/server/entry-server.js');
  console.log('SSR: TEST LOG 987654321', Object.keys(renderModule)); // Log único para rastreo de deploy
  console.log('SSR: renderModule keys', Object.keys(renderModule));
  const render = renderModule.render;
  if (!render) {
    console.error('SSR: ¡No se encontró la función render en entry-server.js!');
  }
  const lang = req.url.startsWith('/en/') ? 'en' : 'es';

  // Detectar si es una URL de detalle
  // Soportar tanto /detalle/:category/:id como /movies/:id, /books/:id, etc.
  let initialItem = null;
  let category = null;
  let id = null;
  let match = req.url.match(/^\/detalle\/(\w+)\/(\d+)/);
  console.log('NUEVO LOG 3*************************************************************************************');
  if (match) {
    category = match[1];
    id = match[2];
  } else {
    // Detectar /movies/:id, /books/:id, etc.
    match = req.url.match(/^\/(\w+)\/(\d+)/);
    if (match) {
      category = match[1];
      id = match[2];
    }
  }
  if (category && id) {
    console.log('NUEVO LOG 4 *************************************************************************************');
    // Cargar el JSON de la categoría
    const dataPath = path.join(__dirname, `public/data/datos_${category}.json`);
    if (fs.existsSync(dataPath)) {
      const dataRaw = fs.readFileSync(dataPath, 'utf-8');
      let data;
      try {
        data = JSON.parse(dataRaw);
      } catch (e) {
        data = dataRaw.recommendations || dataRaw;
      }
      // Soportar tanto array plano como { recommendations: [...] }
      const items = Array.isArray(data) ? data : data.recommendations || [];
      initialItem = items.find(item => String(item.id) === id);
      console.log('SSR detalle:', { url: req.url, category, id, found: !!initialItem, initialItem });
    } else {
      console.log('SSR detalle: archivo de datos no encontrado', { url: req.url, category, id, dataPath });
    }
  }
  console.log('NUEVO LOG 6 *************************************************************************************');
  console.log('SSR: antes de render', { url: req.url, lang, initialItem });
  // Pasar initialItem al render
  const { html, head } = render(req.url, lang, initialItem);
  console.log('SSR: después de render', { url: req.url, lang, initialItem, head });
  template = template
    .replace('<!--app-head-->', head || '')
    .replace('<!--app-html-->', html);
  // Log detallado para depuración SSR HEAD 
  console.log('SSR HEAD DEBUG:', { url: req.url, head });
  console.log('NUEVO LOG 7 *************************************************************************************');
  res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
});

// ¡NO uses app.listen en Vercel!
export default app; 