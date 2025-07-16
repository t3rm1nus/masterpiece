import { isCategoryListView } from '../categoryListView';

describe('isCategoryListView', () => {
  test('devuelve false si es home', () => {
    expect(isCategoryListView('movies', true)).toBe(false);
  });
  test('devuelve false si no hay categoría', () => {
    expect(isCategoryListView(null, false)).toBe(false);
  });
  test('devuelve true para categoría válida', () => {
    expect(isCategoryListView('movies', false)).toBe(true);
  });
}); 