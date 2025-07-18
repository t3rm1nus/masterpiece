import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../../LanguageContext';
import MaterialThemeProvider from '../MaterialThemeProvider';
import AppContent from '../AppContent';

describe('AppContent', () => {
  test('renderiza sin errores', () => {
    render(
      <MemoryRouter>
        <LanguageProvider>
          <MaterialThemeProvider>
            <AppContent />
          </MaterialThemeProvider>
        </LanguageProvider>
      </MemoryRouter>
    );
  });
}); 