import { create } from 'zustand';
import { uiSlice } from '../slices/uiSlice';

describe('uiSlice', () => {
  let store: any;

  beforeEach(() => {
    store = create(uiSlice);
  });

  it('puede establecer el estado de carga', () => {
    store.getState().setLoading(true);
    expect(store.getState().isLoading).toBe(true);
    store.getState().setLoading(false);
    expect(store.getState().isLoading).toBe(false);
  });

  it('puede establecer y limpiar errores', () => {
    store.getState().setError('Error de prueba');
    expect(store.getState().error).toBe('Error de prueba');
    store.getState().clearError();
    expect(store.getState().error).toBe(null);
  });

  it('puede establecer el término de búsqueda', () => {
    store.getState().setSearchTerm('masterpiece');
    expect(store.getState().searchTerm).toBe('masterpiece');
  });

  it('puede limpiar la búsqueda', () => {
    store.getState().setSearchTerm('algo');
    store.getState().clearSearch();
    expect(store.getState().searchTerm).toBe('');
    expect(store.getState().searchResults).toEqual([]);
    expect(store.getState().isSearching).toBe(false);
  });

  it('puede buscar entre recomendaciones', async () => {
    const recomendaciones = [
      { title: 'Masterpiece', description: 'Obra maestra' },
      { title: 'Otra cosa', description: 'Nada que ver' }
    ];
    const resultados = await store.getState().performSearch('master', recomendaciones);
    expect(resultados.length).toBe(1);
    expect(resultados[0].title).toBe('Masterpiece');
    expect(store.getState().isSearching).toBe(false);
  });

  it('puede establecer categorías, subcategorías y tags seleccionados', () => {
    store.getState().setSelectedCategories(['libros']);
    expect(store.getState().selectedCategories).toEqual(['libros']);
    store.getState().setSelectedSubcategories(['novela']);
    expect(store.getState().selectedSubcategories).toEqual(['novela']);
    store.getState().setSelectedTags(['favorito']);
    expect(store.getState().selectedTags).toEqual(['favorito']);
  });

  it('puede limpiar todos los filtros', () => {
    store.getState().setSelectedCategories(['libros']);
    store.getState().setSelectedSubcategories(['novela']);
    store.getState().setSelectedTags(['favorito']);
    store.getState().clearFilters();
    expect(store.getState().selectedCategories).toEqual([]);
    expect(store.getState().selectedSubcategories).toEqual([]);
    expect(store.getState().selectedTags).toEqual([]);
  });
}); 