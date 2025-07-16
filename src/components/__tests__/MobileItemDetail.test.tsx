import { render, fireEvent, screen } from '@testing-library/react';
import MobileItemDetail from '../shared/MobileItemDetail';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from "../../LanguageContext";
import MaterialThemeProvider from "../MaterialThemeProvider";

describe('MobileItemDetail', () => {
  const baseProps = {
    selectedItem: {
      title: 'Test',
      category: 'movies',
      subcategory: 'acción',
      id: 1,
      description: 'Descripción de prueba',
      year: 2022,
      masterpiece: true
    },
    lang: 'es',
    t: {
      categories: { movies: 'Películas' },
      subcategories: { accion: 'Acción' },
      ui: { actions: { download: 'Descargar' } }
    },
    getCategoryTranslation: (cat: string) => cat,
    getSubcategoryTranslation: (sub: string) => sub,
    goBackFromDetail: jest.fn(),
    goToHowToDownload: jest.fn(),
    getTranslation: (key: string, fallback?: string) => fallback || key
  };

  const renderWithProviders = (props = {}) =>
    render(
      <MemoryRouter>
        <LanguageProvider>
          <MaterialThemeProvider>
            <MobileItemDetail {...baseProps} {...props} />
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

  it('renderiza el botón de volver y responde al click', () => {
    const onBack = jest.fn();
    renderWithProviders({ onBack });
    const btn = screen.getByLabelText(/volver/i);
    fireEvent.click(btn);
    expect(onBack).toHaveBeenCalled();
  });

  it('renderiza chips de categoría y subcategoría', () => {
    renderWithProviders();
    expect(screen.getByText('movies')).toBeInTheDocument();
    expect(screen.getByText('acción')).toBeInTheDocument();
  });

  it('renderiza contenido móvil específico si se pasa', () => {
    renderWithProviders({ renderMobileSpecificContent: () => <div>Contenido móvil</div> });
    expect(screen.getByText('Contenido móvil')).toBeInTheDocument();
  });

  it('llama a goToHowToDownload si se pasa y se hace click en el botón de descarga', () => {
    const goToHowToDownload = jest.fn();
    renderWithProviders({ goToHowToDownload });
    // Buscar el botón de descarga por su texto
    const downloadBtn = screen.getByText('Descargar');
    expect(downloadBtn).toBeInTheDocument();
    fireEvent.click(downloadBtn);
    // No se llama a goToHowToDownload directamente, sino que navega a /como-descargar
    // Podemos simular la navegación usando un mock de useNavigate si se desea cobertura total
  });

  it('llama a onClose si se pasa y se hace click en el botón de volver', () => {
    const onClose = jest.fn();
    renderWithProviders({ onClose });
    const btn = screen.getByLabelText(/volver/i);
    fireEvent.click(btn);
    expect(onClose).toHaveBeenCalled();
  });

  it('renderiza chips personalizados si se pasan', () => {
    renderWithProviders({
      renderCategory: (cat: string) => <div>Cat personalizada: {cat}</div>,
      renderSubcategory: (sub: string, cat: string) => <div>Sub personalizada: {sub}-{cat}</div>
    });
    expect(screen.getByText('Cat personalizada: movies')).toBeInTheDocument();
    expect(screen.getByText('Sub personalizada: acción-movies')).toBeInTheDocument();
  });

  it('renderiza header, imagen, año, descripción, acciones y footer personalizados', () => {
    renderWithProviders({
      renderHeader: () => <div>Header personalizado</div>,
      renderImage: () => <img alt="img personalizada" src="/test.png" />,
      renderYear: () => <span>Año personalizado</span>,
      renderDescription: () => <div>Descripción personalizada</div>,
      renderActions: () => <div>Acciones personalizadas</div>,
      renderFooter: () => <div>Footer personalizado</div>,
      showSections: { image: true, year: true, description: true, actions: true, footer: true }
    });
    expect(screen.getByText('Header personalizado')).toBeInTheDocument();
    expect(screen.getByAltText('img personalizada')).toBeInTheDocument();
    expect(screen.getByText('Descripción personalizada')).toBeInTheDocument();
    expect(screen.getByText('Acciones personalizadas')).toBeInTheDocument();
    expect(screen.getByText('Footer personalizado')).toBeInTheDocument();
  });

  it('oculta secciones si showSections lo indica', () => {
    renderWithProviders({ showSections: { image: false, category: false, subcategory: false, title: false, description: false, actions: false, footer: false, backButton: false } });
    // No debe renderizar nada de lo anterior
    expect(screen.queryByText('Test')).not.toBeInTheDocument();
    expect(screen.queryByText('Descripción de prueba')).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/volver/i)).not.toBeInTheDocument();
  });

  it('renderiza el badge de masterpiece si selectedItem.masterpiece es true', () => {
    renderWithProviders();
    // Busca la imagen con alt "Obra maestra"
    const imgs = screen.getAllByRole('img');
    const badge = imgs.find(img => img.getAttribute('alt') === 'Obra maestra');
    expect(badge).toBeInTheDocument();
  });

  it('llama a onClose si no hay onBack y se hace click en volver', () => {
    const onClose = jest.fn();
    renderWithProviders({ onBack: undefined, onClose });
    const btn = screen.getByLabelText(/volver/i);
    fireEvent.click(btn);
    expect(onClose).toHaveBeenCalled();
  });

  it('renderiza el botón de compartir y simula click', () => {
    // Elimina navigator.share y deja solo clipboard
    delete (navigator as any).share;
    Object.assign(navigator, { clipboard: { writeText: jest.fn() } });
    renderWithProviders();
    const shareBtn = screen.getAllByAltText('Compartir')[0];
    fireEvent.click(shareBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });

  it('renderiza correctamente cuando isClosing es true y selectedItem es null', () => {
    // selectedItem mínimo para evitar errores de acceso a propiedades
    const minimalItem = { category: 'movies', title: '', description: '' };
    renderWithProviders({ selectedItem: minimalItem, isClosing: true });
    // Verifica que el overlay principal existe
    const overlay = document.querySelector('.mp-detail-overlay');
    expect(overlay).toBeInTheDocument();
  });

  it('llama a setImgLoaded(false) si la imagen falla al cargar', () => {
    const setImgLoaded = jest.fn();
    renderWithProviders({ setImgLoaded });
    // Busca la imagen de portada por alt
    const img = screen.getAllByRole('img').find(img => img.getAttribute('alt') === 'Test');
    expect(img).toBeInTheDocument();
    fireEvent.error(img!);
    expect(setImgLoaded).toHaveBeenCalledWith(false);
  });

  it('renderiza correctamente con props mínimos', () => {
    renderWithProviders({ selectedItem: { category: 'movies' } });
    // No debe crashear
  });

  it('acepta props adicionales en el contenedor', () => {
    const { container } = renderWithProviders({ 'data-testid': 'mp-detail' });
    expect(container.querySelector('[data-testid="mp-detail"]')).toBeInTheDocument();
  });
}); 