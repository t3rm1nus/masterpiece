import React from 'react';
import { render } from '@testing-library/react';
import UiCard from '../ui/UiCard';

// Test básico de renderizado
it('renderiza el contenido principal', () => {
  const { getByText } = render(<UiCard>Contenido principal</UiCard>);
  expect(getByText('Contenido principal')).toBeInTheDocument();
});

it('renderiza header, media, actions y footer', () => {
  const { getByText, getByAltText } = render(
    <UiCard
      header="Título"
      media={<img src="/img.jpg" alt="imagen" />}
      actions={<button>Acción</button>}
      footer={<span>Pie</span>}
    >
      Contenido
    </UiCard>
  );
  expect(getByText('Título')).toBeInTheDocument();
  expect(getByAltText('imagen')).toBeInTheDocument();
  expect(getByText('Acción')).toBeInTheDocument();
  expect(getByText('Pie')).toBeInTheDocument();
  expect(getByText('Contenido')).toBeInTheDocument();
});

it('aplica estilos personalizados y color de fondo', () => {
  const { container } = render(
    <UiCard color="#123456" style={{ border: '1px solid red' }}>Color test</UiCard>
  );
  const card = container.querySelector('.mp-ui-card');
  expect(card).toHaveStyle('background: #123456');
  expect(card).toHaveStyle('border: 1px solid red');
}); 