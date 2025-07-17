import React, { memo, useState, useEffect } from 'react';
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
import { OndemandVideoIcon, LiveTvIcon } from './shared/CategoryCustomIcons';
import { useLanguage } from '../LanguageContext';
import { useAppView } from '../store/useAppStore';
import { processTitle, processDescription } from '../store/utils';
import UiCard from './ui/UiCard';
import { getCategoryColor, getCategoryGradient } from '../utils/categoryPalette';
import useIsomorphicLayoutEffect from '../hooks/useIsomorphicLayoutEffect';

// Tipos para props
interface Recommendation {
  title?: string;
  name?: string;
  description?: string;
  image?: string;
  category?: string;
  subcategory?: string | null;
  artist?: string;
  masterpiece?: boolean;
  [key: string]: any;
}

export type { Recommendation };

interface MaterialRecommendationCardProps {
  recommendation: Recommendation;
  onClick?: (rec: Recommendation) => void;
  showCategory?: boolean;
  showSubcategory?: boolean;
  sx?: Record<string, any>;
  className?: string;
  actions?: React.ReactNode;
}

const MaterialRecommendationCard: React.FC<MaterialRecommendationCardProps> = memo(({
  recommendation,
  onClick,
  showCategory = true,
  showSubcategory = true,
  sx = {},
  className = '',
  actions
}) => {
  const { lang, getCategoryTranslation, getSubcategoryTranslation } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { goToDetail } = useAppView();

  const title = processTitle(recommendation.title || recommendation.name, lang);
  const description = processDescription(recommendation.description, lang);
  const truncateDescription = (desc: string, category: string, maxLength = 150) => {
    if (!desc) return '';
    if (desc.length > maxLength) {
      return desc.substring(0, maxLength).trim() + '...';
    }
    return desc;
  };
  const getCategoryIcon = (category?: string) => {
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
      case 'series':
        return <LiveTvIcon fontSize="small" />;
      case 'documentales':
        return <OndemandVideoIcon fontSize="small" />;
      default:
        return <StarIcon fontSize="small" />;
    }
  };
  const handleCardClick = () => {
    if (onClick) onClick(recommendation);
    else goToDetail(recommendation);
  };

  const cardSx = (theme: any) => {
    return {
      maxWidth: { xs: '88vw', md: 245 },
      minWidth: { xs: 0, md: 200 },
      width: { xs: '82vw', md: undefined },
      margin: '0 auto 12px auto',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: recommendation.masterpiece ? theme.shadows[4] : theme.shadows[2],
      ...(isIphone
        ? {
            overflow: 'visible !important',
            overflowY: 'visible !important',
            position: 'relative',
            zIndex: 20,
            paddingTop: '0px',
          }
        : {
            overflow: 'visible',
            overflowY: 'visible',
            position: 'relative',
          }),
      border: recommendation.masterpiece ? '2px solid #ffd700' : 'none',
      background: recommendation.masterpiece
        ? (theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #2a2600 60%, #333300 100%)'
          : 'linear-gradient(135deg, #fffbe6 60%, #ffe066 100%)')
        : (sx["--card-gradient"] || getCategoryGradient(recommendation.category)),
      ...sx
    };
  };

  const badgeSx = (theme: any) => ({
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
  });

  const categoryChipSx = (cat: string) => ({
    backgroundColor: cat === 'boardgames' ? 'transparent' : getCategoryColor(cat, 'strong'),
    color: cat === 'boardgames' ? getCategoryColor(cat, 'strong') : 'white',
    borderColor: cat === 'boardgames' ? getCategoryColor(cat, 'strong') : 'transparent',
    border: cat === 'boardgames' ? '1.5px solid' : 'none',
    fontSize: '0.7rem',
    fontWeight: 600,
    letterSpacing: 0.2,
    alignSelf: 'flex-start',
    boxShadow: cat === 'boardgames' ? undefined : '0 0 0 2px rgba(0,0,0,0.04)',
    '& .MuiChip-icon': {
      color: cat === 'boardgames' ? getCategoryColor(cat, 'strong') : 'white'
    }
  });

  const subcategoryChipSx = (cat: string) => ({
    fontSize: '0.68rem',
    borderColor: getCategoryColor(cat, 'strong'),
    color: '#666',
    alignSelf: 'flex-start',
    marginTop: '0px',
    borderWidth: 2,
    borderStyle: 'solid',
    fontWeight: 500
  });

  // Detectar iPhone de forma SSR-safe
  const [isIphone, setIsIphone] = useState(false);
  useIsomorphicLayoutEffect(() => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      setIsIphone(/iPhone|iPad|iPod/.test(navigator.userAgent));
    }
  }, []);

  return (
    <UiCard
      className={`mp-card mp-card--material ${className}`}
      sx={cardSx(theme)}
      onClick={handleCardClick}
    >
      {/* Badge de masterpiece - ahora sobre la esquina del card */}
      {recommendation.masterpiece && (
        <Badge
          badgeContent={<StarIcon sx={{ fontSize: { xs: '26px', sm: '22px', md: '18px' }, color: '#ffd700', animation: { xs: 'pulseGlow 2s ease-in-out infinite', md: 'none' } }} />} // Estrella dorada más grande y animada en móvil
          sx={{
            ...badgeSx(theme),
            position: 'absolute',
            // SOLO para iPhone: sobresalir más y asegurar stacking
            ...(isIphone
              ? {
                  top: '-24px',
                  right: '-24px',
                  zIndex: 30,
                  pointerEvents: 'none',
                  '& .MuiBadge-badge': {
                    ...badgeSx(theme)['& .MuiBadge-badge'],
                    width: 40,
                    height: 40,
                    fontSize: '1.7rem',
                    animation: 'pulseGlow 2s ease-in-out infinite',
                  },
                }
              : {
                  top: { xs: '-21px', md: 0 },
                  right: { xs: '-20px', md: 0 },
                  zIndex: 20,
                  pointerEvents: 'none',
                  '& .MuiBadge-badge': {
                    ...badgeSx(theme)['& .MuiBadge-badge'],
                    width: { xs: 38, sm: 32, md: 28 },
                    height: { xs: 38, sm: 32, md: 28 },
                    fontSize: { xs: '1.6rem', sm: '1.2rem', md: '1rem' },
                    animation: { xs: 'pulseGlow 2s ease-in-out infinite', md: 'none' },
                  },
                }),
          }}
        />
      )}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          sx={{
            height: 200,
            objectFit: 'cover',
            width: '100%',
            border: '2px solid #111', // Borde negro en todos los dispositivos
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
              sx={categoryChipSx(recommendation.category)}
            />
          )}
        </Box>
        {showSubcategory && recommendation.subcategory && (
          <Box sx={{ marginBottom: '8px', width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
            <Chip
              label={getSubcategoryTranslation(recommendation.subcategory, recommendation.category)}
              size="small"
              variant="outlined"
              sx={subcategoryChipSx(recommendation.category)}
            />
          </Box>
        )}
        {recommendation.artist && (
          <div
            style={{
              fontSize: '0.97rem',
              color: '#232323',
              fontWeight: 400,
              marginBottom: 8,
              marginTop: 18,
              textAlign: 'left',
              letterSpacing: 0.01,
              lineHeight: 1.35,
              fontFamily: 'inherit',
              wordBreak: 'break-word',
              opacity: 0.93
            }}
          >
            {recommendation.artist}
          </div>
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

export default MaterialRecommendationCard; 