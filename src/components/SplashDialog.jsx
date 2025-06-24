import React, { useRef, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useLanguage } from '../LanguageContext';

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
  DialogContentProps = {}
}) => {
  const audioRef = useRef(null);
  const { getTranslation } = useLanguage();

  useEffect(() => {
    if (open && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (!open && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [open]);

  return (
    <Dialog
      open={open}
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
          ...sx.content
        }}
        style={{
          background: 'transparent',
          overflow: 'visible',
          maxWidth: 'none',
          minWidth: 0,
          minHeight: 0,
          padding: 0,
          margin: 0,
          ...sx.contentStyle
        }}
        {...DialogContentProps}
      >
        {title && (
          <div style={{ fontWeight: 'bold', fontSize: 22, marginBottom: 16, color: dark ? '#fff' : '#222', textAlign: 'center' }}>{title}</div>
        )}
        {content ? (
          content
        ) : (
          <img
            src="/imagenes/splash_image.png"
            alt={getTranslation('ui.alt.splash', 'Splash')}
            style={{
              width: '90vw',
              maxWidth: '90vw',
              maxHeight: '90vh',
              borderRadius: 16,
              margin: 0,
              cursor: 'pointer',
              objectFit: 'contain',
              background: 'transparent',
              display: 'block',
              boxShadow: 'none',
            }}
            onClick={onClose}
          />
        )}
        <audio ref={audioRef} src={audio} preload="auto" loop />
        {actions && (
          <div style={{ marginTop: 24, width: '100%', display: 'flex', justifyContent: 'center' }}>{actions}</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SplashDialog;
