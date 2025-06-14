import React from 'react';
import {
  Card,
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
import {
  ArrowBack as ArrowBackIcon,
  PlayArrow as PlayArrowIcon,
  Star as StarIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { useLanguage } from '../LanguageContext';
import useViewStore from '../store/viewStore';

const MaterialItemDetail = ({ item }) => {
  const { lang, t, getCategoryTranslation, getSubcategoryTranslation } = useLanguage();
  const { goBackFromDetail, processTitle, processDescription } = useViewStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  
  // Solo renderizar en móviles
  if (!isMobile || !item) {
    return null;
  }
  
  const title = processTitle(item.title, lang);
  const description = processDescription(item.description, lang);
  
  // Determinar qué trailer mostrar según el idioma
  const getTrailerUrl = () => {
    if (!item.trailer) return null;
    
    // Priorizar el idioma actual, si no existe usar el disponible
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
  
  const getCategoryColor = (category) => {
    switch (category) {
      case 'movies':
      case 'peliculas':
        return '#2196f3';
      case 'videogames':
      case 'videojuegos':
        return '#9c27b0';
      case 'books':
      case 'libros':
        return '#4caf50';
      case 'music':
      case 'musica':
        return '#00bcd4';
      case 'podcast':
      case 'podcasts':
        return '#8bc34a';
      case 'boardgames':
      case 'juegos de mesa':
        return '#e91e63';
      case 'comics':
        return '#ff9800';
      default:
        return theme.palette.primary.main;
    }
  };
  
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', padding: '16px' }}>
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
      <Card
        sx={{
          maxWidth: 600,
          margin: '0 auto',
          marginTop: '60px',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: theme.shadows[8],
          border: item.masterpiece ? '3px solid #ffd700' : 'none',
          background: item.masterpiece 
            ? 'linear-gradient(135deg, #fffbe6 60%, #ffe066 100%)'
            : theme.palette.background.paper
        }}
      >
        {/* Imagen principal */}
        <CardMedia
          component="img"
          sx={{
            height: 300,
            objectFit: 'cover',
            position: 'relative'
          }}
          image={item.image}
          alt={title}
        />
        
        {/* Badge de masterpiece en la imagen */}
        {item.masterpiece && (
          <Box
            sx={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              backgroundColor: '#ffd700',
              color: 'white',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid white',
              boxShadow: theme.shadows[4],
              zIndex: 10
            }}
          >
            <StarIcon sx={{ fontSize: '20px' }} />
          </Box>
        )}
        
        <CardContent sx={{ padding: '24px' }}>
          {/* Título */}
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '1.5rem', sm: '2rem' },
              textAlign: 'center',
              marginBottom: '16px'
            }}
          >
            {title}
          </Typography>
          
          {/* Chips de categoría y subcategoría */}
          <Stack 
            direction="row" 
            spacing={1} 
            justifyContent="center" 
            sx={{ marginBottom: '16px' }}
          >
            <Chip
              icon={<CategoryIcon />}
              label={getCategoryTranslation(item.category)}
              sx={{
                backgroundColor: getCategoryColor(item.category),
                color: 'white',
                fontWeight: 'bold',
                '& .MuiChip-icon': {
                  color: 'white'
                }
              }}
            />
            {item.subcategory && (
              <Chip
                label={getSubcategoryTranslation(item.subcategory)}
                variant="outlined"
                sx={{
                  borderColor: getCategoryColor(item.category),
                  color: getCategoryColor(item.category),
                  fontWeight: 'bold'
                }}
              />
            )}
          </Stack>
          
          {/* Año */}
          {item.year && (
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '16px' 
              }}
            >
              <CalendarIcon sx={{ marginRight: '8px', color: 'text.secondary' }} />
              <Typography variant="h6" color="text.secondary">
                <strong>{t.year || 'Año'}:</strong> {item.year}
              </Typography>
            </Box>
          )}
          
          {/* Descripción */}
          <Typography 
            variant="body1" 
            sx={{ 
              fontSize: '1.1rem',
              lineHeight: 1.6,
              textAlign: 'justify',
              marginBottom: '24px',
              color: 'text.primary'
            }}
          >
            {description}
          </Typography>
          
          {/* Botón de trailer */}
          {trailerUrl && (
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                startIcon={<PlayArrowIcon />}
                href={trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  backgroundColor: '#ff4444',
                  color: 'white',
                  padding: '12px 24px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: '25px',
                  textTransform: 'none',
                  boxShadow: theme.shadows[4],
                  '&:hover': {
                    backgroundColor: '#cc0000',
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[8]
                  }
                }}
              >
                {t.watch_trailer || 'Ver Trailer'}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default MaterialItemDetail;
