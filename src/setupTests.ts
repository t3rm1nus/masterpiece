// Mock global para window.scrollTo en entorno de test
if (typeof window !== 'undefined' && !window.scrollTo) {
  window.scrollTo = jest.fn();
}

// Polyfill para TextEncoder/TextDecoder en Node.js
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// Si usas @testing-library/jest-dom, inclúyelo aquí también
import '@testing-library/jest-dom';

if (!global.fetch) {
  global.fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
}

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
    });
  }
  return originalFetch(input, init);
}) as (input: any, init?: any) => Promise<any>; 