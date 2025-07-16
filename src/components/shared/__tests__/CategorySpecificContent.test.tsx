import React from 'react';
import { render } from '@testing-library/react';
import { MobileCategorySpecificContent, DesktopCategorySpecificContent } from '../CategorySpecificContent';

describe('MobileCategorySpecificContent', () => {
  it('renderiza datos de documentales', () => {
    const t = { documentales: { duration: 'Duración', episodes: 'Episodios', language: 'Idioma', country: 'País', director: 'Director' }, filters: { languages: { es: 'Español' } } };
    const item = { category: 'documentales', duration: '90 min', episodes: 3, language: 'es', year: 2020, country: 'España', director: 'Alguien' };
    const { getByText } = render(<MobileCategorySpecificContent selectedItem={item} t={t} lang="es" />);
    expect(getByText('Duración:')).toBeInTheDocument();
    expect(getByText('Episodios:')).toBeInTheDocument();
    expect(getByText('Idioma:')).toBeInTheDocument();
    expect(getByText('País:')).toBeInTheDocument();
    expect(getByText('Director:')).toBeInTheDocument();
  });

  it('renderiza datos de boardgames', () => {
    const item = { category: 'boardgames', minPlayers: 2, maxPlayers: 4, playTime: 60, age: 10 };
    const { getByText } = render(<MobileCategorySpecificContent selectedItem={item} lang="es" />);
    expect(getByText('Jugadores:')).toBeInTheDocument();
    expect(getByText('Duración:')).toBeInTheDocument();
    expect(getByText('Edad:')).toBeInTheDocument();
  });

  it('renderiza datos de videojuegos', () => {
    const item = { category: 'videogames', author: 'Dev', platforms: 'PC' };
    const { getByText } = render(<MobileCategorySpecificContent selectedItem={item} lang="es" />);
    expect(getByText('Desarrollador:')).toBeInTheDocument();
    expect(getByText('Plataformas:')).toBeInTheDocument();
  });

  it('renderiza datos de podcast', () => {
    const item = { category: 'podcast', author: 'Autor' };
    const { getByText } = render(<MobileCategorySpecificContent selectedItem={item} lang="es" />);
    expect(getByText('Autor:')).toBeInTheDocument();
  });

  it('renderiza datos de películas', () => {
    const t = { content: { metadata: { common: { director: 'Director' } } } };
    const item = { category: 'movies', year: 2000, director: 'Director' };
    const { getByText } = render(<MobileCategorySpecificContent selectedItem={item} t={t} lang="es" />);
    expect(getByText('Director:')).toBeInTheDocument();
    expect(getByText('Año:')).toBeInTheDocument();
  });

  it('renderiza datos de series', () => {
    const item = { category: 'series', temporadas: 2, episodios: 10, year: 2021, director: 'Director' };
    const { getByText } = render(<MobileCategorySpecificContent selectedItem={item} lang="es" />);
    expect(getByText('Temporadas:')).toBeInTheDocument();
    expect(getByText('Episodios:')).toBeInTheDocument();
    expect(getByText('Año:')).toBeInTheDocument();
    expect(getByText('Director:')).toBeInTheDocument();
  });

  it('renderiza year en documentales si está presente', () => {
    const t = { documentales: { year: 'Año' }, filters: { languages: { es: 'Español' } } };
    const item = { category: 'documentales', year: 2022 };
    const { getByText } = render(<MobileCategorySpecificContent selectedItem={item} t={t} lang="es" />);
    expect(getByText('Año:')).toBeInTheDocument();
  });

  it('renderiza correctamente minPlayers=maxPlayers en boardgames', () => {
    const item = { category: 'boardgames', minPlayers: 3, maxPlayers: 3 };
    const { getByText } = render(<MobileCategorySpecificContent selectedItem={item} lang="es" />);
    expect(getByText('Jugadores:')).toBeInTheDocument();
    expect(getByText('3')).toBeInTheDocument();
  });

  it('renderiza platforms en videojuegos', () => {
    const item = { category: 'videogames', platforms: 'PC' };
    const { getByText } = render(<MobileCategorySpecificContent selectedItem={item} lang="es" />);
    expect(getByText('Plataformas:')).toBeInTheDocument();
    expect(getByText('PC')).toBeInTheDocument();
  });

  it('renderiza year y director en series', () => {
    const t = { content: { metadata: { common: { year: 'Año', director: 'Director' } } } };
    const item = { category: 'series', year: 2021, director: 'Director', temporadas: 1, episodios: 2 };
    const { getByText } = render(<MobileCategorySpecificContent selectedItem={item} t={t} lang="es" />);
    expect(getByText('Año:')).toBeInTheDocument();
    expect(getByText('Director:')).toBeInTheDocument();
  });

  it('renderiza year en movies usando getTranslation', () => {
    const item = { category: 'movies', year: 2020 };
    const getTranslation = jest.fn(() => 'Año traducido');
    const { getByText } = render(<MobileCategorySpecificContent selectedItem={item} getTranslation={getTranslation} lang="es" />);
    expect(getByText('Año traducido:')).toBeInTheDocument();
  });

  it('retorna null si no hay datos relevantes', () => {
    const item = { category: 'unknown' };
    const { container } = render(<MobileCategorySpecificContent selectedItem={item} lang="es" />);
    expect(container.firstChild).toBeNull();
  });

  it('renderiza correctamente con props mínimos', () => {
    const item = { category: 'movies' };
    render(<MobileCategorySpecificContent selectedItem={item} />);
  });
});

