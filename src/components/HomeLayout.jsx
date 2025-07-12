import React, { useRef, useState } from 'react';
import HomePage from './HomePage';
import HybridMenu from './HybridMenu';
import { Outlet, useLocation, matchPath, useNavigate } from 'react-router-dom';
import UnifiedItemDetail from './UnifiedItemDetail';
import { useAppView } from '../store/useAppStore';
import { Fab } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { CSSTransition } from 'react-transition-group';
import { useEffect } from 'react';
import HowToDownload from '../pages/HowToDownload';
import CoffeePage from './CoffeePage';

export default function HomeLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { goToCoffee, goToHowToDownload, goHome } = useAppView();
  // Splash state y handlers
  const [splashOpen, setSplashOpen] = useState(false);
  const [splashAudio, setSplashAudio] = useState(null);
  const audioRef = useRef(null);
  const overlayRef = useRef(null);

  // Refuerzo: logs y protección para que el splash solo se cierre por acción explícita
  const openSplash = (audio) => {
    setSplashAudio(audio || null);
    setSplashOpen(true);
  };
  const closeSplash = () => {
    setSplashOpen(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // Detecta si la ruta es detalle, como-descargar o donaciones
  const isDetail = !!matchPath('/detalle/:category/:id', location.pathname);
  const isHowToDownload = !!matchPath('/como-descargar', location.pathname);
  const isDonaciones = !!matchPath('/donaciones', location.pathname);
  const isOverlay = isDetail || isHowToDownload || isDonaciones;
  const isMobile = window.innerWidth < 900;

  // --- Animación de salida robusta en móvil ---
  const [showDetailOverlay, setShowDetailOverlay] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [pendingOverlayRoute, setPendingOverlayRoute] = useState(null);
  // Nuevo: guardar la última ruta de overlay para renderizar el contenido correcto durante la animación de salida
  const [lastOverlayRoute, setLastOverlayRoute] = useState(null);

  // Sincroniza el estado local con la ruta
  useEffect(() => {
    if (isMobile && isOverlay && !showDetailOverlay) {
      setShowDetailOverlay(true);
      setIsClosing(false);
      setLastOverlayRoute(location.pathname); // Guardar la ruta actual al abrir overlay
    }
    if (isMobile && !isOverlay && showDetailOverlay && !isClosing) {
      setShowDetailOverlay(false);
    }
    // Desktop: no usar overlay local
    if (!isMobile) {
      setShowDetailOverlay(false);
      setIsClosing(false);
    }
  }, [isMobile, isOverlay, showDetailOverlay, isClosing, location.pathname]);

  // Cuando se inicia el cierre, mantener la ruta del overlay anterior hasta que termine la animación
  useEffect(() => {
    if (isClosing && isMobile && isOverlay) {
      setLastOverlayRoute(location.pathname);
    }
  }, [isClosing, isMobile, isOverlay, location.pathname]);

  // Botón volver: en móvil, activa cierre; en desktop, navega directo
  const handleBack = () => {
    if (isMobile && (isDetail || lastOverlayRoute?.startsWith('/detalle/'))) {
      setIsClosing(true);
    } else {
      navigate('/');
    }
  };

  // Navegación robusta entre overlays
  const handleOverlayNavigate = (targetPath) => {
    if (isMobile && (isOverlay || isClosing)) {
      setIsClosing(true);
      setPendingOverlayRoute(targetPath);
    } else {
      // En desktop, siempre navegar con replace: true entre overlays
      if (!isMobile && (isOverlay || ['/como-descargar','/donaciones'].includes(targetPath) || targetPath.startsWith('/detalle/'))) {
        navigate(targetPath, { replace: true });
      } else {
        navigate(targetPath);
      }
    }
  };

  // Cuando termina la animación de salida, navega a home o a la ruta pendiente
  const handleMobileDetailExited = () => {
    setIsClosing(false);
    setShowDetailOverlay(false);
    if (pendingOverlayRoute) {
      navigate(pendingOverlayRoute);
      setPendingOverlayRoute(null);
    } else {
      navigate('/');
    }
    setLastOverlayRoute(null);
  };

  // Handler robusto para navegación atrás tras animación (desktop)
  const handleDetailExitedDesktop = () => {
    // Si hay historial suficiente, volver atrás; si no, ir a home
    // En overlays que no son detalle, siempre ir a home con replace: true
    if (isHowToDownload || isDonaciones) {
      navigate('/', { replace: true });
    } else if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

  // Sincroniza el estado global con la ruta
  useEffect(() => {
    if (isDonaciones) goToCoffee();
    else if (isHowToDownload) goToHowToDownload();
    else if (isDetail) {/* goToDetail se maneja automáticamente */}
    else if (location.pathname === '/') goHome();
  }, [location.pathname, goToCoffee, goToHowToDownload, goHome, isDonaciones, isHowToDownload, isDetail]);

  // Determinar qué contenido mostrar en el overlay móvil
  let overlayContent = null;
  const effectiveOverlayRoute = isClosing && lastOverlayRoute ? lastOverlayRoute : location.pathname;
  if (matchPath('/detalle/:category/:id', effectiveOverlayRoute)) {
    overlayContent = <UnifiedItemDetail isClosing={isClosing} onBack={handleBack} onExited={handleDetailExitedDesktop} />;
  } else if (effectiveOverlayRoute === '/como-descargar') {
    overlayContent = <HowToDownload />;
  } else if (effectiveOverlayRoute === '/donaciones') {
    overlayContent = <CoffeePage />;
  }

  // Overlay robusto: siempre cubre toda la pantalla, z-index muy alto, logs de ciclo de vida
  const OverlayWrapper = ({ children }) => {
    React.useEffect(() => {
      return () => {
      };
    }, []);
    return (
      <div
        style={{
          position: 'fixed',
          top: 49, // Deja visible el menú superior
          left: 0,
          width: '100vw',
          height: 'calc(100vh - 49px)', // Ajusta la altura para no tapar el menú
          zIndex: 1400, // Overlay base para detalles - por encima del menú móvil (1300)
          background: 'rgba(255,255,255,0.98)',
          overflowY: 'auto',
          boxSizing: 'border-box',
          transition: 'box-shadow 0.3s',
        }}
      >
        {children}
      </div>
    );
  };

  // Animación declarativa con CSSTransition
  return (
    <div>
      <HybridMenu
        onSplashOpen={openSplash}
        splashOpen={splashOpen}
        splashAudio={splashAudio}
        onSplashClose={closeSplash}
        audioRef={audioRef}
        onOverlayNavigate={handleOverlayNavigate}
      />
      <HomePage
        onSplashOpen={openSplash}
        splashOpen={splashOpen}
        splashAudio={splashAudio}
        onSplashClose={closeSplash}
        audioRef={audioRef}
        onOverlayNavigate={handleOverlayNavigate}
      />
      {/* Overlay de detalle móvil con animación de salida robusta */}
      {isMobile && (isOverlay || (isClosing && showDetailOverlay)) && showDetailOverlay && (
        <CSSTransition
          in={!isClosing}
          timeout={400}
          classNames="overlay-fade"
          unmountOnExit
          nodeRef={overlayRef}
          onExited={handleMobileDetailExited}
        >
          <OverlayWrapper>
            <div
              ref={overlayRef}
              key={effectiveOverlayRoute}
              style={{
                minHeight: '100vh',
                width: '100vw',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                position: 'relative',
                zIndex: 1401, // Contenido del overlay para detalles - por encima del overlay base
              }}
            >
              {/* Botón volver para páginas de descargas y donaciones en móvil */}
              {(effectiveOverlayRoute === '/como-descargar' || effectiveOverlayRoute === '/donaciones') && (
                <Fab
                  color="primary"
                  aria-label="volver"
                  onClick={() => {
                    setIsClosing(true);
                  }}
                  sx={{
                    position: 'fixed',
                    top: '73px',
                    left: 16,
                    zIndex: 1402, // FAB del overlay para detalles - por encima del contenido del overlay
                    backgroundColor: '#1976d2',
                    '&:hover': {
                      backgroundColor: '#1565c0',
                    }
                  }}
                >
                  <ArrowBackIcon />
                </Fab>
              )}
              {overlayContent}
            </div>
          </OverlayWrapper>
        </CSSTransition>
      )}
      {/* Overlay para desktop y otros overlays */}
      {!isMobile && (
        <CSSTransition
          in={isOverlay}
          timeout={400}
          classNames="overlay-fade"
          unmountOnExit
          nodeRef={overlayRef}
          onExited={() => goHome()}
        >
          <div
            ref={overlayRef}
            key={location.pathname}
            style={{
              position: 'fixed',
              top: 64,
              left: 0,
              width: '100vw',
              height: 'calc(100vh - 64px)',
              background: 'rgba(255,255,255,0.98)',
              zIndex: 1400, // Overlay desktop - por encima del menú móvil (1300)
              overflowY: 'auto',
              paddingTop: 0,
              boxSizing: 'border-box',
              transition: 'box-shadow 0.3s',
            }}
          >
            <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto', paddingTop: 24 }}>
              {/* Botón de volver para overlays que no son detalle */}
              {/* ELIMINADO: FAB duplicado en overlays desktop para donaciones y otros overlays */}
            </div>
            {/* Renderizar UnifiedItemDetail manualmente para detalle, Outlet para el resto */}
            {isDetail ? (
              <UnifiedItemDetail />
            ) : (
              <Outlet key={location.pathname} />
            )}
          </div>
        </CSSTransition>
      )}
      <style>{`
        .overlay-fade-enter { opacity: 0; transform: translateY(40px); }
        .overlay-fade-enter-active { opacity: 1; transform: translateY(0); transition: opacity 400ms, transform 400ms; }
        .overlay-fade-exit { opacity: 1; transform: translateY(0); }
        .overlay-fade-exit-active { opacity: 0; transform: translateY(40px); transition: opacity 400ms, transform 400ms; }
      `}</style>
    </div>
  );
} 