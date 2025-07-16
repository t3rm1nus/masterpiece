import React from 'react';
import { render } from '@testing-library/react';
import MaterialThemeProvider from '../MaterialThemeProvider';

describe('MaterialThemeProvider', () => {
  it('renderiza correctamente con fragment y sin props', () => {
    const { container } = render(
      <MaterialThemeProvider>
        <>
          <div>Uno</div>
          <div>Dos</div>
        </>
      </MaterialThemeProvider>
    );
    expect(container).toBeInTheDocument();
  });
}); 