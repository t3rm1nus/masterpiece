import React, { useEffect, Suspense } from 'react';
import { useLanguage } from '../LanguageContext';
import useViewStore from '../store/viewStore';
import { isMobileDevice } from '../utils/appUtils';
import HybridMenu from './HybridMenu';
import HomePage from './HomePage';
import { LazyItemDetail, LazyCoffeePage, LoadingFallback } from './LazyComponents';

const AppContent = () => {  
  const { lang } = useLanguage();
    // Usando el store consolidado de vista para toda la gestión de UI
  const { 
    isMobile: isMobileUI, 
    mobileMenuOpen, 
    setMobile, 
    currentView
  } = useViewStore();

  let content;  switch (currentView) {
    case 'home':
      content = <HomePage />;
      break;
    case 'detail':
      content = (
        <Suspense fallback={<LoadingFallback message="Cargando detalle..." />}>
          <LazyItemDetail />
        </Suspense>
      );
      break;
    case 'coffee':
      content = (
        <Suspense fallback={<LoadingFallback message="Cargando página de donación..." />}>
          <LazyCoffeePage />
        </Suspense>
      );
      break;
    default:
      content = <div>Página no encontrada</div>;
  }

  // Usando useEffect para detectar cambios de tamaño y actualizar el estado en el store de UI
  useEffect(() => {
    const checkMobile = () => setMobile(isMobileDevice(window.innerWidth));
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setMobile]);  

  return (
    <div className="container" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>      
      <HybridMenu />
      {content}
    </div>
  );
};

export default AppContent;
