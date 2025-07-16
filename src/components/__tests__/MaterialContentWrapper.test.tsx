import React from 'react';
import { render } from '@testing-library/react';
import MaterialContentWrapper from '../MaterialContentWrapper';

describe('MaterialContentWrapper', () => {
  it('renderiza sin errores con props mínimos', () => {
    render(<MaterialContentWrapper />);
  });
  // Eliminar tests de children/fragmentos si existen
}); 