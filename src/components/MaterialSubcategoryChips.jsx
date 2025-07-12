import React from 'react';
import {
  Chip,
  Box,
  useTheme,
  useMediaQuery,
  Button
} from '@mui/material';
import { useLanguage } from '../LanguageContext';
import { useAppData } from '../store/useAppStore';
import { getCategoryColor } from '../utils/categoryPalette';
import { getSubcategoryLabel } from '../utils/getSubcategoryLabel';

// =============================================
// MaterialSubcategoryChips: Chips de subcategoría Material UI
// Chips de subcategoría Material UI. Optimizado para UX, performance y móviles, soporta customización avanzada y botones especiales.
// =============================================

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

  // Estilos centralizados
  const chipsContainerSx = {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
    gap: '8px',
    justifyContent: 'flex-start',
    padding: '8px 16px',
    marginBottom: '8px',
    ...sx
  };

  const chipBaseSx = (isActive) => ({
    backgroundColor: isActive ? categoryColorFinal : 'transparent',
    borderColor: categoryColorFinal,
    color: isActive ? 'white' : categoryColorFinal,
    fontWeight: isActive ? 'bold' : 'normal',
    fontSize: '0.8rem',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    borderRadius: 8, // Igual que las chips de MUI
    '&:hover': {
      backgroundColor: isActive ? categoryColorFinal : `${categoryColorFinal}20`,
      transform: 'scale(1.05)',
      boxShadow: theme.shadows[2]
    },
    '&:active': {
      transform: 'scale(0.98)'
    },
    ...chipSx
  });

  const specialButtonSx = (active) => ({
    fontWeight: active ? 'bold' : 'normal',
    borderColor: categoryColorFinal,
    color: active ? 'white' : categoryColorFinal,
    backgroundColor: active ? categoryColorFinal : 'transparent',
    textTransform: 'none',
    fontSize: '0.85rem',
    padding: '2px 14px',
    minWidth: 0,
    boxShadow: 'none',
    borderRadius: 8, // Igual que las chips de MUI
    '&:hover': {
      backgroundColor: `${categoryColorFinal}22`,
      borderColor: categoryColorFinal,
      boxShadow: theme.shadows[2]
    },
    '&.Mui-selected': {
      backgroundColor: categoryColorFinal,
      color: 'white',
      fontWeight: 'bold'
    },
    borderWidth: 2,
    borderStyle: 'solid',
    margin: '0 2px',
    transition: 'all 0.2s',
  });

  return (
    <>      {/* Chips de subcategorías normales */}
      {Array.isArray(subcategories) && subcategories.length > 0 && (
        <Box sx={chipsContainerSx} {...props}>
          {subcategories.map(({ sub, label }, idx) => {
            const isActive = activeSubcategory === sub;
            // Usar siempre el literal traducido
            const chipLabel = getSubcategoryLabel(sub, selectedCategory, useLanguage().t, useLanguage().lang);
            const handleClick = onSubcategoryClick ? () => onSubcategoryClick(sub) : undefined;
            return renderChip ? (
              renderChip({ sub, label: chipLabel, isActive, idx, onClick: handleClick })
            ) : (
              <Chip
                key={sub}
                label={chipLabel}
                onClick={handleClick}
                variant={isActive ? 'filled' : 'outlined'}
                sx={chipBaseSx(isActive)}
              />
            );
          })}
        </Box>
      )}
      
      {/* Botones especiales - SOLO en móvil y SOLO si hay categoría */}
      {isMobile && selectedCategory && (
        <Box sx={{
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
            <Button
              variant={isSpanishCinemaActive ? 'contained' : 'outlined'}
              size="small"
              onClick={toggleSpanishCinema}
              sx={specialButtonSx(isSpanishCinemaActive)}
            >
              {getSpecialButtonLabel('spanishCinema', lang)}
            </Button>
          )}
          {/* Botón de Series Españolas solo para categoría de series */}
          {selectedCategory === 'series' && (
            <Button
              variant={isSpanishSeriesActive ? 'contained' : 'outlined'}
              size="small"
              onClick={toggleSpanishSeries}
              sx={specialButtonSx(isSpanishSeriesActive)}
            >
              {lang === 'es' ? 'Series Españolas' : 'Spanish Series'}
            </Button>
          )}
          {/* Botón de Masterpiece - siempre visible cuando hay categoría */}
          <Button
            variant={isMasterpieceActive ? 'contained' : 'outlined'}
            size="small"
            onClick={toggleMasterpiece}
            sx={specialButtonSx(isMasterpieceActive)}
          >
            {getSpecialButtonLabel('masterpiece', lang)}
          </Button>
        </Box>
      )}
    </>
  );
};

export default MaterialSubcategoryChips;
