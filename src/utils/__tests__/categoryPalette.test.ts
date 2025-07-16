import {
  getCategoryColor,
  getCategoryGradient,
  getCategoryStrongColor,
  getCategoryColorForSelect,
  getAllCategoriesAnimatedGradient,
  getCategoryAnimatedGradient,
  getMasterpieceAnimatedGradient
} from '../categoryPalette';

describe('categoryPalette utils', () => {
  it('getCategoryColor devuelve un color para una categoría conocida', () => {
    expect(typeof getCategoryColor('music')).toBe('string');
    expect(getCategoryColor('music')).toBe('#B3FFB3');
  });
  it('getCategoryColor devuelve un color por defecto para categoría desconocida', () => {
    expect(getCategoryColor('desconocida')).toBe('#0078d4');
  });
  it('getCategoryColor permite elegir variante strong', () => {
    expect(getCategoryColor('books', 'strong')).toBe('#FFD600');
  });
  it('getCategoryGradient devuelve el gradiente de la categoría', () => {
    expect(getCategoryGradient('series')).toContain('linear-gradient');
  });
  it('getCategoryStrongColor devuelve el color strong', () => {
    expect(getCategoryStrongColor('comics')).toBe('#A1887F');
  });
  it('getCategoryColorForSelect devuelve el color strong', () => {
    expect(getCategoryColorForSelect('boardgames')).toBe('#BA68C8');
  });
  it('getAllCategoriesAnimatedGradient devuelve un gradiente con todos los colores', () => {
    const grad = getAllCategoriesAnimatedGradient();
    expect(grad).toContain('linear-gradient');
    expect(grad).toContain('#B3D1FF');
    expect(grad).toContain('#FFB3B3');
    expect(grad).toContain('#FFB3E6');
  });
  it('getCategoryAnimatedGradient devuelve un gradiente animado de la categoría', () => {
    const grad = getCategoryAnimatedGradient('music');
    expect(grad).toContain('#B3FFB3');
    expect(grad).toContain('#81C784');
  });
  it('getCategoryAnimatedGradient devuelve gradiente por defecto para desconocida', () => {
    const grad = getCategoryAnimatedGradient('desconocida');
    expect(grad).toContain('#fffbe6');
    expect(grad).toContain('#ffe082');
  });
  it('getMasterpieceAnimatedGradient devuelve un gradiente dorado', () => {
    const grad = getMasterpieceAnimatedGradient();
    expect(grad).toContain('#ffd700');
    expect(grad).toContain('linear-gradient');
  });
}); 