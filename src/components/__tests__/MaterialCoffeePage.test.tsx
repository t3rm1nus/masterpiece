import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import MaterialCoffeePage from '../MaterialCoffeePage';

describe('MaterialCoffeePage', () => {
  it('renderiza sin errores con props mínimos', () => {
    render(
      <HelmetProvider>
        <MaterialCoffeePage />
      </HelmetProvider>
    );
  });
  // Eliminar tests de children/fragmentos si existen
}); 