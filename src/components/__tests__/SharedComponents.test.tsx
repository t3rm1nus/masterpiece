import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { OptimizedImage, MasterpieceBadge, CategoryLabels, NoResults } from '../SharedComponents';
import { LanguageProvider } from '../../LanguageContext';
import { MobileActionButtons } from '../shared/ItemActionButtons';
import { MemoryRouter } from 'react-router-dom';

describe('OptimizedImage', () => {
  it('renderiza la imagen con src y alt', () => {
    const { getByAltText } = render(<OptimizedImage src="/test.png" alt="test" />);
    expect(getByAltText('test')).toBeInTheDocument();
  });
  it('usa fallback si la imagen falla', () => {
    const { getByAltText } = render(<OptimizedImage src="/fail.png" alt="fail" fallback="/fallback.png" />);
    const img = getByAltText('fail') as HTMLImageElement;
    fireEvent.error(img);
    expect(img.src).toContain('/fallback.png');
  });
});

describe('MasterpieceBadge', () => {
  const config = {
    svg: { viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' },
    circle: { cx: 12, cy: 12, r: 10, fill: '#FFD700' },
    star: { d: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z', fill: '#fff' }
  };
  it('renderiza el badge con tooltip', () => {
    const { getByTitle } = render(
      <LanguageProvider>
        <MasterpieceBadge config={config} tooltip="Obra maestra" />
      </LanguageProvider>
    );
    expect(getByTitle('Obra maestra')).toBeInTheDocument();
  });
});

describe('CategoryLabels', () => {
  const getCategoryTranslation = (cat: string) => `Cat: ${cat}`;
  const getSubcategoryTranslation = (sub: string) => `Sub: ${sub}`;
  it('renderiza categoría y subcategoría', () => {
    const { getByText } = render(
      <CategoryLabels
        category="cine"
        subcategory="acción"
        getCategoryTranslation={getCategoryTranslation}
        getSubcategoryTranslation={getSubcategoryTranslation}
      />
    );
    expect(getByText('Cat: cine')).toBeInTheDocument();
    expect(getByText('Sub: acción')).toBeInTheDocument();
  });
  it('permite renderizado personalizado', () => {
    const { getByText } = render(
      <CategoryLabels
        category="cine"
        getCategoryTranslation={getCategoryTranslation}
        getSubcategoryTranslation={getSubcategoryTranslation}
        renderCategory={cat => <span>Personalizado {cat}</span>}
      />
    );
    expect(getByText('Personalizado cine')).toBeInTheDocument();
  });
});

describe('NoResults', () => {
  it('renderiza el texto por defecto y la imagen', () => {
    const { getByText, getByAltText } = render(
      <LanguageProvider>
        <NoResults />
      </LanguageProvider>
    );
    expect(getByText(/no se encontraron resultados/i)).toBeInTheDocument();
    expect(getByAltText(/no se encontraron resultados/i)).toBeInTheDocument();
  });
  it('renderiza texto e imagen personalizados', () => {
    const { getByText, getByAltText } = render(
      <NoResults text="Nada" subtext="Vacío" image="/img.png" />
    );
    expect(getByText('Nada')).toBeInTheDocument();
    expect(getByText('Vacío')).toBeInTheDocument();
    expect(getByAltText('ui.states.noResults')).toBeInTheDocument();
  });
});

describe('MobileActionButtons', () => {
  const baseProps = {
    selectedItem: { category: 'movies', title: 'Test', link: 'http://test', youtube: 'http://yt', spotify: 'http://sp', trailerUrl: 'http://trailer', subcategory: 'acción' },
    lang: 'es',
    t: { ui: { actions: { download: 'Descargar' } }, documentales: { watch: 'Ver Documental' }, watch_trailer: 'Ver Tráiler' },
    goToHowToDownload: jest.fn(),
    onOverlayNavigate: jest.fn()
  };

  const renderWithRouter = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

  it('renderiza botón de YouTube si es música', () => {
    renderWithRouter(<MobileActionButtons {...baseProps} selectedItem={{ ...baseProps.selectedItem, category: 'music', youtube: 'http://yt' }} />);
    expect(screen.getByText(/Oír en YouTube/i)).toBeInTheDocument();
  });

  it('renderiza botón de Spotify si es música', () => {
    renderWithRouter(<MobileActionButtons {...baseProps} selectedItem={{ ...baseProps.selectedItem, category: 'music', spotify: 'http://sp' }} />);
    expect(screen.getByText(/Oír en Spotify/i)).toBeInTheDocument();
  });

  it('renderiza botón de documental si es documental', () => {
    renderWithRouter(<MobileActionButtons {...baseProps} selectedItem={{ ...baseProps.selectedItem, category: 'documentales', link: 'http://doc' }} />);
    expect(screen.getByText(/Ver Documental/i)).toBeInTheDocument();
  });

  it('renderiza botón de tráiler si hay trailerUrl', () => {
    renderWithRouter(<MobileActionButtons {...baseProps} trailerUrl="http://trailer" />);
    expect(screen.getByText(/Ver Tráiler/i)).toBeInTheDocument();
  });

  it('renderiza botón de podcast si es podcast', () => {
    renderWithRouter(<MobileActionButtons {...baseProps} selectedItem={{ ...baseProps.selectedItem, category: 'podcast', link: 'http://pod' }} />);
    expect(screen.getByText(/Escuchar en Spotify/i)).toBeInTheDocument();
  });

  it('renderiza botón de descargar si es movies', () => {
    renderWithRouter(<MobileActionButtons {...baseProps} selectedItem={{ ...baseProps.selectedItem, category: 'movies' }} />);
    expect(screen.getByText(/Descargar/i)).toBeInTheDocument();
  });

  it('renderiza botón de descargar si es series', () => {
    renderWithRouter(<MobileActionButtons {...baseProps} selectedItem={{ ...baseProps.selectedItem, category: 'series' }} />);
    expect(screen.getByText(/Descargar/i)).toBeInTheDocument();
  });

  it('llama a onOverlayNavigate al hacer click en descargar', () => {
    const onOverlayNavigate = jest.fn();
    renderWithRouter(<MobileActionButtons {...baseProps} selectedItem={{ ...baseProps.selectedItem, category: 'movies' }} onOverlayNavigate={onOverlayNavigate} />);
    fireEvent.click(screen.getByText(/Descargar/i));
    expect(onOverlayNavigate).toHaveBeenCalledWith('/como-descargar');
  });
}); 