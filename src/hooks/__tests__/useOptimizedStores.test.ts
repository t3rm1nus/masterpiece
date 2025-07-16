import { renderHook } from '@testing-library/react';
import { useOptimizedStores } from '../useOptimizedStores';

describe('useOptimizedStores', () => {
  it('devuelve los stores optimizados', () => {
    const { result } = renderHook(() => useOptimizedStores());
    expect(result.current).toHaveProperty('isMobile');
    expect(result.current).toHaveProperty('currentView');
    expect(result.current).toHaveProperty('filteredItems');
    expect(result.current).toHaveProperty('badgeConfig');
    expect(result.current).toHaveProperty('handleItemClick');
    expect(result.current).toHaveProperty('processItemTitle');
    expect(result.current).toHaveProperty('processItemDescription');
    expect(result.current).toHaveProperty('isHomeView');
    expect(result.current).toHaveProperty('hasFilteredItems');
    expect(result.current).toHaveProperty('hasHomeRecommendations');
  });
}); 