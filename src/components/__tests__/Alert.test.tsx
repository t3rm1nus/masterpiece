import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Alert from '../ui/Alert';

it('renderiza el contenido principal', () => {
  const { getByText } = render(<Alert>Mensaje de alerta</Alert>);
  expect(getByText('Mensaje de alerta')).toBeInTheDocument();
});

it('renderiza el título y el icono', () => {
  const { getByText, getByTestId } = render(
    <Alert title="Título" icon={<span data-testid="icono">icono</span>}>Contenido</Alert>
  );
  expect(getByText('Título')).toBeInTheDocument();
  expect(getByTestId('icono')).toBeInTheDocument();
});

it('renderiza acciones y ejecuta onClose', () => {
  const onClose = jest.fn();
  const { getByRole } = render(
    <Alert actions={<button>Acción</button>} onClose={onClose}>Alerta</Alert>
  );
  expect(getByRole('button', { name: /cerrar alerta/i })).toBeInTheDocument();
  fireEvent.click(getByRole('button', { name: /cerrar alerta/i }));
  expect(onClose).toHaveBeenCalled();
});

it('no renderiza si visible es false', () => {
  const { queryByText } = render(<Alert visible={false}>No visible</Alert>);
  expect(queryByText('No visible')).toBeNull();
});

it('aplica el tipo de alerta correcto', () => {
  const { container } = render(<Alert type="error">Error</Alert>);
  // Acepta tanto el valor hexadecimal como rgb
  expect(container.firstChild).toHaveStyle({ background: expect.stringMatching(/#ffebee|rgb\(255, 235, 238\)/) });
}); 