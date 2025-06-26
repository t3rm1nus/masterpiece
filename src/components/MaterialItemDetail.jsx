import React, { useEffect } from 'react';
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
import { getSubcategoryLabel } from '../utils/subcategoryLabel';
import { getCategoryColor, getCategoryGradient } from '../utils/categoryPalette';
import './styles/components/item-detail-action-btn.css';

const MaterialItemDetail = ({ item }) => {
  const { lang, t, getCategoryTranslation, getSubcategoryTranslation, getTranslation } = useLanguage();
  const { goBackFromDetail, processTitle, processDescription } = useViewStore();
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

  // Gradiente de fondo igual que en los listados
  const getCategoryGradient = (category) => {
    switch (category) {
      case 'movies':
      case 'peliculas':
        return 'linear-gradient(135deg, #f5fafd 0%, #bbdefb 100%)';
      case 'videogames':
      case 'videojuegos':
        return 'linear-gradient(135deg, #f8f3fa 0%, #e1bee7 100%)';
      case 'books':
      case 'libros':
        return 'linear-gradient(135deg, #f4faf4 0%, #c8e6c9 100%)';
      case 'music':
      case 'musica':
        return 'linear-gradient(135deg, #f2fbfc 0%, #b2ebf2 100%)';
      case 'podcast':
      case 'podcasts':
        return 'linear-gradient(135deg, #f7fbf2 0%, #dcedc8 100%)';
      case 'boardgames':
      case 'juegos de mesa':
        return 'linear-gradient(135deg, #fdf4f8 0%, #f8bbd0 100%)';
      case 'comics':
        return 'linear-gradient(135deg, #fff8f0 0%, #ffe0b2 100%)';
      case 'documentales':
      case 'documentaries':
        return 'linear-gradient(135deg, #fdeaea 0%, #e57373 100%)';
      default:
        return 'linear-gradient(135deg, #f5fafd 0%, #bbdefb 100%)';
    }
  };

  // Estado para saber si la imagen principal ha cargado
  const [imgLoaded, setImgLoaded] = React.useState(false);

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
    // Aquí va la lógica de descarga personalizada
    // Por ejemplo, mostrar un modal, iniciar descarga, etc.
    alert('Descarga iniciada (aquí va tu lógica)');
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', padding: '16px' }} className="item-detail-mobile">
      {/* Botón de volver flotante */}
      <Fab
        color="primary"
        aria-label="volver"
        onClick={goBackFromDetail}
        sx={{
          position: 'fixed',
          top: '80px',
          left: '16px',
          zIndex: 1000,
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
        className={`item-detail-mobile-card recommendation-card ${item.category || 'movies'}`}
        sx={{
          maxWidth: 600,
          margin: '0 auto',
          marginTop: '60px',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: theme.shadows[8],
          border: item.masterpiece ? '3px solid #ffd700' : 'none',
        }}
        style={{ background: '#fff', backgroundImage: 'none' }}
      >
        {/* Imagen principal */}
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            sx={{
              height: 300,
              objectFit: 'cover',
              width: '100%'
            }}
            image={item.image}
            alt={title}
            onLoad={() => setImgLoaded(true)}
          />
          {/* Badge de masterpiece solo móviles, overlay absoluto sobre la imagen */}
          {item.masterpiece && (
            <Box
              className="masterpiece-detail-badge force-mobile-badge"
              title={getTranslation('ui.badges.masterpiece', 'Obra maestra')}
              sx={{
                position: 'absolute',
                top: { xs: '60px !important', md: '-12px' },
                right: { xs: '-9px !important', md: '-12px' },
                zIndex: 100,
                width: { xs: '57px !important', md: '40px' },
                height: { xs: '38px !important', md: '40px' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'white',
                borderRadius: { xs: '19px', md: '50%' },
                boxShadow: 4,
                p: 0,
                m: 0
              }}
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
            className="detail-title-mobile animated-gradient-title"
            sx={{ 
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
              backgroundSize: '200% 200%',
              animation: 'animatedGradientBG 6s ease-in-out infinite',
              color: '#222',
            }}
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
                  fontWeight: 'bold',
                  borderRadius: '16px',
                  py: '6px',
                  px: '12px',
                  fontSize: { xs: '0.8rem', sm: '1rem' },
                  boxShadow: 2
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
                    fontWeight: 'bold',
                    borderRadius: '16px',
                    py: '6px',
                    px: '12px',
                    fontSize: { xs: '0.8rem', sm: '1rem' },
                    boxShadow: 2
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
              sx={{ 
                textAlign: 'justify',
                fontSize: { xs: '0.9rem', sm: '1rem' },
                lineHeight: 1.6,
                mb: 2
              }}
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
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      py: '10px',
                      borderRadius: '8px',
                      boxShadow: 2,
                      minWidth: 180,
                      maxWidth: 320,
                      width: '100%',
                      mx: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      textAlign: 'center',
                      p: 0,
                      m: 0
                    }}
                    startIcon={<PlayArrowIcon sx={{ ml: '-2px', mr: '2px', fontSize: '1.3em' }} />}
                    className="item-detail-action-btn"
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
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      py: '10px',
                      borderRadius: '8px',
                      boxShadow: 2,
                      minWidth: 180,
                      maxWidth: 320,
                      width: '100%',
                      mx: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      textAlign: 'center',
                      p: 0,
                      m: 0
                    }}
                    onClick={e => { e.preventDefault(); handleDownloadClick(); }}
                    startIcon={<LaunchIcon sx={{ ml: '-2px', mr: '2px', fontSize: '1.3em' }} />}
                    className="item-detail-action-btn"
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

/*
Agrega este CSS global si hay estilos globales que afectan los h1:
@media (max-width: 900px) {
  .detail-title-mobile {
    border-radius: 0 !important;
    box-shadow: none !important;
    margin: 0 !important;
  }
}
*/
