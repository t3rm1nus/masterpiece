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
    const context = getContext();
    console.log('🔄 [useBackNavigation] handleBack llamado - context:', context, 'isAnimating:', isAnimating, 'location.pathname:', location.pathname, 'currentView:', currentView);
    
    // Si es coffee o howToDownload, navegar instantáneo sin llamar goHome para evitar parpadeo
    if (context === 'coffee' || context === 'howToDownload') {
      console.log('🔄 [useBackNavigation] Navegando instantáneo a home');
      navigate('/', { replace: true });
      return;
    }
    // Si es detalle, mantener animación (si se desea)
    if (isAnimating) {
      console.log('🔄 [useBackNavigation] Ya está animando, ignorando');
      return;
    }
    setIsAnimating(true);
    if (context === 'detail') {
      console.log('🔄 [useBackNavigation] Disparando evento overlay-detail-exit');
      window.dispatchEvent(new CustomEvent('overlay-detail-exit'));
      animTimeout.current = setTimeout(() => {
        console.log('🔄 [useBackNavigation] Timeout completado, navegando a home');
        setIsAnimating(false);
        navigate('/', { replace: true });
      }, 500);
      return;
    }
    // Si no es overlay, simplemente navega atrás
    console.log('🔄 [useBackNavigation] Navegando atrás');
    setIsAnimating(false);
    navigate(-1);
  }, [isAnimating, location.pathname, currentView, navigate]);

  // Limpiar timeout si el componente se desmonta
  // (Evita memory leaks)
  // eslint-disable-next-line
  useEffect(() => () => { if (animTimeout.current) clearTimeout(animTimeout.current); }, []);

  return { handleBack, isAnimating };
} 