import React from 'react';
import { CardContent, CardMedia, Typography, Chip, Box, Stack, Fab, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Category as CategoryIcon, Extension as ExtensionIcon, Movie as MovieIcon, Book as BookIcon, MusicNote as MusicNoteIcon, SportsEsports as SportsEsportsIcon, Mic as MicIcon, Tv as TvIcon, AutoStories as ComicIcon } from '@mui/icons-material';
import { OndemandVideoIcon, LiveTvIcon } from './CategoryCustomIcons';
import { getCategoryColor, getCategoryGradient } from '../../utils/categoryPalette';
import { ensureString } from '../../utils/stringUtils';
import UiCard from '../ui/UiCard';
import { MobileActionButtons } from './ItemActionButtons';

/**
 * MobileItemDetail
 * Detalle de ítem para móvil, altamente parametrizable y unificado con DesktopItemDetail.
 *
 * Props avanzados:
 * - renderHeader, renderImage, renderCategory, renderSubcategory, renderYear, renderDescription, renderActions, renderFooter: funciones para custom render de cada sección
 * - showSections: objeto para mostrar/ocultar secciones (por ejemplo: { image: true, category: true, year: true, description: true, actions: true, footer: true })
 * - sx, className, style: estilos avanzados
 * - onBack: callback para botón de volver (opcional)
 * - ...props legacy
 *
 * Ejemplo de uso:
 * <MobileItemDetail
 *   selectedItem={item}
 *   renderHeader={...}
 *   renderImage={...}
 *   renderCategory={...}
 *   renderSubcategory={...}
 *   renderYear={...}
 *   renderDescription={...}
 *   renderActions={...}
 *   renderFooter={...}
 *   showSections={{ image: true, category: true, year: true, description: true, actions: true, footer: true }}
 *   sx={{ background: '#fafafa' }}
 *   onBack={() => ...}
 * />
 */
