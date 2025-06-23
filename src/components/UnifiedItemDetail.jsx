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
  const { processTitle, processDescription, goBackFromDetail, goToHowToDownload } = useAppView();
  const { getMasterpieceBadgeConfig } = useAppTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  
  const badgeConfig = getMasterpieceBadgeConfig();
  const selectedItem = item;

  const [imgLoaded, setImgLoaded] = React.useState(false);
  
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
            onLoad={() => {
              setImgLoaded(true);
              console.log('[UnifiedItemDetail] Imagen cargada, imgLoaded=true');
            }}
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
          {/* Eliminado director y año para películas, ya se muestran en info-row */}
          
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
    // Unificación de maquetación para todos los detalles (excepto título, categoría, subcategoría y descripción)
    const infoRows = [];
    // Documentales
    if (selectedItem.category === 'documentales') {
      if (selectedItem.author) infoRows.push({ label: t.documentales?.author || 'Autor', value: ensureString(selectedItem.author) });
      if (selectedItem.duration) infoRows.push({ label: t.documentales?.duration || 'Duración', value: ensureString(selectedItem.duration) });
      if (selectedItem.language) infoRows.push({ label: t.documentales?.language || 'Idioma', value: t.filters?.languages?.[selectedItem.language] || ensureString(selectedItem.language) });
      if (selectedItem.episodes) infoRows.push({ label: t.documentales?.episodes || 'Episodios', value: ensureString(selectedItem.episodes) });
      if (selectedItem.year) infoRows.push({ label: t.documentales?.year || 'Año', value: ensureString(selectedItem.year) });
      if (selectedItem.country) infoRows.push({ label: t.documentales?.country || 'País', value: ensureString(selectedItem.country) });
      if (selectedItem.director) infoRows.push({ label: t.documentales?.director || 'Director', value: ensureString(selectedItem.director) });
    }
    // Juegos de mesa
    if (selectedItem.category === 'boardgames') {
      if (selectedItem.minPlayers || selectedItem.maxPlayers) {
        let players = selectedItem.minPlayers && selectedItem.maxPlayers
          ? (selectedItem.minPlayers === selectedItem.maxPlayers
              ? ensureString(selectedItem.minPlayers)
              : `${ensureString(selectedItem.minPlayers)}-${ensureString(selectedItem.maxPlayers)}`)
          : ensureString(selectedItem.minPlayers || selectedItem.maxPlayers);
        infoRows.push({ label: lang === 'es' ? 'Jugadores' : 'Players', value: players });
      }
      if (selectedItem.playTime) infoRows.push({ label: lang === 'es' ? 'Duración' : 'Play Time', value: `${ensureString(selectedItem.playTime)} min` });
      if (selectedItem.age) infoRows.push({ label: lang === 'es' ? 'Edad' : 'Age', value: ensureString(selectedItem.age) });
    }
    // Videojuegos
    if (selectedItem.category === 'videogames') {
      if (selectedItem.author) infoRows.push({ label: lang === 'es' ? 'Desarrollador' : 'Developer', value: ensureString(selectedItem.author) });
      if (selectedItem.platforms) infoRows.push({ label: lang === 'es' ? 'Plataformas' : 'Platforms', value: ensureString(selectedItem.platforms) });
    }
    // Podcasts
    if (selectedItem.category === 'podcast' && selectedItem.author) {
      infoRows.push({ label: t.author || 'Autor', value: ensureString(selectedItem.author) });
    }
    // Películas y otras categorías
    if (selectedItem.category === 'movies' || selectedItem.category === 'peliculas') {
      if (selectedItem.director) infoRows.push({ label: t.director || 'Director', value: ensureString(selectedItem.director) });
      if (selectedItem.year) infoRows.push({ label: t.year || 'Año', value: ensureString(selectedItem.year) });
    }
    // Renderizado unificado
    if (infoRows.length === 0) return null;
    return (
      <div className="item-info">
        {infoRows.map((row, idx) => (
          <div className="info-row" key={idx}>
            <span className="info-label">{row.label}: </span>
            <span className="info-value">{row.value}</span>
          </div>
        ))}
      </div>
    );
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

    // Botón Descargar Película (solo para películas y series)
    if (selectedItem.category === 'movies' || selectedItem.category === 'series') {
      buttons.push(
        <Box key="download" sx={{ textAlign: 'center', marginBottom: '16px' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlayArrowIcon />}
            onClick={() => {
              if (typeof goToHowToDownload === 'function') goToHowToDownload();
            }}
            sx={{
              backgroundColor: getCategoryColor(selectedItem.category),
              fontWeight: 700,
              fontSize: { xs: '1rem', md: '1.1rem' },
              '&:hover': {
                backgroundColor: getCategoryColor(selectedItem.category),
                opacity: 0.8
              }
            }}
          >
            {t?.ui?.actions?.download || (lang === 'en' ? 'Download' : 'Descargar')}
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
            {t.watch_trailer || t?.ui?.actions?.watchTrailer || (lang === 'en' ? 'Watch Trailer' : 'Ver Trailer')}
          </a>
        </div>
      );
    }

    // Botón Descargar Película (solo para películas y series) en desktop
    if (selectedItem.category === 'movies' || selectedItem.category === 'series') {
      buttons.push(
        <div key="download" className="item-detail-trailer">
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, minWidth: 180 }}
            onClick={() => {
              if (typeof goToHowToDownload === 'function') goToHowToDownload();
            }}
            startIcon={<PlayArrowIcon />}
          >
            {t?.ui?.actions?.download || (lang === 'en' ? 'Download' : 'Descargar')}
          </Button>
        </div>
      );
    }
    
    return buttons;
  }
  
  React.useEffect(() => {
    if (isMobile && selectedItem && imgLoaded) {
      setTimeout(() => {
        // Busca el primer .MuiBox-root que contenga un .MuiCard-root
        let scrollContainer = null;
        const boxRoots = document.querySelectorAll('.MuiBox-root');
        for (const box of boxRoots) {
          if (box.querySelector('.MuiCard-root')) {
            scrollContainer = box;
            break;
          }
        }
        if (scrollContainer) {
          const style = window.getComputedStyle(scrollContainer);
          const hasScroll = style.overflowY === 'auto' || style.overflowY === 'scroll' || scrollContainer.scrollHeight > scrollContainer.clientHeight;
          console.log('[UnifiedItemDetail] Scroll container encontrado:', scrollContainer.className, 'overflowY:', style.overflowY, 'scrollHeight:', scrollContainer.scrollHeight, 'clientHeight:', scrollContainer.clientHeight);
          if (hasScroll) {
            scrollContainer.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            scrollContainer.scrollTop = 0;
            console.log('[UnifiedItemDetail] Scroll aplicado en scrollContainer');
          } else if (scrollContainer.parentNode) {
            const parent = scrollContainer.parentNode;
            const parentStyle = window.getComputedStyle(parent);
            const parentHasScroll = parent.scrollHeight > parent.clientHeight;
            console.log('[UnifiedItemDetail] Intentando scroll en parentNode:', parent.className, 'scrollHeight:', parent.scrollHeight, 'clientHeight:', parent.clientHeight);
            if (parentHasScroll) {
              parent.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              parent.scrollTop = 0;
              console.log('[UnifiedItemDetail] Scroll aplicado en parentNode');
            } else {
              console.log('[UnifiedItemDetail] Ni scrollContainer ni parent tienen scroll. Fallback a window.');
              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            }
          } else {
            console.log('[UnifiedItemDetail] scrollContainer no tiene parentNode. Fallback a window.');
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          }
        } else {
          // Fallback a window
          console.log('[UnifiedItemDetail] Scroll to top en window (no se encontró .MuiBox-root contenedor de .MuiCard-root)');
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }
      }, 0);
    }
  }, [isMobile, selectedItem && (selectedItem.id || selectedItem.title || selectedItem.name), imgLoaded]);
};

export default UnifiedItemDetail;
