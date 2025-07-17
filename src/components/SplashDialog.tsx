import React, { useRef, useEffect, useState, ReactNode, RefObject } from 'react';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent, { DialogContentProps } from '@mui/material/DialogContent';
import Paper, { PaperProps } from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { useLanguage } from '../LanguageContext';
import useIsomorphicLayoutEffect from '../hooks/useIsomorphicLayoutEffect';

// =============================================
// SplashDialog: Modal/diálogo de splash animado y accesible
// Optimizado para UX, móviles y desktop, con soporte de audio y animaciones avanzadas.
// =============================================

export interface SplashDialogProps {
  open: boolean;
  onClose?: () => void;
  title?: ReactNode;
  content?: ReactNode;
  actions?: ReactNode;
  audio?: string;
  dark?: boolean;
  sx?: {
    paper?: React.CSSProperties;
    paperStyle?: React.CSSProperties;
    backdrop?: React.CSSProperties;
    dialog?: React.CSSProperties;
    content?: React.CSSProperties;
    contentStyle?: React.CSSProperties;
  };
  PaperProps?: Partial<PaperProps>;
  DialogContentProps?: Partial<DialogContentProps>;
  audioRef?: RefObject<HTMLAudioElement>;
}

const SplashDialog: React.FC<SplashDialogProps> = ({
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
  const internalAudioRef = useRef<HTMLAudioElement>(null);
  const audioRef = externalAudioRef || internalAudioRef;

  // Detecta si es móvil (SSR safe)
  useIsomorphicLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => setIsMobile(window.innerWidth <= 600);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // Detectar si es iPhone específicamente (SSR safe)
  const [isIPhone, setIsIPhone] = useState(false);
  
  useIsomorphicLayoutEffect(() => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      setIsIPhone(/iPhone|iPod/.test(navigator.userAgent));
    }
  }, []);

  // Volumen del audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.75;
    }
  }, [audio]);

  // Control de reproducción - mejorado para iPhone
  useEffect(() => {
    if (open && audioRef.current) {
      audioRef.current.currentTime = 0;
      
      if (isIPhone) {
        // Para iPhone: necesita interacción del usuario primero
        const playForIPhone = async () => {
          try {
            await audioRef.current!.play();
          } catch (error) {
            // Si falla, esperar primer touch
            const handleFirstTouch = async () => {
              try {
                if (audioRef.current) {
                  await audioRef.current.play();
                }
              } catch (e) {}
              document.removeEventListener('touchstart', handleFirstTouch);
            };
            document.addEventListener('touchstart', handleFirstTouch, { once: true });
          }
        };
        setTimeout(playForIPhone, 100);
      } else {
        // Para otros dispositivos (mantener comportamiento original)
        setTimeout(() => {
          audioRef.current && audioRef.current.play && audioRef.current.play();
        }, 50);
      }
    } else if (!open && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [open, isIPhone]);

  // Animación de entrada/salida SIN timeout ni animación de salida
  useEffect(() => {
    if (open) {
      setVisible(true);
      setAnimationClass('splash-animate-in');
    } else {
      setAnimationClass('');
      setVisible(false); // Desmonta inmediatamente
    }
    return () => {
      setVisible(false); // Limpieza forzada
    };
  }, [open]);

  // Elimina la clase y el id de la imagen splash, y aplica la animación directamente con sx
  function addIdToImg(element: ReactNode): ReactNode {
    if (!React.isValidElement(element)) return element;
    // Type guard para acceder a props.style y props.children
    const hasStyle = (el: any): el is React.ReactElement<{ style?: React.CSSProperties }> => 'style' in (el.props || {});
    const hasChildren = (el: any): el is React.ReactElement<{ children?: ReactNode }> => 'children' in (el.props || {});
    if (element.type === 'img' && hasStyle(element)) {
      return React.cloneElement(element, {
        style: {
          ...element.props.style,
          ...splashImageStyle,
          ...(animationClass === 'splash-animate-in' && splashInStyle),
          ...(animationClass === 'splash-animate-out' && splashOutStyle),
        }
      });
    }
    if (hasChildren(element) && element.props.children) {
      const children = React.Children.map(element.props.children, addIdToImg);
      return React.cloneElement(element, {}, children);
    }
    return element;
  }

  // Animaciones CSS-in-JS para splash
  const splashInStyle: React.CSSProperties = {
    animation: 'splashIn 1.1s cubic-bezier(0.23, 1, 0.32, 1) both',
  };
  const splashOutStyle: React.CSSProperties = {
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
  useIsomorphicLayoutEffect(() => {
    if (typeof document !== 'undefined' && !document.getElementById('splash-keyframes')) {
      const style = document.createElement('style');
      style.id = 'splash-keyframes';
      style.innerHTML = splashKeyframes;
      document.head.appendChild(style);
    }
  }, []);

  // Estilos CSS-in-JS para la imagen splash
  const splashImageStyle: React.CSSProperties = {
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

  // Render condicional: solo renderiza el Dialog si visible es true
  if (!visible) return null;

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
          zIndex: 9999, // El más alto de la app
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
        sx: { background: 'rgba(0,0,0,0.5)', zIndex: 9998, ...sx.backdrop },
        onClick: isMobile ? (e => { if (typeof onClose === 'function') onClose(); }) : undefined
      }}
      sx={{
        p: 0,
        m: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
        zIndex: 9999,
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
                  onError={(e: any) => {
                    // Si falla la imagen principal, usar una imagen de respaldo
                    if (e.target.src !== '/favicon.png') {
                      e.target.src = '/favicon.png';
                    }
                  }}
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
          <audio 
            ref={audioRef} 
            src={audio} 
            preload="auto" 
            autoPlay={!isIPhone}
            loop
            playsInline={isIPhone}
            muted={false}
          />
        </DialogContent>
      )}
    </Dialog>
  );
};

export default SplashDialog; 