describe('DesktopCategorySpecificContent', () => {
  it('renderiza datos de documentales', () => {
    const t = { documentales: { author: 'Autor', duration: 'Duración', language: 'Idioma', episodes: 'Episodios', year: 'Año', country: 'País', director: 'Director' }, filters: { languages: { es: 'Español' } } };
    const item = { category: 'documentales', author: 'Alguien', duration: '90 min', language: 'es', episodes: 3, year: 2020, country: 'España', director: 'Director' };
    const { getByText, getAllByText } = render(<DesktopCategorySpecificContent selectedItem={item} t={t} lang="es" />);
    expect(getAllByText((content) => content.startsWith('Director'))[0]).toBeInTheDocument();
  });

  it('renderiza year y director en series (Desktop)', () => {
    const t = { content: { metadata: { common: { year: 'Año', director: 'Director' } } } };
    const item = { category: 'series', year: 2021, director: 'Director', temporadas: 1, episodios: 2 };
    const { getByText } = render(<DesktopCategorySpecificContent selectedItem={item} t={t} lang="es" />);
    expect(getByText('Año:')).toBeInTheDocument();
    expect(getByText('Director:')).toBeInTheDocument();
  });

  it('renderiza platforms en videojuegos (Desktop)', () => {
    const item = { category: 'videogames', platforms: 'PC' };
    const { getByText } = render(<DesktopCategorySpecificContent selectedItem={item} lang="es" />);
    expect(getByText('Plataformas:')).toBeInTheDocument();
    expect(getByText('PC')).toBeInTheDocument();
  });

  it('renderiza correctamente minPlayers=maxPlayers en boardgames (Desktop)', () => {
    const item = { category: 'boardgames', minPlayers: 3, maxPlayers: 3 };
    const { getByText } = render(<DesktopCategorySpecificContent selectedItem={item} lang="es" />);
    expect(getByText('Jugadores:')).toBeInTheDocument();
    expect(getByText('3')).toBeInTheDocument();
  });

  it('renderiza year en movies usando getTranslation (Desktop)', () => {
    const item = { category: 'movies', year: 2020 };
    const getTranslation = jest.fn(() => 'Año traducido');
    const { getByText } = render(<DesktopCategorySpecificContent selectedItem={item} getTranslation={getTranslation} lang="es" />);
    expect(getByText('Año traducido:')).toBeInTheDocument();
  });

  it('renderiza t.author en podcast (Desktop)', () => {
    const t = { author: 'Autor' };
    const item = { category: 'podcast', author: 'Alguien' };
    const { getByText } = render(<DesktopCategorySpecificContent selectedItem={item} t={t} lang="es" />);
    expect(getByText('Autor:')).toBeInTheDocument();
    expect(getByText('Alguien')).toBeInTheDocument();
  });

  it('retorna null si no hay datos relevantes (Desktop)', () => {
    const item = { category: 'unknown' };
    const { container } = render(<DesktopCategorySpecificContent selectedItem={item} lang="es" />);
    expect(container.firstChild).toBeNull();
  });
}); 