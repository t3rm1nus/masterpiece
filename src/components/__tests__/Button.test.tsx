import React from 'react';
import { render } from '@testing-library/react';
import Button from '../ui/Button';

it('renderiza el texto del botón', () => {
  const { getByText } = render(<Button>Botón</Button>);
  expect(getByText('Botón')).toBeInTheDocument();
});

it('aplica la variante danger', () => {
  const { getByText } = render(<Button variant="danger">Peligro</Button>);
  const button = getByText('Peligro');
  expect(button).toHaveStyle('background: #d32f2f');
  expect(button).toHaveStyle('color: #fff');
});

it('aplica el estado disabled', () => {
  const { getByText } = render(<Button disabled>Deshabilitado</Button>);
  const button = getByText('Deshabilitado');
  expect(button).toBeDisabled();
  expect(button).toHaveStyle('opacity: 0.6');
});

it('aplica atributos HTML adicionales', () => {
  const { getByText } = render(<Button id="btn-id">Con id</Button>);
  expect(getByText('Con id')).toHaveAttribute('id', 'btn-id');
}); 