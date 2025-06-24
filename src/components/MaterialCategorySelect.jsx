import React from 'react';
import { Select, MenuItem, InputLabel, FormControl, useTheme, useMediaQuery, ListSubheader, Box } from '@mui/material';
import { Movie as MovieIcon, SportsEsports as GameIcon, MenuBook as BookIcon, LibraryMusic as MusicIcon, Mic as PodcastIcon, Extension as BoardGameIcon, AutoStories as ComicIcon, Category as CategoryIcon, Star as StarIcon } from '@mui/icons-material';
import { useLanguage } from '../LanguageContext';
import { getCategoryColor, getCategoryColorForSelect } from '../utils/categoryUtils';
import { getSubcategoryLabel } from '../utils/subcategoryLabel';

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
  const { t, lang } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  React.useEffect(() => {
    if (isMobile) {
      console.log('ESTOY EN MODO MOVIL');
    }
  }, [isMobile]);
  if (!isMobile) return null;
  if (!Array.isArray(categories)) return null;

  // El select de subcategorías solo se muestra si hay subcategorías y categoría seleccionada
  const showSubcatSelect = Array.isArray(subcategories) && subcategories.length > 0 && selectedCategory;

  return (
    <div
      style={{ width: isMobile ? '80vw' : '100vw', maxWidth: isMobile ? '80vw' : '100vw', margin: isMobile ? '0 auto' : '0', boxSizing: 'border-box', position: 'relative', left: 'unset', transform: 'unset', zIndex: 900 }}
    >
      <FormControl
        fullWidth
        variant="outlined"
        sx={{
          my: 2,
          display: 'block',
          width: isMobile ? '80vw' : '100vw', // restaurado a 80vw
          maxWidth: isMobile ? '80vw' : '100vw', // restaurado a 80vw
          minWidth: 0,
          boxSizing: 'border-box',
          p: 0,
          mx: isMobile ? 'auto' : 0,
          mb: isMobile && showSubcatSelect ? 2.5 : isMobile ? 1.5 : 0, // antes 4/3, ahora 2.5/1.5
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: selectedCategory ? getCategoryColorForSelect(selectedCategory, theme) : undefined,
            borderWidth: 2
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: selectedCategory ? getCategoryColorForSelect(selectedCategory, theme) : undefined,
            borderWidth: 2
          },
          '& .MuiOutlinedInput-root': {
            boxShadow: 'none !important',
          },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: selectedCategory ? getCategoryColorForSelect(selectedCategory, theme) : undefined,
            borderWidth: 2,
            boxShadow: 'none !important',
          },
          '& .MuiInputLabel-root': {
            color: selectedCategory ? getCategoryColorForSelect(selectedCategory, theme) : undefined,
            fontWeight: 'bold',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: selectedCategory ? getCategoryColorForSelect(selectedCategory, theme) : undefined,
            fontWeight: 'bold',
          }
        }}
      >
        <InputLabel
          id="category-select-label"
          sx={{ fontWeight: 'bold' }}
        >
          {t?.ui?.navigation?.category || (lang === 'en' ? 'Category' : 'Categoría')}
        </InputLabel>
        <Select
          labelId="category-select-label"
          id="category-select"
          value={selectedCategory || ''}
          label={t?.ui?.navigation?.category || (lang === 'en' ? 'Category' : 'Categoría')}
          onChange={e => onCategoryChange(e.target.value, null)}
          sx={{
            background: theme.palette.background.paper,
            borderRadius: 2,
            fontWeight: 'bold',
            fontSize: '1rem',
            boxShadow: theme.shadows[1],
            width: isMobile ? '80vw' : '100vw',
            maxWidth: isMobile ? '80vw' : '100vw',
            minWidth: 0,
            display: 'block',
            boxSizing: 'border-box',
            p: 0,
            mx: isMobile ? 'auto' : 0,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: selectedCategory ? getCategoryColorForSelect(selectedCategory, theme) : undefined,
              borderWidth: 2
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: selectedCategory ? getCategoryColorForSelect(selectedCategory, theme) : undefined,
              borderWidth: 2
            },
            '& .MuiOutlinedInput-root': {
              boxShadow: 'none !important',
            },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: selectedCategory ? getCategoryColorForSelect(selectedCategory, theme) : undefined,
              borderWidth: 2,
              boxShadow: 'none !important',
            },
            '& .MuiInputLabel-root': {
              color: selectedCategory ? getCategoryColorForSelect(selectedCategory, theme) : undefined,
              fontWeight: 'bold'
            },
            '&.Mui-focused .MuiInputLabel-root': {
              color: selectedCategory ? getCategoryColorForSelect(selectedCategory, theme) : undefined,
              fontWeight: 'bold'
            },
            '& .MuiSelect-icon': {
              color: selectedCategory ? getCategoryColorForSelect(selectedCategory, theme) : undefined
            }
          }}
          MenuProps={{
            anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
            transformOrigin: { vertical: 'top', horizontal: 'center' },
            PaperProps: {
              sx: {
                borderRadius: 2,
                boxShadow: theme.shadows[4],
                width: isMobile ? '80vw' : '100vw',
                maxWidth: isMobile ? '80vw' : '100vw',
                minWidth: 0,
                mx: isMobile ? 'auto' : 0,
              },
            },
          }}
        >
          {/* Eliminada la opción 'todas las categorías' en móviles */}
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
        <>
          <Box sx={{ height: 24 }} />
          <FormControl
            fullWidth
            variant="outlined"
            sx={{
              display: 'block',
              width: isMobile ? '80vw' : '100vw',
              maxWidth: isMobile ? '80vw' : '100vw',
              minWidth: 0,
              boxSizing: 'border-box',
              p: 0,
              mx: isMobile ? 'auto' : 0,
              mb: isMobile ? 3 : 0,
              my: 0,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: selectedCategory ? getCategoryColorForSelect(selectedCategory, theme) : undefined,
                borderWidth: 2
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: selectedCategory ? getCategoryColorForSelect(selectedCategory, theme) : undefined,
                borderWidth: 2
              },
              '& .MuiOutlinedInput-root': {
                boxShadow: 'none !important',
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: selectedCategory ? getCategoryColorForSelect(selectedCategory, theme) : undefined,
                borderWidth: 2,
                boxShadow: 'none !important',
              },
              '& .MuiInputLabel-root': {
                color: selectedCategory ? getCategoryColorForSelect(selectedCategory, theme) : undefined,
                fontWeight: 'bold',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: selectedCategory ? getCategoryColorForSelect(selectedCategory, theme) : undefined,
                fontWeight: 'bold',
              },
            }}
          >
            <InputLabel
              id="subcategory-select-label"
              sx={{ fontWeight: 'bold' }}
            >
              {t?.ui?.navigation?.subcategory || (lang === 'en' ? 'Subcategory' : 'Subcategoría')}
            </InputLabel>
            <Select
              labelId="subcategory-select-label"
              id="subcategory-select"
              value={activeSubcategory || 'all'}
              label={t?.ui?.navigation?.subcategory || (lang === 'en' ? 'Subcategory' : 'Subcategoría')}
              onChange={e => onCategoryChange(selectedCategory, e.target.value)}
              sx={{
                background: theme.palette.background.paper,
                borderRadius: 2,
                fontWeight: 'bold',
                fontSize: '1rem',
                boxShadow: theme.shadows[1],
                width: isMobile ? '80vw' : '100vw',
                maxWidth: isMobile ? '80vw' : '100vw',
                minWidth: 0,
                display: 'block',
                boxSizing: 'border-box',
                mt: 1,
                p: 0,
                mx: isMobile ? 'auto' : 0,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: selectedCategory ? getCategoryColorForSelect(selectedCategory, theme) : undefined,
                  borderWidth: 2
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: selectedCategory ? getCategoryColorForSelect(selectedCategory, theme) : undefined,
                  borderWidth: 2
                },
                '& .MuiOutlinedInput-root': {
                  boxShadow: 'none !important',
                },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: selectedCategory ? getCategoryColorForSelect(selectedCategory, theme) : undefined,
                  borderWidth: 2,
                  boxShadow: 'none !important',
                },
                '& .MuiInputLabel-root': {
                  color: selectedCategory ? getCategoryColorForSelect(selectedCategory, theme) : undefined,
                  fontWeight: 'bold',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: selectedCategory ? getCategoryColorForSelect(selectedCategory, theme) : undefined,
                  fontWeight: 'bold',
                },
                '& .MuiSelect-icon': {
                  color: selectedCategory ? getCategoryColorForSelect(selectedCategory, theme) : undefined
                }
              }}
              MenuProps={{
                anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
                transformOrigin: { vertical: 'top', horizontal: 'center' },
                PaperProps: {
                  sx: {
                    borderRadius: 2,
                    boxShadow: theme.shadows[4],
                    width: isMobile ? '80vw' : '100vw',
                    maxWidth: isMobile ? '80vw' : '100vw',
                    minWidth: 0,
                    mx: isMobile ? 'auto' : 0,
                  },
                },
              }}
            >
              <MenuItem key="all" value="all">{t?.ui?.navigation?.all_subcategories || (lang === 'en' ? 'All subcategories' : 'Todas las subcategorías')}</MenuItem>
              {subcategories.map(sub => (
                <MenuItem key={sub.sub || sub} value={sub.sub || sub}>
                  {getSubcategoryLabel(sub.sub || sub, selectedCategory, t, lang)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
    </div>
  );
};

export default MaterialCategorySelect;
