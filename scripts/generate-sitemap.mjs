import fs from 'fs';
import path from 'path';

const baseUrl = 'https://masterpiece.com';
const dataDir = path.join(process.cwd(), 'src', 'data');
const output = path.join(process.cwd(), 'public', 'sitemap.xml');
const textsPath = path.join(dataDir, 'texts.json');

const staticRoutes = [
  '/',
  '/como-descargar',
  '/donaciones',
];

function getFiles(dir) {
  return fs.readdirSync(dir).filter(f => f.startsWith('datos_') && f.endsWith('.json'));
}

function getUrlsFromFile(file) {
  const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
  const json = JSON.parse(content);
  const key = Object.keys(json).find(k => Array.isArray(json[k]));
  if (!key) return [];
  return json[key].map(item => {
    const category = item.category || item.categoria || file.replace('datos_', '').replace('.json', '');
    return `/${category}/${item.id}`;
  });
}

function getCategoryRoutes() {
  const texts = JSON.parse(fs.readFileSync(textsPath, 'utf-8'));
  const categories = texts.es?.categories || texts.categories || {};
  return Object.keys(categories).map(cat => `/${cat}`);
}

function buildSitemap(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url>\n    <loc>${baseUrl}${url}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`).join('\n')}\n</urlset>\n`;
}

const files = getFiles(dataDir);
let urls = [...staticRoutes, ...getCategoryRoutes()];
for (const file of files) {
  urls = urls.concat(getUrlsFromFile(file));
}

const xml = buildSitemap(urls);
fs.writeFileSync(output, xml, 'utf-8');
console.log('✅ Sitemap generado:', output); 