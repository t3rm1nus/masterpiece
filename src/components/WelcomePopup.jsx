import React, { useEffect, useRef } from "react";
import { useLanguage } from "../LanguageContext";

const WELCOME_POPUP_KEY = "masterpiece_welcome_popup_seen";

const messages = {
  es: (
    <>
      <div style={{ fontSize: "1.1em", lineHeight: 1.6 }}>
        <span role="img" aria-label="art">🎨📚🎶🎬</span> Durante 46 años he ido guardando todas las grandes obras maestras con las que me he ido encontrando en todos los ámbitos.<br /><br />
        <span role="img" aria-label="target">🎯📲</span> El objetivo final de esta aplicación es compartir todas esas obras maestras encontradas, para que no pierdas el tiempo viendo o leyendo obras vulgares y aburridas.<br /><br />
        <span role="img" aria-label="legacy">👨‍👧‍👧✨</span> Este es mi legado cultural para mis hijas: para que, el día en que yo falte, pueda seguir recomendándoles cosas maravillosas.<br /><br />
        <span role="img" aria-label="welcome">🌟🎁</span> <b>Bienvenid@s a Masterpiece.</b>
      </div>
    </>
  ),
  en: (
    <>
      <div style={{ fontSize: "1.1em", lineHeight: 1.6 }}>
        <span role="img" aria-label="art">🎨📚🎶🎬</span> For 46 years, I’ve been collecting all the great masterpieces I’ve come across in every field.<br /><br />
        <span role="img" aria-label="target">🎯📲</span> The ultimate goal of this app is to share all those discovered masterpieces, so you don’t waste time watching or reading vulgar and boring works.<br /><br />
        <span role="img" aria-label="legacy">👨‍👧‍👧✨</span> This is my cultural legacy for my daughters—so that, when I’m gone, I can keep recommending them wonderful things.<br /><br />
        <span role="img" aria-label="welcome">🌟🎁</span> <b>Welcome to Masterpiece.</b>
      </div>
    </>
  )
};

export default function WelcomePopup({ open, onClose }) {
  const { language } = useLanguage();
  const overlayRef = useRef();

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
        {messages[language] || messages.en}
      </div>
    </div>
  );
}

export { WELCOME_POPUP_KEY };
