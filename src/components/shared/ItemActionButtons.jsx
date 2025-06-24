import React from 'react';
import { Box, useTheme } from '@mui/material';
import { PlayArrow as PlayArrowIcon } from '@mui/icons-material';
import { getCategoryColor } from '../../utils/categoryUtils';
import UiButton from '../ui/UiButton';

// Botones de acción para mobile y desktop
export function MobileActionButtons({ selectedItem, trailerUrl, lang, t, goToHowToDownload }) {
  const theme = useTheme();
  const buttons = [];
  if (selectedItem.category === 'documentales' && selectedItem.link) {
    buttons.push(
      <Box key="documental" sx={{ textAlign: 'center', marginBottom: '16px' }}>
        <UiButton
          variant="contained"
          href={selectedItem.link}
          target="_blank"
          rel="noopener noreferrer"
          startIcon={<PlayArrowIcon />}
          sx={{
            backgroundColor: getCategoryColor(selectedItem.category),
            '&:hover': {
              backgroundColor: getCategoryColor(selectedItem.category),
              opacity: 0.8
            }
          }}
        >
          {lang === 'es' ? 'Ver Documental' : 'Watch Documentary'}
        </UiButton>
      </Box>
    );
  }
  if (trailerUrl) {
    buttons.push(
      <Box key="trailer" sx={{ textAlign: 'center', marginBottom: '16px' }}>
        <UiButton
          variant="contained"
          color="primary"
          startIcon={<PlayArrowIcon sx={{ marginRight: '6px', minWidth: 0, fontSize: '1.1em' }} />}
          href={trailerUrl}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '0.95rem', md: '1.05rem' },
            minWidth: 140,
            maxWidth: 220,
            width: '100%',
            py: '8px',
            borderRadius: '8px',
            boxShadow: 2,
            mx: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            backgroundColor: theme?.palette?.primary?.main,
            color: theme?.palette?.primary?.contrastText,
            '&:hover': {
              backgroundColor: theme?.palette?.primary?.dark,
              color: theme?.palette?.primary?.contrastText,
              opacity: 0.9
            }
          }}
        >
          {lang === 'es' ? 'Ver Tráiler' : 'Watch Trailer'}
        </UiButton>
      </Box>
    );
  }
  if (selectedItem.category === 'podcast' && selectedItem.link) {
    buttons.push(
      <Box key="spotify" sx={{ textAlign: 'center', marginBottom: '16px' }}>
        <UiButton
          variant="contained"
          href={selectedItem.link}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            backgroundColor: '#1DB954',
            '&:hover': {
              backgroundColor: '#1ed760'
            }
          }}
        >
          Escuchar en Spotify
        </UiButton>
      </Box>
    );
  }
  if (selectedItem.category === 'movies' || selectedItem.category === 'series') {
    buttons.push(
      <Box key="download" sx={{ textAlign: 'center', marginBottom: '16px' }}>
        <UiButton
          variant="contained"
          color="primary"
          startIcon={<PlayArrowIcon sx={{ marginRight: '6px', minWidth: 0, fontSize: '1.1em' }} />}
          onClick={() => {
            if (typeof goToHowToDownload === 'function') goToHowToDownload();
          }}
          sx={{
            fontWeight: 700,
            fontSize: { xs: '0.95rem', md: '1.05rem' },
            minWidth: 140,
            maxWidth: 220,
            width: '100%',
            py: '8px',
            borderRadius: '8px',
            boxShadow: 2,
            mx: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            backgroundColor: theme?.palette?.primary?.main,
            color: theme?.palette?.primary?.contrastText,
            '&:hover': {
              backgroundColor: theme?.palette?.primary?.dark,
              color: theme?.palette?.primary?.contrastText,
              opacity: 0.9
            }
          }}
        >
          {t?.ui?.actions?.download || (lang === 'en' ? 'Download' : 'Descargar')}
        </UiButton>
      </Box>
    );
  }
  return buttons;
}

export function DesktopActionButtons({ selectedItem, trailerUrl, lang, t, goToHowToDownload }) {
  const buttons = [];
  if (selectedItem.category === 'documentales' && selectedItem.link) {
    buttons.push(
      <div key="documental" className="item-detail-trailer">
        <a 
          href={selectedItem.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="trailer-link"
        >
          {t.documentales?.watch || 'Ver documental'}
        </a>
      </div>
    );
  }
  if (trailerUrl) {
    buttons.push(
      <div key="trailer" className="item-detail-trailer">
        <UiButton
          variant="contained"
          color="primary"
          sx={{ mt: 2, fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, minWidth: 180 }}
          component="a"
          href={trailerUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.watch_trailer || t?.ui?.actions?.watchTrailer || (lang === 'en' ? 'Watch Trailer' : 'Ver Tráiler')}
        </UiButton>
      </div>
    );
  }
  if (selectedItem.category === 'movies' || selectedItem.category === 'series') {
    buttons.push(
      <div key="download" className="item-detail-trailer">
        <UiButton
          variant="contained"
          color="primary"
          sx={{ mt: 2, fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, minWidth: 180 }}
          onClick={() => {
            if (typeof goToHowToDownload === 'function') goToHowToDownload();
          }}
          startIcon={<PlayArrowIcon />}
        >
          {t?.ui?.actions?.download || (lang === 'en' ? 'Download' : 'Descargar')}
        </UiButton>
      </div>
    );
  }
  return buttons;
}
