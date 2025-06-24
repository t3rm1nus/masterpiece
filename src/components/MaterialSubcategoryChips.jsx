import React from 'react';
import {
  Chip,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useLanguage } from '../LanguageContext';
import { useAppData, useAppTheme } from '../store/useAppStore';
import { getCategoryColor } from '../utils/categoryUtils';

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
    isMasterpieceActive, 
    toggleSpanishCinema, 
    toggleMasterpiece 
  } = useAppData();
  const { lang } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  // No renderizar si la prop visible es false
  if (!visible) {
    return null;
  }

  // Solo renderizar en móviles
  if (!isMobile) {
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
            const isActive = activeSubcategory === sub;
            const chipColor = isActive ? categoryColorFinal : 'transparent';
            const chipTextColor = isActive ? 'white' : categoryColorFinal;
            const chipBorderColor = categoryColorFinal;

            return renderChip ? (
              renderChip({ sub, label, isActive, idx })
            ) : (
              <Chip
                key={sub}
                label={label || getSubcategoryTranslation(sub, selectedCategory)}
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
      
      {/* Botones especiales - solo mostrar si hay una categoría seleccionada */}
      {selectedCategory && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: 'center',
            padding: '8px 16px',
            marginBottom: '16px'
          }}
        >
          {/* Botón de Cine Español solo para categoría de películas */}
          {selectedCategory === 'movies' && (
            <Chip
              label={getSpecialButtonLabel('spanishCinema', lang)}
              onClick={toggleSpanishCinema}
              variant={isSpanishCinemaActive ? 'filled' : 'outlined'}
              sx={{
                backgroundColor: isSpanishCinemaActive ? categoryColorFinal : 'transparent',
                borderColor: categoryColorFinal,
                color: isSpanishCinemaActive ? 'white' : categoryColorFinal,
                fontWeight: isSpanishCinemaActive ? 'bold' : 'normal',
                fontSize: '0.8rem',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: isSpanishCinemaActive ? categoryColorFinal : `${categoryColorFinal}20`,
                  transform: 'scale(1.05)',
                  boxShadow: theme.shadows[2]
                },
                '&:active': {
                  transform: 'scale(0.98)'
                }
              }}
            />
          )}
          
          {/* Botón de Masterpiece - siempre visible cuando hay categoría */}
          <Chip
            label={getSpecialButtonLabel('masterpiece', lang)}
            onClick={toggleMasterpiece}
            variant={isMasterpieceActive ? 'filled' : 'outlined'}
            sx={{
              backgroundColor: isMasterpieceActive ? categoryColorFinal : 'transparent',
              borderColor: categoryColorFinal,
              color: isMasterpieceActive ? 'white' : categoryColorFinal,
              fontWeight: isMasterpieceActive ? 'bold' : 'normal',
              fontSize: '0.8rem',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: isMasterpieceActive ? categoryColorFinal : `${categoryColorFinal}20`,
                borderColor: categoryColorFinal,
                transform: 'scale(1.05)',
                boxShadow: theme.shadows[2]
              },
              '&:active': {
                transform: 'scale(0.98)'
              }
            }}
          />
        </Box>
      )}
    </>
  );
};

export default MaterialSubcategoryChips;
