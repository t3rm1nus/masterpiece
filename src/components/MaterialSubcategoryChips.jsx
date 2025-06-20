import React from 'react';
import {
  Chip,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useLanguage } from '../LanguageContext';
import { useAppData, useAppTheme } from '../store/useAppStore';

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
  const { getSpecialButtonLabel } = useAppTheme();
  const { lang } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  // Solo renderizar en móviles
  if (!isMobile) {
    return null;
  }
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
              backgroundColor: isMasterpieceActive ? '#ffe0b2' : '#fff8e1',
              borderColor: '#ffd54f',
              color: isMasterpieceActive ? '#5d4037' : '#7a6a28',
              fontWeight: isMasterpieceActive ? 'bold' : 'normal',
              fontSize: '0.8rem',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: isMasterpieceActive ? '#ffe0b2' : '#fff3e0',
                borderColor: '#ffca28',
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
