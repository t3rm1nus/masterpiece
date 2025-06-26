import React from 'react';
import {
  Chip,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useLanguage } from '../LanguageContext';
import { useAppData, useAppTheme } from '../store/useAppStore';
import { getCategoryColor, getCategoryGradient } from '../utils/categoryPalette';
import { getSubcategoryLabel } from '../utils/getSubcategoryLabel';

/**
 * MaterialSubcategoryChips
 * Lista de chips de subcategorías altamente parametrizable y reutilizable.
 *
 * Props avanzados:
 * - subcategories: array de objetos { sub, label, icon? } (subcategorías a mostrar)
 * - activeSubcategory: string (subcategoría seleccionada)
 * - onSubcategoryClick: función (callback al seleccionar subcategoría)
 * - categoryColor: string (color principal de la categoría, default: '#0078d4')
 * - selectedCategory: string (categoría activa, para traducción y color)
 * - renderChip: función opcional para custom render de cada chip `(subcat, selected, idx) => ReactNode`
 * - sx: estilos adicionales para el contenedor
 * - chipSx: estilos adicionales para cada chip
 * - visible: boolean (si se muestra el componente, default: true)
 * - showIcons: boolean (mostrar iconos si existen, default: false)
 * - ...props: cualquier otro prop para el contenedor
 *
 * Ejemplo de uso:
 * <MaterialSubcategoryChips
 *   subcategories={[{ sub: 'comedia', label: 'Comedia' }]}
 *   activeSubcategory="comedia"
 *   onSubcategoryClick={sub => setActiveSubcategory(sub)}
 *   categoryColor="#e91e63"
 *   selectedCategory="movies"
 *   sx={{ background: '#fafafa' }}
 *   chipSx={{ fontSize: '1.1em' }}
 *   renderChip={(subcat, selected, idx) => (
 *     <Chip key={subcat.sub} color={selected ? 'primary' : 'default'} label={subcat.label} />
 *   )}
 * />
 */

