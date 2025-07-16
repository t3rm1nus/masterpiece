import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MaterialMobileMenu from '../MaterialMobileMenu';

describe('MaterialMobileMenu', () => {
  it('renderiza sin errores con props mínimos', () => {
    render(
      <MemoryRouter>
        <MaterialMobileMenu />
      </MemoryRouter>
    );
  });
  // Puedes agregar más tests específicos si configuras los menuItems o callbacks válidos
}); 