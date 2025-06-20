import React from 'react';
import { useLanguage } from '../LanguageContext';
import { useAppView, useAppTheme } from '../store/useAppStore';
import '../styles/components/item-detail.css';

// Material UI imports (solo para mobile)
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
  Category as CategoryIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  ChildCare as ChildCareIcon,
  Code as DeveloperIcon,
  Gamepad as PlatformIcon,
  Translate as TranslateIcon,
  PlaylistPlay as PlaylistPlayIcon
} from '@mui/icons-material';

const UnifiedItemDetail = ({ item, onClose, selectedCategory }) => {
  const { lang, t, getCategoryTranslation, getSubcategoryTranslation } = useLanguage();
  const { processTitle, processDescription, goBackFromDetail } = useAppView();
  const { getMasterpieceBadgeConfig } = useAppTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  
  const badgeConfig = getMasterpieceBadgeConfig();
  const selectedItem = item;
  
  if (!selectedItem) return null;
  
  // Función auxiliar para asegurar que siempre devuelva un string
  const ensureString = (value) => {
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value !== null) {
      return value[lang] || value.es || value.en || JSON.stringify(value);
    }
    return String(value || '');
  };
  
  const rawTitle = processTitle(selectedItem.title || selectedItem.name, lang);
  const rawDescription = processDescription(selectedItem.description, lang);
  
  const title = ensureString(rawTitle);
  const description = ensureString(rawDescription);
  
  // Determinar qué trailer mostrar según el idioma
  const getTrailerUrl = () => {
    if (!selectedItem.trailer) return null;
    
    if (lang === 'es' && selectedItem.trailer.es) {
      return selectedItem.trailer.es;
    } else if (lang === 'en' && selectedItem.trailer.en) {
      return selectedItem.trailer.en;
    } else if (typeof selectedItem.trailer === 'string') {
      return selectedItem.trailer;
    } else if (selectedItem.trailer.es) {
      return selectedItem.trailer.es;
    } else if (selectedItem.trailer.en) {
      return selectedItem.trailer.en;
    }
    return null;
  };
  
  const trailerUrl = getTrailerUrl();
  
  // Función para obtener colores de categorías (usada en mobile)
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
      case 'documentales':
      case 'documentaries':
        return '#9e9e9e';
      default:
        return theme?.palette?.primary?.main || '#1976d2';
    }
  };
  
  // Renderizado para móviles usando Material UI
  if (isMobile) {
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
            border: selectedItem.masterpiece ? '3px solid #ffd700' : 'none',
            background: selectedItem.masterpiece 
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
            image={selectedItem.image}
            alt={title}
          />
          
          {/* Badge de masterpiece en la imagen */}
          {selectedItem.masterpiece && (
            <span className="masterpiece-detail-badge" title="Obra maestra">
              <img src="/imagenes/masterpiece-star.png" alt="Masterpiece" style={{ width: 56, height: 56, display: 'block' }} />
            </span>
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
            {selectedItem.category !== 'boardgames' && selectedItem.category !== 'videogames' && (
              <Stack 
                direction="row" 
                spacing={1} 
                justifyContent="center" 
                sx={{ marginBottom: '16px' }}
              >
                <Chip
                  icon={<CategoryIcon />}
                  label={getCategoryTranslation(selectedItem.category)}
                  sx={{
                    backgroundColor: getCategoryColor(selectedItem.category),
                    color: 'white',
                    fontWeight: 'bold',
                    '& .MuiChip-icon': {
                      color: 'white'
                    }
                  }}
                />
                {selectedItem.subcategory && (
                  <Chip
                    label={getSubcategoryTranslation(selectedItem.subcategory, selectedItem.category)}
                    variant="outlined"
                    sx={{
                      borderColor: getCategoryColor(selectedItem.category),
                      color: getCategoryColor(selectedItem.category),
                      fontWeight: 'bold'
                    }}
                  />
                )}
              </Stack>
            )}
            
            {/* Año */}
            {selectedItem.year && (
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
                  <strong>{t.year || 'Año'}:</strong> {ensureString(selectedItem.year)}
                </Typography>
              </Box>
            )}
            
            {/* Información específica por categoría */}
            {renderMobileSpecificContent()}
            
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
            
            {/* Botones de acción */}
            {renderMobileActionButtons()}
          </CardContent>
        </Card>
      </Box>
    );
  }
  
  // Renderizado para desktop usando CSS clásico
  return (
    <div className="item-detail-page desktop-only">
      <div className="item-detail-container">
        <div className={`item-detail-content ${selectedItem.masterpiece ? 'masterpiece-item' : 'normal-item'} ${selectedItem.category}`}>
          {selectedItem.masterpiece && (
            <span className="masterpiece-detail-badge" title="Obra maestra">
              <img src="/imagenes/masterpiece-star.png" alt="Masterpiece" style={{ width: 56, height: 56, display: 'block' }} />
            </span>
          )}
          
          <div className="item-detail-image-container">
            <img 
              src={selectedItem.image} 
              alt={title}
              className="item-detail-image"
            />
          </div>
          <h2 className="item-detail-title" style={{
            color: '#111',
            fontWeight: 900,
            fontSize: '2.4rem',
            margin: '0.7em 0 0.3em 0',
            lineHeight: 1.1,
            display: 'block',
            letterSpacing: '-1.5px',
            background: 'none',
            border: 'none',
            boxShadow: 'none',
            textShadow: 'none',
            borderRadius: 0,
            padding: 0
          }}>{title}</h2>
          
          {/* Categoría y subcategoría */}
          {selectedItem.category !== 'boardgames' && selectedItem.category !== 'videogames' && (
            <div className="item-detail-category">
              <span className="category-name">
                {getCategoryTranslation(selectedItem.category)}
              </span>
              {selectedItem.subcategory && (
                <span className="subcategory-name">{getSubcategoryTranslation(selectedItem.subcategory, selectedItem.category)}</span>
              )}
            </div>
          )}
          
          {/* Información general */}
          {selectedItem.director && (
            <p className="item-detail-director">
              <strong>{t.director || 'Director'}: </strong> {ensureString(selectedItem.director)}
            </p>
          )}
          
          {selectedItem.year && (
            <p className="item-detail-year">
              <strong>{t.year || 'Año'}: </strong> {ensureString(selectedItem.year)}
            </p>
          )}
          
          {/* Información específica por categoría */}
          {renderDesktopSpecificContent()}
          
          <p className={`item-detail-description ${selectedItem.category === 'boardgames' ? 'boardgame-description' : ''}`}>
            {description}
          </p>
          
          {/* Botones de acción */}
          {renderDesktopActionButtons()}
        </div>
      </div>
    </div>
  );
  
  // Función para renderizar contenido específico de categorías en mobile
  function renderMobileSpecificContent() {
    // Juegos de mesa
    if (selectedItem.category === 'boardgames') {
      return (
        <Box sx={{ marginBottom: '16px' }}>
          {(selectedItem.minPlayers || selectedItem.maxPlayers) && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
              <PersonIcon sx={{ marginRight: '8px', color: getCategoryColor(selectedItem.category) }} />
              <Typography variant="h6" sx={{ color: getCategoryColor(selectedItem.category) }}>
                <strong>{lang === 'es' ? 'Jugadores' : 'Players'}:</strong>{' '}
                {selectedItem.minPlayers && selectedItem.maxPlayers 
                  ? (selectedItem.minPlayers === selectedItem.maxPlayers 
                      ? ensureString(selectedItem.minPlayers) 
                      : `${ensureString(selectedItem.minPlayers)}-${ensureString(selectedItem.maxPlayers)}`)
                  : ensureString(selectedItem.minPlayers || selectedItem.maxPlayers)
                }
              </Typography>
            </Box>
          )}
          
          {selectedItem.playTime && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
              <AccessTimeIcon sx={{ marginRight: '8px', color: getCategoryColor(selectedItem.category) }} />
              <Typography variant="h6" sx={{ color: getCategoryColor(selectedItem.category) }}>
                <strong>{lang === 'es' ? 'Duración' : 'Play Time'}:</strong> {ensureString(selectedItem.playTime)} {lang === 'es' ? 'min' : 'min'}
              </Typography>
            </Box>
          )}
          
          {selectedItem.age && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <ChildCareIcon sx={{ marginRight: '8px', color: getCategoryColor(selectedItem.category) }} />
              <Typography variant="h6" sx={{ color: getCategoryColor(selectedItem.category) }}>
                <strong>{lang === 'es' ? 'Edad' : 'Age'}:</strong> {ensureString(selectedItem.age)}
              </Typography>
            </Box>
          )}
        </Box>
      );
    }
    
    // Videojuegos
    if (selectedItem.category === 'videogames') {
      return (
        <Box sx={{ marginBottom: '16px' }}>
          {selectedItem.author && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
              <DeveloperIcon sx={{ marginRight: '8px', color: getCategoryColor(selectedItem.category) }} />
              <Typography variant="h6" sx={{ color: getCategoryColor(selectedItem.category) }}>
                <strong>{lang === 'es' ? 'Desarrollador' : 'Developer'}:</strong> {ensureString(selectedItem.author)}
              </Typography>
            </Box>
          )}
          
          {selectedItem.platforms && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
              <PlatformIcon sx={{ marginRight: '8px', color: getCategoryColor(selectedItem.category) }} />
              <Typography variant="h6" sx={{ color: getCategoryColor(selectedItem.category) }}>
                <strong>{lang === 'es' ? 'Plataformas' : 'Platforms'}:</strong> {ensureString(selectedItem.platforms)}
              </Typography>
            </Box>
          )}
        </Box>
      );
    }
    
    // Podcasts
    if (selectedItem.category === 'podcast' && selectedItem.author) {
      return (
        <Box sx={{ marginBottom: '16px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
            <PersonIcon sx={{ marginRight: '8px', color: getCategoryColor(selectedItem.category) }} />
            <Typography variant="h6" sx={{ color: getCategoryColor(selectedItem.category) }}>
              <strong>{lang === 'es' ? 'Autor' : 'Author'}:</strong> {ensureString(selectedItem.author)}
            </Typography>
          </Box>
        </Box>
      );
    }
    
    // Documentales
    if (selectedItem.category === 'documentales') {
      return (
        <Box sx={{ marginBottom: '16px' }}>
          {selectedItem.author && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
              <PersonIcon sx={{ marginRight: '8px', color: getCategoryColor(selectedItem.category) }} />
              <Typography variant="h6" sx={{ color: getCategoryColor(selectedItem.category) }}>
                <strong>{lang === 'es' ? 'Autor' : 'Author'}:</strong> {ensureString(selectedItem.author)}
              </Typography>
            </Box>
          )}
          
          {selectedItem.duration && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
              <AccessTimeIcon sx={{ marginRight: '8px', color: getCategoryColor(selectedItem.category) }} />
              <Typography variant="h6" sx={{ color: getCategoryColor(selectedItem.category) }}>
                <strong>{lang === 'es' ? 'Duración' : 'Duration'}:</strong> {ensureString(selectedItem.duration)}
              </Typography>
            </Box>
          )}
          
          {selectedItem.language && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
              <TranslateIcon sx={{ marginRight: '8px', color: getCategoryColor(selectedItem.category) }} />
              <Typography variant="h6" sx={{ color: getCategoryColor(selectedItem.category) }}>
                <strong>{lang === 'es' ? 'Idioma' : 'Language'}:</strong> {ensureString(selectedItem.language)}
              </Typography>
            </Box>
          )}
          
          {selectedItem.episodes && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
              <PlaylistPlayIcon sx={{ marginRight: '8px', color: getCategoryColor(selectedItem.category) }} />
              <Typography variant="h6" sx={{ color: getCategoryColor(selectedItem.category) }}>
                <strong>{lang === 'es' ? 'Episodios' : 'Episodes'}:</strong> {ensureString(selectedItem.episodes)}
              </Typography>
            </Box>
          )}
        </Box>
      );
    }
    
    return null;
  }
  
  // Función para renderizar contenido específico de categorías en desktop
  function renderDesktopSpecificContent() {
    // Documentales
    if (selectedItem.category === 'documentales') {
      return (
        <div className="documentales-specific-details">
          <div className="item-info">
            {selectedItem.author && (
              <div className="info-row">
                <span className="info-label">{t.documentales?.author || 'Autor'}: </span>
                <span className="info-value">{ensureString(selectedItem.author)}</span>
              </div>
            )}
            {selectedItem.duration && (
              <div className="info-row">
                <span className="info-label">{t.documentales?.duration || 'Duración'}: </span>
                <span className="info-value">{ensureString(selectedItem.duration)}</span>
              </div>
            )}
            {selectedItem.language && (
              <div className="info-row">
                <span className="info-label">{t.documentales?.language || 'Idioma'}: </span>
                <span className="info-value">{t.filters?.languages?.[selectedItem.language] || ensureString(selectedItem.language)}</span>
              </div>
            )}
            {selectedItem.episodes && (
              <div className="info-row">
                <span className="info-label">{t.documentales?.episodes || 'Episodios'}: </span>
                <span className="info-value">{ensureString(selectedItem.episodes)}</span>
              </div>
            )}
            {selectedItem.year && (
              <div className="info-row">
                <span className="info-label">{t.documentales?.year || 'Año'}: </span>
                <span className="info-value">{ensureString(selectedItem.year)}</span>
              </div>
            )}
            {selectedItem.country && (
              <div className="info-row">
                <span className="info-label">{t.documentales?.country || 'País'}: </span>
                <span className="info-value">{ensureString(selectedItem.country)}</span>
              </div>
            )}
            {selectedItem.director && (
              <div className="info-row">
                <span className="info-label">{t.documentales?.director || 'Director'}: </span>
                <span className="info-value">{ensureString(selectedItem.director)}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    // Juegos de mesa
    if (selectedItem.category === 'boardgames') {
      return (
        <div className="boardgame-details">
          {(selectedItem.minPlayers || selectedItem.maxPlayers) && (
            <p className="item-detail-players">
              <strong>{lang === 'es' ? 'Jugadores' : 'Players'}: </strong>
              {selectedItem.minPlayers && selectedItem.maxPlayers 
                ? (selectedItem.minPlayers === selectedItem.maxPlayers 
                    ? ensureString(selectedItem.minPlayers) 
                    : `${ensureString(selectedItem.minPlayers)}-${ensureString(selectedItem.maxPlayers)}`)
                : ensureString(selectedItem.minPlayers || selectedItem.maxPlayers)
              }
            </p>
          )}
          
          {selectedItem.playTime && (
            <p className="item-detail-playtime">
              <strong>{lang === 'es' ? 'Duración' : 'Play Time'}: </strong> {ensureString(selectedItem.playTime)} {lang === 'es' ? 'min' : 'min'}
            </p>
          )}
          
          {selectedItem.age && (
            <p className="item-detail-age">
              <strong>{lang === 'es' ? 'Edad' : 'Age'}: </strong> {ensureString(selectedItem.age)}
            </p>
          )}
        </div>
      );
    }
    
    // Videojuegos
    if (selectedItem.category === 'videogames') {
      return (
        <div className="videogame-details">
          {selectedItem.author && (
            <p className="item-detail-developer">
              <strong>{lang === 'es' ? 'Desarrollador' : 'Developer'}: </strong> {ensureString(selectedItem.author)}
            </p>
          )}
          
          {selectedItem.platforms && (
            <p className="item-detail-platforms">
              <strong>{lang === 'es' ? 'Plataformas' : 'Platforms'}: </strong> {ensureString(selectedItem.platforms)}
            </p>
          )}
        </div>
      );
    }
    
    // Podcasts
    if (selectedItem.category === 'podcast' && selectedItem.author) {
      return (
        <p className="item-detail-author">
          <strong>{t.author || 'Autor'}: </strong> {ensureString(selectedItem.author)}
        </p>
      );
    }
    
    return null;
  }
  
  // Función para renderizar botones de acción en mobile
  function renderMobileActionButtons() {
    const buttons = [];
    
    // Botón para documentales
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
    
    // Botón de trailer
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
    
    // Botón de Spotify para podcasts
    if (selectedItem.category === 'podcast' && selectedItem.link) {
      buttons.push(
        <Box key="spotify" sx={{ textAlign: 'center', marginBottom: '16px' }}>
          <Button
            variant="contained"
            href={selectedItem.link}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              backgroundColor: '#1DB954', // Spotify green
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
    
    return buttons;
  }
  
  // Función para renderizar botones de acción en desktop
  function renderDesktopActionButtons() {
    const buttons = [];
    
    // Botón para documentales
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
    
    // Botón de trailer
    if (trailerUrl) {
      buttons.push(
        <div key="trailer" className="item-detail-trailer">
          <a 
            href={trailerUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="trailer-link"
          >
            {t.watch_trailer || 'Ver Trailer'}
          </a>
        </div>
      );
    }
    
    // Botón de Spotify para podcasts
    if (selectedItem.category === 'podcast' && selectedItem.link) {
      buttons.push(
        <div key="spotify" className="item-detail-spotify">
          <a 
            href={selectedItem.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="spotify-link"
          >
            Escuchar en Spotify
          </a>
        </div>
      );
    }
    
    return buttons;
  }
};

export default UnifiedItemDetail;
