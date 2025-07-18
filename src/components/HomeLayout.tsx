import React, { useRef, useState } from 'react';
import { useLocation, matchPath, useNavigate } from 'react-router-dom';
import UnifiedItemDetail from './UnifiedItemDetail';
import HomePage from './HomePage';
import HybridMenu from './HybridMenu';
import HowToDownload from '../pages/HowToDownload';
import CoffeePage from './CoffeePage';
import WelcomePopup, { WELCOME_POPUP_KEY } from './WelcomePopup';
import MaterialMobileMenu from './MaterialMobileMenu';
import useIsomorphicLayoutEffect from '../hooks/useIsomorphicLayoutEffect';
import { useLanguage } from '../LanguageContext';

export default function HomeLayout({ forcedLang }: { forcedLang?: string }): React.JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, setLanguage } = useLanguage();

  React.useEffect(() => {
    if (forcedLang && lang !== forcedLang) {
      setLanguage(forcedLang);
    }
    if (!forcedLang && lang !== 'es') {
      setLanguage('es');
    }
  }, [forcedLang, lang, setLanguage]);

  // Detectar si estamos en detalle
  const cleanPath = location.pathname.startsWith('/en/') ? location.pathname.replace(/^\/en/, '') : location.pathname;
  const match = matchPath('/detalle/:category/:id', cleanPath);
  const isDetail = !!match;
  const category = match?.params?.category;
  const id = match?.params?.id;

  // Detectar overlays especiales
  const isHowToDownload = cleanPath === '/como-descargar';
  const isDonaciones = cleanPath === '/donaciones';

  // Handler para volver atrás (cerrar detalle)
  const handleBack = React.useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Estado para WelcomePopup (SSR safe)
  const [welcomePopupOpen, setWelcomePopupOpen] = React.useState(false);
  useIsomorphicLayoutEffect(() => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const hasSeenWelcomePopup = localStorage.getItem(WELCOME_POPUP_KEY);
      if (!hasSeenWelcomePopup && !welcomePopupOpen) {
        const timer = setTimeout(() => setWelcomePopupOpen(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [welcomePopupOpen]);
  const closeWelcomePopup = React.useCallback(() => {
    setWelcomePopupOpen(false);
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(WELCOME_POPUP_KEY, 'true');
    }
  }, []);

  // Estado y lógica del Splash (antes en HomePage)
  const [splashOpenLocal, setSplashOpen] = useState(false);
  const splashAudios = [
    "/sonidos/samurai.mp3",
    "/sonidos/samurai.wav",
    "/sonidos/samurai1.mp3",
    "/sonidos/samurai2.mp3",
    "/sonidos/samurai3.mp3",
    "/sonidos/samurai4.mp3"
  ];
  const [pendingAudios, setPendingAudios] = useState([...splashAudios]);
  const [splashAudioLocal, setSplashAudio] = useState(splashAudios[0]);
  const audioRef = useRef(null);
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

  // Renderizado principal
  return (
    <div>
      <div style={{ position: 'relative', zIndex: 3000 }}>
        <HybridMenu
          onBack={handleBack}
          onSplashOpen={handleSplashOpen}
          splashOpen={splashOpenLocal}
          onSplashClose={handleSplashClose}
          splashAudio={splashAudioLocal}
          audioRef={audioRef}
        />
      </div>
      {/* AppBar y menú móvil siempre visibles en móvil */}
      <MaterialMobileMenu
        onSplashOpen={handleSplashOpen}
        splashOpen={splashOpenLocal}
        onSplashClose={handleSplashClose}
        splashAudio={splashAudioLocal}
        audioRef={audioRef}
      />
      {/* Overlay para detalle SOLO si isDetail y category/id definidos */}
      {isDetail && category && id ? (
        <UnifiedItemDetail category={category} id={id} onClose={handleBack} onBack={handleBack} />
      ) : isHowToDownload ? (
        <HowToDownload onAnimationEnd={handleBack} />
      ) : isDonaciones ? (
        <CoffeePage onAnimationEnd={handleBack} />
      ) : (
        <div style={{ position: 'relative', zIndex: 1, transition: 'none' }}>
          <HomePage onOverlayNavigate={navigate} />
        </div>
      )}
      {/* WelcomePopup */}
      <WelcomePopup open={welcomePopupOpen} onClose={closeWelcomePopup} />
    </div>
  );
} 