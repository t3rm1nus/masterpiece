import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Button, useTheme, useMediaQuery, Paper, Container, Fab } from '@mui/material';
import { useLanguage } from '../LanguageContext';
import { useGoogleAnalytics } from '../hooks/useGoogleAnalytics';
import { applyHowToDownloadScrollFixForIPhone, cleanupScrollFixesForIPhone } from '../utils/iPhoneScrollFix';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

interface HowToDownloadProps {
  onAnimationEnd?: () => void;
}

const HowToDownload: React.FC<HowToDownloadProps> = ({ onAnimationEnd }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const { lang, t } = useLanguage();
  const { trackSpecialPageView } = useGoogleAnalytics();

  // Fix específico para iPhone - asegurar scroll
  useEffect(() => {
    // Aplicar fixes específicos para iPhone usando la utilidad
    applyHowToDownloadScrollFixForIPhone();
    
    return () => {
      // Limpiar al desmontar
      cleanupScrollFixesForIPhone();
    };
  }, []);

  // Efecto para hacer scroll al top al montar la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Textos traducibles
  const texts = {
    title: {
      es: '¿Cómo descargar cositas buenas sin volverte un náufrago digital?',
      en: 'How to download cool stuff without becoming a digital castaway?'
    },
    intro: {
      es: 'Vale, antes de que empieces a sudar pensando en hackers rusos, virus con nombre de Pokémon o que vas a acabar en la cárcel por bajarte una peli de hace 10 años... <b>respira</b>. Descargar torrents no es brujería, ni delito (si lo haces con cabeza), ni necesitas un sombrero de pirata para hacerlo bien.',
      en: "Okay, before you start sweating about Russian hackers, viruses named after Pokémon, or ending up in jail for downloading a 10-year-old movie... <b>breathe</b>. Downloading torrents isn't witchcraft, nor a crime (if you use your head), and you don't need a pirate hat to do it right."
    },
    step1: {
      es: '🧭 Paso 1: Consigue un cliente de torrents',
      en: '🧭 Step 1: Get a torrent client'
    },
    step1desc: {
      es: 'Esto es como el Uber de los archivos. Le dices qué quieres y él se encarga del resto. Recomendados:',
      en: 'This is like the Uber for files. You tell it what you want and it does the rest. Recommended:'
    },
    step2: {
      es: '🧙‍♂️ Paso 2: Encuentra el .torrent o el magnet link',
      en: '🧙‍♂️ Step 2: Find the .torrent or magnet link'
    },
    step2desc: {
      es: 'Aquí es donde empieza la aventura. Necesitas encontrar el archivo .torrent o el magnet link de lo que quieres bajar. Es como buscar un tesoro, pero en internet.',
      en: "This is where the adventure begins. You need to find the .torrent file or magnet link of what you want to download. It's like treasure hunting, but on the internet."
    },
    piratebay: {
      es: '🏴‍☠️ The Pirate Bay',
      en: '🏴‍☠️ The Pirate Bay'
    },
    warning: {
      es: '⚠️ Consejo de sabio: si la web te pide que instales algo raro o te dice que eres el visitante número 1.000.000... huye.',
      en: "⚠️ Pro tip: if the site asks you to install something weird or says you're visitor number 1,000,000... run."
    },
    step3: {
      es: '⚡ Paso 3: Ábrelo con tu cliente y espera',
      en: '⚡ Step 3: Open it with your client and wait'
    },
    step3desc: {
      es: 'Ahora solo queda dejar que la magia fluya. Verás cómo el archivo empieza a descargarse poco a poco gracias a una red de gente compartiendo pedacitos. Es como una fondue colectiva, pero con bits.',
      en: "Now just let the magic happen. You'll see the file start downloading bit by bit thanks to a network of people sharing pieces. It's like a collective fondue, but with bits."
    },
    vpn: {
      es: '🛡️ Bonus: Usa VPN si no quieres que tu proveedor de internet te mire feo',
      en: "🛡️ Bonus: Use a VPN if you don't want your internet provider giving you the stink eye"
    },
    vpndesc: {
      es: 'No es obligatorio, pero si te mola la privacidad o estás en un país donde se ponen intensos con los torrents, un VPN es tu mejor amigo.',
      en: 'Not mandatory, but if you like privacy or live in a country that gets intense about torrents, a VPN is your best friend.'
    },
    end: {
      es: 'Y listo. Ya puedes decir con orgullo que sabes bajar torrents sin naufragar en un mar de pop-ups, spyware y desesperación. ¡Feliz navegación, capitán! 🏴‍☠️',
      en: "And that's it. Now you can proudly say you know how to download torrents without sinking in a sea of pop-ups, spyware, and despair. Happy sailing, captain! 🏴‍☠️"
    }
  };

  const handleBack = useCallback(() => {
    console.log('🔄 [HowToDownload] handleBack llamado');
    console.log('🔄 [HowToDownload] onAnimationEnd disponible:', !!onAnimationEnd);
    // Solo usar el callback, sin navegación propia
    if (typeof onAnimationEnd === 'function') {
      console.log('🔄 [HowToDownload] Llamando onAnimationEnd');
      onAnimationEnd();
    }
  }, [onAnimationEnd]);

  return (
    <div style={{ marginTop: '70px' }}>
      <Container 
        maxWidth="md" 
        sx={{ 
          padding: { xs: '16px', sm: '24px' },
          paddingTop: isMobile ? { xs: '36px', sm: '80px', md: '50px' } : '40px',
          paddingBottom: '40px',
          backgroundColor: isMobile ? '#fafafa' : '#fff',
          minHeight: '100vh',
          position: 'relative',
          zIndex: isMobile ? 1000 : 1200, // Páginas descargar/donaciones - por debajo del AppBar (1200) en móvil
          overflow: 'visible',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Botón volver para móviles */}
        {isMobile && (
          <Fab
            color="primary"
            aria-label="volver"
            onClick={handleBack}
            sx={{
              position: 'fixed',
              top: '73px',
              left: 16,
              zIndex: 1402,
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              }
            }}
          >
            <ArrowBackIcon />
          </Fab>
        )}
        <Paper elevation={3} sx={{
          width: '100%',
          maxWidth: { xs: 480, md: '720px', lg: '900px' },
          margin: '0 auto',
          padding: { xs: 2, sm: 3, md: 4 },
          borderRadius: 3,
          boxSizing: 'border-box',
          position: 'relative',
          paddingTop: { xs: 2, md: 4 },
          pb: { xs: 3, md: 5 },
          mb: { xs: 3, md: 5 },
          overflow: 'visible',
          WebkitOverflowScrolling: 'touch',
          mt: { xs: 0, md: 0 },
          overflowY: { xs: 'auto', md: 'visible' },
          height: { xs: 'auto', md: 'auto' },
          maxHeight: { xs: 'none', md: 'none' },
        }}
        >
          {/* FAB volver dentro del Paper para desktop */}
          {!isMobile && (
            <Fab
              color="primary"
              aria-label="volver"
              onClick={handleBack}
              sx={{
                position: 'absolute',
                top: 18,
                left: 18,
                zIndex: 50,
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                }
              }}
            >
              <ArrowBackIcon />
            </Fab>
          )}
          {/* Imagen Pirate Bay dentro del card */}
          <Box sx={{
            width: '100%',
            mb: 2,
            borderRadius: 0,
            overflow: 'hidden',
            boxShadow: 0,
          }}>
            <img
              src="https://raw.githubusercontent.com/t3rm1nus/masterpiece/main/public/imagenes/descargas/pirate.jpg"
              alt="Pirate Bay Logo"
              style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
            />
          </Box>
          <Typography variant="h4" align="center" gutterBottom sx={{ 
            fontWeight: 700, mb: 3, mt: 3,
            fontSize: { xs: '1.4rem', sm: '2rem', md: '2.2rem', lg: '2.4rem' }
          }}>
            <span style={{display:'inline-flex',alignItems:'center',gap:8}}>
              {texts.title[lang]}
            </span>
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }} dangerouslySetInnerHTML={{__html: texts.intro[lang]}} />
          <Typography variant="h6" sx={{ mt: 7, mb: 1, fontWeight: 600 }}>{texts.step1[lang]}</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>{texts.step1desc[lang]}</Typography>
          <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, mb: 2 }}>
            <Button variant="contained" color="primary" href="https://transmissionbt.com/download" target="_blank" sx={{ fontWeight: 600, mb: isMobile ? 1 : 0, '&:hover': { color: '#111' } }}>
              Transmission
            </Button>
            <Button variant="contained" color="primary" href="https://www.qbittorrent.org/download" target="_blank" sx={{ fontWeight: 600, mb: isMobile ? 1 : 0, '&:hover': { color: '#111' } }}>
              qBittorrent
            </Button>
          </Box>
          <Typography variant="h6" sx={{ mt: 7, mb: 1, fontWeight: 600 }}>{texts.step2[lang]}</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{texts.step2desc[lang]}</Typography>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              href="https://piratebayproxy.info/"
              target="_blank"
              sx={{ fontWeight: 600, mb: 0, minWidth: 'unset', width: 'auto', px: 2, py: 1, fontSize: '1rem', '&:hover': { color: '#111' } }}
            >
              {texts.piratebay[lang]}
            </Button>
          </Box>
          <Box sx={{ width: { xs: '80%', sm: '60%', md: '50%' }, mx: 'auto', mb: 2, borderRadius: 2, overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
            <img
              src="https://raw.githubusercontent.com/t3rm1nus/masterpiece/main/public/imagenes/descargas/pirate1.jpg"
              alt="Ejemplo Pirate Bay"
              style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
            />
          </Box>
          <Typography variant="body2" color="warning.main" sx={{ fontWeight: 600, mb: 2 }}>
            {texts.warning[lang]}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {lang === 'es' ? 'Una vez seleccionado lo que quieres bajar, haz click sobre el icono del imán y se abrirá automáticamente tu Transmission o qBittorrent. Dale a aceptar para empezar la descarga y...' : 'Once you have selected what you want to download, click the magnet icon and your Transmission or qBittorrent will open automatically. Click accept to start the download and...'}
          </Typography>
          <Box sx={{ width: '100%', mb: 2, borderRadius: 2, overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
            <img
              src="https://raw.githubusercontent.com/t3rm1nus/masterpiece/main/public/imagenes/descargas/pirate2.jpg"
              alt="Ejemplo Pirate Bay 2"
              style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
            />
          </Box>
          <Typography variant="h6" sx={{ mt: 7, mb: 1, fontWeight: 600 }}>{texts.step3[lang]}</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{texts.step3desc[lang]}</Typography>
          <Box sx={{ width: { xs: '80%', sm: '60%', md: '40%' }, mx: 'auto', mb: 3, display: 'flex', justifyContent: 'center' }}>
            <img
              src="https://raw.githubusercontent.com/t3rm1nus/masterpiece/main/public/imagenes/descargas/magic.gif"
              alt="Magia torrent"
              style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
            />
          </Box>
          <Typography variant="h6" sx={{ mt: 7, mb: 1, fontWeight: 600 }}>{texts.vpn[lang]}</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{texts.vpndesc[lang]}</Typography>
          <Typography variant="body1" sx={{ mt: 6, fontWeight: 600, textAlign: 'center' }}>
            {texts.end[lang]}
          </Typography>
        </Paper>
      </Container>
    </div>
  );
};

export default HowToDownload; 