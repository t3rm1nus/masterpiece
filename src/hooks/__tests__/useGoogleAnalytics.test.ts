import { renderHook } from '@testing-library/react';
import useGoogleAnalytics from '../useGoogleAnalytics';

describe('useGoogleAnalytics', () => {
  it('se ejecuta sin errores', () => {
    renderHook(() => useGoogleAnalytics());
    expect(true).toBe(true);
  });
}); 