import { renderHook } from '@testing-library/react';
import useInfiniteScroll from '../useInfiniteScroll';

beforeAll(() => {
  global.IntersectionObserver = class {
    root = null;
    rootMargin = '';
    thresholds = [];
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  };
});

describe('useInfiniteScroll', () => {
  it('devuelve un sentinelRef', () => {
    const onLoadMore = jest.fn();
    const { result } = renderHook(() => useInfiniteScroll(onLoadMore, true, false));
    expect(result.current).toHaveProperty('sentinelRef');
  });
}); 