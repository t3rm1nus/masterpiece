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

const MaterialSubcategoryChips = ({ 
  subcategories, 
  activeSubcategory, 
  onSubcategoryClick,
  categoryColor = '#0078d4',
  selectedCategory
}) => {  const { getSubcategoryTranslation } = useLanguage();
  const { 
    isSpanishCinemaActive, 
    isMasterpieceActive, 
    toggleSpanishCinema, 
    toggleMasterpiece 
  } = useAppData();
  const { lang } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
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
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: 'center',
            padding: '8px 16px',
            marginBottom: '8px'
          }}
        >
          {subcategories.map(({ sub, label }) => (
            <Chip
              key={sub}
              label={label || getSubcategoryTranslation(sub, selectedCategory)}
              onClick={() => onSubcategoryClick(sub)}
              variant={activeSubcategory === sub ? 'filled' : 'outlined'}
              sx={{
                backgroundColor: activeSubcategory === sub ? categoryColorFinal : 'transparent',
                borderColor: categoryColorFinal,
                color: activeSubcategory === sub ? 'white' : categoryColorFinal,
                fontWeight: activeSubcategory === sub ? 'bold' : 'normal',
                fontSize: '0.8rem',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: activeSubcategory === sub ? categoryColorFinal : `${categoryColorFinal}20`,
                  transform: 'scale(1.05)',
                  boxShadow: theme.shadows[2]
                },
                '&:active': {
                  transform: 'scale(0.98)'
                }
              }}
            />
          ))}
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
