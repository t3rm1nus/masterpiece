import React, { useRef, useState } from 'react';
import HomePage from './HomePage';
import HybridMenu from './HybridMenu';
import { Outlet, useLocation, matchPath, useNavigate } from 'react-router-dom';
import UnifiedItemDetail from './UnifiedItemDetail';
import { useAppView } from '../store/useAppStore';
import { Fade } from '@mui/material';
import { useEffect } from 'react';
import HowToDownload from '../pages/HowToDownload';
import CoffeePage from './CoffeePage';
import { useOverlayAnimation } from '../hooks/useMaterialAnimation';

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

  // --- Animación de salida simplificada ---
  const [showDetailOverlay, setShowDetailOverlay] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [pendingOverlayRoute, setPendingOverlayRoute] = useState(null);

  // Usar hook de animación para overlays
  const overlayAnimationProps = useOverlayAnimation(showDetailOverlay || isClosing);

  // Sincroniza el estado local con la ruta
  useEffect(() => {
    if (isMobile && isOverlay && !showDetailOverlay) {
      setShowDetailOverlay(true);
      setIsClosing(false);
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

  // Botón volver: en móvil, activa cierre; en desktop, navega directo
  const handleBack = () => {
    if (isMobile && isOverlay) {
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
  if (matchPath('/detalle/:category/:id', location.pathname)) {
    overlayContent = <UnifiedItemDetail isClosing={isClosing} onBack={handleBack} onExited={handleMobileDetailExited} />;
  } else if (location.pathname === '/como-descargar') {
    overlayContent = <HowToDownload onAnimationEnd={handleMobileDetailExited} />;
  } else if (location.pathname === '/donaciones') {
    overlayContent = <CoffeePage onAnimationEnd={handleMobileDetailExited} />;
  }

  // Overlay simplificado: siempre cubre toda la pantalla, z-index muy alto
  const OverlayWrapper = ({ children }) => {
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
      
      {/* Overlay móvil con Material-UI Fade */}
      <Fade {...overlayAnimationProps} onExited={() => setShowDetailOverlay(false)}>
        {isMobile && (showDetailOverlay || isClosing) && (
          <OverlayWrapper>
            {overlayContent}
          </OverlayWrapper>
        )}
      </Fade>
      
      {/* Desktop: renderizado directo sin overlay */}
      {!isMobile && (
        <Outlet />
      )}
    </div>
  );
} 