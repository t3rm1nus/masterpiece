import React, { memo } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  Badge,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Star as StarIcon,
  Movie as MovieIcon,
  SportsEsports as GameIcon,
  MenuBook as BookIcon,
  LibraryMusic as MusicIcon,
  Mic as PodcastIcon,
  Extension as BoardGameIcon,
  AutoStories as ComicIcon
} from '@mui/icons-material';
import { useLanguage } from '../LanguageContext';
import useViewStore from '../store/viewStore';

const MaterialRecommendationCard = ({ recommendation, isHome = false }) => {
  const { lang, getCategoryTranslation, getSubcategoryTranslation } = useLanguage();
  const { navigateToDetail, processTitle, processDescription } = useViewStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  
  // Solo renderizar en móviles
  if (!isMobile) {
    return null;
  }
  
  const title = processTitle(recommendation.title || recommendation.name, lang);
  const description = processDescription(recommendation.description, lang);
    // Función para recortar descripciones largas
  const truncateDescription = (desc, category, maxLength = 150) => {
    if (!desc) return '';
    
    // Aplicar truncamiento a todas las categorías
    if (desc.length > maxLength) {
      return desc.substring(0, maxLength).trim() + '...';
    }
    
    return desc;
  };
  
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'movies':
      case 'peliculas':
        return <MovieIcon fontSize="small" />;
      case 'videogames':
      case 'videojuegos':
        return <GameIcon fontSize="small" />;
      case 'books':
      case 'libros':
        return <BookIcon fontSize="small" />;
      case 'music':
      case 'musica':
        return <MusicIcon fontSize="small" />;
      case 'podcast':
      case 'podcasts':
        return <PodcastIcon fontSize="small" />;
      case 'boardgames':
      case 'juegos de mesa':
        return <BoardGameIcon fontSize="small" />;
      case 'comics':
        return <ComicIcon fontSize="small" />;
      default:
        return <StarIcon fontSize="small" />;
    }
  };
    const getCategoryColor = (category) => {
    switch (category) {
      case 'movies':
      case 'peliculas':
        return theme.palette.mode === 'dark' ? '#1976d2' : '#2196f3';
      case 'videogames':
      case 'videojuegos':
        return theme.palette.mode === 'dark' ? '#7b1fa2' : '#9c27b0';
      case 'books':
      case 'libros':
        return theme.palette.mode === 'dark' ? '#388e3c' : '#4caf50';
      case 'music':
      case 'musica':
        return theme.palette.mode === 'dark' ? '#0097a7' : '#00bcd4';
      case 'podcast':
      case 'podcasts':
        return theme.palette.mode === 'dark' ? '#689f38' : '#8bc34a';
      case 'boardgames':
      case 'juegos de mesa':
        return theme.palette.mode === 'dark' ? '#c2185b' : '#e91e63';      case 'comics':
        return theme.palette.mode === 'dark' ? '#f57c00' : '#ff9800';
      case 'documentales':
      case 'documentaries':
        return theme.palette.mode === 'dark' ? '#757575' : '#9e9e9e';
      default:
        return theme.palette.primary.main;
    }
  };
    const handleClick = () => {
    navigateToDetail(recommendation);
  };  return isHome ? (
    // Layout para la home (móvil)
    <Card
      sx={{
        width: '100%',
        maxWidth: 400,
        margin: '0 auto 16px auto',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: recommendation.masterpiece ? theme.shadows[4] : theme.shadows[2], // Sombra base
        overflow: 'visible', // Permitir que el badge sobresalga
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],        
        },
        border: recommendation.masterpiece ? '2px solid #ffd700' : 'none',
        background: recommendation.masterpiece 
          ? (theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #2a2600 60%, #333300 100%)'
            : 'linear-gradient(135deg, #fffbe6 60%, #ffe066 100%)')
          : (theme.palette.mode === 'dark' ? '#2d2d2d' : '#ffffff') // Color sólido para no-masterpieces
      }}
      onClick={handleClick}
    >
      <CardContent sx={{ padding: '12px', position: 'relative', overflow: 'visible' }}>
        {/* Título centrado arriba */}
        <Typography 
          variant="h6" 
          component="h3"
          sx={{ 
            textAlign: 'center',
            marginBottom: '12px',
            fontSize: '1rem',
            fontWeight: 'bold',
            lineHeight: 1.2
          }}
        >
          {title}
        </Typography>
        
        {/* Contenido principal en fila */}
        <Box sx={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          {/* Imagen y categorías */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 80 }}>
            <CardMedia
              component="img"
              sx={{
                width: 80,
                height: 110,
                borderRadius: '6px',
                objectFit: 'cover',
                marginBottom: '8px'
              }}
              image={recommendation.image}
              alt={title}
            />            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
              <Chip
                icon={getCategoryIcon(recommendation.category)}
                label={getCategoryTranslation(recommendation.category)}
                size="small"
                sx={{
                  backgroundColor: recommendation.category === 'boardgames' ? 'transparent' : getCategoryColor(recommendation.category),
                  color: recommendation.category === 'boardgames' ? getCategoryColor(recommendation.category) : 'white',
                  borderColor: recommendation.category === 'boardgames' ? getCategoryColor(recommendation.category) : 'transparent',
                  border: recommendation.category === 'boardgames' ? '1px solid' : 'none',
                  fontSize: '0.7rem',
                  height: '24px',
                  '& .MuiChip-icon': {
                    color: recommendation.category === 'boardgames' ? getCategoryColor(recommendation.category) : 'white'
                  }
                }}
              />
              {recommendation.subcategory && (
                <Chip
                  label={getSubcategoryTranslation(recommendation.subcategory, recommendation.category)}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: '0.65rem',
                    height: '20px',
                    borderColor: getCategoryColor(recommendation.category),
                    color: getCategoryColor(recommendation.category),
                    marginTop: recommendation.category === 'boardgames' ? '4px' : '0px'
                  }}
                />
              )}
            </Box>
          </Box>          {/* Descripción */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontSize: '0.85rem',
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 6,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {truncateDescription(description, recommendation.category)}
            </Typography>
          </Box>
        </Box>
          {/* Badge de masterpiece */}
        {recommendation.masterpiece && (
          <Badge
            badgeContent={<StarIcon sx={{ fontSize: '16px', color: 'white' }} />}            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              zIndex: 10, // Asegurar que esté siempre visible
              '& .MuiBadge-badge': {
                backgroundColor: '#ffd700',
                color: 'white',
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: '2px solid white',
                boxShadow: theme.shadows[4], // Sombra más prominente
                display: 'flex !important', // Asegurar que siempre se muestre
                visibility: 'visible !important', // Forzar visibilidad
                opacity: '1 !important' // Asegurar opacidad completa
              }
            }}
          />
        )}
      </CardContent>    </Card>
  ) : (
    // Layout para categorías (móvil)
    <Card
      sx={{
        width: '100%',
        maxWidth: 300,
        margin: '0 auto', // Centrar la tarjeta
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: recommendation.masterpiece ? theme.shadows[4] : theme.shadows[2], // Sombra base
        overflow: 'visible', // Permitir que el badge sobresalga
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],        },
        border: recommendation.masterpiece ? '2px solid #ffd700' : 'none',
        background: recommendation.masterpiece 
          ? (theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #2a2600 60%, #333300 100%)'
            : 'linear-gradient(135deg, #fffbe6 60%, #ffe066 100%)')
          : (theme.palette.mode === 'dark' ? '#2d2d2d' : '#ffffff') // Color sólido para no-masterpieces
      }}
      onClick={handleClick}
    >
      <CardMedia
        component="img"
        sx={{
          height: 200,
          objectFit: 'cover'
        }}
        image={recommendation.image}
        alt={title}
      />
      <CardContent sx={{ position: 'relative', overflow: 'visible' }}>
        <Typography variant="h6" component="h3" sx={{ marginBottom: '8px', fontSize: '1rem' }}>
          {title}
        </Typography>
          <Box sx={{ display: 'flex', gap: '4px', marginBottom: '8px', flexWrap: 'wrap', flexDirection: recommendation.category === 'boardgames' ? 'column' : 'row', alignItems: recommendation.category === 'boardgames' ? 'flex-start' : 'center' }}>
          <Chip
            icon={getCategoryIcon(recommendation.category)}
            label={getCategoryTranslation(recommendation.category)}
            size="small"
            sx={{
              backgroundColor: recommendation.category === 'boardgames' ? 'transparent' : getCategoryColor(recommendation.category),
              color: recommendation.category === 'boardgames' ? getCategoryColor(recommendation.category) : 'white',
              borderColor: recommendation.category === 'boardgames' ? getCategoryColor(recommendation.category) : 'transparent',
              border: recommendation.category === 'boardgames' ? '1px solid' : 'none',
              fontSize: '0.7rem',
              alignSelf: recommendation.category === 'boardgames' ? 'flex-start' : 'auto',
              '& .MuiChip-icon': {
                color: recommendation.category === 'boardgames' ? getCategoryColor(recommendation.category) : 'white'
              }
            }}
          />
          {recommendation.subcategory && (
            <Chip
              label={getSubcategoryTranslation(recommendation.subcategory, recommendation.category)}
              size="small"
              variant="outlined"
              sx={{
                fontSize: '0.65rem',
                borderColor: getCategoryColor(recommendation.category),
                color: getCategoryColor(recommendation.category),
                alignSelf: recommendation.category === 'boardgames' ? 'flex-start' : 'auto',
                marginTop: recommendation.category === 'boardgames' ? '4px' : '0px'
              }}
            />
          )}
        </Box><Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}        >
          {truncateDescription(description, recommendation.category)}        </Typography>
      </CardContent>
      
      {/* Badge de masterpiece - posicionado sobre la imagen */}
      {recommendation.masterpiece && (
        <Badge
          badgeContent={<StarIcon sx={{ fontSize: '16px', color: 'white' }} />}          sx={{
            position: 'absolute',
            top: 8, // Ajustado para estar sobre la imagen
            right: 8,
            zIndex: 10, // Asegurar que esté siempre visible
            '& .MuiBadge-badge': {
              backgroundColor: '#ffd700',
              color: 'white',
              width: 28,
              height: 28,
              borderRadius: '50%',
              border: '2px solid white',
              boxShadow: theme.shadows[4], // Sombra más prominente
              display: 'flex !important', // Asegurar que siempre se muestre
              visibility: 'visible !important', // Forzar visibilidad
              opacity: '1 !important' // Asegurar opacidad completa
            }
          }}
        />
      )}
    </Card>
  );
};

export default memo(MaterialRecommendationCard);
