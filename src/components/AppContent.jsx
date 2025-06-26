import React, { useEffect, Suspense } from 'react';
import { useAppView, useAppUI } from '../store/useAppStore';
import { isMobileDevice } from '../utils/appUtils';
import HybridMenu from './HybridMenu';
import HomePage from './HomePage';
import UnifiedItemDetail from './UnifiedItemDetail';
import { LazyCoffeePage, LazyHowToDownload, LoadingFallback } from './LazyComponents';
import { useLanguage } from '../LanguageContext';

const AppContent = () => {
  // Usando el store consolidado de vista para toda la gestión de UI
  const { 
    currentView,
    selectedItem,
    goBackFromDetail,
    isMobile: isMobileView,
    setViewport
  } = useAppView();
  const { getTranslation } = useLanguage();

  // Scroll al top al volver a la vista 'home' desde 'detail' en desktop
  useEffect(() => {
    // Si venimos de un detalle y estamos en desktop, sube el scroll al top
    if (currentView === 'home' && !isMobileView) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        const main = document.querySelector('main');
        if (main) main.scrollTop = 0;
        const root = document.getElementById('root');
        if (root) root.scrollTop = 0;
      }, 200); // Espera breve para asegurar que HomePage se haya renderizado
    }
  }, [currentView, isMobileView]);

  // Renderiza SIEMPRE HomePage y muestra el detalle como overlay/modal si corresponde
  return (
    <>
      <HybridMenu />
      <HomePage />
      {/* Overlay/modal de detalle solo si hay selectedItem y currentView es 'detail' */}
      {currentView === 'detail' && selectedItem && (
        <UnifiedItemDetail 
          item={selectedItem}
          onClose={goBackFromDetail}
          selectedCategory={selectedItem.category}
        />
      )}
      {/* Otras vistas (coffee, howToDownload, etc) */}
      {currentView === 'coffee' && (
        <Suspense fallback={<LoadingFallback message={getTranslation('ui.states.loading_coffee', 'Cargando página de donación...')} />}>
          <LazyCoffeePage />
        </Suspense>
      )}
      {currentView === 'howToDownload' && (
        <Suspense fallback={<LoadingFallback message={getTranslation('ui.states.loading_how_to_download', 'Cargando instrucciones de descarga...')} />}>
          <LazyHowToDownload />
        </Suspense>
      )}
      {['home', 'detail', 'coffee', 'howToDownload'].indexOf(currentView) === -1 && (
        <div>{getTranslation('ui.errors.page_not_found', 'Página no encontrada')}</div>
      )}
    </>
  );
};

export default AppContent;
