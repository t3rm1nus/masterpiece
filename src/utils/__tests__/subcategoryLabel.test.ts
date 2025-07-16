import { getSubcategoryLabel } from '../subcategoryLabel';

describe('getSubcategoryLabel', () => {
  const t = {
    subcategories: {
      music: { rock: 'Rock', jazz: 'Jazz' }
    }
  };
  it('devuelve el label correcto para una subcategoría existente', () => {
    expect(getSubcategoryLabel('rock', 'music', t)).toBe('Rock');
  });
  it('devuelve la key capitalizada si no existe traducción', () => {
    expect(getSubcategoryLabel('pop', 'music', t)).toBe('Pop');
  });
}); 