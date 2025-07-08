import React, { useEffect } from 'react';
import { Box, Typography, Button, useTheme, useMediaQuery, Paper } from '@mui/material';
import { useLanguage } from '../LanguageContext';
import { useGoogleAnalytics } from '../hooks/useGoogleAnalytics';
import { applyHowToDownloadScrollFixForIPhone, cleanupScrollFixesForIPhone } from '../utils/iPhoneScrollFix';

const HowToDownload = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const { lang, t } = useLanguage();
  const { trackSpecialPageView } = useGoogleAnalytics();

  // Google Analytics tracking para página de descargas
  useEffect(() => {
    trackSpecialPageView('downloads', {
      page_title: 'Cómo Descargar',
      source: 'main_navigation'
    });
  }, [trackSpecialPageView]);

  // Scroll automático al inicio en móviles al montar
  useEffect(() => {
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isMobile]);

  // Fix específico para iPhone - asegurar scroll
  useEffect(() => {
    // Aplicar fixes específicos para iPhone usando la utilidad
    applyHowToDownloadScrollFixForIPhone();
    
    return () => {
      // Limpiar al desmontar
      cleanupScrollFixesForIPhone();
    };
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
      es: 'No, no necesitas una brújula mágica. Solo ve a una web decente (de esas que no te lanzan 37 ventanas con casinos y princesas nigerianas) y busca el archivo que te interesa.',
      en: "No, you don't need a magic compass. Just go to a decent website (one that doesn't throw 37 popups with casinos and Nigerian princesses) and look for the file you want."
    },
    piratebay: {
      es: 'Busca tu bahía pirata',
      en: 'Find your Pirate Bay'
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
      en: 'Now just let the magic happen. You’ll see the file start downloading bit by bit thanks to a network of people sharing pieces. It’s like a collective fondue, but with bits.'
    },
    vpn: {
      es: '🛡️ Bonus: Usa VPN si no quieres que tu proveedor de internet te mire feo',
      en: '🛡️ Bonus: Use a VPN if you don’t want your internet provider giving you the stink eye'
    },
    vpndesc: {
      es: 'No es obligatorio, pero si te mola la privacidad o estás en un país donde se ponen intensos con los torrents, un VPN es tu mejor amigo.',
      en: 'Not mandatory, but if you like privacy or live in a country that gets intense about torrents, a VPN is your best friend.'
    },
    end: {
      es: 'Y listo. Ya puedes decir con orgullo que sabes bajar torrents sin naufragar en un mar de pop-ups, spyware y desesperación. ¡Feliz navegación, capitán! 🏴‍☠️',
      en: 'And that’s it. Now you can proudly say you know how to download torrents without sinking in a sea of pop-ups, spyware, and despair. Happy sailing, captain! 🏴‍☠️'
    }
  };
  return (
    <Box sx={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: { xs: 'auto', lg: 'calc(100vh - 120px)' },
      boxSizing: 'border-box',
      zIndex: 2,
      overflow: 'visible',
      WebkitOverflowScrolling: 'touch',
      mt: { xs: 0, lg: 8 }, // 8*8=64px, suficiente para el menú fijo
      // Específico para iPhone - asegurar scroll
      overflowY: { xs: 'auto', md: 'visible' },
      height: { xs: '100%', md: 'auto' },
      maxHeight: { xs: '100%', md: 'none' },
    }}>
      <Paper elevation={3} sx={{
        width: '100%',
        maxWidth: { xs: 480, md: '720px', lg: '900px' },
        margin: '0 auto',
        padding: { xs: 2, sm: 3, md: 4 },
        borderRadius: 3,
        boxSizing: 'border-box',
        position: 'relative',
        paddingTop: { xs: 2, md: '64px' }, // Espacio arriba en desktop para evitar solapamiento con menú
        pb: { xs: 3, md: 5 }, // padding bottom extra para mostrar el borde inferior
        mb: { xs: 3, md: 5 }, // margen inferior extra para separar el card del borde de la página
        overflow: 'visible',
        WebkitOverflowScrolling: 'touch',
        mt: { xs: '64px', md: 0 }, // margen superior en móviles para evitar solapamiento con menú
        // Específico para iPhone - Paper scrolleable
        overflowY: { xs: 'auto', md: 'visible' },
        height: { xs: 'auto', md: 'auto' },
        maxHeight: { xs: 'calc(100vh - 120px)', md: 'none' },
      }}>
        {/* Imagen Pirate Bay dentro del card */}
        <Box sx={{
          width: '100%',
          mb: 2,
          borderRadius: 0,
          overflow: 'hidden',
          boxShadow: 0,
        }}>
          <img
            src="/imagenes/descargas/pirate.jpg"
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
        <Button
          variant="contained"
          color="primary"
          href="https://piratebayproxy.info/"
          target="_blank"
          sx={{ fontWeight: 600, mb: 2, display: 'inline-block', mx: { xs: 'auto', md: 0 }, minWidth: 'unset', width: 'auto', px: 2, py: 1, fontSize: '1rem', '&:hover': { color: '#111' } }}
        >
          {texts.piratebay[lang]}
        </Button>
        <Box sx={{ width: { xs: '80%', sm: '60%', md: '50%' }, mx: 'auto', mb: 2, borderRadius: 2, overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
          <img
            src="/imagenes/descargas/pirate1.jpg"
            alt="Ejemplo Pirate Bay"
            style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
          />
        </Box>
        <Typography variant="body2" color="warning.main" sx={{ fontWeight: 600, mb: 2 }}>
          {texts.warning[lang]}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {lang === 'es' ? 'Una vez seleccionado lo que quieres bajar, haz click sobre el icono del imán y se abrirá automáticamente tu Transmission o qBittorrent. Dale a aceptar para empezar la descarga y...' : 'Once you’ve selected what you want to download, click the magnet icon and your Transmission or qBittorrent will open automatically. Click accept to start the download and...'}
        </Typography>
        <Box sx={{ width: '100%', mb: 2, borderRadius: 2, overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
          <img
            src="/imagenes/descargas/pirate2.jpg"
            alt="Ejemplo Pirate Bay 2"
            style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
          />
        </Box>
        <Typography variant="h6" sx={{ mt: 7, mb: 1, fontWeight: 600 }}>{texts.step3[lang]}</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>{texts.step3desc[lang]}</Typography>
        <Box sx={{ width: { xs: '80%', sm: '60%', md: '40%' }, mx: 'auto', mb: 3, display: 'flex', justifyContent: 'center' }}>
          <img
            src="/imagenes/descargas/magic.gif"
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
    </Box>
  );
};

export default HowToDownload;
