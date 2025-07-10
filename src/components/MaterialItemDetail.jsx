import React, { useEffect, useState } from 'react';
import {
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  Button,
  useTheme,
  useMediaQuery,
  Stack,
  Fab
} from '@mui/material';
import UiCard from './ui/UiCard';
import {
  ArrowBack as ArrowBackIcon,
  PlayArrow as PlayArrowIcon,
  Star as StarIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
  Person as PersonIcon,
  Launch as LaunchIcon,
  AccessTime as AccessTimeIcon,
  ChildCare as ChildCareIcon,
  Code as DeveloperIcon,
  Gamepad as PlatformIcon,
  Translate as TranslateIcon,
  PlaylistPlay as PlaylistPlayIcon
} from '@mui/icons-material';
import { useLanguage } from '../LanguageContext';
import useViewStore from '../store/viewStore';
import { getSubcategoryLabel } from '../utils/getSubcategoryLabel';
import { getCategoryColor, getCategoryGradient } from '../utils/categoryPalette';
import { processTitle, processDescription } from '../store/utils';

// =============================================
// MaterialItemDetail: Detalle de ítem Material UI
// Optimizado para móviles, soporta accesibilidad, animaciones y layout avanzado.
// =============================================

// --- Animación de gradiente para el título ---
const animatedGradientKeyframes = {
  '@keyframes animatedGradientBG': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
};

const getCategoryAnimatedGradient = (category) => {
  switch (category) {
    case 'movies':
    case 'peliculas':
      return 'linear-gradient(270deg, #ff9800, #2196f3, #8bc34a, #e91e63, #ff9800)';
    case 'videogames':
    case 'videojuegos':
      return 'linear-gradient(270deg, #8bc34a, #2196f3, #ff9800, #e91e63, #8bc34a)';
    case 'books':
    case 'libros':
      return 'linear-gradient(270deg, #2196f3, #ff9800, #8bc34a, #e91e63, #2196f3)';
    case 'music':
    case 'musica':
      return 'linear-gradient(270deg, #e91e63, #8bc34a, #2196f3, #ff9800, #e91e63)';
    default:
      return 'linear-gradient(270deg, #ff9800, #2196f3, #8bc34a, #e91e63, #ff9800)';
  }
};

