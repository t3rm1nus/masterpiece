import React, { useEffect, Suspense, useRef, useState } from 'react';
import { useAppView } from '../store/useAppStore';
import { useLanguage } from '../LanguageContext';
import HybridMenu from './HybridMenu';
import HomePage from './HomePage';
import UnifiedItemDetail from './UnifiedItemDetail';
import { LazyCoffeePage, LazyHowToDownload, LoadingFallback } from './LazyComponents';
import MaterialMobileMenu from './MaterialMobileMenu';
import { Box, Fade, Slide } from '@mui/material';

/**
 * AppContent (migrado a layout moderno con animaciones y overlays accesibles)
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
  const {
    currentView,
    selectedItem,
    goBackFromDetail,
    isMobile: isMobileView
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
    if (currentView === 'home' && !isMobileView) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        const main = document.querySelector('main');
        if (main) main.scrollTop = 0;
        const root = document.getElementById('root');
        if (root) root.scrollTop = 0;
      }, 200);
    }
  }, [currentView, isMobileView]);

  // Scroll al top al entrar en un detalle (móvil y desktop)
  useEffect(() => {
    if (currentView === 'detail') {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
        document.documentElement.scrollTop = 0;
      }, 200);
    }
  }, [currentView]);

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', position: 'relative', background: '#fafbfc' }}>
      {/* Menús globales */}
      <HybridMenu
        onSplashOpen={handleSplashOpen}
        splashAudio={splashAudio}
        splashOpen={splashOpen}
        onSplashClose={handleSplashClose}
        audioRef={audioRef}
      />
      {isMobileView && (
        <MaterialMobileMenu
          onSplashOpen={handleSplashOpen}
          splashAudio={splashAudio}
          splashOpen={splashOpen}
          onSplashClose={handleSplashClose}
          audioRef={audioRef}
        />
      )}
      {/* HomePage animada */}
      <Fade in={currentView === 'home'} timeout={400} unmountOnExit>
        <Box>
          <HomePage
            splashAudio={splashAudio}
            splashOpen={splashOpen}
            onSplashOpen={handleSplashOpen}
            onSplashClose={handleSplashClose}
            audioRef={audioRef}
          />
        </Box>
      </Fade>
      {/* Overlay/modal de detalle animado y accesible */}
      <Slide direction="up" in={currentView === 'detail' && !!selectedItem} mountOnEnter unmountOnExit timeout={400}>
        <Box sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 1100, // Más bajo que el menú híbrido
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: 'none',
          backdropFilter: 'none',
          overflowY: 'auto',
          pointerEvents: 'none', // Permite clicks a través del overlay
          pt: { xs: '72px', md: '88px' },
        }} aria-modal="true" role="dialog">
          <Box sx={{ pointerEvents: 'auto', width: '100%' }}>
            {selectedItem ? (
              <UnifiedItemDetail
                item={selectedItem}
                onClose={goBackFromDetail}
                selectedCategory={selectedItem.category}
              />
            ) : (
              <Box sx={{ minHeight: 200 }} />
            )}
          </Box>
        </Box>
      </Slide>
      {/* Otras vistas (coffee, howToDownload) animadas */}
      <Fade in={currentView === 'coffee'} timeout={400} mountOnEnter unmountOnExit>
        <Box>
          <Suspense fallback={<LoadingFallback message={getTranslation('ui.states.loading_coffee', 'Cargando página de donación...')} />}>
            <LazyCoffeePage />
          </Suspense>
        </Box>
      </Fade>
      <Fade in={currentView === 'howToDownload'} timeout={400} mountOnEnter unmountOnExit>
        <Box>
          <Suspense fallback={<LoadingFallback message={getTranslation('ui.states.loading_how_to_download', 'Cargando instrucciones de descarga...')} />}>
            <LazyHowToDownload />
          </Suspense>
        </Box>
      </Fade>
      {/* Página no encontrada */}
      <Fade in={['home', 'detail', 'coffee', 'howToDownload'].indexOf(currentView) === -1} timeout={400} unmountOnExit>
        <Box sx={{ p: 6, textAlign: 'center', color: '#b00', fontWeight: 700 }}>
          {getTranslation('ui.errors.page_not_found', 'Página no encontrada')}
        </Box>
      </Fade>
    </Box>
  );
};

export default AppContent;
