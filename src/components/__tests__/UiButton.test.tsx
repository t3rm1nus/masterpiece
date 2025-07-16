import React from 'react';
import { render } from '@testing-library/react';
import UiButton from '../ui/UiButton';

it('renderiza el texto del botón', () => {
  const { getByText } = render(<UiButton>Botón principal</UiButton>);
  expect(getByText('Botón principal')).toBeInTheDocument();
});

it('aplica la variante outlined y tamaño large', () => {
  const { getByRole } = render(<UiButton variant="outlined" size="large">Outlined</UiButton>);
  const button = getByRole('button');
  expect(button).toHaveTextContent('Outlined');
  expect(button).toHaveClass('MuiButton-outlined');
});

it('muestra el icono si se pasa como prop', () => {
  const { getByTestId } = render(
    <UiButton icon={<span data-testid="icono">icono</span>}>Con icono</UiButton>
  );
  expect(getByTestId('icono')).toBeInTheDocument();
});

it('aplica estilos personalizados vía sx', () => {
  const { getByRole } = render(
    <UiButton sx={{ background: '#123456' }}>Estilo</UiButton>
  );
  const button = getByRole('button');
  expect(button).toHaveStyle('background: #123456');
}); 