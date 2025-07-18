import React from 'react';
import { Select, MenuItem, InputLabel, FormControl, useTheme, useMediaQuery, Box } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import StarIcon from '@mui/icons-material/Star';
import MovieIcon from '@mui/icons-material/Movie';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import MicIcon from '@mui/icons-material/Mic';
import ExtensionIcon from '@mui/icons-material/Extension';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import { useLanguage } from '../LanguageContext';
import { getCategoryColor, getCategoryGradient, getCategoryColorForSelect } from '../utils/categoryPalette';
import { getSubcategoryLabel } from '../utils/getSubcategoryLabel';

// Tipos de props
interface Category {
  key: string;
  label: string;
  isMasterpiece?: boolean;
}
interface Subcategory {
  sub: string;
  label?: string;
}
interface MaterialCategorySelectProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string, subcategory: string | null) => void;
  subcategories?: Subcategory[];
  activeSubcategory?: string;
  renderCategoryButton?: (category: Category, selected: boolean, idx: number) => React.ReactNode;
  renderSubcategoryChip?: (subcategory: Subcategory, selected: boolean, idx: number) => React.ReactNode;
  sx?: object;
  [key: string]: any;
}

const getCategoryIcon = (categoryKey: string) => {
  switch (categoryKey) {
    case 'movies':
    case 'peliculas':
      return <MovieIcon fontSize="small" sx={{ mr: 1 }} />;
    case 'videogames':
    case 'videojuegos':
      return <SportsEsportsIcon fontSize="small" sx={{ mr: 1 }} />;
    case 'books':
    case 'libros':
      return <MenuBookIcon fontSize="small" sx={{ mr: 1 }} />;
    case 'music':
    case 'musica':
      return <LibraryMusicIcon fontSize="small" sx={{ mr: 1 }} />;
    case 'podcast':
    case 'podcasts':
      return <MicIcon fontSize="small" sx={{ mr: 1 }} />;
    case 'boardgames':
    case 'juegos de mesa':
      return <ExtensionIcon fontSize="small" sx={{ mr: 1 }} />;
    case 'comics':
      return <AutoStoriesIcon fontSize="small" sx={{ mr: 1 }} />;
    case 'series':
      return <LiveTvIcon fontSize="small" sx={{ mr: 1 }} />;
    case 'documentales':
      return <OndemandVideoIcon fontSize="small" sx={{ mr: 1 }} />;
    default:
      return <CategoryIcon fontSize="small" sx={{ mr: 1 }} />;
  }
};

