import React, { useRef, useState, useEffect } from 'react';
import HomePage from './HomePage';
import HybridMenu from './HybridMenu';
import { Outlet, useLocation, matchPath, useNavigate } from 'react-router-dom';
import UnifiedItemDetail from './UnifiedItemDetail';
import { useAppView } from '../store/useAppStore';
import { Fab } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

export default function HomeLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { goToCoffee, goToHowToDownload, goHome } = useAppView();
  // Splash state y handlers
  const [splashOpen, setSplashOpen] = useState(false);
  const [splashAudio, setSplashAudio] = useState(null);
  const audioRef = useRef(null);
  // Animación de overlays desktop
  const [overlayAnim, setOverlayAnim] = useState('super-fade-in-up');
  const [isDetailExiting, setIsDetailExiting] = useState(false);
  const [isOverlayExiting, setIsOverlayExiting] = useState(false);

  // Actualizar currentView cuando cambie la ruta entre overlays
  useEffect(() => {
    if (matchPath('/donaciones', location.pathname)) {
      goToCoffee();
    } else if (matchPath('/como-descargar', location.pathname)) {
      goToHowToDownload();
    } else if (matchPath('/detalle/:id', location.pathname)) {
      // goToDetail se maneja automáticamente
    } else {
      // Si no es ninguna ruta de overlay, volver a home
      goHome();
    }
  }, [location.pathname, goToCoffee, goToHowToDownload, goHome]);

  useEffect(() => {
    const onOverlayDetailExit = () => {
      setIsDetailExiting(true);
    };
    const onOverlayExit = () => {
      setIsOverlayExiting(true);
    };
    window.addEventListener('overlay-detail-exit', onOverlayDetailExit);
    window.addEventListener('overlay-exit', onOverlayExit);
    return () => {
      window.removeEventListener('overlay-detail-exit', onOverlayDetailExit);
      window.removeEventListener('overlay-exit', onOverlayExit);
    };
  }, []);

  // Callback para cuando termina la animación de salida
  const handleDetailExited = () => {
    setIsDetailExiting(false);
    // Navegar directamente a la home en lugar de usar navigate(-1)
    navigate('/');
  };

  // Callback para cuando termina la animación de salida del overlay
  const handleOverlayExited = () => {
    setIsOverlayExiting(false);
    // Navegar directamente a la home en lugar de usar navigate(-1)
    navigate('/');
  };

  const handleSplashOpen = (audio) => {
    setSplashAudio(audio || null);
    setSplashOpen(true);
  };
  const handleSplashClose = () => {
    setSplashOpen(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };
  // Detecta si la ruta es detalle, como-descargar o donaciones
  const isOverlay = !!(
    matchPath('/detalle/:id', location.pathname) ||
    matchPath('/como-descargar', location.pathname) ||
    matchPath('/donaciones', location.pathname)
  );
  const isMobile = window.innerWidth < 900;

  // Handler para cerrar overlay con animación
  const handleOverlayClose = () => {
    setOverlayAnim('super-fade-out-down');
    setTimeout(() => {
      setOverlayAnim('super-fade-in-up');
      navigate(-1);
    }, 500); // Duración igual a la animación
  };

  return (
    <div>
      <HybridMenu
        onSplashOpen={handleSplashOpen}
        splashOpen={splashOpen}
        splashAudio={splashAudio}
        onSplashClose={handleSplashClose}
        audioRef={audioRef}
      />
      <HomePage
        onSplashOpen={handleSplashOpen}
        splashOpen={splashOpen}
        splashAudio={splashAudio}
        onSplashClose={handleSplashClose}
        audioRef={audioRef}
      />
      {isOverlay && (
        <div
          key={location.pathname}
          className={isOverlayExiting ? 'super-fade-out-down' : overlayAnim}
          style={{
            position: 'fixed',
            top: isMobile ? 49 : 64,
            left: 0,
            width: '100vw',
            height: isMobile ? 'calc(100vh - 49px)' : 'calc(100vh - 64px)',
            background: 'rgba(255,255,255,0.98)',
            zIndex: isMobile ? 1000 : 1000, // Por debajo del menú superior (1200)
            overflowY: 'auto',
            paddingTop: 0,
            boxSizing: 'border-box',
            transition: 'box-shadow 0.3s',
          }}
          onAnimationEnd={() => {
            if (isOverlayExiting) {
              handleOverlayExited();
            }
          }}
        >
          {/* Botón de volver para páginas que no son detalle */}
          {!matchPath('/detalle/:id', location.pathname) && (
            <Fab
              color="primary"
              aria-label="volver"
              onClick={() => {
                // Disparar evento para animación de salida
                window.dispatchEvent(new CustomEvent('overlay-exit'));
              }}
              sx={{
                position: 'fixed',
                top: isMobile ? 63 : 24,
                left: 16,
                zIndex: 1300,
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0',
                }
              }}
            >
              <ArrowBackIcon />
            </Fab>
          )}
          {/* Wrapper para alinear el contenido principal, sin botón volver */}
          <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto' }} />
          {/* Renderizar UnifiedItemDetail manualmente para pasarle isExiting y onExited solo en detalle */}
          {matchPath('/detalle/:id', location.pathname) ? (
            <UnifiedItemDetail isExiting={isDetailExiting} onExited={handleDetailExited} />
          ) : (
            <Outlet key={location.pathname} />
          )}
        </div>
      )}
    </div>
  );
} 