import React from 'react';
import { CardContent, CardMedia, Typography, Chip, Box, Stack, Fab, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Category as CategoryIcon } from '@mui/icons-material';
import { getCategoryColor } from '../../utils/categoryUtils';
import { ensureString } from '../../utils/stringUtils';
import UiCard from '../ui/UiCard';

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
  ...props
}) => {
  // Filtrar props internos que no deben ir al DOM
  const domSafeProps = { ...props };
  delete domSafeProps.showCategorySelect;
  delete domSafeProps.showSubcategoryChips;
  if (!selectedItem) return null;
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', padding: '16px', ...sx }} className={className} style={style} {...domSafeProps}>
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
          margin: '0 auto',
          marginTop: '60px',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: theme?.shadows?.[8],
          border: selectedItem.masterpiece ? '3px solid #ffd700' : 'none',
          background: selectedItem.masterpiece 
            ? (theme?.palette?.mode === 'dark' 
              ? 'linear-gradient(135deg, #2a2600 60%, #333300 100%)'
              : 'linear-gradient(135deg, #fffbe6 60%, #ffe066 100%)')
            : getCategoryColor(selectedItem.category, theme),
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
          <span className="masterpiece-detail-badge" title={getTranslation('ui.badges.masterpiece', 'Obra maestra')}>
            <img src="/imagenes/masterpiece-star.png" alt={getTranslation('ui.alt.masterpiece', 'Obra maestra')} style={{ width: 56, height: 56, display: 'block' }} />
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
          {showSections.category !== false && selectedItem.category !== 'boardgames' && selectedItem.category !== 'videogames' && (
            renderCategory
              ? renderCategory(selectedItem)
              : <Stack direction="row" spacing={1} justifyContent="center" sx={{ marginBottom: '16px' }}>
                  <Chip
                    icon={<CategoryIcon />}
                    label={getCategoryTranslation(selectedItem.category)}
                    sx={{
                      backgroundColor: getCategoryColor(selectedItem.category, theme),
                      color: 'white',
                      fontWeight: 'bold',
                      '& .MuiChip-icon': { color: 'white' }
                    }}
                  />
                  {selectedItem.subcategory && (renderSubcategory
                    ? renderSubcategory(selectedItem)
                    : <Chip
                        label={getSubcategoryTranslation(selectedItem.subcategory, selectedItem.category)}
                        variant="outlined"
                        sx={{
                          borderColor: getCategoryColor(selectedItem.category, theme),
                          color: getCategoryColor(selectedItem.category, theme),
                          fontWeight: 'bold'
                        }}
                      />
                  )}
                </Stack>
          )}
          {/* Año */}
          {showSections.year !== false && selectedItem.year && (
            renderYear
              ? renderYear(selectedItem)
              : <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Typography variant="h6" color="text.secondary">
                    <strong>{t?.year || 'Año'}:</strong> {ensureString(selectedItem.year, lang)}
                  </Typography>
                </Box>
          )}
          {/* Información específica por categoría */}
          {renderMobileSpecificContent && renderMobileSpecificContent(selectedItem)}
          {/* Descripción */}
          {showSections.description !== false && (
            renderDescription
              ? renderDescription(selectedItem)
              : <Typography 
                  variant="body1" 
                  sx={{ fontSize: '1.1rem', lineHeight: 1.6, textAlign: 'justify', marginBottom: '24px', color: 'text.primary' }}
                >
                  {description}
                </Typography>
          )}
          {/* Botones de acción */}
          {showSections.actions !== false && (renderActions
            ? renderActions(selectedItem)
            : renderMobileActionButtons && renderMobileActionButtons(selectedItem)
          )}
          {/* Footer custom */}
          {showSections.footer !== false && renderFooter && renderFooter(selectedItem)}
        </CardContent>
      </UiCard>
    </Box>
  );
};

export default MobileItemDetail;
