import { renderHook } from '@testing-library/react';
import useMultiLanguageData from '../useMultiLanguageData';

describe('useMultiLanguageData', () => {
  it('devuelve datos multilenguaje', () => {
    const data = {
      es: 'Hola',
      en: 'Hello'
    };
    const { result } = renderHook(() => useMultiLanguageData());
    expect(result.current.getLocalizedContent(data)).toBe('Hola'); // Por defecto español
  });
}); 