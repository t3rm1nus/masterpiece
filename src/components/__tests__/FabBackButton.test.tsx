import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FabBackButton from '../ui/FabBackButton';
import { ArrowBack } from '@mui/icons-material';

describe('FabBackButton', () => {
  it('renderiza el botón por defecto', () => {
    render(<FabBackButton />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('no renderiza si visible es false', () => {
    const { container } = render(<FabBackButton visible={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('usa un icono custom si se provee', () => {
    render(<FabBackButton icon={<ArrowBack data-testid="custom-icon" />} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('usa el aria-label personalizado', () => {
    render(<FabBackButton ariaLabel="regresar" />);
    expect(screen.getByLabelText('regresar')).toBeInTheDocument();
  });

  it('llama a onClick al hacer click', () => {
    const onClick = jest.fn();
    render(<FabBackButton onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
}); 