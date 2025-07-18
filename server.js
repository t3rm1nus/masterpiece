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

// Servir estáticos
app.use(express.static(resolve('dist/client')));

// SSR handler
app.get('*', async (req, res) => {
  let template = fs.readFileSync(path.join(process.cwd(), 'dist/client/index.html'), 'utf-8');
  const render = (await import('./dist/server/entry-server.js')).render;
  // Detectar idioma por la URL
  const lang = req.url.startsWith('/en/') ? 'en' : 'es';
  const { html, head } = render(req.url, lang);
  template = template
    .replace('<!--app-head-->', head || '')
    .replace('<!--app-html-->', html);
  res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`SSR server running at http://localhost:${port}`);
}); 