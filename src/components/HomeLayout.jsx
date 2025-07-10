import React, { useRef, useState, useEffect } from 'react';
import HomePage from './HomePage';
import HybridMenu from './HybridMenu';
import { Outlet, useLocation, matchPath, useNavigate } from 'react-router-dom';
import UnifiedItemDetail from './UnifiedItemDetail';

export default function HomeLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  // Splash state y handlers
  const [splashOpen, setSplashOpen] = useState(false);
  const [splashAudio, setSplashAudio] = useState(null);
  const audioRef = useRef(null);
  // Animación de overlays desktop
  const [overlayAnim, setOverlayAnim] = useState('super-fade-in-up');
  const [isDetailExiting, setIsDetailExiting] = useState(false);

  useEffect(() => {
    const onOverlayDetailExit = () => {
      setIsDetailExiting(true);
    };
    window.addEventListener('overlay-detail-exit', onOverlayDetailExit);
    return () => window.removeEventListener('overlay-detail-exit', onOverlayDetailExit);
  }, []);

  // Callback para cuando termina la animación de salida
  const handleDetailExited = () => {
    setIsDetailExiting(false);
    // Esperar un poco más para asegurar que la animación CSS haya terminado completamente
    setTimeout(() => {
      navigate(-1);
    }, 100);
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
          className={overlayAnim}
          style={{
            position: 'fixed',
            top: isMobile ? 49 : 64,
            left: 0,
            width: '100vw',
            height: isMobile ? 'calc(100vh - 49px)' : 'calc(100vh - 64px)',
            background: 'rgba(255,255,255,0.98)',
            zIndex: isMobile ? 2000 : 1000,
            overflowY: 'auto',
            paddingTop: 0,
            boxSizing: 'border-box',
            transition: 'box-shadow 0.3s',
          }}
        >
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