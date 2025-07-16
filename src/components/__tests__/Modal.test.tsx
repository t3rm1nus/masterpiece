import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Modal from '../ui/Modal';

it('no renderiza si open es false', () => {
  const { queryByText } = render(<Modal open={false}>No visible</Modal>);
  expect(queryByText('No visible')).toBeNull();
});

it('renderiza el contenido, título y acciones cuando open es true', () => {
  const { getByText } = render(
    <Modal open title="Título modal" actions={<button>Acción</button>}>
      Contenido modal
    </Modal>
  );
  expect(getByText('Título modal')).toBeInTheDocument();
  expect(getByText('Contenido modal')).toBeInTheDocument();
  expect(getByText('Acción')).toBeInTheDocument();
});

it('ejecuta onClose al hacer click en el backdrop', () => {
  const onClose = jest.fn();
  const { getByText } = render(
    <Modal open onClose={onClose}>Contenido</Modal>
  );
  // El backdrop es el primer Box, así que hacemos click en el padre del modal
  fireEvent.click(getByText('Contenido').parentElement!.parentElement!);
  expect(onClose).toHaveBeenCalled();
});

it('aplica estilos personalizados vía sx', () => {
  const { getByText } = render(
    <Modal open sx={{ modal: { background: '#123456' } }}>Estilo</Modal>
  );
  // El modal es el padre directo del contenido
  expect(getByText('Estilo').parentElement).toHaveStyle('background: #123456');
}); 