import React, { ReactNode, CSSProperties } from 'react';
import UiButton from '../ui/UiButton';
import MasterpieceBadge from './MasterpieceBadge';
import { getCategoryColor } from '../../utils/categoryPalette';
import { Box, Typography, Stack, Fab } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { DesktopActionButtons } from './ItemActionButtons';
import { DesktopCategorySpecificContent } from './CategorySpecificContent';

interface DesktopItemDetailProps {
  selectedItem: any;
  title?: string;
  description?: string;
  lang?: string;
  t?: any;
  getCategoryTranslation?: (cat: string) => string;
  getSubcategoryTranslation?: (subcat: string, cat: string) => string;
  goToHowToDownload?: () => void;
  renderDesktopSpecificContent?: (item: any) => ReactNode;
  renderDesktopActionButtons?: (item: any) => ReactNode;
  renderHeader?: (item: any) => ReactNode;
  renderImage?: (item: any) => ReactNode;
  renderCategory?: (item: any) => ReactNode;
  renderSubcategory?: (item: any) => ReactNode;
  renderYear?: (item: any) => ReactNode;
  renderDescription?: (item: any) => ReactNode;
  renderActions?: (item: any) => ReactNode;
  renderFooter?: (item: any) => ReactNode;
  showSections?: Record<string, boolean>;
  sx?: CSSProperties;
  className?: string;
  style?: CSSProperties;
  onBack?: () => void;
  getTranslation?: (key: string, fallback?: string) => string;
  trailerUrl?: string;
  onOverlayNavigate?: (path: string) => void;
  [key: string]: any;
}

const DesktopItemDetail: React.FC<DesktopItemDetailProps> = ({
  selectedItem,
  title,
  description,
  lang,
  t,
  getCategoryTranslation = (cat: string) => cat,
  getSubcategoryTranslation = (subcat: string, cat: string) => subcat,
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
  trailerUrl,
  onOverlayNavigate,
  ...props
}) => {
  if (!selectedItem) return null;
  
  return (
    <div className={`item-detail-page desktop-only ${className}`} style={style} {...props}>
      {/* Botón de volver redondo azul flotante */}
      {showSections.backButton !== false && onBack && (
        <Fab
          color="primary"
          aria-label="volver"
          onClick={onBack}
          sx={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 2000,
            backgroundColor: '#667eea',
            boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
            '&:hover': {
              backgroundColor: '#5a67d8',
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 24px rgba(102, 126, 234, 0.4)'
            }
          }}
        >
          <ArrowBackIcon />
        </Fab>
      )}

      {/* Contenedor principal centrado */}
      <div className="item-detail-container">
        {/* Contenedor del detalle con layout horizontal */}
        <div 
          className={`item-detail-content ${selectedItem.masterpiece ? 'masterpiece-item' : ''}`}
          style={{
            background: `linear-gradient(135deg, ${getCategoryColor(selectedItem.category)} 0%, #fff 100%)`,
            display: 'flex',
            gap: '40px',
            alignItems: 'flex-start',
            padding: '40px',
            borderRadius: '24px',
            boxShadow: '0 4px 32px rgba(0,0,0,0.1)',
            position: 'relative',
            ...sx
          }}
        >
          {/* Badge masterpiece */}
          {selectedItem.masterpiece && (
            <div className="masterpiece-badge-container">
              <MasterpieceBadge
                alt={getTranslation ? getTranslation('ui.alt.masterpiece', 'Obra maestra') : 'Obra maestra'}
                title={getTranslation ? getTranslation('ui.badges.masterpiece', 'Obra maestra') : 'Obra maestra'}
                absolute={false}
                size={32}
              />
            </div>
          )}

          {/* Columna izquierda: Imagen */}
          <div className="item-detail-image-container" style={{ flex: '0 0 300px' }}>
            {showSections.image !== false && (renderImage
              ? renderImage(selectedItem)
              : <img
                  src={selectedItem.image}
                  alt={title}
                  className="item-detail-image"
                  style={{
                    width: '100%',
                    maxWidth: 300,
                    height: 'auto',
                    borderRadius: '20px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLImageElement>) => {
                    const target = e.target as HTMLImageElement;
                    target.style.transform = 'scale(1.03) rotateY(5deg)';
                    target.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLImageElement>) => {
                    const target = e.target as HTMLImageElement;
                    target.style.transform = 'scale(1) rotateY(0deg)';
                    target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
                  }}
                />
            )}
          </div>

          {/* Columna derecha: Contenido */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Header custom */}
            {renderHeader && renderHeader(selectedItem)}

            {/* Título */}
            {showSections.title !== false && (
              <h1 className="item-detail-title">
                {title}
              </h1>
            )}

            {/* Categoría y subcategoría */}
            {showSections.category !== false && (
              renderCategory
                ? renderCategory(selectedItem)
                : <div className="item-detail-meta">
                    <span style={{
                      padding: '8px 16px',
                      borderRadius: '16px',
                      fontWeight: 700,
                      fontSize: '1rem',
                      color: '#fff',
                      background: getCategoryColor(selectedItem.category),
                      letterSpacing: 0.5
                    }}>
                      {getCategoryTranslation(selectedItem.category)}
                    </span>
                    {selectedItem.subcategory && (renderSubcategory
                      ? renderSubcategory(selectedItem)
                      : <span style={{
                          padding: '8px 16px',
                          borderRadius: '16px',
                          fontWeight: 500,
                          fontSize: '0.95rem',
                          color: '#333',
                          background: '#f5f5f5',
                          border: `1.5px solid ${getCategoryColor(selectedItem.category)}`,
                          marginLeft: '8px'
                        }}>
                          {getSubcategoryTranslation(selectedItem.subcategory, selectedItem.category)}
                        </span>
                    )}
                  </div>
            )}

            {/* Información específica por categoría */}
            {renderDesktopSpecificContent 
              ? renderDesktopSpecificContent(selectedItem)
              : <DesktopCategorySpecificContent 
                  selectedItem={selectedItem}
                  lang={lang}
                  t={t}
                  getTranslation={getTranslation}
                />
            }

            {/* Descripción */}
            {showSections.description !== false && (
              renderDescription
                ? renderDescription(selectedItem)
                : <p style={{
                    fontSize: '1.15rem',
                    color: '#222',
                    lineHeight: 1.6,
                    marginBottom: '32px',
                    textAlign: 'left'
                  }}>
                    {description}
                  </p>
            )}

            {/* Botones de acción */}
            {showSections.actions !== false && (renderActions
              ? renderActions(selectedItem)
              : renderDesktopActionButtons 
                ? renderDesktopActionButtons(selectedItem)
                : <div className="action-buttons">
                    <DesktopActionButtons
                      selectedItem={selectedItem}
                      trailerUrl={trailerUrl}
                      lang={lang}
                      t={t}
                      goToHowToDownload={goToHowToDownload}
                      onOverlayNavigate={onOverlayNavigate}
                    />
                  </div>
            )}

            {/* Footer custom */}
            {showSections.footer !== false && renderFooter && renderFooter(selectedItem)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopItemDetail; 