const MaterialItemDetail = ({ item }) => {
  const { lang, t, getCategoryTranslation, getSubcategoryTranslation, getTranslation } = useLanguage();
  const { goBackFromDetail } = useViewStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  // Solo renderizar en móviles
  if (!isMobile || !item) {
    return null;
  }
  const title = processTitle(item.title || item.name, lang);
  const description = processDescription(item.description, lang);

  // Función auxiliar para asegurar que siempre devuelva un string
  const ensureString = (value) => {
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value !== null) {
      return value[lang] || value.es || value.en || JSON.stringify(value);
    }
    return String(value || '');
  };

  // Determinar qué trailer mostrar según el idioma
  const getTrailerUrl = () => {
    if (!item.trailer) return null;
    if (lang === 'es' && item.trailer.es) {
      return item.trailer.es;
    } else if (lang === 'en' && item.trailer.en) {
      return item.trailer.en;
    } else if (typeof item.trailer === 'string') {
      return item.trailer;
    } else if (item.trailer.es) {
      return item.trailer.es;
    } else if (item.trailer.en) {
      return item.trailer.en;
    }
    return null;
  };

  const trailerUrl = getTrailerUrl();

  // Estado para saber si la imagen principal ha cargado
  const [imgLoaded, setImgLoaded] = useState(false);

  // Scroll arriba en móviles solo cuando la imagen esté cargada
  useEffect(() => {
    let timeoutId;
    const isReallyMobile = isMobile || /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);
    if (isReallyMobile && item && imgLoaded) {
      timeoutId = setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }, 30); // pequeño retardo tras carga de imagen
    }
    return () => clearTimeout(timeoutId);
  }, [isMobile, item && (item.id || item.title || item.name), imgLoaded]);

  // Función para manejar la acción de descarga
  const handleDownloadClick = () => {
    alert('Descarga iniciada (aquí va tu lógica)');
  };

  // --- Estilos centralizados ---
  const cardSx = {
    maxWidth: 600,
    margin: '0 auto',
    marginTop: 14,
    marginLeft: 5,
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: theme.shadows[8],
    border: item.masterpiece ? '3px solid #ffd700' : 'none',
    background: '#fff',
    backgroundImage: 'none',
    p: 0,
  };
  const badgeSx = {
    position: 'absolute',
    top: { xs: '60px', md: '-12px' },
    right: { xs: '-9px', md: '-12px' },
    zIndex: 100,
    width: { xs: '57px', md: '40px' },
    height: { xs: '38px', md: '40px' },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'white',
    borderRadius: { xs: '19px', md: '50%' },
    boxShadow: 4,
    p: 0,
    m: 0
  };
  const titleSx = {
    fontWeight: 'bold',
    fontSize: { xs: '1.2rem', sm: '2rem' },
    textAlign: 'center',
    marginBottom: { xs: 0, sm: '16px' },
    borderRadius: { xs: 0, sm: '8px' },
    boxShadow: { xs: 'none', sm: 2 },
    p: { xs: 0, sm: 1 },
    mt: { xs: 0, sm: 0 },
    mb: { xs: 0, sm: '16px' },
    m: { xs: 0, sm: undefined },
    background: getCategoryAnimatedGradient(item.category),
    backgroundSize: '1200% 1200%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    color: 'transparent',
    animation: 'animatedGradientBG 6s ease-in-out infinite',
    ...animatedGradientKeyframes['@keyframes animatedGradientBG']
  };
  const chipSx = {
    fontSize: { xs: '0.8rem', sm: '1rem' },
    borderRadius: '16px',
    fontWeight: 600,
    boxShadow: 2,
    py: '6px',
    px: '12px',
    m: '0 4px 8px 0',
  };
  const descSx = {
    textAlign: 'justify',
    fontSize: { xs: '0.9rem', sm: '1rem' },
    lineHeight: 1.6,
    mb: 2,
    color: '#444',
  };
  const actionBtnSx = {
    minWidth: 180,
    maxWidth: 320,
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block',
    textAlign: 'center',
    fontWeight: 700,
    fontSize: '1rem',
    paddingTop: '12px',
    paddingBottom: '12px',
    borderRadius: '8px',
    boxShadow: '2px 2px 8px rgba(0,0,0,0.08)',
    mx: 'auto',
    my: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    p: 0,
    m: 0
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', padding: '16px', zIndex: 1 }}>
      {/* Botón de volver flotante */}
      <Fab
        color="primary"
        aria-label="volver"
        onClick={goBackFromDetail}
        sx={{
          position: 'fixed',
          top: '80px',
          left: '16px',
          zIndex: 1201, // Asegura que el botón esté por encima del AppBar
          backgroundColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          }
        }}
      >
        <ArrowBackIcon />
      </Fab>
      {/* Tarjeta principal */}
      <UiCard
        sx={cardSx}
      >
        {/* Imagen principal */}
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            sx={{
              height: 300,
              objectFit: 'cover',
              width: '100%',
              borderRadius: 0,
              boxShadow: 'none',
              border: '2px solid #111', // Borde negro en todos los dispositivos
            }}
            image={item.image}
            alt={title}
            onLoad={() => setImgLoaded(true)}
          />
          {/* Badge de masterpiece solo móviles, overlay absoluto sobre la imagen */}
          {item.masterpiece && (
            <Box
              title={getTranslation('ui.badges.masterpiece', 'Obra maestra')}
              sx={badgeSx}
            >
              <img
                alt={getTranslation('ui.alt.masterpiece', 'Obra maestra')}
                src="/imagenes/masterpiece-star.png"
                style={{ width: 32, height: 32, display: 'block' }}
              />
            </Box>
          )}
        </Box>
        <CardContent sx={{ padding: { xs: '12px 8px', md: '24px' } }}>
          {/* Título */}
          <Typography 
            variant="h4" 
            component="h1" 
            id="item-detail-mobile-title"
            gutterBottom
            sx={titleSx}
          >
            {title}
          </Typography>
          {/* Detalles adicionales (chips, descripción, botones, etc.) */}
          <Stack spacing={1} sx={{ mb: 2 }}>
            {/* Chips de categoría y subcategoría */}
            <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <Chip 
                label={getCategoryTranslation(item.category, lang)} 
                sx={{ 
                  backgroundColor: getCategoryColor(item.category),
                  color: 'white',
                  ...chipSx
                }}
                icon={
                  <CategoryIcon sx={{ mr: 0.5, fontSize: { xs: '1rem', sm: '1.2rem' } }} />
                }
              />
              {item.subcategory && (
                <Chip 
                  label={getSubcategoryLabel(item.subcategory, item.category || 'series', t, lang)} 
                  sx={{ 
                    backgroundColor: theme.palette.secondary.main,
                    color: 'white',
                    ...chipSx
                  }}
                  icon={
                    <TranslateIcon sx={{ mr: 0.5, fontSize: { xs: '1rem', sm: '1.2rem' } }} />
                  }
                />
              )}
            </Box>
            {/* Descripción */}
            <Typography 
              variant="body1" 
              component="div"
              sx={descSx}
            >
              {description}
            </Typography>
            {/* Botones de acción */}
            <Stack spacing={2} sx={{ alignItems: 'center', width: '100%' }}>
              {/* Botón Ver Trailer */}
              {trailerUrl && (
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', p: 0, m: 0 }}>
                  <Button
                    component="a"
                    href={trailerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="contained"
                    color="primary"
                    sx={actionBtnSx}
                    startIcon={<PlayArrowIcon sx={{ ml: '-2px', mr: '2px', fontSize: '1.3em' }} />}
                  >
                    <span style={{ display: 'inline-block', verticalAlign: 'middle', lineHeight: 1 }}>{t?.ui?.actions?.watchTrailer ? t.ui.actions.watchTrailer : (lang === 'en' ? 'Watch Trailer' : 'Ver Trailer')}</span>
                  </Button>
                </Box>
              )}
              {/* Botón Descargar Película (solo para películas) */}
              {item.category === 'movies' && (
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', p: 0, m: 0 }}>
                  <Button
                    component="a"
                    href="#descargar"
                    variant="contained"
                    color="primary"
                    sx={actionBtnSx}
                    onClick={e => { e.preventDefault(); handleDownloadClick(); }}
                    startIcon={<LaunchIcon sx={{ ml: '-2px', mr: '2px', fontSize: '1.3em' }} />}
                  >
                    <span style={{ display: 'inline-block', verticalAlign: 'middle', lineHeight: 1 }}>{t?.ui?.actions?.download ? `${t.ui.actions.download} ${t.ui.categories?.movies?.toLowerCase?.() || ''}`.trim() : (lang === 'en' ? 'Download movie' : 'Descargar película')}</span>
                  </Button>
                </Box>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </UiCard>
    </Box>
  );
};

export default MaterialItemDetail;
