import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Box,
  useMediaQuery,
  useTheme,
  Divider,
  Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  Coffee as CoffeeIcon,
  Close as CloseIcon,
  Lightbulb as LightbulbIcon,
  DarkMode as DarkModeIcon
} from '@mui/icons-material';
import { useLanguage } from '../LanguageContext';
import useFiltersStore from '../store/filtersStore';
import useUIStore from '../store/uiStore';
import useThemeStore from '../store/themeStore';
import ThemeToggle from './ThemeToggle';

const MaterialMobileMenu = () => {
  const { t, lang, changeLanguage } = useLanguage();
  const { resetAllFilters } = useFiltersStore();
  const { currentView, goBackFromDetail, goBackFromCoffee, navigate, navigateToCoffee } = useUIStore();
  const { isDarkTheme, toggleTheme } = useThemeStore();
    const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg')); // Cambiado de 'md' a 'lg' para incluir tablets
  
  const handleNewRecommendations = () => {
    resetAllFilters(lang);
    navigate('home');
    setDrawerOpen(false);
  };
  
  const handleCoffeeNavigation = () => {
    navigateToCoffee();
    setDrawerOpen(false);
  };
  
  const handleGoBack = () => {
    if (currentView === 'detail') {
      goBackFromDetail();
    } else if (currentView === 'coffee') {
      goBackFromCoffee();
    }
    setDrawerOpen(false);
  };
  
  const isDetailView = currentView === 'detail';
  const isCoffeeView = currentView === 'coffee';
  const showBackButton = isDetailView || isCoffeeView;
  
  // Solo renderizar si estamos en móvil
  if (!isMobile) {
    return null;
  }
  
  const menuItems = [
    {
      text: t.home_title || 'Inicio',
      icon: <HomeIcon />,
      action: handleNewRecommendations,
      show: true
    },
    {
      text: t.back || 'Volver',
      icon: <ArrowBackIcon />,
      action: handleGoBack,
      show: showBackButton
    },
    {
      text: t.buy_me_coffee || 'Cómprame un café',
      icon: <CoffeeIcon />,
      action: handleCoffeeNavigation,
      show: !isCoffeeView,
      special: true
    }
  ];
  
  return (
    <>      <AppBar 
        position="fixed" 
        elevation={1}
        sx={{ 
          backgroundColor: isDarkTheme ? '#1e1e1e' : '#ffffff',
          color: isDarkTheme ? '#ffffff' : '#000000',
          borderBottom: isDarkTheme ? '1px solid #333' : '1px solid #e0e0e0',
          height: '48px',
          minHeight: '48px',
          top: '0 !important',
          left: '0 !important',
          right: '0 !important',
          margin: 0,
          padding: 0,
          zIndex: theme.zIndex.appBar || 1100,
          position: 'fixed !important'
        }}
      >
        <Toolbar 
          variant="dense"
          sx={{ 
            justifyContent: 'space-between', 
            padding: '0 12px',
            minHeight: '48px !important', // Altura más compacta
            height: '48px'
          }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 'bold',
              fontSize: '1.1rem',
              color: isDarkTheme ? '#ffffff' : '#000000'
            }}
          >
            Masterpiece
          </Typography>
          
          <IconButton
            edge="end"
            color="inherit"
            aria-label="abrir menú"
            onClick={() => setDrawerOpen(true)}
            sx={{ 
              color: isDarkTheme ? '#ffffff' : '#0078d4',
              fontSize: '1.5rem'
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
        <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 'min(80vw, 320px)',
            backgroundColor: isDarkTheme ? '#2d2d2d' : '#ffffff',
            color: isDarkTheme ? '#ffffff' : '#000000'
          }
        }}
      >
        <Box sx={{ padding: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Menú
          </Typography>
          <IconButton 
            onClick={() => setDrawerOpen(false)}
            sx={{ color: isDarkTheme ? '#ffffff' : '#000000' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider />
        
        <List sx={{ padding: 0 }}>
          {menuItems.map((item, index) => {
            if (!item.show) return null;
            
            return (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={item.action}
                  sx={{
                    padding: '12px 16px',
                    backgroundColor: item.special ? '#ffc439' : 'transparent',
                    color: item.special ? '#333333' : (isDarkTheme ? '#ffffff' : '#000000'),
                    margin: item.special ? '8px 16px' : '0',
                    borderRadius: item.special ? '20px' : '0',
                    '&:hover': {
                      backgroundColor: item.special ? '#ffb700' : (isDarkTheme ? '#404040' : '#f5f5f5')
                    }
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      color: item.special ? '#333333' : (isDarkTheme ? '#ffffff' : '#000000'),
                      minWidth: '40px'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontWeight: item.special ? 'bold' : 'normal'
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        
        <Divider sx={{ margin: '16px 0' }} />
        
        {/* Selector de tema */}
        <Box sx={{ padding: '0 16px', marginBottom: '16px' }}>
          <ListItemButton
            onClick={toggleTheme}
            sx={{
              borderRadius: '8px',
              padding: '12px',
              '&:hover': {
                backgroundColor: isDarkTheme ? '#404040' : '#f5f5f5'
              }
            }}
          >
            <ListItemIcon sx={{ color: isDarkTheme ? '#ffffff' : '#000000', minWidth: '40px' }}>
              {isDarkTheme ? <LightbulbIcon /> : <DarkModeIcon />}
            </ListItemIcon>
            <ListItemText 
              primary={isDarkTheme ? 'Modo Claro' : 'Modo Oscuro'}
              sx={{ color: isDarkTheme ? '#ffffff' : '#000000' }}
            />
          </ListItemButton>
        </Box>
        
        {/* Selector de idioma */}
        <Box sx={{ padding: '0 16px', marginBottom: '16px' }}>
          <Typography variant="subtitle2" sx={{ marginBottom: '8px', color: isDarkTheme ? '#cccccc' : '#666666' }}>
            Idioma
          </Typography>
          <Box sx={{ display: 'flex', gap: '8px' }}>
            <Button
              variant={lang === 'es' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => changeLanguage('es')}
              sx={{
                minWidth: '60px',
                backgroundColor: lang === 'es' ? '#0078d4' : 'transparent',
                color: lang === 'es' ? '#ffffff' : (isDarkTheme ? '#ffffff' : '#0078d4'),
                borderColor: '#0078d4'
              }}
            >
              ES
            </Button>
            <Button
              variant={lang === 'en' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => changeLanguage('en')}
              sx={{
                minWidth: '60px',
                backgroundColor: lang === 'en' ? '#0078d4' : 'transparent',
                color: lang === 'en' ? '#ffffff' : (isDarkTheme ? '#ffffff' : '#0078d4'),
                borderColor: '#0078d4'
              }}
            >
              EN
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default MaterialMobileMenu;
