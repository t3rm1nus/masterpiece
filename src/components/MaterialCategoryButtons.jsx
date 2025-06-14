import React from 'react';
import {
  Button,
  ButtonGroup,
  Box,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Movie as MovieIcon,
  SportsEsports as GameIcon,
  MenuBook as BookIcon,
  LibraryMusic as MusicIcon,
  Podcast as PodcastIcon,
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
        return '#e91e63';
      case 'comics':
        return '#ff9800';
      default:
        return theme.palette.primary.main;
    }
  };
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        justifyContent: 'center',
        padding: '16px',
        maxWidth: '100%'
      }}
    >
      {categories.map(({ key, label }) => (
        <Button
          key={key}
          variant={selectedCategory === key ? 'contained' : 'outlined'}
          startIcon={getCategoryIcon(key)}
          onClick={() => onCategoryClick(key, label)}
          sx={{
            minWidth: 'auto',
            borderRadius: '20px',
            textTransform: 'none',
            fontSize: '0.875rem',
            fontWeight: selectedCategory === key ? 'bold' : 'normal',
            backgroundColor: selectedCategory === key ? getCategoryColor(key) : 'transparent',
            borderColor: getCategoryColor(key),
            color: selectedCategory === key ? 'white' : getCategoryColor(key),
            padding: '6px 16px',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: selectedCategory === key ? getCategoryColor(key) : `${getCategoryColor(key)}20`,
              borderColor: getCategoryColor(key),
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[4]
            },
            '& .MuiButton-startIcon': {
              marginRight: '6px',
              fontSize: '18px'
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
