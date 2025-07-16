import { safeStorage } from '../safeStorage';

describe('safeStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  test('setItem y getItem funcionan', () => {
    safeStorage.setItem('key', 'value');
    expect(safeStorage.getItem('key')).toBe('value');
  });
  test('removeItem elimina el valor', () => {
    safeStorage.setItem('key', 'value');
    safeStorage.removeItem('key');
    expect(safeStorage.getItem('key')).toBeNull();
  });
  test('clear elimina todos los valores', () => {
    safeStorage.setItem('a', '1');
    safeStorage.setItem('b', '2');
    safeStorage.clear();
    expect(safeStorage.getItem('a')).toBeNull();
    expect(safeStorage.getItem('b')).toBeNull();
  });
}); 