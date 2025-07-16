import { create } from 'zustand';
import { createDataSlice } from '../dataStore';

describe('dataStore', () => {
  let store: any;

  beforeEach(() => {
    store = create(createDataSlice);
  });

  it('actualiza datos reales correctamente', () => {
    const realData = { categories: [{ id: 'test', name: 'Test' }], recommendations: [{ id: 1 }], allData: { test: [{ id: 1 }] } };
    store.getState().updateWithRealData(realData);
    expect(store.getState().categories.length).toBe(1);
    expect(store.getState().recommendations.length).toBeGreaterThan(0);
    expect(store.getState().isDataInitialized).toBe(true);
  });

  it('puede cambiar la categoría seleccionada', () => {
    store.getState().setCategory('libros');
    expect(store.getState().selectedCategory).toBe('libros');
  });

  it('puede cambiar la subcategoría activa', () => {
    store.getState().setActiveSubcategory('novela');
    expect(store.getState().activeSubcategory).toBe('novela');
  });

  it('genera nuevas recomendaciones', () => {
    store.setState({
      allData: {
        movies: [{ id: 1 }, { id: 2 }],
        books: [{ id: 3 }, { id: 4 }],
        comics: [],
        boardgames: [],
        podcast: [],
        series: [],
        documentales: [],
        music: []
      }
    });
    store.getState().generateNewRecommendations();
    expect(store.getState().recommendations.length).toBeGreaterThan(0);
  });

  it('resetea todos los filtros', () => {
    store.setState({ selectedCategory: 'libros', activeSubcategory: 'novela' });
    store.getState().resetAllFilters();
    expect(store.getState().selectedCategory).toBe(null);
    expect(store.getState().activeSubcategory).toBe(null);
  });

  it('actualiza los items filtrados', () => {
    store.getState().updateFilteredItems([{ id: 1 }]);
    expect(store.getState().filteredItems.length).toBe(1);
  });

  it('resetea la paginación', () => {
    store.setState({ mobilePage: 5, desktopPage: 3 });
    store.getState().resetPagination();
    expect(store.getState().mobilePage).toBe(1);
    expect(store.getState().desktopPage).toBe(1);
  });
}); 