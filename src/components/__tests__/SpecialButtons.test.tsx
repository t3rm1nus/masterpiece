import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SpecialButtons from '../home/SpecialButtons';

describe('SpecialButtons', () => {
  const baseProps = {
    selectedCategory: 'movies',
    isSpanishCinemaActive: false,
    handleSpanishCinemaToggle: jest.fn(),
    isMasterpieceActive: false,
    handleMasterpieceToggle: jest.fn(),
    lang: 'es',
    isRecommendedActive: false,
    isMobile: false,
    isSpanishSeriesActive: false,
    handleSpanishSeriesToggle: jest.fn(),
    musicFilterType: null,
    setMusicFilterType: jest.fn(),
    activeSubcategory: null,
    battleFilterActive: false,
    setBattleFilterActive: jest.fn(),
  };

  const renderWithRouter = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

  it('renderiza botón de Cine Español y Masterpieces', () => {
    const { getByText } = renderWithRouter(<SpecialButtons {...baseProps} />);
    expect(getByText('Cine Español')).toBeInTheDocument();
    expect(getByText('Obras Maestras')).toBeInTheDocument();
  });

  it('llama a handleSpanishCinemaToggle al hacer click', () => {
    const handleSpanishCinemaToggle = jest.fn();
    const { getByText } = renderWithRouter(
      <SpecialButtons {...baseProps} handleSpanishCinemaToggle={handleSpanishCinemaToggle} />
    );
    fireEvent.click(getByText('Cine Español'));
    expect(handleSpanishCinemaToggle).toHaveBeenCalled();
  });

  it('llama a handleMasterpieceToggle al hacer click', () => {
    const handleMasterpieceToggle = jest.fn();
    const { getByText } = renderWithRouter(
      <SpecialButtons {...baseProps} handleMasterpieceToggle={handleMasterpieceToggle} />
    );
    fireEvent.click(getByText('Obras Maestras'));
    expect(handleMasterpieceToggle).toHaveBeenCalled();
  });

  it('renderiza botones de música cuando selectedCategory es music', () => {
    const { getByText } = renderWithRouter(
      <SpecialButtons {...baseProps} selectedCategory="music" lang="en" />
    );
    expect(getByText('Song')).toBeInTheDocument();
    expect(getByText('Album')).toBeInTheDocument();
  });

  it('renderiza botones de idioma para podcast', () => {
    const setActivePodcastDocumentaryLanguage = jest.fn();
    jest.spyOn(require('../../store/useAppStore'), 'default').mockImplementation(() => ({
      activePodcastDocumentaryLanguage: 'es',
      setActivePodcastDocumentaryLanguage
    }));
    const { getByText } = renderWithRouter(
      <SpecialButtons {...baseProps} selectedCategory="podcast" lang="es" />
    );
    expect(getByText('Español')).toBeInTheDocument();
    expect(getByText('Inglés')).toBeInTheDocument();
  });

  it('renderiza botón de batalla si subcategoría es rap', () => {
    const { getByText } = renderWithRouter(
      <SpecialButtons {...baseProps} selectedCategory="music" activeSubcategory="rap" />
    );
    expect(getByText('Batalla')).toBeInTheDocument();
  });

  it('renderiza botón de sesión si subcategoría es electrónica', () => {
    const { getByText } = renderWithRouter(
      <SpecialButtons {...baseProps} selectedCategory="music" activeSubcategory="electronica" />
    );
    expect(getByText('Sesión')).toBeInTheDocument();
  });

  it('renderiza botón de Series Españolas en desktop', () => {
    const { getByText } = renderWithRouter(
      <SpecialButtons {...baseProps} selectedCategory="series" isMobile={false} />
    );
    expect(getByText('Series Españolas')).toBeInTheDocument();
  });

  it('cambia el estado de los toggles de música', () => {
    const setMusicFilterType = jest.fn();
    const setBattleFilterActive = jest.fn();
    const { getByText } = renderWithRouter(
      <SpecialButtons
        {...baseProps}
        selectedCategory="music"
        setMusicFilterType={setMusicFilterType}
        setBattleFilterActive={setBattleFilterActive}
      />
    );
    fireEvent.click(getByText('Canción'));
    expect(setMusicFilterType).toHaveBeenCalled();
    fireEvent.click(getByText('Álbum'));
    expect(setMusicFilterType).toHaveBeenCalled();
  });

  it('muestra toggles activos correctamente en movies', () => {
    const { getByText } = renderWithRouter(
      <SpecialButtons
        {...baseProps}
        isSpanishCinemaActive={true}
        isMasterpieceActive={true}
        selectedCategory="movies"
        isMobile={false}
      />
    );
    expect(getByText('Cine Español').className).toMatch(/active|Mui-selected/);
    expect(getByText('Obras Maestras').className).toMatch(/active|Mui-selected/);
  });

  it('muestra toggles activos correctamente en series', () => {
    const { getByText } = renderWithRouter(
      <SpecialButtons
        {...baseProps}
        isSpanishSeriesActive={true}
        selectedCategory="series"
        isMobile={false}
      />
    );
    expect(getByText('Series Españolas').className).toMatch(/active|Mui-selected/);
  });

  it('renderiza correctamente en modo móvil', () => {
    const { getByText } = renderWithRouter(
      <SpecialButtons {...baseProps} isMobile={true} selectedCategory="series" />
    );
    expect(getByText('Series Españolas')).toBeInTheDocument();
  });

  it('combina filtros activos: batalla y canción', () => {
    const setMusicFilterType = jest.fn();
    const setBattleFilterActive = jest.fn();
    const { getByText } = renderWithRouter(
      <SpecialButtons
        {...baseProps}
        selectedCategory="music"
        activeSubcategory="rap"
        battleFilterActive={true}
        setMusicFilterType={setMusicFilterType}
        setBattleFilterActive={setBattleFilterActive}
      />
    );
    fireEvent.click(getByText('Batalla'));
    expect(setBattleFilterActive).toHaveBeenCalled();
    fireEvent.click(getByText('Canción'));
    expect(setMusicFilterType).toHaveBeenCalled();
  });

  it('no lanza error si no se pasan callbacks', () => {
    const props = { ...baseProps,
      handleSpanishCinemaToggle: () => {},
      handleMasterpieceToggle: () => {},
      handleSpanishSeriesToggle: () => {},
      setMusicFilterType: () => {},
      setBattleFilterActive: () => {}
    };
    renderWithRouter(<SpecialButtons {...props} />);
    // No assertion, solo que no crashee
  });

  it('renderiza correctamente sin subcategoría activa', () => {
    const { getByText } = renderWithRouter(
      <SpecialButtons {...baseProps} selectedCategory="music" activeSubcategory={null} />
    );
    expect(getByText('Canción')).toBeInTheDocument();
    expect(getByText('Álbum')).toBeInTheDocument();
  });

  it('traduce textos según lang', () => {
    const { getByText } = renderWithRouter(
      <SpecialButtons {...baseProps} selectedCategory="music" lang="en" />
    );
    expect(getByText('Song')).toBeInTheDocument();
    expect(getByText('Album')).toBeInTheDocument();
  });

  it('botones de toggles muestran estado activo visual', () => {
    const { getByText } = renderWithRouter(
      <SpecialButtons {...baseProps} isSpanishCinemaActive isMasterpieceActive selectedCategory="movies" />
    );
    expect(getByText('Cine Español').className).toMatch(/active|Mui-selected/);
    expect(getByText('Obras Maestras').className).toMatch(/active|Mui-selected/);
  });

  it('renderiza correctamente con props mínimos', () => {
    renderWithRouter(<SpecialButtons selectedCategory="movies" isSpanishCinemaActive={false} handleSpanishCinemaToggle={() => {}} isMasterpieceActive={false} handleMasterpieceToggle={() => {}} lang="es" isRecommendedActive={false} isMobile={false} isSpanishSeriesActive={false} handleSpanishSeriesToggle={() => {}} musicFilterType={null} setMusicFilterType={() => {}} activeSubcategory={null} battleFilterActive={false} setBattleFilterActive={() => {}} />);
  });

  it('acepta fragmentos y children', () => {
    const { container } = renderWithRouter(<SpecialButtons {...baseProps}>{<><span>Child</span></>}</SpecialButtons>);
    expect(container).toBeDefined();
  });
}); 