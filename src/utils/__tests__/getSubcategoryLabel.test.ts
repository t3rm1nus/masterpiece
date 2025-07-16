import { getSubcategoryLabel } from '../getSubcategoryLabel';
describe('getSubcategoryLabel', () => {
  it('devuelve un string para una subcategoría', () => {
    expect(typeof getSubcategoryLabel('rock', 'music', {})).toBe('string');
  });
}); 