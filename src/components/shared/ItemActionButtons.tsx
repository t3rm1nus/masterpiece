import React from 'react';
import { Box, useTheme } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { getCategoryColor } from '../../utils/categoryPalette';
import UiButton from '../ui/UiButton';
import { useNavigate } from 'react-router-dom';
import { getLocalizedPath } from '../../utils/urlHelpers';

// Tipos de props
interface ActionButtonsProps {
  selectedItem: any;
  trailerUrl?: string;
  lang?: string;
  t?: any;
  goToHowToDownload?: () => void;
  onOverlayNavigate?: (path: string) => void;
}

// Función helper para manejar la navegación con cierre de detalle
const handleNavigationWithDetailClose = (navigationFunction: () => void) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('overlay-detail-exit'));
  }
  setTimeout(() => {
    navigationFunction();
  }, 500);
};

export const MobileActionButtons: React.FC<ActionButtonsProps> = ({ selectedItem, trailerUrl, lang, t, goToHowToDownload, onOverlayNavigate }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const getButtonSx = {
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
  };
  const buttons: React.ReactNode[] = [];
  if (selectedItem.category === 'music' && selectedItem.youtube) {
    buttons.push(
      <Box key="music-youtube" sx={{ textAlign: 'center', marginBottom: '16px' }}>
        <UiButton
          component="a"
          variant="contained"
          href={selectedItem.youtube}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            ...getButtonSx,
            backgroundColor: '#e53935',
            '&:hover': { backgroundColor: '#b71c1c' }
          }}
        >
          {lang === 'es' ? 'Oír en YouTube' : 'Listen in YouTube'}
        </UiButton>
      </Box>
    );
  }
  if (selectedItem.category === 'music' && selectedItem.spotify) {
    buttons.push(
      <Box key="music-spotify" sx={{ textAlign: 'center', marginBottom: '16px' }}>
        <UiButton
          component="a"
          variant="contained"
          href={selectedItem.spotify}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            ...getButtonSx,
            backgroundColor: '#1DB954',
            '&:hover': { backgroundColor: '#1ed760' }
          }}
        >
          {lang === 'es' ? 'Oír en Spotify' : 'Listen in Spotify'}
        </UiButton>
      </Box>
    );
  }
  if (selectedItem.category === 'documentales' && selectedItem.link) {
    buttons.push(
      <Box key="documental" sx={{ textAlign: 'center', marginBottom: '16px' }}>
        <UiButton
          component="a"
          variant="contained"
          color="primary"
          href={selectedItem.link}
          target="_blank"
          rel="noopener noreferrer"
          startIcon={<PlayArrowIcon />}
          sx={getButtonSx}
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
          component="a"
          variant="contained"
          color="primary"
          startIcon={<PlayArrowIcon sx={{ marginRight: '6px', minWidth: 0, fontSize: '1.1em' }} />}
          href={trailerUrl}
          target="_blank"
          rel="noopener noreferrer"
          sx={getButtonSx}
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
          component="a"
          variant="contained"
          href={selectedItem.link}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            ...getButtonSx,
            backgroundColor: '#1DB954',
            '&:hover': { backgroundColor: '#1ed760' }
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
            if (onOverlayNavigate) {
              onOverlayNavigate(getLocalizedPath('/como-descargar', lang));
            } else {
              navigate(getLocalizedPath('/como-descargar', lang));
            }
          }}
          sx={getButtonSx}
        >
          {t?.ui?.actions?.download || (lang === 'en' ? 'Download' : 'Descargar')}
        </UiButton>
      </Box>
    );
  }
  return <>{buttons}</>;
};

export const DesktopActionButtons: React.FC<ActionButtonsProps> = ({ selectedItem, trailerUrl, lang, t, goToHowToDownload, onOverlayNavigate }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const getButtonSx = {
    mt: 2,
    fontWeight: 700,
    fontSize: { xs: '1rem', md: '1.1rem' },
    minWidth: 180,
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
  };
  const buttons: React.ReactNode[] = [];
  if (selectedItem.category === 'music' && selectedItem.youtube) {
    buttons.push(
      <Box key="music-youtube" sx={{ textAlign: 'center', marginBottom: '16px' }}>
        <UiButton
          component="a"
          variant="contained"
          href={selectedItem.youtube}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            ...getButtonSx,
            backgroundColor: '#e53935',
            '&:hover': { backgroundColor: '#b71c1c' }
          }}
        >
          {lang === 'es' ? 'Oír en YouTube' : 'Listen in YouTube'}
        </UiButton>
      </Box>
    );
  }
  if (selectedItem.category === 'music' && selectedItem.spotify) {
    buttons.push(
      <Box key="music-spotify" sx={{ textAlign: 'center', marginBottom: '16px' }}>
        <UiButton
          component="a"
          variant="contained"
          href={selectedItem.spotify}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            ...getButtonSx,
            backgroundColor: '#1DB954',
            '&:hover': { backgroundColor: '#1ed760' }
          }}
        >
          {lang === 'es' ? 'Oír en Spotify' : 'Listen in Spotify'}
        </UiButton>
      </Box>
    );
  }
  if (selectedItem.category === 'documentales' && selectedItem.link) {
    buttons.push(
      <Box key="documental" sx={{ textAlign: 'center', marginBottom: '16px' }}>
        <UiButton
          component="a"
          variant="contained"
          color="primary"
          href={selectedItem.link}
          target="_blank"
          rel="noopener noreferrer"
          startIcon={<PlayArrowIcon />}
          sx={getButtonSx}
        >
          {t?.documentales?.watch || 'Ver documental'}
        </UiButton>
      </Box>
    );
  }
  if (trailerUrl) {
    buttons.push(
      <Box key="trailer" sx={{ textAlign: 'center', marginBottom: '16px' }}>
        <UiButton
          component="a"
          variant="contained"
          color="primary"
          startIcon={<PlayArrowIcon sx={{ marginRight: '6px', minWidth: 0, fontSize: '1.1em' }} />}
          href={trailerUrl}
          target="_blank"
          rel="noopener noreferrer"
          sx={getButtonSx}
        >
          {t?.watch_trailer || t?.ui?.actions?.watchTrailer || (lang === 'en' ? 'Watch Trailer' : 'Ver Tráiler')}
        </UiButton>
      </Box>
    );
  }
  if (selectedItem.category === 'podcast' && selectedItem.link) {
    buttons.push(
      <Box key="spotify" sx={{ textAlign: 'center', marginBottom: '16px' }}>
        <UiButton
          component="a"
          variant="contained"
          href={selectedItem.link}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            ...getButtonSx,
            backgroundColor: '#1DB954',
            '&:hover': { backgroundColor: '#1ed760' }
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
          component="a"
          variant="contained"
          color="primary"
          startIcon={<PlayArrowIcon sx={{ marginRight: '6px', minWidth: 0, fontSize: '1.1em' }} />}
          onClick={() => {
            if (onOverlayNavigate) {
              onOverlayNavigate(getLocalizedPath('/como-descargar', lang));
            } else {
              navigate(getLocalizedPath('/como-descargar', lang));
            }
          }}
          sx={getButtonSx}
        >
          {t?.ui?.actions?.download || (lang === 'en' ? 'Download' : 'Descargar')}
        </UiButton>
      </Box>
    );
  }
  return <>{buttons}</>;
}; 