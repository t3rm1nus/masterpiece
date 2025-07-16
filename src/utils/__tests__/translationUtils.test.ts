import {
  createTranslationValidator,
  pluralize,
  formatTranslation,
  mergeTranslations,
  extractTranslationKeys,
  createTranslationNamespace,
  batchGetTranslations,
  createTranslationCache
} from '../translationUtils';

describe('translationUtils', () => {
  test('pluralize funciona para inglés y español', () => {
    expect(pluralize(1, 'cat', 'cats', 'en')).toBe('cat');
    expect(pluralize(2, 'cat', 'cats', 'en')).toBe('cats');
    expect(pluralize(1, 'gato', 'gatos', 'es')).toBe('gato');
    expect(pluralize(2, 'gato', 'gatos', 'es')).toBe('gatos');
  });
  test('formatTranslation interpola variables', () => {
    expect(formatTranslation('Hola {name}!', { name: 'Mundo' })).toBe('Hola Mundo!');
  });
  test('mergeTranslations hace merge profundo', () => {
    const a = { a: 1, b: { c: 2 } };
    const b = { b: { d: 3 } };
    expect(mergeTranslations(a, b)).toEqual({ a: 1, b: { c: 2, d: 3 } });
  });
  test('extractTranslationKeys extrae claves', () => {
    const obj = { a: { b: 'c' }, d: 'e' };
    expect(extractTranslationKeys(obj)).toContain('a.b');
    expect(extractTranslationKeys(obj)).toContain('d');
  });
  test('createTranslationNamespace antepone el namespace', () => {
    const getT = (key: string) => key;
    const ns = createTranslationNamespace(getT, 'foo');
    expect(ns('bar')).toBe('foo.bar');
  });
  test('batchGetTranslations obtiene varias', () => {
    const getT = (key: string) => key + '-t';
    expect(batchGetTranslations(getT, ['a', 'b'])).toEqual({ a: 'a-t', b: 'b-t' });
  });
  test('createTranslationCache almacena y recupera', () => {
    const cache = createTranslationCache();
    let called = 0;
    const result = cache.get('foo', () => { called++; return 42; });
    expect(result).toBe(42);
    expect(cache.get('foo', () => { called++; return 99; })).toBe(42);
    expect(called).toBe(1);
    cache.clear();
    expect(cache.get('foo', () => 99)).toBe(99);
  });
  test('createTranslationValidator detecta claves faltantes', () => {
    const translations = { foo: { bar: 'baz' } };
    const validator = createTranslationValidator(translations);
    expect(validator.validate('foo.bar')).toBe(true);
    expect(validator.validate('foo.baz')).toBe(false);
    expect(validator.getMissingKeys()).toContain('foo.baz');
    validator.clearMissingKeys();
    expect(validator.getMissingKeys()).toEqual([]);
  });
}); 