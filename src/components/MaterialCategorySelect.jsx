import React from 'react';
import { Select, MenuItem, InputLabel, FormControl, useTheme, useMediaQuery, ListSubheader } from '@mui/material';
import { Movie as MovieIcon, SportsEsports as GameIcon, MenuBook as BookIcon, LibraryMusic as MusicIcon, Mic as PodcastIcon, Extension as BoardGameIcon, AutoStories as ComicIcon, Category as CategoryIcon, Star as StarIcon } from '@mui/icons-material';

const getCategoryIcon = (categoryKey) => {
  switch (categoryKey) {
    case 'movies':
    case 'peliculas':
      return <MovieIcon fontSize="small" sx={{ mr: 1 }} />;
    case 'videogames':
    case 'videojuegos':
      return <GameIcon fontSize="small" sx={{ mr: 1 }} />;
    case 'books':
    case 'libros':
      return <BookIcon fontSize="small" sx={{ mr: 1 }} />;
    case 'music':
    case 'musica':
      return <MusicIcon fontSize="small" sx={{ mr: 1 }} />;
    case 'podcast':
    case 'podcasts':
      return <PodcastIcon fontSize="small" sx={{ mr: 1 }} />;
    case 'boardgames':
    case 'juegos de mesa':
      return <BoardGameIcon fontSize="small" sx={{ mr: 1 }} />;
    case 'comics':
      return <ComicIcon fontSize="small" sx={{ mr: 1 }} />;
    default:
      return <CategoryIcon fontSize="small" sx={{ mr: 1 }} />;
  }
};

// Recibe también subcategorías y categoría seleccionada
const MaterialCategorySelect = ({ categories, selectedCategory, onCategoryChange, subcategories, activeSubcategory }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  React.useEffect(() => {
    if (isMobile) {
      console.log('ESTOY EN MODO MOVIL');
    }
  }, [isMobile]);
  if (!isMobile) return null;
  if (!Array.isArray(categories)) return null;

  // El select de subcategorías solo se muestra si hay subcategorías y categoría seleccionada (excepto documentales)
  const showSubcatSelect = Array.isArray(subcategories) && subcategories.length > 0 && selectedCategory && selectedCategory !== 'documentales';

  return (
    <div style={{ width: '100%' }}>
      <FormControl fullWidth variant="outlined" sx={{ my: 2, display: 'block', width: '100%' }}>
        <InputLabel id="category-select-label">Categoría</InputLabel>
        <Select
          labelId="category-select-label"
          id="category-select"
          value={selectedCategory || ''}
          label="Categoría"
          onChange={e => onCategoryChange(e.target.value, null)}
          sx={{
            background: theme.palette.background.paper,
            borderRadius: 2,
            fontWeight: 'bold',
            fontSize: '1rem',
            boxShadow: theme.shadows[1],
            width: '100%',
            display: 'block',
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                borderRadius: 2,
                boxShadow: theme.shadows[4],
              },
            },
          }}
        >
          <MenuItem key="all" value="all">
            Todas las categorías
          </MenuItem>
          {categories.map(({ key, label, isMasterpiece }) => (
            <MenuItem key={key} value={key} sx={{ display: 'flex', alignItems: 'center' }}>
              {getCategoryIcon(key)}
              {label}
              {isMasterpiece && (
                <StarIcon sx={{ color: '#FFD600', ml: 1, fontSize: '1.1em', verticalAlign: 'middle' }} />
              )}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {showSubcatSelect && (
        <FormControl fullWidth variant="outlined" sx={{ my: 1, display: 'block', width: '100%' }}>
          <InputLabel id="subcategory-select-label">Subcategoría</InputLabel>
          <Select
            labelId="subcategory-select-label"
            id="subcategory-select"
            value={activeSubcategory || 'all'}
            label="Subcategoría"
            onChange={e => onCategoryChange(selectedCategory, e.target.value)}
            sx={{
              background: theme.palette.background.paper,
              borderRadius: 2,
              fontWeight: 'bold',
              fontSize: '1rem',
              boxShadow: theme.shadows[1],
              width: '100%',
              display: 'block',
              mt: 1,
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: 2,
                  boxShadow: theme.shadows[4],
                },
              },
            }}
          >
            <MenuItem key="all" value="all">Todas las subcategorías</MenuItem>
            {subcategories.map(sub => (
              <MenuItem key={sub.sub || sub} value={sub.sub || sub}>
                {sub.label || sub.sub || sub}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </div>
  );
};

export default MaterialCategorySelect;
