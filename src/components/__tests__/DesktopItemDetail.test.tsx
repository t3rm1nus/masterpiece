import { render, screen, fireEvent } from '@testing-library/react';
import DesktopItemDetail from '../shared/DesktopItemDetail';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from "../../LanguageContext";
import MaterialThemeProvider from "../MaterialThemeProvider";

describe('DesktopItemDetail', () => {
  const baseProps = {
    selectedItem: {
      title: 'Test',
      category: 'movies',
      subcategory: 'acción',
      id: 1,
      description: 'Descripción de prueba',
      year: 2022,
      masterpiece: true,
      image: '/test.png'
    },
    title: 'Test',
    description: 'Descripción de prueba',
    lang: 'es',
    t: { categories: { movies: 'Películas' }, subcategories: { accion: 'Acción' } },
    getCategoryTranslation: (cat: string) => cat,
    getSubcategoryTranslation: (sub: string) => sub,
    getTranslation: (key: string, fallback?: string) => fallback || key
  };

  const renderWithProviders = (props = {}) =>
    render(
      <MemoryRouter>
        <LanguageProvider>
          <MaterialThemeProvider>
            <DesktopItemDetail {...baseProps} {...props} />
          </MaterialThemeProvider>
        </LanguageProvider>
      </MemoryRouter>
    );

  it('renderiza sin errores', () => {
    renderWithProviders();
  });

  it('muestra el título y la descripción', () => {
    renderWithProviders();
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Descripción de prueba')).toBeInTheDocument();
  });

  it('renderiza el badge de masterpiece si selectedItem.masterpiece es true', () => {
    renderWithProviders();
    expect(screen.getByTitle('Obra maestra')).toBeInTheDocument();
  });

  it('renderiza chips de categoría y subcategoría', () => {
    renderWithProviders();
    expect(screen.getByText('movies')).toBeInTheDocument();
    expect(screen.getByText('acción')).toBeInTheDocument();
  });

  it('renderiza imagen por defecto', () => {
    renderWithProviders();
    expect(screen.getByAltText('Test')).toBeInTheDocument();
  });

  it('renderiza header, imagen, categoría, subcategoría, descripción, acciones y footer personalizados', () => {
    renderWithProviders({
      renderHeader: () => <div>Header personalizado</div>,
      renderImage: () => <img alt="img personalizada" src="/test.png" />,
      renderCategory: () => <div>Cat personalizada</div>,
      renderSubcategory: () => <div>Sub personalizada</div>,
      renderDescription: () => <div>Descripción personalizada</div>,
      renderActions: () => <div>Acciones personalizadas</div>,
      renderFooter: () => <div>Footer personalizado</div>,
      showSections: { image: true, category: true, subcategory: true, description: true, actions: true, footer: true }
    });
    expect(screen.getByText('Header personalizado')).toBeInTheDocument();
    expect(screen.getByAltText('img personalizada')).toBeInTheDocument();
    expect(screen.getByText('Cat personalizada')).toBeInTheDocument();
    // No se debe esperar 'Sub personalizada' porque renderCategory tiene prioridad
    expect(screen.getByText('Descripción personalizada')).toBeInTheDocument();
    expect(screen.getByText('Acciones personalizadas')).toBeInTheDocument();
    expect(screen.getByText('Footer personalizado')).toBeInTheDocument();
  });

  it('oculta secciones si showSections lo indica', () => {
    renderWithProviders({ showSections: { image: false, category: false, subcategory: false, title: false, description: false, actions: false, footer: false, backButton: false } });
    expect(screen.queryByText('Test')).not.toBeInTheDocument();
    expect(screen.queryByText('Descripción de prueba')).not.toBeInTheDocument();
  });

  it('renderiza el botón de volver y responde al click', () => {
    const onBack = jest.fn();
    renderWithProviders({ onBack });
    const btn = screen.getByLabelText(/volver/i);
    fireEvent.click(btn);
    expect(onBack).toHaveBeenCalled();
  });

  it('renderiza correctamente con props mínimos', () => {
    renderWithProviders({ selectedItem: { category: 'movies' } });
  });

  it('acepta props adicionales en el contenedor', () => {
    const { container } = renderWithProviders({ 'data-testid': 'desktop-detail' });
    expect(container.querySelector('[data-testid="desktop-detail"]')).toBeInTheDocument();
  });
}); 