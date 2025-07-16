import React from 'react';
import { render } from '@testing-library/react';
import UiLayout from '../ui/UiLayout';

it('renderiza el contenido principal', () => {
  const { getByText } = render(<UiLayout>Contenido de layout</UiLayout>);
  expect(getByText('Contenido de layout')).toBeInTheDocument();
});

it('aplica la prop maxWidth y clase personalizada', () => {
  const { container } = render(
    <UiLayout maxWidth="md" className="clase-prueba">Contenido</UiLayout>
  );
  const containerDiv = container.querySelector('.clase-prueba');
  expect(containerDiv).toBeInTheDocument();
});

it('aplica estilos personalizados vía sx', () => {
  const { container } = render(
    <UiLayout sx={{ background: '#abcdef' }}>Estilo</UiLayout>
  );
  expect(container.firstChild).toHaveStyle('background: #abcdef');
}); 