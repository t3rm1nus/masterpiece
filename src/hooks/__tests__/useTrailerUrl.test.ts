import { renderHook } from '@testing-library/react';
import { useTrailerUrl } from '../useTrailerUrl';

describe('useTrailerUrl', () => {
  it('devuelve null si no hay datos', () => {
    const { result } = renderHook(() => useTrailerUrl(null));
    expect(result.current).toBeNull();
  });

  it('devuelve la url del trailer si existe', () => {
    const data = { trailer: 'https://youtube.com/trailer' };
    const { result } = renderHook(() => useTrailerUrl(data));
    expect(result.current).toBe('https://youtube.com/trailer');
  });
}); 