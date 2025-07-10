import React from 'react';
import UiButton from '../ui/UiButton';
import MasterpieceBadge from './MasterpieceBadge';
import { getCategoryColor } from '../../utils/categoryPalette';
import { Box, Typography, Stack } from '@mui/material';

// =============================================
// DesktopItemDetail: Detalle de ítem optimizado para desktop
// Detalle de ítem optimizado para desktop. Altamente parametrizable, soporta accesibilidad, animaciones y customización avanzada.
// =============================================
const DesktopItemDetail = ({
  selectedItem,
  title,
  description,
  lang,
  t,
  getCategoryTranslation,
  getSubcategoryTranslation,
  goToHowToDownload,
  renderDesktopSpecificContent,
  renderDesktopActionButtons,
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
  getTranslation,
  ...props
}) => {
  if (!selectedItem) return null;
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', width: '100vw', overflowX: 'hidden', background: '#fff' }}>
      {/* Contenido principal centrado y con padding superior para menú */}
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          pt: { xs: '72px', md: '88px' },
          zIndex: 1,
          position: 'relative',
          background: '#fff', // Asegura fondo blanco para .item-detail-page.desktop-only
          ...sx
        }}
        className={`item-detail-page desktop-only ${className}`}
        style={{ background: '#fff', ...style }}
        {...props}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 900,
            background: `linear-gradient(135deg, ${getCategoryColor(selectedItem.category)} 0%, #fff 100%)`, // Fondo degradado de color de categoría
            borderRadius: 4,
            boxShadow: 6,
            position: 'relative',
            p: { xs: 2, md: 4 }, // Restaurar padding original en desktop
            mt: { xs: '135px', md: '77.5px' }, // Reducir margin-top a la mitad en desktop
            mx: 'auto',
            '--category-color': getCategoryColor(selectedItem.category)
          }}
        >
          {/* Badge masterpiece */}
          {selectedItem.masterpiece && (
            <MasterpieceBadge
              alt={getTranslation ? getTranslation('ui.alt.masterpiece', 'Obra maestra') : 'Obra maestra'}
              title={getTranslation ? getTranslation('ui.badges.masterpiece', 'Obra maestra') : 'Obra maestra'}
              absolute={true}
              size={48}
              sx={{ top: -28, right: -28, zIndex: 1201 }}
            />
          )}
          {/* Botón de volver (opcional) */}
          {showSections.backButton !== false && onBack && (
            <UiButton onClick={onBack} variant="outlined" color="primary" sx={{ mb: 2 }}>
              Volver
            </UiButton>
          )}
          {renderHeader && renderHeader(selectedItem)}
          {/* Imagen */}
          {showSections.image !== false && (renderImage
            ? renderImage(selectedItem)
            : <Box sx={{ width: '100%', mb: 3, display: 'flex', justifyContent: 'center' }}>
                <img
                  src={selectedItem.image}
                  alt={title}
                  style={{ maxWidth: 320, width: '100%', borderRadius: 12, boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)' }}
                />
              </Box>
          )}
          {/* Título */}
          {showSections.title !== false && (
            <Typography
              variant="h3"
              component="h1"
              sx={{
                color: '#111', fontWeight: 900, fontSize: { xs: '2rem', md: '2.4rem' }, mt: 1, mb: 2, lineHeight: 1.1, letterSpacing: '-1.5px', textAlign: 'center'
              }}
            >
              {title}
            </Typography>
          )}
          {/* Categoría y subcategoría */}
          {showSections.category !== false && (
            renderCategory
              ? renderCategory(selectedItem)
              : <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
                  <Box sx={{
                    px: 2, py: 0.5, borderRadius: 2, fontWeight: 700, fontSize: '1rem', color: '#fff', background: `linear-gradient(90deg, ${getCategoryColor(selectedItem.category)}, #888 80%)`, letterSpacing: 0.5
                  }}>{getCategoryTranslation(selectedItem.category)}</Box>
                  {selectedItem.subcategory && (renderSubcategory
                    ? renderSubcategory(selectedItem)
                    : <Box sx={{ px: 2, py: 0.5, borderRadius: 2, fontWeight: 500, fontSize: '0.95rem', color: '#333', background: '#f5f5f5', border: `1.5px solid ${getCategoryColor(selectedItem.category)}` }}>{getSubcategoryTranslation(selectedItem.subcategory, selectedItem.category)}</Box>
                  )}
                </Stack>
          )}
          {/* Información específica por categoría */}
          {renderDesktopSpecificContent && renderDesktopSpecificContent(selectedItem)}
          {/* Descripción */}
          {showSections.description !== false && (
            renderDescription
              ? renderDescription(selectedItem)
              : <Typography variant="body1" sx={{ mt: 2, mb: 3, fontSize: '1.15rem', color: '#222', textAlign: 'center' }}>{description}</Typography>
          )}
          {/* Botones de acción */}
          {showSections.actions !== false && (renderActions
            ? renderActions(selectedItem)
            : renderDesktopActionButtons && renderDesktopActionButtons(selectedItem)
          )}
          {/* Footer custom */}
          {showSections.footer !== false && renderFooter && renderFooter(selectedItem)}
        </Box>
      </Box>
    </Box>
  );
};

export default DesktopItemDetail;
