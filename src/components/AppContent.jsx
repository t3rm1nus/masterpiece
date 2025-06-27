import React, { useEffect, Suspense, useRef, useState } from 'react';
import { useAppView, useAppUI } from '../store/useAppStore';
import { isMobileDevice } from '../utils/appUtils';
import HybridMenu from './HybridMenu';
import HomePage from './HomePage';
import UnifiedItemDetail from './UnifiedItemDetail';
import { LazyCoffeePage, LazyHowToDownload, LoadingFallback } from './LazyComponents';
import { useLanguage } from '../LanguageContext';
import MaterialMobileMenu from './MaterialMobileMenu';

/**
 * AppContent
 *
 * Componente principal que orquesta la navegación y renderizado de las vistas principales de la app.
 * Siempre renderiza HomePage y muestra overlays/modales según el estado global (detalle, donaciones, instrucciones, etc).
 * Gestiona el scroll y la experiencia de usuario al cambiar de vista.
 */
const splashAudios = [
  "/sonidos/samurai.mp3",
  "/sonidos/samurai.wav",
  "/sonidos/samurai1.mp3",
  "/sonidos/samurai2.mp3",
  "/sonidos/samurai3.mp3",
  "/sonidos/samurai4.mp3"
];

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
  const audioRef = useRef(null);
  const [splashOpen, setSplashOpen] = useState(false);
  const [pendingAudios, setPendingAudios] = useState([...splashAudios]);
  const [splashAudio, setSplashAudio] = useState(splashAudios[0]);

  const handleSplashOpen = () => {
    let audiosToUse = pendingAudios.length > 0 ? pendingAudios : [...splashAudios];
    const randomIdx = Math.floor(Math.random() * audiosToUse.length);
    const randomAudio = audiosToUse[randomIdx];
    setSplashAudio(randomAudio);
    setSplashOpen(true);
    const newPending = audiosToUse.filter((a, i) => i !== randomIdx);
    setPendingAudios(newPending);
  };

  const handleSplashClose = () => {
    setSplashOpen(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

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
        console.log('[AppContent] Scroll al top tras volver a home (desktop)');
      }, 200); // Espera breve para asegurar que HomePage se haya renderizado
    }
  }, [currentView, isMobileView]);

  // Scroll al top al entrar en un detalle (móvil y desktop)
  useEffect(() => {
    if (currentView === 'detail') {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
        document.documentElement.scrollTop = 0;
      }, 200); // Espera breve para asegurar que el detalle se haya renderizado
    }
  }, [currentView]);

  // Renderiza SIEMPRE HomePage y muestra el detalle como overlay/modal si corresponde
  return (
    <>
      {/* HybridMenu siempre visible para acceso global al splash/info */}
      <HybridMenu
        onSplashOpen={handleSplashOpen}
        splashAudio={splashAudio}
        splashOpen={splashOpen}
        onSplashClose={handleSplashClose}
        audioRef={audioRef}
      />
      {/* MaterialMobileMenu siempre visible en móvil para acceso global al splash/info */}
      {isMobileView && (
        <MaterialMobileMenu
          onSplashOpen={handleSplashOpen}
          splashAudio={splashAudio}
          splashOpen={splashOpen}
          onSplashClose={handleSplashClose}
          audioRef={audioRef}
        />
      )}
      {/* Renderiza HomePage solo si estamos en la vista home */}
      {currentView === 'home' && (
        <HomePage
          splashAudio={splashAudio}
          splashOpen={splashOpen}
          onSplashOpen={handleSplashOpen}
          onSplashClose={handleSplashClose}
          audioRef={audioRef}
        />
      )}
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
      {/* Renderiza mensaje de error si la vista no existe */}
      {['home', 'detail', 'coffee', 'howToDownload'].indexOf(currentView) === -1 && (
        <div>{getTranslation('ui.errors.page_not_found', 'Página no encontrada')}</div>
      )}
    </>
  );
};

export default AppContent;
