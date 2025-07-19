import React from 'react';
import { renderToString } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';

export function render(url: string, lang: string) {
  const app = (
    <StaticRouter location={url}>
      <App initialLang={lang} />
    </StaticRouter>
  );
  const html = renderToString(app);
  return {
    html,
    head: '',
  };
} 