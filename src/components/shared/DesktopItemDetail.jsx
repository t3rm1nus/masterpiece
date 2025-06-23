import React from 'react';
import UiButton from '../ui/UiButton';
import { getCategoryColor } from '../../utils/categoryUtils';
import { ensureString } from '../../utils/stringUtils';
import { useTrailerUrl } from '../../hooks/useTrailerUrl';

const DesktopItemDetail = ({ selectedItem, title, description, lang, t, getCategoryTranslation, getSubcategoryTranslation, goToHowToDownload, renderDesktopSpecificContent, renderDesktopActionButtons }) => {
  if (!selectedItem) return null;
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
};

export default DesktopItemDetail;
