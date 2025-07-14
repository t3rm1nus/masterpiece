import React, { useEffect, useRef } from "react";
import { useLanguage } from "../LanguageContext";
import { useGoogleAnalytics } from "../hooks/useGoogleAnalytics";
import texts from "../data/texts.json";

const WELCOME_POPUP_KEY = "masterpiece_welcome_popup_seen";

export default function WelcomePopup({ open, onClose }) {
  const { language } = useLanguage();
  const { trackPopupView } = useGoogleAnalytics();
  const overlayRef = useRef();

  // Google Analytics tracking para popup de bienvenida
  useEffect(() => {
    if (open) {
      trackPopupView('welcome_popup', {
        popup_title: 'Quiénes Somos - Bienvenida',
        language: language,
        trigger: 'first_visit'
      });
    }
  }, [open, trackPopupView, language]);

  // Detectar móvil solo en cliente
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    setIsMobile(window.innerWidth <= 600);
  }, []);

  // Mostrar español por defecto si el idioma no es 'en'
  const popupLang = language === 'en' ? 'en' : 'es';

  const messages = {
    es: (
      <>
        <div style={{ fontSize: "1.1em", lineHeight: 1.6 }}>
         <span role="img" aria-label="art">🎨📚🎶🎬</span> {texts.es.ui.welcome_popup.intro}<br />
         <span role="img" aria-label="target">🎯📲</span> {texts.es.ui.welcome_popup.objective}<br />
        <span role="img" aria-label="welcome">🌟🎁</span> <b>{texts.es.ui.welcome_popup.welcome}</b>
        </div>
      </>
    ),
    en: (
      <>
        <div style={{ fontSize: "1.1em", lineHeight: 1.6 }}>
          <span role="img" aria-label="art">🎨📚🎶🎬</span> {texts.en.ui.welcome_popup.intro}<br /><br />
          <span role="img" aria-label="target">🎯📲</span> {texts.en.ui.welcome_popup.objective}<br /><br />
          <span role="img" aria-label="welcome">🌟🎁</span> <b>{texts.en.ui.welcome_popup.welcome}</b>
        </div>
      </>
    )
  };

  useEffect(() => {
    console.log('[WelcomePopup] open:', open);
  }, [open]);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", onKeyDown);
    }
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) {
    console.log('[WelcomePopup] NO renderiza popup porque open es false');
    return null;
  }

  function handleOverlayClick(e) {
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
      {console.log('[WelcomePopup] Renderizando contenido del popup')}
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
}

export { WELCOME_POPUP_KEY };
