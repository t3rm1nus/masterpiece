import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../../LanguageContext';
import MaterialThemeProvider from '../MaterialThemeProvider';
import CoffeePage from '../CoffeePage';

describe('CoffeePage', () => {
  test('renderiza sin errores', () => {
    render(
      <HelmetProvider>
        <LanguageProvider>
          <MaterialThemeProvider>
            <MemoryRouter>
              <CoffeePage />
            </MemoryRouter>
          </MaterialThemeProvider>
        </LanguageProvider>
      </HelmetProvider>
    );
  });
}); 