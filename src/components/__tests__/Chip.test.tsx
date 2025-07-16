import React from 'react';
import { render } from '@testing-library/react';
import Chip from '../ui/Chip';

it('renderiza el label correctamente', () => {
  const { getByText } = render(<Chip label="Drama" />);
  expect(getByText('Drama')).toBeInTheDocument();
});

it('renderiza el icono si se pasa como prop', () => {
  const { getByTestId } = render(<Chip icon={<span data-testid="icono">icono</span>} label="Con icono" />);
  expect(getByTestId('icono')).toBeInTheDocument();
});

it('aplica la variante outlined', () => {
  const { getByText } = render(<Chip label="Outlined" variant="outlined" />);
  const chip = getByText('Outlined').parentElement;
  expect(chip).toHaveStyle({ border: expect.stringMatching(/1.5px solid currentcolor|1.5px solid rgb/i) });
});

it('aplica el estado selected', () => {
  const { getByText } = render(<Chip label="Seleccionado" selected />);
  const chip = getByText('Seleccionado').parentElement;
  expect(chip).toHaveStyle({ background: expect.stringMatching(/#0078d4|rgb\(0, 120, 212\)/) });
  // El color puede variar según el navegador/MUI, así que no lo comprobamos estrictamente
});

it('renderiza children si no hay label', () => {
  const { getByText } = render(<Chip>Contenido hijo</Chip>);
  expect(getByText('Contenido hijo')).toBeInTheDocument();
});

it('aplica estilos personalizados vía sx', () => {
  const { getByText } = render(<Chip label="Estilo" sx={{ background: '#123456' }} />);
  const chip = getByText('Estilo').parentElement;
  expect(chip).toHaveStyle({ background: expect.stringMatching(/#123456|rgb\(18, 52, 86\)/) });
}); 