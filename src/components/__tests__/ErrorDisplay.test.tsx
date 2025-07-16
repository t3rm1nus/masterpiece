import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorDisplay from '../ErrorDisplay';

describe('ErrorDisplay', () => {
  test('muestra el mensaje de error', () => {
    render(<ErrorDisplay message="Error fatal" open={true} />);
    expect(screen.getByText(/Error fatal/i)).toBeInTheDocument();
  });
}); 