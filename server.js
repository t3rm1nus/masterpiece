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
  req.url = req.url.replace(/^\/[a-z]{2}(?:-[A-Z]{2})?(?=\/assets\/)/, '');
  next();
});

// Servir archivos estáticos desde dist/client (build de producción)
app.use(express.static(resolve('dist/client')));

// Servir archivos estáticos desde public (para desarrollo)
app.use(express.static(path.join(process.cwd(), 'public')));

// SSR handler
app.get('*', async (req, res) => {
  let template = fs.readFileSync(path.join(process.cwd(), 'dist/client/index.html'), 'utf-8');
  const render = (await import('./dist/server/entry-server.js')).render;
  const lang = req.url.startsWith('/en/') ? 'en' : 'es';

  // Detectar si es una URL de detalle
  const match = req.url.match(/^\/detalle\/(\w+)\/(\d+)/);
  let initialItem = null;
  if (match) {
    const category = match[1];
    const id = match[2];
    // Cargar el JSON de la categoría
    const dataPath = path.join(process.cwd(), `public/data/datos_${category}.json`);
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
    }
  }

  // Pasar initialItem al render
  const { html, head } = render(req.url, lang, initialItem);
  template = template
    .replace('<!--app-head-->', head || '')
    .replace('<!--app-html-->', html);
  res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`SSR server running at http://localhost:${port}`);
}); 