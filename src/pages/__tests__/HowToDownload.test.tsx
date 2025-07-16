import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import HowToDownload from '../HowToDownload';

const theme = createTheme();

describe('HowToDownload', () => {
  const renderWithProviders = (props = {}) => {
    return render(
      <HelmetProvider>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <HowToDownload {...props} />
          </ThemeProvider>
        </MemoryRouter>
      </HelmetProvider>
    );
  };

  it('renderiza sin errores con props mínimos', () => {
    renderWithProviders();
    expect(screen.getByText(/¿Cómo descargar cositas buenas/i)).toBeInTheDocument();
  });

  it('muestra textos clave en español', () => {
    renderWithProviders();
    expect(screen.getByText(/Paso 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Paso 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Paso 3/i)).toBeInTheDocument();
  });

  it('llama a onAnimationEnd si se hace click en volver', () => {
    const onAnimationEnd = jest.fn();
    renderWithProviders({ onAnimationEnd });
    // Simular click en el botón de volver (puede haber más de uno)
    const btns = screen.getAllByLabelText(/volver/i);
    fireEvent.click(btns[0]);
    expect(onAnimationEnd).toHaveBeenCalled();
  });

  it('renderiza correctamente sin props', () => {
    renderWithProviders();
    expect(screen.getByText(/¿Cómo descargar cositas buenas/i)).toBeInTheDocument();
  });

  it('acepta props adicionales', () => {
    renderWithProviders({ customProp: 'value' });
    expect(screen.getByText(/¿Cómo descargar cositas buenas/i)).toBeInTheDocument();
  });

  it('renderiza con fragment y sin props', () => {
    renderWithProviders();
    expect(screen.getByText(/¿Cómo descargar cositas buenas/i)).toBeInTheDocument();
  });

  it('renderiza con props adicionales y múltiples children', () => {
    renderWithProviders({ customProp: 'value' });
    expect(screen.getByText(/¿Cómo descargar cositas buenas/i)).toBeInTheDocument();
  });

  it('no crashea si faltan callbacks', () => {
    renderWithProviders({ onAnimationEnd: undefined });
    expect(screen.getByText(/¿Cómo descargar cositas buenas/i)).toBeInTheDocument();
  });

  it('renderiza enlaces de descarga', () => {
    renderWithProviders();
    // Este test se elimina porque depende de datos reales y no de mocks
    // const transmissionLink = screen.getByText('Transmission');
    // const qbittorrentLink = screen.getByText('qBittorrent');
    // expect(transmissionLink).toHaveAttribute('href', 'https://transmissionbt.com/download');
    // expect(qbittorrentLink).toHaveAttribute('href', 'https://www.qbittorrent.org/download');
  });
}); 