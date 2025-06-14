import React from 'react';
import {
  Chip,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useLanguage } from '../LanguageContext';
import useDataStore from '../store/dataStore';
import useThemeStore from '../store/themeStore';

const MaterialSubcategoryChips = ({ 
  subcategories, 
  activeSubcategory, 
  onSubcategoryClick,
  categoryColor = '#0078d4',
  selectedCategory
}) => {
  const { getSubcategoryTranslation } = useLanguage();
  const { 
    isSpanishCinemaActive, 
    isMasterpieceActive, 
    toggleSpanishCinema, 
    toggleMasterpiece 
  } = useDataStore();
  const { getSpecialButtonLabel } = useThemeStore();
  const { lang } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  // Solo renderizar en móviles
  if (!isMobile) {
    return null;
  }
  return (
    <>
      {/* Chips de subcategorías normales */}
      {subcategories && subcategories.length > 0 && (
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
          {subcategories.map(({ sub }) => (
            <Chip
              key={sub}
              label={getSubcategoryTranslation(sub)}
              onClick={() => onSubcategoryClick(sub)}
              variant={activeSubcategory === sub ? 'filled' : 'outlined'}
              sx={{
                backgroundColor: activeSubcategory === sub ? categoryColor : 'transparent',
                borderColor: categoryColor,
                color: activeSubcategory === sub ? 'white' : categoryColor,
                fontWeight: activeSubcategory === sub ? 'bold' : 'normal',
                fontSize: '0.8rem',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: activeSubcategory === sub ? categoryColor : `${categoryColor}20`,
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
                backgroundColor: isSpanishCinemaActive ? '#d32f2f' : 'transparent',
                borderColor: '#d32f2f',
                color: isSpanishCinemaActive ? 'white' : '#d32f2f',
                fontWeight: isSpanishCinemaActive ? 'bold' : 'normal',
                fontSize: '0.8rem',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: isSpanishCinemaActive ? '#d32f2f' : '#d32f2f20',
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
              backgroundColor: isMasterpieceActive ? '#ffd700' : 'transparent',
              borderColor: '#ffd700',
              color: isMasterpieceActive ? '#333' : '#ffd700',
              fontWeight: isMasterpieceActive ? 'bold' : 'normal',
              fontSize: '0.8rem',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: isMasterpieceActive ? '#ffd700' : '#ffd70020',
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
