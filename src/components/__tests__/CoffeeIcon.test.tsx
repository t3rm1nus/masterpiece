import React from 'react';
import { render } from '@testing-library/react';
import CoffeeIcon from '../CoffeeIcon';

describe('CoffeeIcon', () => {
  it('renderiza el SVG correctamente', () => {
    const { container } = render(<CoffeeIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
  });
}); 