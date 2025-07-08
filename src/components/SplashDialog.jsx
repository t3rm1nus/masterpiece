import React, { useRef, useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { useLanguage } from '../LanguageContext';

/**
 * SplashDialog: Modal/diálogo de splash personalizable.
 * Modernizado a CSS-in-JS, accesibilidad y buenas prácticas.
 */
const SplashDialog = ({
  open,
  onClose,
  title,
  content,
  actions,
  audio = '/sonidos/samurai.mp3',
  dark = true,
  sx = {},
  PaperProps = {},
  DialogContentProps = {},
  audioRef: externalAudioRef
}) => {
  const { getTranslation } = useLanguage();
  const [animationClass, setAnimationClass] = useState('');
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Usar audioRef externo si se proporciona, sino crear uno interno
  const internalAudioRef = useRef(null);
  const audioRef = externalAudioRef || internalAudioRef;

  // Detecta si es móvil (SSR safe)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 600);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Volumen del audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.75;
    }
  }, [audio]);

  // Control de reproducción
  useEffect(() => {
    if (open && audioRef.current) {
      audioRef.current.currentTime = 0;
      setTimeout(() => {
        audioRef.current && audioRef.current.play && audioRef.current.play();
      }, 50);
    } else if (!open && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [open]);

  // Animación de entrada/salida
  useEffect(() => {
    if (open) {
      setVisible(true);
      setAnimationClass('splash-animate-in');
    } else if (animationClass === 'splash-animate-in') {
      setAnimationClass('splash-animate-out');
      const timeout = setTimeout(() => {
        setAnimationClass('');
        setVisible(false);
      }, 700);
      return () => clearTimeout(timeout);
    } else {
      setAnimationClass('');
      setVisible(false);
    }
  }, [open]);

  // Elimina la clase y el id de la imagen splash, y aplica la animación directamente con sx
  function addIdToImg(element) {
    if (!React.isValidElement(element)) return element;
    if (element.type === 'img') {
      return React.cloneElement(element, {
        style: {
          ...element.props.style,
          ...splashImageStyle,
          ...(animationClass === 'splash-animate-in' && splashInStyle),
          ...(animationClass === 'splash-animate-out' && splashOutStyle),
        }
      });
    }
    if (element.props && element.props.children) {
      const children = React.Children.map(element.props.children, addIdToImg);
      return React.cloneElement(element, {}, children);
    }
    return element;
  }

  // Animaciones CSS-in-JS para splash
  const splashInStyle = {
    animation: 'splashIn 1.1s cubic-bezier(0.23, 1, 0.32, 1) both',
  };
  const splashOutStyle = {
    animation: 'splashOut 0.7s cubic-bezier(0.23, 1, 0.32, 1) both',
  };

  // Keyframes para animación splash (se inyectan en un <style> global)
  const splashKeyframes = `
  @keyframes splashIn {
    0% { opacity: 0; transform: scale(0.7) rotate(-10deg); filter: blur(16px) brightness(1.2); }
    60% { opacity: 1; transform: scale(1.05) rotate(2deg); filter: blur(2px) brightness(1.05); }
    100% { opacity: 1; transform: scale(1) rotate(0deg); filter: blur(0) brightness(1); }
  }
  @keyframes splashOut {
    0% { opacity: 1; transform: scale(1) rotate(0deg); filter: blur(0) brightness(1); }
    100% { opacity: 0; transform: scale(0.8) rotate(-8deg); filter: blur(18px) brightness(1.2); }
  }
  `;

  // Inyecta los keyframes globalmente una sola vez
  useEffect(() => {
    if (!document.getElementById('splash-keyframes')) {
      const style = document.createElement('style');
      style.id = 'splash-keyframes';
      style.innerHTML = splashKeyframes;
      document.head.appendChild(style);
    }
  }, []);

  // Estilos CSS-in-JS para la imagen splash
  const splashImageStyle = {
    height: isMobile ? '100%' : '100vh',
    width: isMobile ? '100%' : 'auto',
    maxHeight: isMobile ? '100%' : '100vh',
    maxWidth: isMobile ? '100%' : '100vw',
    borderRadius: isMobile ? 24 : 32,
    margin: 0,
    cursor: 'pointer',
    objectFit: 'contain',
    background: 'transparent',
    display: 'block',
    boxShadow: 'none',
    border: '4px solid #000',
    boxSizing: 'border-box',
  };

  return (
    <Dialog
      open={visible}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'transparent',
          boxShadow: 'none',
          overflow: 'visible',
          m: 0,
          p: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: 'none',
          minWidth: 0,
          minHeight: 0,
          ...sx.paper
        },
        style: {
          background: 'transparent',
          boxShadow: 'none',
          borderRadius: 24,
          overflow: 'visible',
          maxWidth: 'none',
          minWidth: 0,
          minHeight: 0,
          ...sx.paperStyle
        },
        ...PaperProps
      }}
      BackdropProps={{
        sx: { background: 'rgba(0,0,0,1)', ...sx.backdrop }
      }}
      sx={{
        p: 0,
        m: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
        ...sx.dialog
      }}
    >
      {visible && (
        <DialogContent
          sx={{
            p: 0,
            m: 0,
            background: 'transparent',
            overflow: 'visible',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: 'none',
            minWidth: 0,
            minHeight: 0,
            width: '100vw',
            height: '100vh',
            boxSizing: 'border-box',
            borderRadius: 0,
            ...sx.content
          }}
          style={{
            background: 'transparent',
            overflow: 'visible',
            maxWidth: 'none',
            minWidth: 0,
            minHeight: 0,
            width: '100vw',
            height: '100vh',
            padding: 0,
            margin: 0,
            boxSizing: 'border-box',
            borderRadius: 0,
            ...sx.contentStyle
          }}
          {...DialogContentProps}
          onClick={isMobile ? (e => {
            if (e.target === e.currentTarget && typeof onClose === 'function') {
              onClose();
            }
          }) : undefined}
        >
          <Paper elevation={0} sx={{
            borderRadius: 0,
            background: 'transparent',
            boxShadow: 'none',
            p: 0,
            maxWidth: 'none',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            zIndex: 3,
          }}
          className={animationClass}
          >
            {/* No title for desktop splash */}
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 0, cursor: 'pointer' }}
              onClick={() => {
                if (typeof onClose === 'function') {
                  onClose();
                }
              }}
            >
              {content
                ? addIdToImg(content)
                : (
                <img
                  id="splash-image"
                  src="/imagenes/splash_image.png"
                  alt={getTranslation('ui.alt.splash', 'Splash')}
                  style={{
                    ...splashImageStyle,
                    ...(animationClass === 'splash-animate-in' && splashInStyle),
                    ...(animationClass === 'splash-animate-out' && splashOutStyle),
                  }}
                />
              )}
            </Box>
            {/* No actions or close button for desktop splash */}
          </Paper>
          <audio ref={audioRef} src={audio} preload="auto" autoPlay loop />
        </DialogContent>
      )}
    </Dialog>
  );
};

export default SplashDialog;
