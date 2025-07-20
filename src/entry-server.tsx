import React from 'react';
import { renderToString } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';

export function render(url: string, lang: string, initialItem?: any) {
  // Crear un contexto para Helmet
  const helmetContext: any = {};
  const app = (
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App initialLang={lang} initialItem={initialItem} />
      </StaticRouter>
    </HelmetProvider>
  );
  const html = renderToString(app);
  // Recoger las meta tags de Helmet
  const { helmet } = helmetContext;
  return {
    html,
    head: helmet ? `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}` : '',
  };
} 