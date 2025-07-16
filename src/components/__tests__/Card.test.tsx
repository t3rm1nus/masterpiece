import React from 'react';
import { render } from '@testing-library/react';
import Card from '../ui/Card';

it('renderiza el contenido principal', () => {
  const { getByText } = render(<Card>Contenido de la tarjeta</Card>);
  expect(getByText('Contenido de la tarjeta')).toBeInTheDocument();
});

it('aplica atributos HTML adicionales', () => {
  const { container } = render(<Card id="card-id">Con id</Card>);
  expect(container.firstChild).toHaveAttribute('id', 'card-id');
}); 