const MaterialCategorySelect: React.FC<MaterialCategorySelectProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  subcategories = [],
  activeSubcategory,
  renderCategoryButton,
  renderSubcategoryChip,
  sx = {},
  ...rest
}) => {
  const { t, lang } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  if (!isMobile) return null;
  if (!Array.isArray(categories)) return null;

  // El select de subcategorías solo se muestra si hay subcategorías y categoría seleccionada
  const showSubcatSelect = Array.isArray(subcategories) && subcategories.length > 0 && selectedCategory;

  return (
    <div
      style={{
        width: isMobile ? '80vw' : '100vw',
        maxWidth: isMobile ? '80vw' : '100vw',
        margin: isMobile ? '0 auto' : '0',
        boxSizing: 'border-box',
        position: 'relative',
        left: 'unset',
        transform: 'unset',
        zIndex: 1 // Por debajo del menú superior (1200)
      }}
      {...rest}
    >
      <FormControl
        fullWidth
        variant="outlined"
        sx={{
          my: 2,
          display: 'block',
          width: isMobile ? '80vw' : '100vw',
          maxWidth: isMobile ? '80vw' : '100vw',
          minWidth: 0,
          boxSizing: 'border-box',
          p: 0,
          mx: isMobile ? 'auto' : 0,
          mb: isMobile && showSubcatSelect ? 2.5 : isMobile ? 1.5 : 0,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: selectedCategory ? getCategoryColorForSelect(selectedCategory) : undefined,
            borderWidth: 2
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: selectedCategory ? getCategoryColorForSelect(selectedCategory) : undefined,
            borderWidth: 2
          },
          '& .MuiOutlinedInput-root': {
            boxShadow: 'none !important',
          },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: selectedCategory ? getCategoryColorForSelect(selectedCategory) : undefined,
            borderWidth: 2,
            boxShadow: 'none !important',
          },
          '& .MuiInputLabel-root': {
            color: selectedCategory ? getCategoryColorForSelect(selectedCategory) : undefined,
            fontWeight: 'bold',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: selectedCategory ? getCategoryColorForSelect(selectedCategory) : undefined,
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
              borderColor: selectedCategory ? getCategoryColorForSelect(selectedCategory) : undefined,
              borderWidth: 2
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: selectedCategory ? getCategoryColorForSelect(selectedCategory) : undefined,
              borderWidth: 2
            },
            '& .MuiOutlinedInput-root': {
              boxShadow: 'none !important',
            },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: selectedCategory ? getCategoryColorForSelect(selectedCategory) : undefined,
              borderWidth: 2,
              boxShadow: 'none !important',
            },
            '& .MuiInputLabel-root': {
              color: selectedCategory ? getCategoryColorForSelect(selectedCategory) : undefined,
              fontWeight: 'bold'
            },
            '&.Mui-focused .MuiInputLabel-root': {
              color: selectedCategory ? getCategoryColorForSelect(selectedCategory) : undefined,
              fontWeight: 'bold'
            },
            '& .MuiSelect-icon': {
              color: selectedCategory ? getCategoryColorForSelect(selectedCategory) : undefined
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
          {categories.map((cat, idx) => (
            renderCategoryButton
              ? renderCategoryButton(cat, selectedCategory === cat.key, idx)
              : (
                <MenuItem key={cat.key} value={cat.key} sx={{ display: 'flex', alignItems: 'center' }}>
                  {getCategoryIcon(cat.key)}
                  {cat.label}
                  {cat.isMasterpiece && (
                    <StarIcon sx={{ color: '#FFD600', ml: 1, fontSize: '1.1em', verticalAlign: 'middle' }} />
                  )}
                </MenuItem>
              )
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
                borderColor: selectedCategory ? getCategoryColorForSelect(selectedCategory) : undefined,
                borderWidth: 2
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: selectedCategory ? getCategoryColorForSelect(selectedCategory) : undefined,
                borderWidth: 2
              },
              '& .MuiOutlinedInput-root': {
                boxShadow: 'none !important',
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: selectedCategory ? getCategoryColorForSelect(selectedCategory) : undefined,
                borderWidth: 2,
                boxShadow: 'none !important',
              },
              '& .MuiInputLabel-root': {
                color: selectedCategory ? getCategoryColorForSelect(selectedCategory) : undefined,
                fontWeight: 'bold',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: selectedCategory ? getCategoryColorForSelect(selectedCategory) : undefined,
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
                  borderColor: selectedCategory ? getCategoryColorForSelect(selectedCategory) : undefined,
                  borderWidth: 2
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: selectedCategory ? getCategoryColorForSelect(selectedCategory) : undefined,
                  borderWidth: 2
                },
                '& .MuiOutlinedInput-root': {
                  boxShadow: 'none !important',
                },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: selectedCategory ? getCategoryColorForSelect(selectedCategory) : undefined,
                  borderWidth: 2,
                  boxShadow: 'none !important',
                },
                '& .MuiInputLabel-root': {
                  color: selectedCategory ? getCategoryColorForSelect(selectedCategory) : undefined,
                  fontWeight: 'bold',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: selectedCategory ? getCategoryColorForSelect(selectedCategory) : undefined,
                  fontWeight: 'bold',
                },
                '& .MuiSelect-icon': {
                  color: selectedCategory ? getCategoryColorForSelect(selectedCategory) : undefined
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
              {subcategories.map((sub, idx) => (
                renderSubcategoryChip
                  ? renderSubcategoryChip(sub, activeSubcategory === sub.sub, idx)
                  : (
                    <MenuItem key={sub.sub} value={sub.sub}>
                      {getSubcategoryLabel(sub.sub, selectedCategory, t, lang)}
                    </MenuItem>
                  )
              ))}
            </Select>
          </FormControl>
        </>
      )}
    </div>
  );
};

export default MaterialCategorySelect; 