import { normalizeSubcategoryInternal, normalizeSubcategory, filterItemsBySubcategory, getUniqueSubcategories, getCategoryGradient } from '../categoryUtils';

describe('categoryUtils', () => {
  test('normalizeSubcategoryInternal normaliza y traduce correctamente', () => {
    expect(normalizeSubcategoryInternal('Acción')).toBe('action');
    expect(normalizeSubcategoryInternal('comedia')).toBe('comedy');
    expect(normalizeSubcategoryInternal('')).toBe('');
  });
  test('normalizeSubcategory traduce según idioma', () => {
    expect(normalizeSubcategory('acción', 'en')).toBe('action');
    expect(normalizeSubcategory('comedy', 'es')).toBe('comedia');
  });
  test('filterItemsBySubcategory filtra correctamente', () => {
    const items = [
      { subcategory: 'acción' },
      { subcategory: 'comedia' },
      { subcategory: 'acción' }
    ];
    expect(filterItemsBySubcategory(items, 'acción', 'es').length).toBe(2);
  });
  test('getUniqueSubcategories devuelve únicas', () => {
    const items = [
      { subcategory: 'acción' },
      { subcategory: 'comedia' },
      { subcategory: 'acción' }
    ];
    const result = getUniqueSubcategories(items, 'es');
    expect(result).toContain('action');
    expect(result).toContain('comedy');
  });
  test('getCategoryGradient retorna un string', () => {
    expect(typeof getCategoryGradient('movies')).toBe('string');
  });
}); 