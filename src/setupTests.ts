// Mock global para window.scrollTo en entorno de test
if (typeof window !== 'undefined' && !window.scrollTo) {
  window.scrollTo = jest.fn();
}

// Mock robusto para document.body y sus métodos/props usados por Emotion/MUI
defineDocumentBodyForSSR();
function defineDocumentBodyForSSR() {
  if (typeof document !== 'undefined') {
    if (!document.body) {
      Object.defineProperty(document, 'body', {
        value: document.createElement('body'),
        writable: true,
      });
    }
    if (!document.body.setAttribute) {
      document.body.setAttribute = () => {};
    }
    if (!document.body.style) {
      Object.defineProperty(document.body, 'style', {
        value: {},
        writable: true,
      });
    }
  }
}

// Polyfill para TextEncoder/TextDecoder en Node.js
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// Si usas @testing-library/jest-dom, inclúyelo aquí también
import '@testing-library/jest-dom';

// Mock para fetch de rutas relativas en entorno de test
const originalFetch = global.fetch;
// @ts-ignore
global.fetch = ((input: any, init?: any) => {
  if (typeof input === 'string' && input.startsWith('/')) {
    // Devuelve un objeto plano simulando la respuesta de fetch
    return Promise.resolve({
      ok: true,
      status: 200,
      json: async () => ({}),
      text: async () => '',
      blob: async () => new Blob(),
      arrayBuffer: async () => new ArrayBuffer(0),
    }) as Promise<any>;
  }
  return originalFetch(input, init);
}) as (input: any, init?: any) => Promise<any>; 