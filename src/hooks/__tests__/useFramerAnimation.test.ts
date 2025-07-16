import { renderHook } from '@testing-library/react';
import { useFramerAnimation } from '../useFramerAnimation';

describe('useFramerAnimation', () => {
  it('devuelve los valores de animación', () => {
    const { result } = renderHook(() => useFramerAnimation(false));
    expect(result.current).toHaveProperty('initial');
    expect(result.current).toHaveProperty('animate');
  });
}); 