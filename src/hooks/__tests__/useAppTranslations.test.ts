import { renderHook } from '@testing-library/react';
import useAppTranslations from '../useAppTranslations';
import { LanguageProvider } from '../../LanguageContext';

describe('useAppTranslations', () => {
  it('no rompe en SSR', () => {
    expect(() => {
      renderHook(() => useAppTranslations(), {
        wrapper: LanguageProvider
      });
    }).not.toThrow();
  });
}); 