import {
  getDefaultTitle,
  isMobileDevice,
  generateRecommendationKey,
  getRandomNotFoundImage,
  generateUniqueId,
  ensureUniqueId,
  processItemsWithUniqueIds,
  findItemByGlobalId,
  getLocalizedContent,
  getLocalizedTitle,
  getLocalizedDescription,
  isValidArray,
  isArray,
  safeArray
} from '../appUtils';

describe('appUtils', () => {
  test('getDefaultTitle retorna el título correcto', () => {
    expect(getDefaultTitle('es')).toBe('Recomendaciones diarias');
    expect(getDefaultTitle('en')).toBe('Daily Recommendations');
  });
  test('isMobileDevice detecta correctamente', () => {
    expect(isMobileDevice(500)).toBe(true);
    expect(isMobileDevice(800)).toBe(false);
  });
  test('generateRecommendationKey genera un string único', () => {
    expect(generateRecommendationKey({ category: 'movies', id: 1 }, 0)).toContain('movies_1_0');
  });
  test('getRandomNotFoundImage retorna una ruta', () => {
    expect(getRandomNotFoundImage()).toMatch(/\/imagenes\/notfound\//);
  });
  test('generateUniqueId genera un id global', () => {
    expect(generateUniqueId({ category: 'movies', id: 1 })).toBe('movies_1');
  });
  test('ensureUniqueId agrega globalId', () => {
    const item = { category: 'movies', id: 1 };
    expect(ensureUniqueId(item)).toHaveProperty('globalId');
  });
  test('processItemsWithUniqueIds procesa array', () => {
    const arr = [{ category: 'movies', id: 1 }];
    expect(processItemsWithUniqueIds(arr)[0]).toHaveProperty('globalId');
  });
  test('findItemByGlobalId encuentra el item', () => {
    const arr = [{ category: 'movies', id: 1 }];
    const globalId = generateUniqueId(arr[0]);
    expect(findItemByGlobalId(arr, globalId)).toEqual(arr[0]);
  });
  test('getLocalizedContent extrae idioma', () => {
    expect(getLocalizedContent({ es: 'hola', en: 'hello' }, 'en')).toBe('hello');
    expect(getLocalizedContent('hola', 'es')).toBe('hola');
  });
  test('getLocalizedTitle y getLocalizedDescription funcionan', () => {
    const item = { title: { es: 'hola', en: 'hello' }, description: { es: 'desc', en: 'desc-en' } };
    expect(getLocalizedTitle(item, 'en')).toBe('hello');
    expect(getLocalizedDescription(item, 'es')).toBe('desc');
  });
  test('isValidArray, isArray y safeArray funcionan', () => {
    expect(isValidArray([1,2])).toBe(true);
    expect(isValidArray([])).toBe(false);
    expect(isArray([1,2])).toBe(true);
    expect(isArray('no')).toBe(false);
    expect(safeArray([1,2])).toEqual([1,2]);
    expect(safeArray(null)).toEqual([]);
  });
}); 