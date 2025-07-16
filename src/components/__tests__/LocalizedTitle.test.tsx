import React from 'react';
import { render } from '@testing-library/react';
import LocalizedTitle from '../LocalizedTitle';

describe('LocalizedTitle', () => {
  it('renderiza el título con el texto correcto', () => {
    const { getByText } = render(<LocalizedTitle title="Hola mundo" />);
    expect(getByText('Hola mundo')).toBeInTheDocument();
  });

  it('aplica el atributo lang correctamente', () => {
    const { getByText } = render(<LocalizedTitle title="Hello" lang="en" />);
    expect(getByText('Hello').getAttribute('lang')).toBe('en');
  });
}); 