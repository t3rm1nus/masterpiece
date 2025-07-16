import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import MobileItemDetail from '../MobileItemDetail';

const theme = createTheme();

describe('MobileItemDetail', () => {
  const defaultProps = {
    selectedItem: {
      id: '1',
      title: 'Test Item',
      category: 'movies',
      year: '2023',
      rating: 4.5,
      description: 'Test description',
      image: 'test.jpg',
    },
    trailerUrl: 'https://youtube.com/watch?v=test',
    lang: 'es',
    t: (key: string) => key,
    goToHowToDownload: jest.fn(),
    onOverlayNavigate: jest.fn(),
  };

  const renderWithProviders = (props = {}) => {
    return render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <MobileItemDetail {...defaultProps} {...props} />
        </ThemeProvider>
      </MemoryRouter>
    );
  };

  it('renderiza el detalle correctamente', () => {
    renderWithProviders();
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('acepta props adicionales', () => {
    renderWithProviders({ customProp: 'value' });
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('renderiza correctamente con props mínimos', () => {
    renderWithProviders();
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('no crashea si no hay selectedItem', () => {
    renderWithProviders({ selectedItem: undefined });
    // El componente puede renderizar algo o no, pero no debe crashear
    expect(document.body).toBeInTheDocument();
  });

  it('no crashea si faltan callbacks', () => {
    renderWithProviders({ 
      goToHowToDownload: undefined,
      onOverlayNavigate: undefined 
    });
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('renderiza elementos del detalle', () => {
    renderWithProviders();
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renderiza botón de descarga', () => {
    renderWithProviders();
    expect(screen.getByText('Descargar')).toBeInTheDocument();
  });

  it('renderiza imagen del item', () => {
    renderWithProviders();
    const image = screen.getByAltText('Test Item');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test.jpg');
  });
}); 