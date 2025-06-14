import React from 'react';
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
import useUIStore from '../store/uiStore';

const MaterialRecommendationCard = ({ recommendation, isHome = false }) => {
  const { lang, getCategoryTranslation, getSubcategoryTranslation } = useLanguage();
  const { navigateToDetail } = useUIStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  
  // Solo renderizar en móviles
  if (!isMobile) {
    return null;
  }
  
  const title = recommendation.title?.[lang] || recommendation.title || 'Sin título';
  const description = recommendation.description?.[lang] || recommendation.description || '';
  
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
        return theme.palette.mode === 'dark' ? '#388e3c' : '#4caf50';      case 'music':
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
      default:
        return theme.palette.primary.main;
    }
  };
  
  const handleClick = () => {
    navigateToDetail(recommendation);
  };
    const cardContent = isHome ? (
    // Layout para la home (móvil)
    <Card
      sx={{
        width: '100%',
        maxWidth: 400,
        margin: '0 auto 16px auto',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
        border: recommendation.masterpiece ? '2px solid #ffd700' : 'none',
        backgroundColor: recommendation.masterpiece 
          ? (theme.palette.mode === 'dark' ? '#2a2600' : '#fffbe6')
          : theme.palette.background.paper,
        background: recommendation.masterpiece 
          ? (theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #2a2600 60%, #333300 100%)'
            : 'linear-gradient(135deg, #fffbe6 60%, #ffe066 100%)')
          : theme.palette.background.paper
      }}
      onClick={handleClick}
    >
      <CardContent sx={{ padding: '12px' }}>
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
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
              <Chip
                icon={getCategoryIcon(recommendation.category)}
                label={getCategoryTranslation(recommendation.category)}
                size="small"
                sx={{
                  backgroundColor: getCategoryColor(recommendation.category),
                  color: 'white',
                  fontSize: '0.7rem',
                  height: '24px',
                  '& .MuiChip-icon': {
                    color: 'white'
                  }
                }}
              />
              {recommendation.subcategory && (
                <Chip
                  label={getSubcategoryTranslation(recommendation.subcategory)}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: '0.65rem',
                    height: '20px',
                    borderColor: getCategoryColor(recommendation.category),
                    color: getCategoryColor(recommendation.category)
                  }}
                />
              )}
            </Box>
          </Box>
          
          {/* Descripción */}
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
              {description}
            </Typography>
          </Box>
        </Box>
        
        {/* Badge de masterpiece */}
        {recommendation.masterpiece && (
          <Badge
            badgeContent={<StarIcon sx={{ fontSize: '14px', color: 'white' }} />}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              '& .MuiBadge-badge': {
                backgroundColor: '#ffd700',
                color: 'white',
                width: 24,
                height: 24,
                borderRadius: '50%',
                border: '2px solid white',
                boxShadow: theme.shadows[2]
              }
            }}
          />
        )}
      </CardContent>
    </Card>
  ) : (
    // Layout para categorías (móvil)
    <Card
      sx={{
        width: '100%',
        maxWidth: 300,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },        border: recommendation.masterpiece ? '2px solid #ffd700' : 'none',
        backgroundColor: recommendation.masterpiece 
          ? (theme.palette.mode === 'dark' ? '#2a2600' : '#fffbe6')
          : theme.palette.background.paper,
        background: recommendation.masterpiece 
          ? (theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #2a2600 60%, #333300 100%)'
            : 'linear-gradient(135deg, #fffbe6 60%, #ffe066 100%)')
          : theme.palette.background.paper
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
      <CardContent>
        <Typography variant="h6" component="h3" sx={{ marginBottom: '8px', fontSize: '1rem' }}>
          {title}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: '4px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <Chip
            icon={getCategoryIcon(recommendation.category)}
            label={getCategoryTranslation(recommendation.category)}
            size="small"
            sx={{
              backgroundColor: getCategoryColor(recommendation.category),
              color: 'white',
              fontSize: '0.7rem',
              '& .MuiChip-icon': {
                color: 'white'
              }
            }}
          />
          {recommendation.subcategory && (
            <Chip
              label={getSubcategoryTranslation(recommendation.subcategory)}
              size="small"
              variant="outlined"
              sx={{
                fontSize: '0.65rem',
                borderColor: getCategoryColor(recommendation.category),
                color: getCategoryColor(recommendation.category)
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
          {description}
        </Typography>
        
        {/* Badge de masterpiece */}
        {recommendation.masterpiece && (
          <Badge
            badgeContent={<StarIcon sx={{ fontSize: '14px', color: 'white' }} />}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              '& .MuiBadge-badge': {
                backgroundColor: '#ffd700',
                color: 'white',
                width: 24,
                height: 24,
                borderRadius: '50%',
                border: '2px solid white',
                boxShadow: theme.shadows[2]
              }
            }}
          />
        )}
      </CardContent>
    </Card>
  );
  
  return cardContent;
};

export default MaterialRecommendationCard;
