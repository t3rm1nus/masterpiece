import React from 'react';
import { useMediaQuery, useTheme, Box, Grid } from '@mui/material';
import MaterialRecommendationCard from './MaterialRecommendationCard';
import MaterialCategoryButtons from './MaterialCategoryButtons';
import MaterialSubcategoryChips from './MaterialSubcategoryChips';

const MaterialContentWrapper = ({ 
  children, 
  categories,
  selectedCategory,
  onCategoryClick,
  subcategories,
  activeSubcategory,
  onSubcategoryClick,
  recommendations,
  isHome = false,
  categoryColor
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  
  // Si no es móvil, renderizar el contenido original
  if (!isMobile) {
    return children;
  }
  
  // En móviles, usar componentes Material UI
  return (
    <Box sx={{ width: '100%', padding: '8px' }}>
      {/* Botones de categorías Material UI */}
      {categories && (
        <MaterialCategoryButtons
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryClick={onCategoryClick}
        />
      )}
      
      {/* Chips de subcategorías Material UI */}
      {subcategories && subcategories.length > 0 && (
        <MaterialSubcategoryChips
          subcategories={subcategories}
          activeSubcategory={activeSubcategory}
          onSubcategoryClick={onSubcategoryClick}
          categoryColor={categoryColor}
        />
      )}
      
      {/* Lista de recomendaciones Material UI */}
      {recommendations && recommendations.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: isHome ? '8px' : '16px',
            padding: '8px',
            width: '100%'
          }}
        >
          {recommendations.map((recommendation, index) => (
            <MaterialRecommendationCard
              key={recommendation.globalId || `${recommendation.title}-${index}`}
              recommendation={recommendation}
              isHome={isHome}
            />
          ))}
        </Box>
      )}
      
      {/* Si no hay recomendaciones, mostrar el contenido original */}
      {(!recommendations || recommendations.length === 0) && children}
    </Box>
  );
};

export default MaterialContentWrapper;
