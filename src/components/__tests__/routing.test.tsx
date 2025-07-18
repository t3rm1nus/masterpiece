import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import HomePage from '../HomePage';
import UnifiedItemDetail from '../UnifiedItemDetail';
import { LanguageProvider } from "../../LanguageContext";
import MaterialThemeProvider from "../MaterialThemeProvider";
import { HelmetProvider } from 'react-helmet-async';
import { act } from 'react';

describe('Routing', () => {
  it('renderiza HomePage en la ruta /', async () => {
    await act(async () => {
      render(
        <HelmetProvider>
          <LanguageProvider>
            <MaterialThemeProvider>
              <MemoryRouter initialEntries={['/']}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                </Routes>
              </MemoryRouter>
            </MaterialThemeProvider>
          </LanguageProvider>
        </HelmetProvider>
      );
    });
    expect(screen.getAllByText(/Nuevas Recomendaciones/i).length).toBeGreaterThan(0);
  });

  it('renderiza UnifiedItemDetail en la ruta /detalle/:cat/:id', async () => {
    await act(async () => {
      render(
        <HelmetProvider>
          <LanguageProvider>
            <MaterialThemeProvider>
              <MemoryRouter initialEntries={['/detalle/movies/1']}>
                <Routes>
                  <Route path="/detalle/:cat/:id" element={<UnifiedItemDetail item={{ id: 1, title: 'Test', category: 'movies' }} onClose={() => {}} />} />
                </Routes>
              </MemoryRouter>
            </MaterialThemeProvider>
          </LanguageProvider>
        </HelmetProvider>
      );
    });
    expect(screen.getAllByText(/Test/i).length).toBeGreaterThan(0);
  });
}); 