const MaterialSubcategoryChips = ({ 
  subcategories, 
  activeSubcategory, 
  onSubcategoryClick,
  categoryColor = '#0078d4',
  selectedCategory,
  renderChip,
  sx,
  chipSx,
  visible = true,
  showIcons = false,
  ...props
}) => {  
  const { getSubcategoryTranslation } = useLanguage();
  const { 
    isSpanishCinemaActive,
    isSpanishSeriesActive,
    isMasterpieceActive,
    toggleSpanishCinema,
    toggleSpanishSeries,
    toggleMasterpiece 
  } = useAppData();
  const { lang } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  // No renderizar si la prop visible es false
  if (!visible) {
    return null;
  }

  // Fallback temporal para evitar crash si no existe getSpecialButtonLabel
  const getSpecialButtonLabel = (type, lang) => {
    if (type === 'spanishCinema') return lang === 'es' ? 'Cine Español' : 'Spanish Cinema';
    if (type === 'masterpiece') return lang === 'es' ? 'Obras Maestras' : 'Masterpieces';
    return '';
  };

  // Obtener color de categoría para móvil
  const categoryColorFinal = getCategoryColor(selectedCategory);

  // LOG para depuración de subcategorías
  console.log('[MaterialSubcategoryChips] subcategories prop:', subcategories);
  console.log('[MaterialSubcategoryChips] selectedCategory:', selectedCategory);

  return (
    <>      {/* Chips de subcategorías normales */}
      {Array.isArray(subcategories) && subcategories.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'nowrap', // Evita salto de línea
            overflowX: 'auto', // Scroll horizontal
            gap: '8px',
            justifyContent: 'flex-start',
            padding: '8px 16px',
            marginBottom: '8px',
            ...sx
          }}
          {...props}
        >
          {subcategories.map(({ sub, label }, idx) => {
            // LOG para cada chip
            console.log('[MaterialSubcategoryChips] Render chip:', { sub, label, idx });
            const isActive = activeSubcategory === sub;
            const chipColor = isActive ? categoryColorFinal : 'transparent';
            const chipTextColor = isActive ? 'white' : categoryColorFinal;
            const chipBorderColor = categoryColorFinal;
            // Usar siempre el literal traducido
            const chipLabel = getSubcategoryLabel(sub, selectedCategory, useLanguage().t, useLanguage().lang);
            return renderChip ? (
              renderChip({ sub, label: chipLabel, isActive, idx })
            ) : (
              <Chip
                key={sub}
                label={chipLabel}
                onClick={onSubcategoryClick ? () => onSubcategoryClick(sub) : undefined}
                variant={isActive ? 'filled' : 'outlined'}
                sx={{
                  backgroundColor: chipColor,
                  borderColor: chipBorderColor,
                  color: chipTextColor,
                  fontWeight: isActive ? 'bold' : 'normal',
                  fontSize: '0.8rem',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: isActive ? chipBorderColor : `${chipBorderColor}20`,
                    transform: 'scale(1.05)',
                    boxShadow: theme.shadows[2]
                  },
                  '&:active': {
                    transform: 'scale(0.98)'
                  },
                  ...chipSx
                }}
              />
            );
          })}
        </Box>
      )}
      
      {/* Botones especiales - SOLO en móvil y SOLO si hay categoría */}
      {isMobile && selectedCategory && (
        <div className="special-buttons-container" style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '8px',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          margin: '8px 0px'
        }}>
          {/* Botón de Cine Español solo para categoría de películas */}
          {selectedCategory === 'movies' && (
            <button
              className={`MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButton-outlinedSecondary MuiButton-sizeSmall MuiButton-outlinedSizeSmall MuiButton-colorSecondary MuiButton-root MuiButton-outlined MuiButton-outlinedSecondary MuiButton-sizeSmall MuiButton-outlinedSizeSmall MuiButton-colorSecondary subcategory-btn spanish-cinema` + (isSpanishCinemaActive ? ' Mui-selected' : '')}
              type="button"
              tabIndex={0}
              onClick={toggleSpanishCinema}
              style={{ fontWeight: isSpanishCinemaActive ? 'bold' : 'normal' }}
            >
              {getSpecialButtonLabel('spanishCinema', lang)}
              <span className="MuiTouchRipple-root css-r3djoj-MuiTouchRipple-root"></span>
            </button>
          )}
          {/* Botón de Series Españolas solo para categoría de series */}
          {selectedCategory === 'series' && (
            <button
              className={`MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButton-outlinedSecondary MuiButton-sizeSmall MuiButton-outlinedSizeSmall MuiButton-colorSecondary MuiButton-root MuiButton-outlined MuiButton-outlinedSecondary MuiButton-sizeSmall MuiButton-outlinedSizeSmall MuiButton-colorSecondary subcategory-btn spanish-series` + (isSpanishSeriesActive ? ' Mui-selected' : '')}
              type="button"
              tabIndex={0}
              onClick={toggleSpanishSeries}
              style={{ fontWeight: isSpanishSeriesActive ? 'bold' : 'normal' }}
            >
              {lang === 'es' ? 'Series Españolas' : 'Spanish Series'}
              <span className="MuiTouchRipple-root css-r3djoj-MuiTouchRipple-root"></span>
            </button>
          )}
          {/* Botón de Masterpiece - siempre visible cuando hay categoría */}
          <button
            className={`MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButton-outlinedSecondary MuiButton-sizeSmall MuiButton-outlinedSizeSmall MuiButton-colorSecondary MuiButton-root MuiButton-outlined MuiButton-outlinedSecondary MuiButton-sizeSmall MuiButton-outlinedSizeSmall MuiButton-colorSecondary subcategory-btn masterpiece-btn css-2uqr7o-MuiButtonBase-root-MuiButton-root` + (isMasterpieceActive ? ' Mui-selected' : '')}
            type="button"
            tabIndex={0}
            onClick={toggleMasterpiece}
            style={{ fontWeight: isMasterpieceActive ? 'bold' : 'normal' }}
          >
            {getSpecialButtonLabel('masterpiece', lang)}
          </button>
        </div>
      )}
    </>
  );
};

export default MaterialSubcategoryChips;
