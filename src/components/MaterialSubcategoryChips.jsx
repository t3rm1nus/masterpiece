import React from 'react';
import {
  Chip,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useLanguage } from '../LanguageContext';

const MaterialSubcategoryChips = ({ 
  subcategories, 
  activeSubcategory, 
  onSubcategoryClick,
  categoryColor = '#0078d4'
}) => {
  const { getSubcategoryTranslation } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  
  // Solo renderizar en móviles
  if (!isMobile) {
    return null;
  }
  
  return (
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
  );
};

export default MaterialSubcategoryChips;
