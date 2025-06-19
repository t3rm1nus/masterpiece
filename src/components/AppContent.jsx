import React, { useEffect, Suspense } from 'react';
import { useLanguage } from '../LanguageContext';
import useViewStore from '../store/viewStore';
import { isMobileDevice } from '../utils/appUtils';
import HybridMenu from './HybridMenu';
import HomePage from './HomePage';
import { LazyItemDetail, LazyCoffeePage, LoadingFallback } from './LazyComponents';

const AppContent = () => {  
  const { lang } = useLanguage();
  
  console.log('[AppContent] Component rendering with language:', lang);
  
    // Usando el store consolidado de vista para toda la gestión de UI
  const { 
    isMobile: isMobileUI, 
    mobileMenuOpen, 
    setMobile, 
    currentView
  } = useViewStore();

  console.log('[AppContent] Current view state:', { currentView, isMobileUI, mobileMenuOpen });

  let content;  switch (currentView) {
    case 'home':
      console.log('[AppContent] Rendering HomePage');
      content = <HomePage />;
      break;
    case 'detail':
      console.log('[AppContent] Rendering ItemDetail (lazy)');
      content = (
        <Suspense fallback={<LoadingFallback message="Cargando detalle..." />}>
          <LazyItemDetail />
        </Suspense>
      );
      break;
    case 'coffee':
      console.log('[AppContent] Rendering CoffeePage (lazy)');
      content = (
        <Suspense fallback={<LoadingFallback message="Cargando página de donación..." />}>
          <LazyCoffeePage />
        </Suspense>
      );
      break;
    default:
      console.warn('[AppContent] Unknown view:', currentView);
      content = <div>Página no encontrada</div>;
  }

  // Usando useEffect para detectar cambios de tamaño y actualizar el estado en el store de UI
  useEffect(() => {
    console.log('[AppContent] Setting up resize listener...');
    const checkMobile = () => {
      const newIsMobile = isMobileDevice(window.innerWidth);
      console.log('[AppContent] Screen size changed. Is mobile:', newIsMobile, 'Width:', window.innerWidth);
      setMobile(newIsMobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      console.log('[AppContent] Cleaning up resize listener');
      window.removeEventListener('resize', checkMobile);
    };
  }, [setMobile]);

  return (
    <div className="container" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>      
      <HybridMenu />
      {content}
    </div>
  );
};

export default AppContent;
