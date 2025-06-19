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
  Category as CategoryIcon
} from '@mui/icons-material';
import { useLanguage } from '../LanguageContext';

const MaterialCategoryButtons = ({ categories, selectedCategory, onCategoryClick }) => {
  const { lang } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
    // Solo renderizar en móviles
  if (!isMobile) {
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
  
  const getCategoryColor = (categoryKey) => {
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
        return '#e91e63';      case 'comics':
        return '#ff9800';
      case 'documentales':
      case 'documentaries':
        return '#f44336';
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
        boxSizing: 'border-box'
      }}
    >
      {categories.map(({ key, label }) => (
        <Button
          key={key}
          variant={selectedCategory === key ? 'contained' : 'outlined'}
          startIcon={getCategoryIcon(key)}
          onClick={() => onCategoryClick(key, label)}          sx={{
            minWidth: 'auto',
            maxWidth: 'calc(50% - 3px)', // Máximo 50% del ancho menos la mitad del gap
            borderRadius: '20px',
            textTransform: 'none',
            fontSize: '0.8rem', // Ligeramente más pequeño para móviles
            fontWeight: selectedCategory === key ? 'bold' : 'normal',
            backgroundColor: selectedCategory === key ? getCategoryColor(key) : 'transparent',
            borderColor: getCategoryColor(key),
            color: selectedCategory === key ? 'white' : getCategoryColor(key),
            padding: '6px 12px', // Padding horizontal reducido
            transition: 'all 0.3s ease',
            flexShrink: 1, // Permitir que el botón se encoja si es necesario
            '&:hover': {
              backgroundColor: selectedCategory === key ? getCategoryColor(key) : `${getCategoryColor(key)}20`,
              borderColor: getCategoryColor(key),
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[4]
            },
            '& .MuiButton-startIcon': {
              marginRight: '4px', // Reducido para ahorrar espacio
              fontSize: '16px'
            }
          }}
        >
          {label}
        </Button>
      ))}
    </Box>
  );
};

export default MaterialCategoryButtons;
