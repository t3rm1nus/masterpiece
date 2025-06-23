import React from 'react';
import { Box, Button } from '@mui/material';
import { PlayArrow as PlayArrowIcon } from '@mui/icons-material';
import { getCategoryColor } from '../../utils/categoryUtils';

// Botones de acción para mobile y desktop
export function MobileActionButtons({ selectedItem, trailerUrl, lang, t, goToHowToDownload }) {
  const buttons = [];
  if (selectedItem.category === 'documentales' && selectedItem.link) {
    buttons.push(
      <Box key="documental" sx={{ textAlign: 'center', marginBottom: '16px' }}>
        <Button
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
        </Button>
      </Box>
    );
  }
  if (trailerUrl) {
    buttons.push(
      <Box key="trailer" sx={{ textAlign: 'center', marginBottom: '16px' }}>
        <Button
          variant="contained"
          startIcon={<PlayArrowIcon />}
          href={trailerUrl}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            backgroundColor: getCategoryColor(selectedItem.category),
            '&:hover': {
              backgroundColor: getCategoryColor(selectedItem.category),
              opacity: 0.8
            }
          }}
        >
          {t.watch_trailer || 'Ver Trailer'}
        </Button>
      </Box>
    );
  }
  if (selectedItem.category === 'podcast' && selectedItem.link) {
    buttons.push(
      <Box key="spotify" sx={{ textAlign: 'center', marginBottom: '16px' }}>
        <Button
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
        </Button>
      </Box>
    );
  }
  if (selectedItem.category === 'movies' || selectedItem.category === 'series') {
    buttons.push(
      <Box key="download" sx={{ textAlign: 'center', marginBottom: '16px' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PlayArrowIcon />}
          onClick={() => {
            if (typeof goToHowToDownload === 'function') goToHowToDownload();
          }}
          sx={{
            backgroundColor: getCategoryColor(selectedItem.category),
            fontWeight: 700,
            fontSize: { xs: '1rem', md: '1.1rem' },
            '&:hover': {
              backgroundColor: getCategoryColor(selectedItem.category),
              opacity: 0.8
            }
          }}
        >
          {t?.ui?.actions?.download || (lang === 'en' ? 'Download' : 'Descargar')}
        </Button>
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
        <a 
          href={trailerUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="trailer-link"
        >
          {t.watch_trailer || t?.ui?.actions?.watchTrailer || (lang === 'en' ? 'Watch Trailer' : 'Ver Trailer')}
        </a>
      </div>
    );
  }
  if (selectedItem.category === 'movies' || selectedItem.category === 'series') {
    buttons.push(
      <div key="download" className="item-detail-trailer">
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, minWidth: 180 }}
          onClick={() => {
            if (typeof goToHowToDownload === 'function') goToHowToDownload();
          }}
          startIcon={<PlayArrowIcon />}
        >
          {t?.ui?.actions?.download || (lang === 'en' ? 'Download' : 'Descargar')}
        </Button>
      </div>
    );
  }
  return buttons;
}
