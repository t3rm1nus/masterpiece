import React, { useEffect, useRef } from "react";
import { useLanguage } from "../LanguageContext";
import texts from "../data/texts.json";

const WELCOME_POPUP_KEY = "masterpiece_welcome_popup_seen";

export default function WelcomePopup({ open, onClose }) {
  const { language } = useLanguage();
  const overlayRef = useRef();

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
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", onKeyDown);
    }
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose();
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        zIndex: 2000,
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
}

export { WELCOME_POPUP_KEY };
