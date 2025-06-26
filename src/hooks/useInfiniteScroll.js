import { useEffect, useRef } from 'react';

/**
 * useInfiniteScroll
 * Hook para disparar una callback cuando el usuario llega al final de un contenedor (infinite scroll).
 * @param {Function} onLoadMore - Callback para cargar más elementos.
 * @param {boolean} hasMore - Si hay más elementos para cargar.
 * @param {boolean} loading - Si está cargando actualmente.
 * @returns {object} - { sentinelRef }
 */
export default function useInfiniteScroll(onLoadMore, hasMore, loading) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!hasMore || loading) return;
    const observer = new window.IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          console.log('[InfiniteScroll] Sentinel intersecting, trigger onLoadMore');
          onLoadMore();
        } else {
          console.log('[InfiniteScroll] Sentinel NOT intersecting');
        }
      },
      { rootMargin: '120px' }
    );
    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
      console.log('[InfiniteScroll] Observing sentinel', sentinelRef.current);
    } else {
      console.log('[InfiniteScroll] Sentinel ref is null');
    }
    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
        console.log('[InfiniteScroll] Unobserving sentinel', sentinelRef.current);
      }
      observer.disconnect();
    };
  }, [hasMore, loading, onLoadMore]);

  return { sentinelRef };
}
