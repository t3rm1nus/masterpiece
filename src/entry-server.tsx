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
  const head = helmet ? `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}` : '';
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