import React, { useEffect, Suspense, useRef, useState } from 'react';
import { useAppView } from '../store/useAppStore';
import { useLanguage } from '../LanguageContext';
import HomePage from './HomePage';
import UnifiedItemDetail from './UnifiedItemDetail';
import { LazyCoffeePage, LazyHowToDownload, LoadingFallback } from './LazyComponents';
import MaterialMobileMenu from './MaterialMobileMenu';
import HybridMenu from './HybridMenu';
import { Box, Fade, Slide } from '@mui/material';
import WelcomePopup, { WELCOME_POPUP_KEY } from "./WelcomePopup";
import { safeStorage } from '../utils/safeStorage.js';

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
  const [isClosingDetail, setIsClosingDetail] = useState(false);
  const [isClosingCoffee, setIsClosingCoffee] = useState(false);
  const [isClosingHowToDownload, setIsClosingHowToDownload] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(false);

  // Estado local robusto para el detalle
  const [detailItem, setDetailItem] = useState(null);

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

  // Mostrar popup solo la primera vez
  useEffect(() => {
    const hasSeenWelcome = safeStorage.getItem('welcomeShown');
    if (!hasSeenWelcome) {
      setWelcomeOpen(true);
    }
  }, []);

  const handleWelcomeClose = () => {
    setWelcomeOpen(false);
    safeStorage.setItem('welcomeShown', 'true');
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

  React.useEffect(() => {
    if (isClosingDetail) {
      const timeout = setTimeout(() => {
        goBackFromDetail();
        setIsClosingDetail(false);
      }, 600); // Debe coincidir con la duración de la animación
      return () => clearTimeout(timeout);
    }
  }, [isClosingDetail, goBackFromDetail]);

  React.useEffect(() => {
    if (isClosingCoffee) {
      const timeout = setTimeout(() => {
        // Asume que hay un método goBackFromCoffee en useAppView
        if (typeof window.goBackFromCoffee === 'function') {
          window.goBackFromCoffee();
        } else if (typeof goBackFromDetail === 'function') {
          goBackFromDetail(); // fallback
        }
        setIsClosingCoffee(false);
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [isClosingCoffee, goBackFromDetail]);

  React.useEffect(() => {
    if (isClosingHowToDownload) {
      const timeout = setTimeout(() => {
        // Asume que hay un método goBackFromHowToDownload en useAppView
        if (typeof window.goBackFromHowToDownload === 'function') {
          window.goBackFromHowToDownload();
        } else if (typeof goBackFromDetail === 'function') {
          goBackFromDetail(); // fallback
        }
        setIsClosingHowToDownload(false);
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [isClosingHowToDownload, goBackFromDetail]);

  // Callback estable para el botón Volver del menú superior
  const handleBackFromDetail = React.useCallback(() => {
    if (currentView === 'detail' && selectedItem) {
      setIsClosingDetail(true);
    }
  }, [currentView, selectedItem]);

  // --- ARREGLO: Limpiar selectedItem solo después de la animación ---
  // Creamos una función local para separar el setView y el setSelectedItem
  const { setSelectedItem, setView } = useAppView();
  const goBackFromDetailAfterAnimation = React.useCallback(() => {
    setView('home');
    setTimeout(() => setSelectedItem(null), 400); // Espera a que termine la animación de salida
  }, [setView, setSelectedItem]);

  // Usar esta función en vez de goBackFromDetail en el efecto de cierre
  React.useEffect(() => {
    if (isClosingDetail) {
      const timeout = setTimeout(() => {
        goBackFromDetailAfterAnimation();
        setIsClosingDetail(false);
        setDetailItem(null); // Limpia el detalle tras la animación
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [isClosingDetail, goBackFromDetailAfterAnimation]);

  // Sincroniza detailItem solo al abrir el detalle
  useEffect(() => {
    if (currentView === 'detail' && selectedItem) {
      setDetailItem(selectedItem);
    }
    // Limpia detailItem al salir de la vista detail
    if (currentView !== 'detail' && detailItem) {
      setDetailItem(null);
    }
    // eslint-disable-next-line
  }, [currentView, selectedItem]);

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', position: 'relative', background: '#fafbfc' }}>
      <WelcomePopup open={welcomeOpen} onClose={handleWelcomeClose} />
      {/* Menú superior desktop siempre visible, con onBack dinámico */}
      <HybridMenu
        onSplashOpen={handleSplashOpen}
        splashAudio={splashAudio}
        splashOpen={splashOpen}
        onSplashClose={handleSplashClose}
        audioRef={audioRef}
        onBack={() => {
          if (currentView === 'detail' && selectedItem) {
            setIsClosingDetail(true);
          } else if (currentView === 'coffee') {
            setIsClosingCoffee(true);
          } else if (currentView === 'howToDownload') {
            setIsClosingHowToDownload(true);
          } else {
            console.log('[AppContent] onBack ignorado: no hay detalle activo');
          }
        }}
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
      {/* HomePage solo se renderiza en desktop si currentView === 'home'. En mobile, Fade animado. */}
      {isMobileView ? (
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
      ) : (
        currentView === 'home' && (
          <Box>
            <HomePage
              splashAudio={splashAudio}
              splashOpen={splashOpen}
              onSplashOpen={handleSplashOpen}
              onSplashClose={handleSplashClose}
              audioRef={audioRef}
            />
          </Box>
        )
      )}
      {/* Overlay/modal de detalle animado y accesible */}
      <Slide direction="up" in={currentView === 'detail' && !!selectedItem && !isClosingDetail} mountOnEnter unmountOnExit timeout={400} key={selectedItem ? selectedItem.id : 'empty'}>
        <Box sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 1050,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: 'none',
          backdropFilter: 'none',
          overflowY: 'auto',
          pointerEvents: 'none',
          pt: { xs: '72px', md: '88px' },
        }} aria-modal="true" role="dialog">
          <Box sx={{ pointerEvents: 'auto', width: '100%' }}>
            {selectedItem ? (
              <UnifiedItemDetail
                key={selectedItem.id}
                item={selectedItem}
                onClose={() => setIsClosingDetail(true)}
                selectedCategory={selectedItem.category}
                onRequestClose={() => setIsClosingDetail(true)}
              />
            ) : (
              <Box sx={{ minHeight: 200 }} />
            )}
          </Box>
        </Box>
      </Slide>
      {/* Overlay/modal de donación animado y accesible */}
      <Slide direction="up" in={currentView === 'coffee' && !isClosingCoffee} mountOnEnter unmountOnExit timeout={400}>
        <Box sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 1050,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: 'none',
          backdropFilter: 'none',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          pointerEvents: 'none',
          pt: { xs: '-10px', md: '-10px' }, // 20px menos que antes, margen negativo para pegar aún más
        }} aria-modal="true" role="dialog" data-page="coffee">
          <Box sx={{ pointerEvents: 'auto', width: '100%' }}>
            <Suspense fallback={<LoadingFallback message={getTranslation('ui.states.loading_coffee', 'Cargando página de donación...')} />}>
              <LazyCoffeePage onClose={() => setIsClosingCoffee(true)} />
            </Suspense>
          </Box>
        </Box>
      </Slide>
      {/* Overlay/modal de cómo descargar animado y accesible */}
      <Slide direction="up" in={currentView === 'howToDownload' && !isClosingHowToDownload} mountOnEnter unmountOnExit timeout={400}>
        <Box sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 1050,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: 'none',
          backdropFilter: 'none',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          pointerEvents: 'none',
          pt: { xs: '32px', md: '36px' }, // espacio superior aún más reducido en desktop
        }} aria-modal="true" role="dialog" data-page="howToDownload">
          <Box sx={{ pointerEvents: 'auto', width: '100%' }}>
            <Suspense fallback={<LoadingFallback message={getTranslation('ui.states.loading_how_to_download', 'Cargando instrucciones de descarga...')} />}>
              <LazyHowToDownload onClose={() => setIsClosingHowToDownload(true)} />
            </Suspense>
          </Box>
        </Box>
      </Slide>
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
