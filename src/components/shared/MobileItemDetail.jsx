import React from 'react';
import { CardContent, CardMedia, Typography, Chip, Box, Stack, Fab, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Category as CategoryIcon } from '@mui/icons-material';
import { getCategoryColor } from '../../utils/categoryUtils';
import { ensureString } from '../../utils/stringUtils';
import { useTrailerUrl } from '../../hooks/useTrailerUrl';
import UiCard from '../ui/UiCard';

const MobileItemDetail = ({ selectedItem, title, description, lang, t, theme, getCategoryTranslation, getSubcategoryTranslation, goBackFromDetail, goToHowToDownload, imgLoaded, setImgLoaded, renderMobileSpecificContent, renderMobileActionButtons }) => {
  if (!selectedItem) return null;
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', padding: '16px' }}>
      {/* Botón de volver flotante */}
      <Fab
        color="primary"
        aria-label="volver"
        onClick={goBackFromDetail}
        sx={{
          position: 'fixed',
          top: '80px',
          left: '16px',
          zIndex: 1000,
          backgroundColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          }
        }}
      >
        <ArrowBackIcon />
      </Fab>
      {/* Tarjeta principal */}
      <UiCard
        sx={{
          maxWidth: 600,
          margin: '0 auto',
          marginTop: '60px',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: theme.shadows[8],
          border: selectedItem.masterpiece ? '3px solid #ffd700' : 'none',
          background: selectedItem.masterpiece 
            ? (theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, #2a2600 60%, #333300 100%)'
              : 'linear-gradient(135deg, #fffbe6 60%, #ffe066 100%)')
            : getCategoryColor(selectedItem.category),
        }}
      >
        {/* Imagen principal */}
        <CardMedia
          component="img"
          sx={{
            height: 300,
            objectFit: 'cover',
            position: 'relative'
          }}
          image={selectedItem.image}
          alt={title}
          onLoad={() => setImgLoaded(true)}
        />
        {/* Badge de masterpiece en la imagen */}
        {selectedItem.masterpiece && (
          <span className="masterpiece-detail-badge" title="Obra maestra">
            <img src="/imagenes/masterpiece-star.png" alt="Masterpiece" style={{ width: 56, height: 56, display: 'block' }} />
          </span>
        )}
        <CardContent sx={{ padding: '24px' }}>
          {/* Título */}
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '1.5rem', sm: '2rem' },
              textAlign: 'center',
              marginBottom: '16px'
            }}
          >
            {title}
          </Typography>
          {/* Chips de categoría y subcategoría */}
          {selectedItem.category !== 'boardgames' && selectedItem.category !== 'videogames' && (
            <Stack 
              direction="row" 
              spacing={1} 
              justifyContent="center" 
              sx={{ marginBottom: '16px' }}
            >
              <Chip
                icon={<CategoryIcon />}
                label={getCategoryTranslation(selectedItem.category)}
                sx={{
                  backgroundColor: getCategoryColor(selectedItem.category, theme),
                  color: 'white',
                  fontWeight: 'bold',
                  '& .MuiChip-icon': {
                    color: 'white'
                  }
                }}
              />
              {selectedItem.subcategory && (
                <Chip
                  label={getSubcategoryTranslation(selectedItem.subcategory, selectedItem.category)}
                  variant="outlined"
                  sx={{
                    borderColor: getCategoryColor(selectedItem.category, theme),
                    color: getCategoryColor(selectedItem.category, theme),
                    fontWeight: 'bold'
                  }}
                />
              )}
            </Stack>
          )}
          {/* Año */}
          {selectedItem.year && (
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '16px' 
              }}
            >
              {/* ...año... */}
              <Typography variant="h6" color="text.secondary">
                <strong>{t.year || 'Año'}:</strong> {ensureString(selectedItem.year, lang)}
              </Typography>
            </Box>
          )}
          {/* Información específica por categoría */}
          {renderMobileSpecificContent()}
          {/* Descripción */}
          <Typography 
            variant="body1" 
            sx={{ 
              fontSize: '1.1rem',
              lineHeight: 1.6,
              textAlign: 'justify',
              marginBottom: '24px',
              color: 'text.primary'
            }}
          >
            {description}
          </Typography>
          {/* Botones de acción */}
          {renderMobileActionButtons()}
        </CardContent>
      </UiCard>
    </Box>
  );
};

export default MobileItemDetail;
