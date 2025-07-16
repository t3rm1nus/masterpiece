import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import HomeLayout from '../HomeLayout';

// Mock de los hooks de navegación
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' }),
}));

// Mock de los componentes hijos
jest.mock('../UnifiedItemDetail', () => {
  return function MockUnifiedItemDetail() {
    return <div>Mock UnifiedItemDetail</div>;
  };
});

jest.mock('../HomePage', () => {
  return function MockHomePage() {
    return <div>Mock HomePage</div>;
  };
});

jest.mock('../HybridMenu', () => {
  return function MockHybridMenu() {
    return <div>Mock HybridMenu</div>;
  };
});

jest.mock('../../pages/HowToDownload', () => {
  return function MockHowToDownload() {
    return <div>Mock HowToDownload</div>;
  };
});

jest.mock('../CoffeePage', () => {
  return function MockCoffeePage() {
    return <div>Mock CoffeePage</div>;
  };
});

jest.mock('../WelcomePopup', () => {
  return function MockWelcomePopup() {
    return <div>Mock WelcomePopup</div>;
  };
});

jest.mock('../MaterialMobileMenu', () => {
  return function MockMaterialMobileMenu() {
    return <div>Mock MaterialMobileMenu</div>;
  };
});

const theme = createTheme();

describe('HomeLayout', () => {
  const renderWithProviders = () => {
    return render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <HomeLayout />
        </ThemeProvider>
      </MemoryRouter>
    );
  };

  it('renderiza correctamente', () => {
    renderWithProviders();
    expect(screen.getByText('Mock HybridMenu')).toBeInTheDocument();
    expect(screen.getByText('Mock MaterialMobileMenu')).toBeInTheDocument();
    expect(screen.getByText('Mock HomePage')).toBeInTheDocument();
  });

  it('renderiza el layout completo', () => {
    renderWithProviders();
    expect(document.body).toBeInTheDocument();
  });

  it('renderiza componentes principales', () => {
    renderWithProviders();
    expect(screen.getByText('Mock HybridMenu')).toBeInTheDocument();
  });

  it('renderiza menú móvil', () => {
    renderWithProviders();
    expect(screen.getByText('Mock MaterialMobileMenu')).toBeInTheDocument();
  });

  it('renderiza página principal por defecto', () => {
    renderWithProviders();
    expect(screen.getByText('Mock HomePage')).toBeInTheDocument();
  });

  it('no crashea al renderizar', () => {
    expect(() => renderWithProviders()).not.toThrow();
  });

  it('renderiza estructura básica', () => {
    renderWithProviders();
    expect(document.querySelector('div')).toBeInTheDocument();
  });
}); 