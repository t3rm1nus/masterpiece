import { renderHook } from '@testing-library/react';
import { useMaterialAnimation } from '../useMaterialAnimation';

describe('useMaterialAnimation', () => {
  it('devuelve los valores de animación', () => {
    const { result } = renderHook(() => useMaterialAnimation(false));
    expect(result.current).toHaveProperty('in');
    expect(result.current).toHaveProperty('timeout');
  });
}); 