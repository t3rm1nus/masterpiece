import React, { useEffect, Suspense } from 'react';
import { useAppView, useAppUI } from '../store/useAppStore';
import { isMobileDevice } from '../utils/appUtils';
import HybridMenu from './HybridMenu';
import HomePage from './HomePage';
import UnifiedItemDetail from './UnifiedItemDetail';
import { LazyCoffeePage, LazyHowToDownload, LoadingFallback } from './LazyComponents';

const AppContent = () => {
  // Usando el store consolidado de vista para toda la gestión de UI
  const { 
    currentView,
    selectedItem,
    goBackFromDetail,
    isMobile: isMobileView,
    setViewport
  } = useAppView();

  let content;  switch (currentView) {
    case 'home':
      content = <HomePage />;
      break;    case 'detail':
      if (!selectedItem) {
        console.warn('[AppContent] No selectedItem found, redirecting to home');
        content = <HomePage />;
      } else {
        content = (
          <UnifiedItemDetail 
            item={selectedItem}
            onClose={goBackFromDetail}
            selectedCategory={selectedItem.category}
          />
        );
      }
      break;
    case 'coffee':
      content = (
        <Suspense fallback={<LoadingFallback message="Cargando página de donación..." />}>
          <LazyCoffeePage />
        </Suspense>
      );
      break;
    case 'howToDownload':
      content = (
        <Suspense fallback={<LoadingFallback message="Cargando instrucciones de descarga..." />}>
          <LazyHowToDownload />
        </Suspense>
      );
      break;
    default:
      console.warn('[AppContent] Unknown view:', currentView);
      content = <div>Página no encontrada</div>;
  }  // Usando useEffect para detectar cambios de tamaño y actualizar el estado en el store de vista
  useEffect(() => {
    const checkMobile = () => {
      const currentWidth = window.innerWidth;
      
      // Actualizar viewport usando setViewport que maneja isMobile, isTablet, isDesktop
      setViewport(currentWidth);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [setViewport]);

  return (
    <div className="container" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>      
      <HybridMenu />
      {content}
    </div>
  );
};

export default AppContent;
