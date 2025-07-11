import { useCallback, useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation, matchPath } from 'react-router-dom';
import { useAppView } from '../store/useAppStore';

/**
 * useBackNavigation
 * Unifica la lógica de los botones 'volver' para overlays, detalles, donaciones, etc.
 * - Gestiona animaciones de salida
 * - Decide la ruta de navegación segura
 * - Deshabilita el botón durante la animación
 * - Evita condiciones de carrera
 *
 * @returns {Object} { handleBack, isAnimating }
 */
export default function useBackNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentView, goHome } = useAppView();
  const [isAnimating, setIsAnimating] = useState(false);
  const animTimeout = useRef(null);

  // Decide el tipo de overlay/contexto
  const getContext = () => {
    if (matchPath('/detalle/:id', location.pathname) || currentView === 'detail') return 'detail';
    if (matchPath('/donaciones', location.pathname) || currentView === 'coffee') return 'coffee';
    if (matchPath('/como-descargar', location.pathname) || currentView === 'howToDownload') return 'howToDownload';
    return 'home';
  };

  // Lógica unificada para volver
  const handleBack = useCallback(() => {
    if (isAnimating) return;
    const context = getContext();
    setIsAnimating(true);
    // Lanzar el evento de animación adecuado
    if (context === 'detail') {
      window.dispatchEvent(new CustomEvent('overlay-detail-exit'));
    } else if (context === 'coffee' || context === 'howToDownload') {
      window.dispatchEvent(new CustomEvent('overlay-exit'));
    } else {
      // Si no es overlay, simplemente navega atrás
      setIsAnimating(false);
      navigate(-1);
      return;
    }
    // Esperar a que termine la animación antes de navegar
    animTimeout.current = setTimeout(() => {
      setIsAnimating(false);
      // Navegar a home usando replace para evitar bucles
      navigate('/', { replace: true });
      goHome();
    }, 500); // Duración igual a la animación
  }, [isAnimating, location.pathname, currentView, navigate, goHome]);

  // Limpiar timeout si el componente se desmonta
  // (Evita memory leaks)
  // eslint-disable-next-line
  useEffect(() => () => { if (animTimeout.current) clearTimeout(animTimeout.current); }, []);

  return { handleBack, isAnimating };
} 