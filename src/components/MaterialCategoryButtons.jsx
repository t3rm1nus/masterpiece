import React from 'react';
import {
  Button,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Movie as MovieIcon,
  SportsEsports as GameIcon,
  MenuBook as BookIcon,
  LibraryMusic as MusicIcon,
  Mic as PodcastIcon,
  Extension as BoardGameIcon,
  AutoStories as ComicIcon,
  Category as CategoryIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useLanguage } from '../LanguageContext';

/**
 * MaterialCategoryButtons
 * Lista de botones de categorías altamente parametrizable y reutilizable.
 *
 * Props avanzados:
 * - categories: array de objetos { key, label, isMasterpiece?, icon? } (categorías a mostrar)
 * - selectedCategory: string (categoría seleccionada)
 * - onCategoryClick: función (callback al seleccionar categoría, recibe key y label)
 * - renderButton: función opcional para custom render de cada botón `(cat, selected, idx) => ReactNode`
 * - sx: estilos adicionales para el contenedor
 * - buttonSx: estilos adicionales para cada botón
 * - visible: boolean (si se muestra el componente, default: true)
 * - showIcons: boolean (mostrar iconos si existen, default: true)
 * - ...props: cualquier otro prop para el contenedor
 *
 * Ejemplo de uso:
 * <MaterialCategoryButtons
 *   categories={[
 *     { key: 'movies', label: 'Películas', icon: <MovieIcon /> },
 *     { key: 'books', label: 'Libros' }
 *   ]}
 *   selectedCategory="movies"
 *   onCategoryClick={key => setSelectedCategory(key)}
 *   sx={{ background: '#fafafa' }}
 *   buttonSx={{ fontSize: '1.1em' }}
 *   renderButton={(cat, selected, idx) => (
 *     <Button key={cat.key} color={selected ? 'primary' : 'inherit'}>{cat.label}</Button>
 *   )}
 * />
 */

const MaterialCategoryButtons = ({ categories, selectedCategory, onCategoryClick, renderButton, sx, buttonSx, visible = true, showIcons = true, ...props }) => {
  const { lang } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  
  // Solo renderizar en móviles
  if (!isMobile || !visible) {
    return null;
  }
  
  // Validar que categories sea un array
  if (!Array.isArray(categories)) {
    return null;
  }
  
  const getCategoryIcon = (categoryKey) => {
    switch (categoryKey) {
      case 'movies':
      case 'peliculas':
        return <MovieIcon />;
      case 'videogames':
      case 'videojuegos':
        return <GameIcon />;
      case 'books':
      case 'libros':
        return <BookIcon />;
      case 'music':
      case 'musica':
        return <MusicIcon />;
      case 'podcast':
      case 'podcasts':
        return <PodcastIcon />;
      case 'boardgames':
      case 'juegos de mesa':
        return <BoardGameIcon />;
      case 'comics':
        return <ComicIcon />;
      default:
        return <CategoryIcon />;
    }
  };
  
  const getCategoryColor = (categoryKey, isMasterpiece) => {
    if (isMasterpiece) {
      return 'linear-gradient(135deg, #fffbe6 0%, #ffe082 40%, #fff8e1 100%)';
    }
    switch (categoryKey) {
      case 'movies':
      case 'peliculas':
        return '#2196f3';
      case 'videogames':
      case 'videojuegos':
        return '#9c27b0';
      case 'books':
      case 'libros':
        return '#4caf50';
      case 'music':
      case 'musica':
        return '#00bcd4';
      case 'podcast':
      case 'podcasts':
        return '#8bc34a';
      case 'boardgames':
      case 'juegos de mesa':
        return '#e91e63';
      case 'comics':
        return '#ff9800';
      case 'documentales':
      case 'documentaries':
        return '#9e9e9e';
      default:
        return theme.palette.primary.main;
    }
  };
    return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px', // Reducido gap para que quepan mejor en pantallas pequeñas
        justifyContent: 'center',
        padding: '12px 4px', // Padding horizontal reducido
        maxWidth: '100%',
        width: '100%',
        boxSizing: 'border-box',
        ...sx
      }}
      {...props}
    >
      {categories.map(({ key, label, isMasterpiece }, idx) => {
        if (renderButton) {
          return renderButton({ key, label, isMasterpiece }, selectedCategory === key, idx);
        }
        return (
          <Button
            key={key}
            variant={selectedCategory === key ? 'contained' : 'outlined'}
            startIcon={showIcons ? getCategoryIcon(key) : null}
            onClick={() => onCategoryClick(key, label)}
            sx={{
              minWidth: 'auto',
              maxWidth: 'calc(50% - 3px)',
              borderRadius: '20px',
              textTransform: 'none',
              fontSize: '0.8rem',
              fontWeight: selectedCategory === key ? 'bold' : 'normal',
              background: selectedCategory === key && isMasterpiece ? getCategoryColor(key, true) : (selectedCategory === key ? getCategoryColor(key) : 'transparent'),
              borderColor: getCategoryColor(key),
              color: selectedCategory === key ? 'white' : getCategoryColor(key),
              padding: '6px 12px',
              transition: 'all 0.3s ease',
              flexShrink: 1,
              ...buttonSx,
              '&:hover': {
                background: selectedCategory === key && isMasterpiece ? getCategoryColor(key, true) : (selectedCategory === key ? getCategoryColor(key) : `${getCategoryColor(key)}20`),
                borderColor: getCategoryColor(key),
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[4]
              },
              '& .MuiButton-startIcon': {
                marginRight: '4px',
                fontSize: '16px'
              }
            }}
          >
            {label}
            {isMasterpiece && (
              <StarIcon sx={{ color: '#FFD600', ml: 1, fontSize: '1.1em', verticalAlign: 'middle' }} />
            )}
          </Button>
        );
      })}
    </Box>
  );
};

export default MaterialCategoryButtons;
