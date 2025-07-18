import React from 'react';
import { renderToString } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';

export function render(url: string, lang: string) {
  const helmetContext = {};
  const app = (
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App initialLang={lang} />
      </StaticRouter>
    </HelmetProvider>
  );
  const html = renderToString(app);
  // HelmetContext contiene head/meta tags
  // @ts-ignore
  const { helmet } = helmetContext;
  return {
    html,
    head: helmet ? `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}` : '',
  };
} 