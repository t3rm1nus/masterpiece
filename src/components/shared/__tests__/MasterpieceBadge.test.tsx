import React from 'react';
import { render } from '@testing-library/react';
import MasterpieceBadge from '../MasterpieceBadge';

describe('MasterpieceBadge', () => {
  it('renderiza el badge correctamente', () => {
    const { getByAltText } = render(<MasterpieceBadge />);
    expect(getByAltText(/obra maestra/i)).toBeInTheDocument();
  });
  it('acepta props adicionales', () => {
    const { getByAltText } = render(<MasterpieceBadge alt="Test Badge" />);
    expect(getByAltText('Test Badge')).toBeInTheDocument();
  });
  it('renderiza correctamente con props mínimos', () => {
    render(<MasterpieceBadge />);
  });
}); 