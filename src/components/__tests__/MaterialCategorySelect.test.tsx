import React from 'react';
import { render } from '@testing-library/react';
import MaterialCategorySelect from '../MaterialCategorySelect';

describe('MaterialCategorySelect', () => {
  it('renderiza sin errores con props mínimos', () => {
    render(<MaterialCategorySelect categories={[]} selectedCategory={null} onCategoryChange={() => {}} />);
  });
  // Eliminar tests de children/fragmentos si existen
}); 