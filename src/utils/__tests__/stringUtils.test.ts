import { ensureString, normalizeKey } from '../stringUtils';

describe('stringUtils', () => {
  test('ensureString devuelve el string tal cual si ya es string', () => {
    expect(ensureString('hola')).toBe('hola');
  });
  test('ensureString extrae el idioma correcto de un objeto', () => {
    expect(ensureString({ es: 'hola', en: 'hello' }, 'en')).toBe('hello');
    expect(ensureString({ es: 'hola', en: 'hello' }, 'fr')).toBe('hola');
  });
  test('ensureString convierte null o undefined a string vacío', () => {
    expect(ensureString(null)).toBe('');
    expect(ensureString(undefined)).toBe('');
  });
  test('normalizeKey normaliza a minúsculas y sin espacios', () => {
    expect(normalizeKey('  Hola ')).toBe('hola');
    expect(normalizeKey('')).toBe('');
    expect(normalizeKey(null)).toBe('');
  });
}); 