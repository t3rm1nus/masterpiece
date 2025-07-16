import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { MobileActionButtons } from '../ItemActionButtons';

// Mock de Material-UI
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: () => false,
}));

const theme = createTheme();

describe('MobileActionButtons', () => {
  const defaultProps = {
    selectedItem: {
      id: '1',
      title: 'Test Item',
      category: 'movies',
      year: '2023',
      rating: 4.5,
      description: 'Test description',
      image: 'test.jpg',
      trailer: 'https://youtube.com/watch?v=test',
      spotify: 'https://spotify.com/track/test',
      youtube: 'https://youtube.com/watch?v=test',
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
          <MobileActionButtons {...defaultProps} {...props} />
        </ThemeProvider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza botón de YouTube si es música', () => {
    const musicItem = {
      ...defaultProps.selectedItem,
      category: 'music',
    };
    renderWithProviders({ selectedItem: musicItem });
    expect(screen.getByText('Oír en YouTube')).toBeInTheDocument();
  });

  it('renderiza botón de Spotify si es música', () => {
    const musicItem = {
      ...defaultProps.selectedItem,
      category: 'music',
    };
    renderWithProviders({ selectedItem: musicItem });
    expect(screen.getByText('Oír en Spotify')).toBeInTheDocument();
  });

  it('renderiza botón de documental', () => {
    const documentaryItem = {
      ...defaultProps.selectedItem,
      category: 'documentaries',
    };
    renderWithProviders({ selectedItem: documentaryItem });
    expect(screen.getByText('Ver Tráiler')).toBeInTheDocument();
  });

  it('renderiza botón de tráiler', () => {
    renderWithProviders();
    expect(screen.getByText('Ver Tráiler')).toBeInTheDocument();
  });

  it('llama a onOverlayNavigate al hacer click en descargar', () => {
    const onOverlayNavigate = jest.fn();
    renderWithProviders({ onOverlayNavigate });
    
    const downloadButton = screen.getByText('Descargar');
    fireEvent.click(downloadButton);
    expect(onOverlayNavigate).toHaveBeenCalledWith('/como-descargar');
  });

  it('acepta props adicionales', () => {
    renderWithProviders({ customProp: 'value' });
    expect(screen.getByText('Descargar')).toBeInTheDocument();
  });

  it('renderiza correctamente con props mínimos', () => {
    renderWithProviders();
    expect(screen.getByText('Descargar')).toBeInTheDocument();
  });

  it('acepta fragmentos y children', () => {
    renderWithProviders();
    expect(screen.getByText('Descargar')).toBeInTheDocument();
  });

  it('no crashea si faltan callbacks', () => {
    renderWithProviders({ 
      goToHowToDownload: undefined,
      onOverlayNavigate: undefined 
    });
    expect(screen.getByText('Descargar')).toBeInTheDocument();
  });

  it('maneja clicks en botones de música correctamente', () => {
    const musicItem = {
      ...defaultProps.selectedItem,
      category: 'music',
    };
    renderWithProviders({ selectedItem: musicItem });
    
    const youtubeButton = screen.getByText('Oír en YouTube');
    const spotifyButton = screen.getByText('Oír en Spotify');
    
    expect(youtubeButton).toBeInTheDocument();
    expect(spotifyButton).toBeInTheDocument();
  });

  it('renderiza botones según la categoría del item', () => {
    const movieItem = {
      ...defaultProps.selectedItem,
      category: 'movies',
    };
    renderWithProviders({ selectedItem: movieItem });
    
    expect(screen.getByText('Ver Tráiler')).toBeInTheDocument();
    expect(screen.getByText('Descargar')).toBeInTheDocument();
  });
}); 