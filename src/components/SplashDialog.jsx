import React, { useRef, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

const SplashDialog = ({ open, onClose, audio = '/imagenes/samurai.mp3', dark = true }) => {
  const audioRef = useRef(null);

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
        },
        style: {
          background: 'transparent',
          boxShadow: 'none',
          borderRadius: 18,
          overflow: 'visible',
          maxWidth: 'none',
          minWidth: 0,
          minHeight: 0,
        }
      }}
      BackdropProps={{
        sx: { background: 'rgba(0,0,0,0.65)' }
      }}
      sx={{
        p: 0,
        m: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
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
        }}
        style={{
          background: 'transparent',
          overflow: 'visible',
          maxWidth: 'none',
          minWidth: 0,
          minHeight: 0,
          padding: 0,
          margin: 0,
        }}
      >
        <img
          src="/imagenes/splash_image.png"
          alt="Splash"
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
        <audio ref={audioRef} src={audio} preload="auto" loop />
      </DialogContent>
    </Dialog>
  );
};

export default SplashDialog;