const MobileItemDetail = ({
  selectedItem,
  title,
  description,
  lang,
  t,
  theme,
  getCategoryTranslation,
  getSubcategoryTranslation,
  goBackFromDetail,
  goToHowToDownload,
  imgLoaded,
  setImgLoaded,
  renderMobileSpecificContent,
  renderMobileActionButtons,
  renderHeader,
  renderImage,
  renderCategory,
  renderSubcategory,
  renderYear,
  renderDescription,
  renderActions,
  renderFooter,
  showSections = {},
  sx = {},
  className = '',
  style = {},
  onBack,
  getTranslation, // <-- Añadido correctamente como prop
  ...props
}) => {
  // Filtrar props internos que no deben ir al DOM
  const domSafeProps = { ...props };
  delete domSafeProps.showCategorySelect;
  delete domSafeProps.showSubcategoryChips;
  if (!selectedItem) return null;

  // Helper para iconos por categoría
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'boardgames':
        return <ExtensionIcon />;
      case 'movies':
        return <MovieIcon />;
      case 'books':
        return <BookIcon />;
      case 'music':
        return <MusicNoteIcon />;
      case 'videogames':
        return <SportsEsportsIcon />;
      case 'podcasts':
        return <MicIcon />;
      case 'series':
        return <LiveTvIcon />; // Icono TV para series
      case 'documentales':
        return <OndemandVideoIcon />; // Icono video para documentales
      case 'comics':
        return <ComicIcon />;
      default:
        return <CategoryIcon />;
    }
  };

  return (
    <Box
      className={`item-detail-page mobile-only ${className || ''}`}
      sx={{ position: 'relative', minHeight: '100vh', padding: '16px', ...sx }}
      style={{
        ...style
      }}
      {...domSafeProps}
    >
      {/* Botón de volver flotante */}
      {showSections.backButton !== false && (onBack || goBackFromDetail) && (
        <Fab
          color="primary"
          aria-label="volver"
          onClick={onBack || goBackFromDetail}
          sx={{
            position: 'fixed',
            top: '80px',
            left: '16px',
            zIndex: 1000,
            backgroundColor: theme?.palette?.primary?.main,
            '&:hover': {
              backgroundColor: theme?.palette?.primary?.dark,
            }
          }}
        >
          <ArrowBackIcon />
        </Fab>
      )}
      {/* Tarjeta principal */}
      <UiCard
        sx={{
          maxWidth: 600,
          width: '100%',
          margin: '0 auto',
          marginTop: 0,
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: theme?.shadows?.[8],
          border: selectedItem.masterpiece ? '3px solid #ffd700' : 'none',
          background: selectedItem.masterpiece ? '#fffbe6' : getCategoryGradient(selectedItem.category),
        }}
      >
        {/* Header custom */}
        {renderHeader && renderHeader(selectedItem)}
        {/* Imagen principal */}
        {showSections.image !== false && (renderImage
          ? renderImage(selectedItem)
          : <CardMedia
              component="img"
              sx={{ height: 300, objectFit: 'cover', position: 'relative' }}
              image={selectedItem.image}
              alt={title}
              onLoad={() => setImgLoaded && setImgLoaded(true)}
            />
        )}
        {/* Badge de masterpiece en la imagen */}
        {selectedItem.masterpiece && (
          <span className="masterpiece-detail-badge" title={(getTranslation ? getTranslation('ui.badges.masterpiece', 'Obra maestra') : 'Obra maestra')}>
            <img src="/imagenes/masterpiece-star.png" alt={(getTranslation ? getTranslation('ui.alt.masterpiece', 'Obra maestra') : 'Obra maestra')} style={{ width: 56, height: 56, display: 'block' }} />
          </span>
        )}
        <CardContent sx={{ padding: '24px' }}>
          {/* Título */}
          {showSections.title !== false && (
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
          )}
          {/* Chips de categoría y subcategoría */}
          {showSections.category !== false && (
            renderCategory
              ? renderCategory(selectedItem)
              : <Stack direction="row" spacing={1} justifyContent="center" sx={{ marginBottom: '16px' }} style={{
                  '--category-color': getCategoryColor(selectedItem.category, 'strong')
                }}>
                  <Chip
                    icon={getCategoryIcon(selectedItem.category)}
                    label={getCategoryTranslation(selectedItem.category)}
                    className="category-chip"
                    sx={{
                      backgroundColor: selectedItem.category === 'boardgames' ? 'transparent' : getCategoryColor(selectedItem.category, 'strong'),
                      color: selectedItem.category === 'boardgames' ? getCategoryColor(selectedItem.category, 'strong') : 'white',
                      borderColor: selectedItem.category === 'boardgames' ? getCategoryColor(selectedItem.category, 'strong') : 'transparent',
                      border: selectedItem.category === 'boardgames' ? '1.5px solid' : 'none',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      letterSpacing: 0.2,
                      alignSelf: 'flex-start',
                      boxShadow: selectedItem.category === 'boardgames' ? undefined : '0 0 0 2px rgba(0,0,0,0.04)',
                      '& .MuiChip-icon': {
                        color: selectedItem.category === 'boardgames' ? '#fff' : 'white',
                      }
                    }}
                  />
                  {selectedItem.subcategory && (renderSubcategory
                    ? renderSubcategory(selectedItem)
                    : <Chip
                        label={getSubcategoryTranslation(selectedItem.subcategory, selectedItem.category)}
                        variant="outlined"
                        className="subcategory-chip"
                        sx={{
                          fontSize: '0.68rem',
                          borderColor: getCategoryColor(selectedItem.category, 'strong'),
                          color: '#666',
                          alignSelf: 'flex-start',
                          marginTop: '0px',
                          borderWidth: 2,
                          borderStyle: 'solid',
                          fontWeight: 500
                        }}
                      />
                  )}
                </Stack>
          )}
          {/* Información específica por categoría */}
          {renderMobileSpecificContent && renderMobileSpecificContent(selectedItem)}
          {/* Descripción */}
          {showSections.description !== false && (
            renderDescription
              ? renderDescription(selectedItem)
              : <Typography 
                  variant="body1" 
                  sx={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '24px', color: 'text.primary' }}
                >
                  {description}
                </Typography>
          )}
          {/* Botones de acción */}
          {showSections.actions !== false && (renderActions
            ? renderActions(selectedItem)
            : renderMobileActionButtons
              ? renderMobileActionButtons(selectedItem)
              : <MobileActionButtons selectedItem={selectedItem} lang={lang} t={t} />
          )}
          {/* Footer custom */}
          {showSections.footer !== false && renderFooter && renderFooter(selectedItem)}
        </CardContent>
      </UiCard>
    </Box>
  );
};

export default MobileItemDetail;
