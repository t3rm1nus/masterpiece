import React, { useEffect, useRef } from "react";
import { useLanguage } from "../LanguageContext";
import { useGoogleAnalytics } from "../hooks/useGoogleAnalytics";
import useIsomorphicLayoutEffect from '../hooks/useIsomorphicLayoutEffect';

const WELCOME_POPUP_KEY = "masterpiece_welcome_popup_seen";

interface WelcomePopupProps {
  open: boolean;
  onClose: () => void;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ open, onClose }) => {
  const { lang, getTranslation } = useLanguage();
  // LOGS TEMPORALES DE DEPURACIÓN
  console.log('LANG:', lang);
  console.log('INTRO:', getTranslation('ui.welcome_popup.intro'));
  const { trackPopupView } = useGoogleAnalytics();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Google Analytics tracking para popup de bienvenida
  useEffect(() => {
    if (open) {
      trackPopupView('welcome_popup', {
        popup_title: 'Quiénes Somos - Bienvenida',
        language: lang,
        trigger: 'first_visit'
      });
    }
  }, [open, trackPopupView, lang]);

  // Detectar móvil solo en cliente (SSR-safe)
  const [isMobile, setIsMobile] = React.useState(false);
  useIsomorphicLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth <= 600);
    }
  }, []);

  // Mostrar español por defecto si el idioma no es 'en'
  const popupLang = lang === 'en' ? 'en' : 'es';

  const getSafe = (val: any, fallback: string) => (typeof val === 'string' && val.trim() !== '' ? val : fallback);
  const messages: Record<'es' | 'en', React.ReactNode> = {
    es: (
      <>
        <div style={{ fontSize: "1.1em", lineHeight: 1.6 }}>
         <span role="img" aria-label="art">🎨📚🎶🎬</span> {getTranslation('ui.welcome_popup.intro', '¡Bienvenido a Masterpiece!')}<br />
         <span role="img" aria-label="target">🎯📲</span> {getTranslation('ui.welcome_popup.objective', 'Descubre y comparte cultura de forma sencilla.')}<br />
        <span role="img" aria-label="welcome">🌟🎁</span> <b>{getTranslation('ui.welcome_popup.welcome', '¡Disfruta la experiencia!')}</b>
        </div>
      </>
    ),
    en: (
      <>
        <div style={{ fontSize: "1.1em", lineHeight: 1.6 }}>
          <span role="img" aria-label="art">🎨📚🎶🎬</span> {getTranslation('ui.welcome_popup.intro', 'Welcome to Masterpiece!')}<br /><br />
          <span role="img" aria-label="target">🎯📲</span> {getTranslation('ui.welcome_popup.objective', 'Discover and share culture easily.')}<br /><br />
          <span role="img" aria-label="welcome">🌟🎁</span> <b>{getTranslation('ui.welcome_popup.welcome', 'Enjoy the experience!')}</b>
        </div>
      </>
    )
  };

  useEffect(() => {
  }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", onKeyDown);
    }
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (e.target === overlayRef.current) onClose();
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        zIndex: 1500, // Popup de bienvenida - por encima de overlays pero por debajo del splash
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        onClick={onClose}
        style={{
          background: "#fff",
          color: "#222",
          borderRadius: 18,
          maxWidth: 420,
          width: "90vw",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          padding: "2.2em 1.5em 1.5em 1.5em",
          cursor: "pointer",
          textAlign: "left",
          fontFamily: "inherit",
          fontSize: "1.05em",
          position: "relative"
        }}
        tabIndex={0}
        aria-modal="true"
        role="dialog"
      >
        {messages[popupLang]}
      </div>
    </div>
  );
};

export default WelcomePopup;
export { WELCOME_POPUP_KEY }; 