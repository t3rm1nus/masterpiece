import React, { useRef, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { useLanguage } from '../LanguageContext';
import '../styles/components/splash-visual.css';
import '../styles/components/splash-visual-mobile.css';

/**
 * SplashDialog: Modal/diálogo de splash personalizable.
 * Permite definir título, contenido, acciones, estilos y callbacks de cierre.
 *
 * Props:
 * - open: boolean (si el diálogo está abierto)
 * - onClose: función (callback al cerrar)
 * - title: string o ReactNode (título opcional)
 * - content: ReactNode (contenido opcional, por defecto imagen splash)
 * - actions: ReactNode (acciones opcionales, por ejemplo botones)
 * - audio: string (ruta de audio opcional)
 * - dark: boolean (modo oscuro)
 * - sx: estilos adicionales para el diálogo
 * - PaperProps/DialogContentProps: props adicionales para personalizar estilos
 *
 * Ejemplo de uso:
 * <SplashDialog
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   title="Bienvenido"
 *   content={<img src="/imagenes/splash_image.png" alt="Splash" />}
 *   actions={<Button onClick={onClose}>Cerrar</Button>}
 *   audio="/sonidos/samurai.mp3"
 *   dark={true}
 *   sx={{ background: '#111' }}
 * />
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
  audioRef: externalAudioRef // <-- allow parent to pass audioRef
}) => {
  const internalAudioRef = useRef(null);
  const audioRef = externalAudioRef || internalAudioRef;
  const { getTranslation } = useLanguage();
  const [animationClass, setAnimationClass] = React.useState('');

  // Detecta si es móvil (SSR safe)
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 600);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Controla la animación al abrir/cerrar
  useEffect(() => {
    if (open) {
      setAnimationClass('splash-animate-in');
    } else if (animationClass === 'splash-animate-in') {
      setAnimationClass('splash-animate-out');
      // Espera la animación de salida antes de desmontar
      const timeout = setTimeout(() => setAnimationClass(''), 700);
      return () => clearTimeout(timeout);
    } else {
      setAnimationClass('');
    }
    // eslint-disable-next-line
  }, [open]);

  // Función recursiva para clonar el primer <img> y añadir id y clase
  function addIdToImg(element) {
    if (!React.isValidElement(element)) return element;
    if (element.type === 'img') {
      return React.cloneElement(element, {
        id: 'splash-image',
        className: (element.props.className || '') + ' splash-image',
      });
    }
    if (element.props && element.props.children) {
      const children = React.Children.map(element.props.children, addIdToImg);
      return React.cloneElement(element, {}, children);
    }
    return element;
  }

  return (
    <Dialog
      open={open || animationClass === 'splash-animate-out'}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '18px',
          background: 'transparent !important',
          boxShadow: 'none !important',
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
          borderRadius: 18,
          overflow: 'visible',
          maxWidth: 'none',
          minWidth: 0,
          minHeight: 0,
          ...sx.paperStyle
        },
        ...PaperProps
      }}
      BackdropProps={{
        sx: { background: 'rgba(0,0,0,0.65)', ...sx.backdrop }
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
      {/* --- Advanced animated background and effects --- */}
      {/* Fondo animado eliminado por requerimiento */}
      {/* --- End advanced effects --- */}
      <DialogContent
        sx={{
          p: 0,
          m: 0,
          background: 'transparent !important',
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
          borderRadius: 0, // Revert to no border radius
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
          borderRadius: 0, // Revert to no border radius
          ...sx.contentStyle
        }}
        {...DialogContentProps}
        onClick={isMobile ? (e => {
          // Evita que el click en la imagen o el box lo vuelva a disparar
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
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 0 }}
            onClick={() => {
              if (typeof onClose === 'function') {
                onClose();
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            {content
              ? addIdToImg(content)
              : (
              <img
                id="splash-image"
                className="splash-image"
                src="/imagenes/splash_image.png"
                alt={getTranslation('ui.alt.splash', 'Splash')}
                style={{
                  height: '100vh',
                  width: 'auto',
                  maxHeight: '100vh',
                  maxWidth: '100vw',
                  borderRadius: '32px',
                  margin: 0,
                  cursor: 'pointer',
                  objectFit: 'contain',
                  background: 'transparent',
                  display: 'block',
                  boxShadow: 'none',
                  border: '4px solid #000',
                }}
              />
            )}
          </Box>
          {/* No actions or close button for desktop splash */}
        </Paper>
        <audio ref={audioRef} src={audio} preload="auto" autoPlay loop />
      </DialogContent>
    </Dialog>
  );
};

export default SplashDialog;
