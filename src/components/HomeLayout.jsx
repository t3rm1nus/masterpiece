import React, { useRef, useState } from 'react';
import HomePage from './HomePage';
import HybridMenu from './HybridMenu';
import { Outlet, useLocation, matchPath, useNavigate } from 'react-router-dom';
import UnifiedItemDetail from './UnifiedItemDetail';
import { useAppView } from '../store/useAppStore';
import { useEffect } from 'react';
import HowToDownload from '../pages/HowToDownload';
import CoffeePage from './CoffeePage';
import { AnimatePresence, motion } from 'framer-motion';

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
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Estado de animación para desktop
  const [showDesktopOverlay, setShowDesktopOverlay] = useState(false);
  const [isDesktopClosing, setIsDesktopClosing] = useState(false);



  // Sincroniza el estado local con la ruta
  useEffect(() => {
    // Evitar cambios de estado durante la navegación
    if (isNavigating) return;
    
    // Si estamos en móvil y hay una ruta de overlay, mostrar el overlay inmediatamente
    if (isMobile && isOverlay) {
      if (!showDetailOverlay && !isClosing) {
        setShowDetailOverlay(true);
        setIsClosing(false);
      }
    } else if (isMobile && !isOverlay && showDetailOverlay) {
      // Móvil: ocultar overlay inmediatamente al salir
      setShowDetailOverlay(false);
      setIsClosing(false);
    }
    // Desktop: manejar overlay de forma más simple
    if (!isMobile) {
      if (isOverlay && !showDesktopOverlay) {
        setShowDesktopOverlay(true);
      } else if (!isOverlay && showDesktopOverlay) {
        // Para páginas de descargas y donaciones, ocultar inmediatamente
        if (isHowToDownload || isDonaciones) {
          setShowDesktopOverlay(false);
        } else {
          // Para detalles, mantener el estado hasta que termine la animación
          if (!isDesktopClosing) {
            setShowDesktopOverlay(false);
          }
        }
      }
    }
  }, [isMobile, isOverlay, showDetailOverlay, isClosing, showDesktopOverlay, isDesktopClosing, location.pathname, isDetail, isHowToDownload, isDonaciones, isNavigating]);



  // Botón volver: en móvil, navegación instantánea; en desktop, navegación instantánea
  const handleBack = () => {
    if (isMobile && isOverlay) {
      // Móvil: navegación instantánea sin animación
      if (isHowToDownload || isDonaciones) {
        navigate('/', { replace: true });
      } else {
        navigate('/');
      }
    } else if (!isMobile && isOverlay) {
      // Desktop: navegación instantánea sin animación
      // Para páginas de descargas y donaciones, usar replace para evitar historial
      if (isHowToDownload || isDonaciones) {
        navigate('/', { replace: true });
      } else {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  // Navegación robusta entre overlays
  const handleOverlayNavigate = (targetPath) => {
    if (isMobile && (isOverlay || isClosing)) {
      setIsClosing(true);
      setIsNavigating(true);
      setPendingOverlayRoute(targetPath);
    } else if (!isMobile && (isOverlay || isDesktopClosing)) {
      // Desktop: activar animación de salida antes de navegar
      setIsDesktopClosing(true);
      setIsNavigating(true);
      setPendingOverlayRoute(targetPath);
      setTimeout(() => {
        handleDesktopDetailExited();
      }, 400);
    } else {
      // Navegación directa
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
    // Navegar inmediatamente sin delay adicional
    if (pendingOverlayRoute) {
      navigate(pendingOverlayRoute);
      setPendingOverlayRoute(null);
    } else {
      navigate('/');
    }
    // Resetear el estado de navegación después de un breve delay
    setTimeout(() => {
      setIsNavigating(false);
    }, 100);
  };

  // Handler para navegación tras animación en desktop
  const handleDesktopDetailExited = () => {
    // Para páginas de descargas y donaciones, navegación instantánea
    if (isHowToDownload || isDonaciones) {
      navigate('/', { replace: true });
    } else {
      // Para detalles, manejar animación de salida
      setIsDesktopClosing(false);
      setShowDesktopOverlay(false);
      if (pendingOverlayRoute) {
        navigate(pendingOverlayRoute);
        setPendingOverlayRoute(null);
      } else {
        navigate('/');
      }
      setTimeout(() => {
        setIsNavigating(false);
      }, 200);
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
    overlayContent = <UnifiedItemDetail isClosing={false} onBack={handleBack} onExited={handleMobileDetailExited} />;
  } else if (location.pathname === '/como-descargar') {
    overlayContent = <HowToDownload onAnimationEnd={handleMobileDetailExited} />;
  } else if (location.pathname === '/donaciones') {
    overlayContent = <CoffeePage onAnimationEnd={handleMobileDetailExited} />;
  }

  // Determinar qué contenido mostrar en el overlay desktop
  let desktopOverlayContent = null;
  if (matchPath('/detalle/:category/:id', location.pathname)) {
    desktopOverlayContent = <UnifiedItemDetail isClosing={isDesktopClosing} onBack={handleBack} onExited={handleDesktopDetailExited} />;
  } else if (location.pathname === '/como-descargar') {
    desktopOverlayContent = <HowToDownload onAnimationEnd={handleDesktopDetailExited} />;
  } else if (location.pathname === '/donaciones') {
    desktopOverlayContent = <CoffeePage onAnimationEnd={handleDesktopDetailExited} />;
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
          // Sin transición de opacidad para navegación instantánea
        }}
      >
        {children}
      </div>
    );
  };

  // Overlay para desktop sin animaciones
  const DesktopOverlayWrapper = ({ children }) => {
    return (
      <div
        style={{
          position: 'fixed',
          top: 70, // Exactamente debajo del menú híbrido (70px de altura)
          left: 0,
          width: '100vw',
          height: 'calc(100vh - 70px)', // Ajusta la altura para no tapar el menú
          zIndex: 1200, // Por encima de la home pero por debajo del menú
          background: 'rgba(255,255,255,0.98)',
          overflowY: 'auto',
          boxSizing: 'border-box',
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
      {/* HomePage siempre visible excepto cuando hay overlay activo en móvil */}
      {(!isMobile || !showDetailOverlay) && (
        <HomePage
          onSplashOpen={openSplash}
          splashOpen={splashOpen}
          splashAudio={splashAudio}
          onSplashClose={closeSplash}
          audioRef={audioRef}
          onOverlayNavigate={handleOverlayNavigate}
        />
      )}
      
      {/* Overlay móvil simplificado sin animación de salida */}
      {isMobile && showDetailOverlay && (
        <OverlayWrapper>
          {overlayContent}
        </OverlayWrapper>
      )}
      
      {/* Overlay desktop sin animaciones */}
      {!isMobile && showDesktopOverlay && desktopOverlayContent && (
        <DesktopOverlayWrapper>
          {desktopOverlayContent}
        </DesktopOverlayWrapper>
      )}
    </div>
  );
} 