import React from 'react';
import { Box, Typography, Button, useTheme, useMediaQuery, Paper } from '@mui/material';

const HowToDownload = () => {
  console.log('HowToDownload render');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  return (
    <Box sx={{
      maxWidth: 520,
      width: '100%',
      margin: { xs: '0 auto', lg: '0 auto' },
      padding: { xs: '16px 8px', lg: '32px 32px' },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 3,
      minHeight: { xs: 'auto', lg: 'calc(100vh - 120px)' },
      boxSizing: 'border-box',
      zIndex: 2,
      mt: { xs: 0, lg: 8 } // 8*8=64px, suficiente para el menú fijo
    }}>
      <Paper elevation={3} sx={{ width: '100%', maxWidth: 480, margin: '0 auto', padding: { xs: 2, lg: 4 }, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700, mb: 2, mt: isMobile ? 0 : 1 }}>
          <span style={{display:'inline-flex',alignItems:'center',gap:8}}>
            {/* Icono pirata negro */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{verticalAlign:'middle'}} xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="#111" />
              <path d="M8 12C8 10 12 8 16 8C20 8 24 10 24 12C24 14 20 16 16 16C12 16 8 14 8 12Z" fill="#fff" stroke="#fff" strokeWidth="1.5"/>
              <rect x="13.5" y="11" width="2" height="2" rx="1" fill="#111"/>
              <rect x="17" y="11" width="2" height="2" rx="1" fill="#111"/>
              <path d="M12 18C13.5 20 18.5 20 20 18" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M6 24C10 22 22 22 26 24" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <rect x="21" y="6" width="2" height="8" rx="1" fill="#fff"/>
              <rect x="9" y="6" width="2" height="8" rx="1" fill="#fff"/>
            </svg>
            ¿Cómo descargar torrents sin volverte un náufrago digital?
          </span>
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Vale, antes de que empieces a sudar pensando en hackers rusos, virus con nombre de Pokémon o que vas a acabar en la cárcel por bajarte una peli de hace 10 años... <b>respira</b>. Descargar torrents no es brujería, ni delito (si lo haces con cabeza), ni necesitas un sombrero de pirata para hacerlo bien.
        </Typography>
        <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>🧭 Paso 1: Consigue un cliente de torrents</Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Esto es como el Uber de los archivos. Le dices qué quieres y él se encarga del resto. Recomendados:
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, mb: 2 }}>
          <Button variant="contained" color="primary" href="https://transmissionbt.com/download" target="_blank" sx={{ fontWeight: 600 }}>
            Transmission
          </Button>
          <Button variant="contained" color="primary" href="https://www.qbittorrent.org/download" target="_blank" sx={{ fontWeight: 600 }}>
            qBittorrent
          </Button>
        </Box>
        <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>🧙‍♂️ Paso 2: Encuentra el .torrent o el magnet link</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          No, no necesitas una brújula mágica. Solo ve a una web decente (de esas que no te lanzan 37 ventanas con casinos y princesas nigerianas) y busca el archivo que te interesa.
        </Typography>
        <Typography variant="body2" color="warning.main" sx={{ fontWeight: 600, mb: 2 }}>
          ⚠️ Consejo de sabio: si la web te pide que instales algo raro o te dice que eres el visitante número 1.000.000... huye.
        </Typography>
        <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>⚡ Paso 3: Ábrelo con tu cliente y espera</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Ahora solo queda dejar que la magia fluya. Verás cómo el archivo empieza a descargarse poco a poco gracias a una red de gente compartiendo pedacitos. Es como una fondue colectiva, pero con bits.
        </Typography>
        <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>🛡️ Bonus: Usa VPN si no quieres que tu proveedor de internet te mire feo</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          No es obligatorio, pero si te mola la privacidad o estás en un país donde se ponen intensos con los torrents, un VPN es tu mejor amigo.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, fontWeight: 600, textAlign: 'center' }}>
          Y listo. Ya puedes decir con orgullo que sabes bajar torrents sin naufragar en un mar de pop-ups, spyware y desesperación. ¡Feliz navegación, capitán! 🏴‍☠️
        </Typography>
      </Paper>
    </Box>
  );
};

export default HowToDownload;
