import React from 'react';
import { renderToString } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';

export function render(url: string, lang: string, initialItem?: any) {
  if (typeof window === 'undefined') {
    console.log('SSR render ejecutado', { url, lang, initialItem });
  }
  // Crear un contexto para Helmet
  const helmetContext: any = {};
  const app = (
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App initialLang={lang} initialItem={initialItem} helmetContext={helmetContext} />
      </StaticRouter>
    </HelmetProvider>
  );
  console.log('SSR: ANTES DE renderToString', { url, lang, initialItem });
  const html = renderToString(app);
  // Recoger las meta tags de Helmet
  const { helmet } = helmetContext;
  let head = helmet ? `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}` : '';
  // --- FIX: Forzar head por defecto en la home si está vacío ---
  if ((!head || head.trim() === '') && url === '/') {
    head = `
      <title>Masterpiece - Recomendaciones culturales</title>
      <meta name="description" content="Descubre las mejores recomendaciones de películas, cómics, libros, música, videojuegos, juegos de mesa y podcasts." />
      <meta property="og:title" content="Masterpiece - Recomendaciones culturales" />
      <meta property="og:description" content="Descubre las mejores recomendaciones de películas, cómics, libros, música, videojuegos, juegos de mesa y podcasts." />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://masterpiece.es/imagenes/splash_image.png" />
      <meta property="og:url" content="https://masterpiece.es/" />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href="https://masterpiece.es/" />
      <meta name="ssr-debug-home" content="SSR_HELMET_HOME_OK" />
    `;
  }
  // LOGS para depuración SSR
  console.log('SSR: DESPUÉS DE renderToString', { url, lang, initialItem, head });
  if (!head) {
    console.warn('⚠️ SSR: HEAD está vacío para', url);
  } else {
    console.log('✅ SSR: HEAD generado para', url);
  }
  return {
    html,
    head,
  };
} 