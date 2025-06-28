import React from 'react';
import { CardContent, CardMedia, Typography, Chip, Box, Stack, Fab, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Category as CategoryIcon, Extension as ExtensionIcon, Movie as MovieIcon, Book as BookIcon, MusicNote as MusicNoteIcon, SportsEsports as SportsEsportsIcon, Mic as MicIcon, Tv as TvIcon, AutoStories as ComicIcon } from '@mui/icons-material';
import { OndemandVideoIcon, LiveTvIcon } from './CategoryCustomIcons';
import { getCategoryColor, getCategoryGradient } from '../../utils/categoryPalette';
import { ensureString } from '../../utils/stringUtils';
import UiCard from '../ui/UiCard';
import { MobileActionButtons } from './ItemActionButtons';
import MasterpieceBadge from './MasterpieceBadge';

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
  isClosing = false,
  onClose,
  ...props
}) => {
  // Filtrar props internos que no deben ir al DOM
  const domSafeProps = { ...props };
  delete domSafeProps.showCategorySelect;
  delete domSafeProps.showSubcategoryChips;

  // Permitir renderizar el detalle durante la animación de cierre aunque selectedItem sea null
  const shouldRender = selectedItem || isClosing;
  if (!shouldRender) return null;

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

  // Lógica para desmontar tras animación de salida
  const handleAnimationEnd = () => {
    if (isClosing) {
      console.log('[MobileItemDetail] Animación de cierre FINALIZADA (onAnimationEnd)');
    }
    if (isClosing && typeof onClose === 'function') {
      onClose();
    }
  };

  React.useEffect(() => {
    if (isClosing) {
      console.log('[MobileItemDetail] Animación de cierre INICIADA (isClosing=true)', { selectedItem });
    }
    // Eliminada la inyección de estilos globales para h1 móvil
  }, [isClosing, selectedItem]);

  // Botón de volver flotante, fijo respecto a la ventana y fuera del Box animado
  const BackButton = (
    showSections.backButton !== false && (onBack || goBackFromDetail) && (
      <Fab
        color="primary"
        aria-label="volver"
        onClick={() => {
          if (onBack) {
            onBack();
          } else if (goBackFromDetail) {
            goBackFromDetail();
          }
        }}
        sx={{
          position: 'fixed',
          top: { xs: '63px', sm: 24 },
          left: 16,
          zIndex: 1300,
          backgroundColor: theme?.palette?.primary?.main,
          '&:hover': {
            backgroundColor: theme?.palette?.primary?.dark,
          }
        }}
      >
        <ArrowBackIcon />
      </Fab>
    )
  );

  return (
    <>
      {BackButton}
      <Box
        sx={{
          position: 'relative',
          minHeight: '100vh',
          padding: '16px',
          pt: { xs: '20px', sm: '36px' }, // Espacio superior reducido a la mitad
          ...sx
        }}
        style={{ ...style }}
        className={isClosing ? 'slideOutDown' : 'slideInUp'}
        onAnimationEnd={handleAnimationEnd}
        {...domSafeProps}
      >
        {/* Tarjeta principal */}
        <UiCard
          sx={{
            maxWidth: { xs: 380, sm: 500, md: 600 }, // Reducido en móvil
            width: '96vw', // Un poco menos que el 100% para dejar margen
            margin: '0 auto',
            marginTop: 0,
            borderRadius: '16px',
            boxShadow: theme?.shadows?.[8],
            border: selectedItem.masterpiece ? '3px solid #ffd700' : 'none',
            background: selectedItem.masterpiece ? '#fffbe6' : getCategoryGradient(selectedItem.category),
            position: 'relative'
          }}
        >
          {/* Badge de masterpiece en la esquina del detalle */}
          {selectedItem.masterpiece && (
            <MasterpieceBadge
              alt={getTranslation ? getTranslation('ui.alt.masterpiece', 'Obra maestra') : 'Obra maestra'}
              title={getTranslation ? getTranslation('ui.badges.masterpiece', 'Obra maestra') : 'Obra maestra'}
              absolute={true}
              size={40}
              sx={{
                top: -17,
                right: -18,
                zIndex: 1201,
                filter: 'drop-shadow(0 4px 16px rgba(255,215,0,0.5))',
                background: '#FFD700',
                border: '2.5px solid #111',
                animation: 'pulseGlow 2s ease-in-out infinite',
                transition: 'box-shadow 0.3s',
              }}
            />
          )}
          {/* Header custom */}
          {renderHeader && renderHeader(selectedItem)}
          {/* Imagen principal + badge masterpiece */}
          <Box sx={{ position: 'relative' }}>
            {showSections.image !== false && (renderImage
              ? renderImage(selectedItem)
              : <CardMedia
                  component="img"
                  sx={{ height: 300, objectFit: 'cover', position: 'relative', border: '2px solid #111' }}
                  image={selectedItem.image}
                  alt={title}
                  onLoad={() => setImgLoaded && setImgLoaded(true)}
                />
            )}
          </Box>
          <CardContent sx={{ padding: '24px', position: 'relative' }}>
            {/* Título */}
            {showSections.title !== false && (
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: { xs: 400, sm: 'bold' }, // 400 en móviles, bold en desktop
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
                : <Stack direction="row" spacing={1} justifyContent="center" sx={{ marginBottom: '16px' }}>
                    <Chip
                      icon={getCategoryIcon(selectedItem.category)}
                      label={getCategoryTranslation(selectedItem.category)}
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
    </>
  );
};

export default MobileItemDetail;
