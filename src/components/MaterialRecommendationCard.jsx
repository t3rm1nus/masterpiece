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
import { getCategoryColor, getCategoryGradient } from '../utils/categoryPalette';

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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
  const handleCardClick = () => {
    if (onClick) onClick(recommendation);
    else goToDetail(recommendation);
  };

  return (
    <UiCard
      className={`mp-card mp-card--material ${className}`}
      style={{
        maxWidth: isMobile ? '88vw' : 245,
        minWidth: isMobile ? '0' : 200,
        width: isMobile ? '82vw' : undefined,
        margin: '0 auto 12px auto',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: recommendation.masterpiece ? theme.shadows[4] : theme.shadows[2],
        overflow: 'visible',
        border: recommendation.masterpiece ? '2px solid #ffd700' : 'none',
        background: recommendation.masterpiece
          ? (theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #2a2600 60%, #333300 100%)'
            : 'linear-gradient(135deg, #fffbe6 60%, #ffe066 100%)')
          : (sx["--card-gradient"] || getCategoryGradient(recommendation.category)),
        position: 'relative',
        ...sx
      }}
      onClick={handleCardClick}
    >
      {/* Badge de masterpiece - ahora sobre la esquina del card */}
      {recommendation.masterpiece && (
        <Badge
          badgeContent={<StarIcon sx={{ fontSize: '18px', color: '#ffd700' }} />} // Estrella dorada
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
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
      </Box>
      <CardContent sx={{ position: 'relative', overflow: 'visible' }}>
        <Typography variant="h6" component="h3" sx={{ marginBottom: '8px', fontSize: '1.13rem', textAlign: 'center', fontWeight: 600 }}>
          {title}
        </Typography>
        <Box sx={{ marginBottom: '8px', width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
          {showCategory && (
            <Chip
              icon={getCategoryIcon(recommendation.category)}
              label={getCategoryTranslation(recommendation.category)}
              size="small"
              sx={{
                backgroundColor: recommendation.category === 'boardgames' ? 'transparent' : getCategoryColor(recommendation.category, 'strong'),
                color: recommendation.category === 'boardgames' ? getCategoryColor(recommendation.category, 'strong') : 'white',
                borderColor: recommendation.category === 'boardgames' ? getCategoryColor(recommendation.category, 'strong') : 'transparent',
                border: recommendation.category === 'boardgames' ? '1.5px solid' : 'none',
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: 0.2,
                alignSelf: 'flex-start',
                boxShadow: recommendation.category === 'boardgames' ? undefined : '0 0 0 2px rgba(0,0,0,0.04)',
                '& .MuiChip-icon': {
                  color: recommendation.category === 'boardgames' ? getCategoryColor(recommendation.category, 'strong') : 'white'
                }
              }}
            />
          )}
        </Box>
        {showSubcategory && recommendation.subcategory && (
          <Box sx={{ marginBottom: '8px', width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
            <Chip
              label={getSubcategoryTranslation(recommendation.subcategory, recommendation.category)}
              size="small"
              variant="outlined"
              sx={{
                fontSize: '0.68rem',
                borderColor: getCategoryColor(recommendation.category, 'strong'),
                color: '#666',
                alignSelf: 'flex-start',
                marginTop: '0px',
                borderWidth: 2,
                borderStyle: 'solid',
                fontWeight: 500
              }}
            />
          </Box>
        )}
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
