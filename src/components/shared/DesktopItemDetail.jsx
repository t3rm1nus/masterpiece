import React from 'react';
import UiButton from '../ui/UiButton';
import { getCategoryColor, getCategoryGradient } from '../../utils/categoryPalette';

/**
 * DesktopItemDetail
 * Detalle de ítem para desktop, altamente parametrizable y unificado con MobileItemDetail.
 *
 * Props avanzados:
 * - renderHeader, renderImage, renderCategory, renderSubcategory, renderYear, renderDescription, renderActions, renderFooter: funciones para custom render de cada sección
 * - showSections: objeto para mostrar/ocultar secciones (por ejemplo: { image: true, category: true, year: true, description: true, actions: true, footer: true })
 * - sx, className, style: estilos avanzados
 * - onBack: callback para botón de volver (opcional)
 * - ...props legacy
 *
 * Ejemplo de uso:
 * <DesktopItemDetail
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
  getTranslation, // <-- Añadido correctamente como prop
  ...props
}) => {
  if (!selectedItem) return null;
  return (
    <div className={`item-detail-page desktop-only ${className}`} style={{
      ...style,
      background: getCategoryGradient(selectedItem.category)
    }} {...props}>
      <div className="item-detail-container" style={sx}>
        <div className={`item-detail-content ${selectedItem.masterpiece ? 'masterpiece-item' : 'normal-item'} ${selectedItem.category}`}
          style={{
            background: '#fff',
            '--category-color': getCategoryColor(selectedItem.category),
          }}>
          {/* Botón de volver (opcional) */}
          {showSections.backButton !== false && onBack && (
            <UiButton onClick={onBack} variant="outlined" color="primary" sx={{ mb: 2 }}>
              Volver
            </UiButton>
          )}
          {renderHeader && renderHeader(selectedItem)}
          {selectedItem.masterpiece && (
            <span className="masterpiece-detail-badge" title={(getTranslation ? getTranslation('ui.badges.masterpiece', 'Obra maestra') : 'Obra maestra')}>
              <img src="/imagenes/masterpiece-star.png" alt={(getTranslation ? getTranslation('ui.alt.masterpiece', 'Obra maestra') : 'Obra maestra')} style={{ width: 56, height: 56, display: 'block' }} />
            </span>
          )}
          {/* Imagen */}
          {showSections.image !== false && (renderImage
            ? renderImage(selectedItem)
            : <div className="item-detail-image-container">
                <img 
                  src={selectedItem.image} 
                  alt={title}
                  className="item-detail-image"
                />
              </div>
          )}
          {/* Título */}
          {showSections.title !== false && (
            <h2 className="item-detail-title" style={{
              color: '#111', fontWeight: 900, fontSize: '2.4rem', margin: '0.7em 0 0.3em 0', lineHeight: 1.1, display: 'block', letterSpacing: '-1.5px', background: 'none', border: 'none', boxShadow: 'none', textShadow: 'none', borderRadius: 0, padding: 0
            }}>{title}</h2>
          )}
          {/* Categoría y subcategoría */}
          {showSections.category !== false && (
            renderCategory
              ? renderCategory(selectedItem)
              : <div className="item-detail-category" style={{
                  '--category-color': getCategoryColor(selectedItem.category)
                }}>
                  <span className="category-name">
                    {getCategoryTranslation(selectedItem.category)}
                  </span>
                  {selectedItem.subcategory && (renderSubcategory
                    ? renderSubcategory(selectedItem)
                    : <span className="subcategory-name">{getSubcategoryTranslation(selectedItem.subcategory, selectedItem.category)}</span>
                  )}
                </div>
          )}
          {/* Información específica por categoría */}
          {renderDesktopSpecificContent && renderDesktopSpecificContent(selectedItem)}
          {/* Descripción */}
          {showSections.description !== false && (
            renderDescription
              ? renderDescription(selectedItem)
              : <p className={`item-detail-description ${selectedItem.category === 'boardgames' ? 'boardgame-description' : ''}`}>{description}</p>
          )}
          {/* Botones de acción */}
          {showSections.actions !== false && (renderActions
            ? renderActions(selectedItem)
            : renderDesktopActionButtons && renderDesktopActionButtons(selectedItem)
          )}
          {/* Footer custom */}
          {showSections.footer !== false && renderFooter && renderFooter(selectedItem)}
        </div>
      </div>
    </div>
  );
};

export default DesktopItemDetail;
