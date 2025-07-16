import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import HybridMenu from '../HybridMenu';

// Mock de los hooks de navegación
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' }),
}));

// Mock de Material-UI
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: () => false, // Simula desktop
}));

// Mock de los hooks de la aplicación
jest.mock('../../store/useAppStore', () => ({
  useAppData: () => ({
    resetAllFilters: jest.fn(),
    generateNewRecommendations: jest.fn(),
  }),
  useAppView: () => ({
    currentView: 'home',
    goBackFromDetail: jest.fn(),
    goBackFromCoffee: jest.fn(),
    goHome: jest.fn(),
    goToCoffee: jest.fn(),
    goToHowToDownload: jest.fn(),
  }),
}));

// Mock del hook useMenuItems
jest.mock('../../hooks/useMenuItems', () => ({
  useMenuItems: () => [
    {
      label: 'Nuevas Recomendaciones',
      icon: <span>🏠</span>,
      action: jest.fn(),
      show: true,
      path: '/',
    },
    {
      label: '¿Cómo descargar?',
      icon: <span>📥</span>,
      action: jest.fn(),
      show: true,
      path: '/como-descargar',
    },
  ],
}));

const theme = createTheme();

describe('HybridMenu', () => {
  const defaultProps = {
    onSplashOpen: jest.fn(),
    onOverlayNavigate: jest.fn(),
  };

  const renderWithProviders = (props = {}) => {
    return render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <HybridMenu {...defaultProps} {...props} />
        </ThemeProvider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza correctamente con props básicos', () => {
    renderWithProviders();
    expect(screen.getByText('Nuevas Recomendaciones')).toBeInTheDocument();
    expect(screen.getByText('¿Cómo descargar?')).toBeInTheDocument();
  });

  it('llama a onOverlayNavigate al hacer click en Nuevas Recomendaciones', () => {
    const onOverlayNavigate = jest.fn();
    renderWithProviders({ onOverlayNavigate });
    
    const homeButton = screen.getByText('Nuevas Recomendaciones');
    fireEvent.click(homeButton);
    expect(onOverlayNavigate).toHaveBeenCalledWith('/');
  });

  it('llama a onOverlayNavigate al hacer click en ¿Cómo descargar?', () => {
    const onOverlayNavigate = jest.fn();
    renderWithProviders({ onOverlayNavigate });
    
    const downloadButton = screen.getByText('¿Cómo descargar?');
    fireEvent.click(downloadButton);
    expect(onOverlayNavigate).toHaveBeenCalledWith('/como-descargar');
  });

  it('renderiza correctamente sin props', () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <HybridMenu />
        </ThemeProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('Nuevas Recomendaciones')).toBeInTheDocument();
  });

  it('renderiza con props adicionales', () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <HybridMenu 
            onSplashOpen={jest.fn()} 
            onOverlayNavigate={jest.fn()}
            sx={{ menu: { background: '#f0f0f0' } }}
          />
        </ThemeProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('Nuevas Recomendaciones')).toBeInTheDocument();
  });

  it('maneja clicks en botones correctamente', () => {
    const onOverlayNavigate = jest.fn();
    renderWithProviders({ onOverlayNavigate });
    
    const downloadButton = screen.getByText('¿Cómo descargar?');
    fireEvent.click(downloadButton);
    expect(onOverlayNavigate).toHaveBeenCalledWith('/como-descargar');
  });

  it('renderiza elementos de navegación', () => {
    renderWithProviders();
    expect(screen.getByText('Nuevas Recomendaciones')).toBeInTheDocument();
    expect(screen.getByText('¿Cómo descargar?')).toBeInTheDocument();
  });

  it('acepta props opcionales', () => {
    renderWithProviders({ 
      onSplashOpen: jest.fn(),
      onOverlayNavigate: jest.fn(),
      sx: { menu: { background: '#fff' } }
    });
    expect(screen.getByText('Nuevas Recomendaciones')).toBeInTheDocument();
  });

  it('renderiza correctamente con menuItems personalizados', () => {
    const customMenuItems = [
      {
        label: 'Menú Personalizado',
        icon: <span>🎯</span>,
        action: jest.fn(),
        show: true,
        path: '/custom',
      },
    ];

    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <HybridMenu menuItems={customMenuItems} onOverlayNavigate={jest.fn()} />
        </ThemeProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('Menú Personalizado')).toBeInTheDocument();
  });
}); 