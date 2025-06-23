import React, { memo } from 'react';
import PropTypes from 'prop-types';
import {
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
import { useAppView } from '../store/useAppStore';
import UiCard from './ui/UiCard';

/**
 * MaterialRecommendationCard
 * Card visual para mostrar una recomendación.
 *
 * Props:
 * - recommendation: objeto de recomendación (requerido)
 * - onClick: función al hacer click (por defecto navega al detalle)
 * - showCategory: boolean (muestra el chip de categoría)
 * - showSubcategory: boolean (muestra el chip de subcategoría)
 * - sx: estilos extra para la card
 * - className: clase CSS extra
 * - actions: nodo React para acciones extra (abajo)
 */
const MaterialRecommendationCard = memo(({
  recommendation,
  onClick,
  showCategory = true,
  showSubcategory = true,
  sx = {},
  className = '',
  actions
}) => {
  const { lang, getCategoryTranslation, getSubcategoryTranslation } = useLanguage();
  const { goToDetail, processTitle, processDescription } = useAppView();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  if (!isMobile) return null;

  const title = processTitle(recommendation.title || recommendation.name, lang);
  const description = processDescription(recommendation.description, lang);
  const truncateDescription = (desc, category, maxLength = 150) => {
    if (!desc) return '';
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
        return theme.palette.mode === 'dark' ? '#c2185b' : '#e91e63';
      case 'comics':
        return theme.palette.mode === 'dark' ? '#f57c00' : '#ff9800';
      case 'documentales':
      case 'documentaries':
        return theme.palette.mode === 'dark' ? '#757575' : '#9e9e9e';
      default:
        return theme.palette.primary.main;
    }
  };
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
        return 'linear-gradient(135deg, #fafafa 0%, #e0e0e0 100%)';
      default:
        return 'linear-gradient(135deg, #f5fafd 0%, #bbdefb 100%)';
    }
  };
  const handleCardClick = () => {
    if (onClick) onClick(recommendation);
    else goToDetail(recommendation);
  };

  return (
    <UiCard
      className={`mp-card mp-card--material ${className}`}
      style={{
        maxWidth: 300,
        margin: '0 auto',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: recommendation.masterpiece ? theme.shadows[4] : theme.shadows[2],
        overflow: 'visible',
        border: recommendation.masterpiece ? '2px solid #ffd700' : 'none',
        background: recommendation.masterpiece
          ? (theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #2a2600 60%, #333300 100%)'
            : 'linear-gradient(135deg, #fffbe6 60%, #ffe066 100%)')
          : getCategoryGradient(recommendation.category),
        ...sx
      }}
      onClick={handleCardClick}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          sx={{
            height: 200,
            objectFit: 'cover',
            width: '100%'
          }}
          image={recommendation.image}
          alt={title}
        />
        {/* Badge de masterpiece - SOLO móviles: top: 0, right: 0 */}
        {recommendation.masterpiece && (
          <Badge
            badgeContent={<StarIcon sx={{ fontSize: '18px', color: '#ffd700' }} />} // Estrella dorada
            sx={{
              position: 'absolute',
              top: { xs: 0, md: 8 },
              right: { xs: 0, md: 8 },
              zIndex: 10,
              pointerEvents: 'none',
              '& .MuiBadge-badge': {
                backgroundColor: 'white',
                color: '#ffd700',
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: '2px solid #ffd700',
                boxShadow: theme.shadows[4],
                display: 'flex !important',
                alignItems: 'center',
                justifyContent: 'center',
                visibility: 'visible !important',
                opacity: '1 !important',
                padding: 0
              }
            }}
          />
        )}
      </Box>
      <CardContent sx={{ position: 'relative', overflow: 'visible' }}>
        <Typography variant="h6" component="h3" sx={{ marginBottom: '8px', fontSize: '1rem' }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', gap: '4px', marginBottom: '8px', flexWrap: 'wrap', flexDirection: recommendation.category === 'boardgames' ? 'column' : 'row', alignItems: recommendation.category === 'boardgames' ? 'flex-start' : 'center' }}>
          {showCategory && (
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
          )}
          {/* Mostrar subcategoría solo si no es documental */}
          {showSubcategory && recommendation.subcategory && recommendation.category !== 'documentales' && recommendation.category !== 'documentaries' && (
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
        </Box>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {truncateDescription(description, recommendation.category)}
        </Typography>
        {actions && <Box mt={1}>{actions}</Box>}
      </CardContent>
    </UiCard>
  );
});

MaterialRecommendationCard.propTypes = {
  recommendation: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  showCategory: PropTypes.bool,
  showSubcategory: PropTypes.bool,
  sx: PropTypes.object,
  className: PropTypes.string,
  actions: PropTypes.node
};

export default MaterialRecommendationCard;
