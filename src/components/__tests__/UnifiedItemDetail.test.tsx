import { render } from '@testing-library/react';
import UnifiedItemDetail from '../UnifiedItemDetail';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from "../../LanguageContext";
import MaterialThemeProvider from "../MaterialThemeProvider";

describe('UnifiedItemDetail', () => {
  it('renderiza sin errores', () => {
    render(
      <MemoryRouter>
        <LanguageProvider>
          <MaterialThemeProvider>
            <UnifiedItemDetail item={{ title: 'Test', category: 'movies', id: 1 }} onClose={() => {}} />
          </MaterialThemeProvider>
        </LanguageProvider>
      </MemoryRouter>
    );
  });
}); 