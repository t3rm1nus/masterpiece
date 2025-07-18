import { useEffect, useRef, RefObject } from 'react';

// =============================================
// useInfiniteScroll: Hook para infinite scroll eficiente
// Implementa infinite scroll usando IntersectionObserver, optimizado para UX y performance en listas largas en móvil y desktop.
// =============================================

interface UseInfiniteScrollReturn {
  sentinelRef: RefObject<HTMLDivElement | null>;
}

/**
 * useInfiniteScroll
 * Hook para disparar una callback cuando el usuario llega al final de un contenedor (infinite scroll).
 * @param {Function} onLoadMore - Callback para cargar más elementos.
 * @param {boolean} hasMore - Si hay más elementos para cargar.
 * @param {boolean} loading - Si está cargando actualmente.
 * @returns {object} - { sentinelRef }
 */
export default function useInfiniteScroll(
  onLoadMore: () => void,
  hasMore: boolean,
  loading: boolean
): UseInfiniteScrollReturn {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return; // Solo en cliente
    if (!hasMore || loading) return;
    const observer = new window.IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: '120px' }
    );
    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }
    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
      observer.disconnect();
    };
  }, [hasMore, loading, onLoadMore]);

  return { sentinelRef };
} 