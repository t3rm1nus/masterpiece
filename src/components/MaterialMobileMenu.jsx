import React, { useState, useEffect, useRef } from 'react';
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
  Button,
  Dialog,
  DialogContent
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  Coffee as CoffeeIcon,
  Close as CloseIcon,
  Lightbulb as LightbulbIcon,
  DarkMode as DarkModeIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useLanguage } from '../LanguageContext';
import { useAppData, useAppView, useAppTheme } from '../store/useAppStore';
import ThemeToggle from './ui/ThemeToggle';
import FabBackButton from './ui/FabBackButton';
import { useNavigationActions } from '../hooks/useNavigationActions';
import { useMenuItems } from '../hooks/useMenuItems.jsx';
import LanguageSelector from './ui/LanguageSelector';

/**
 * MaterialMobileMenu: Menú lateral y AppBar para navegación móvil.
 * Permite customizar renderizado de items, estilos y callbacks.
 *
 * Props:
 * - renderMenuItem: función opcional para customizar el render de cada ítem del menú (item, index) => ReactNode
 * - menuItems: array opcional de items personalizados para el menú
 * - onMenuOpen/onMenuClose: callbacks opcionales al abrir/cerrar el menú
 * - sx: estilos adicionales para el Drawer/AppBar
 *
 * Ejemplo de uso:
 * <MaterialMobileMenu
 *   renderMenuItem={(item, idx) => <CustomMenuItem item={item} key={idx} />}
 *   menuItems={[{ label: 'Inicio', icon: <HomeIcon />, action: () => {} }]}
 *   onMenuOpen={() => {}}
 *   onMenuClose={() => {}}
 *   sx={{ background: '#222' }}
 * />
 */
const MaterialMobileMenu = ({
  renderMenuItem,
  menuItems: menuItemsProp,
  onMenuOpen,
  onMenuClose,
  sx = {}
} = {}) => {
  const { t, lang, changeLanguage, getTranslation } = useLanguage();
  const { resetAllFilters } = useAppData();
  const { currentView, goBackFromDetail, goBackFromCoffee, goHome, goToCoffee, goToHowToDownload } = useAppView();
  const { isDarkMode, toggleTheme } = useAppTheme();
  const navigation = useNavigationActions();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [splashOpen, setSplashOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg')); // Cambiado de 'md' a 'lg' para incluir tablets
  const audioRef = useRef(null);

  // Cerrar Drawer al cambiar idioma para forzar recarga de textos
  useEffect(() => {
    if (drawerOpen) setDrawerOpen(false);
  }, [lang]);

  useEffect(() => {
    // Escuchar evento global para abrir el splash desde desktop
    const openSplashListener = () => setSplashOpen(true);
    window.addEventListener('openMobileSplash', openSplashListener);
    return () => window.removeEventListener('openMobileSplash', openSplashListener);
  }, []);
  
    const handleNewRecommendations = () => {
    resetAllFilters(lang);
    goHome();
    setDrawerOpen(false);
  };
  
  const handleCoffeeNavigation = () => {
    goToCoffee();
    setDrawerOpen(false);
  };
  
  const handleGoBack = () => {
    if (currentView === 'detail') {
      goBackFromDetail();
    } else if (currentView === 'coffee') {
      goBackFromCoffee();
    } else if (currentView === 'howToDownload') {
      goHome();
    }
    setDrawerOpen(false);
  };
  
  const handleHowToDownload = () => {
    goToHowToDownload();
    setDrawerOpen(false);
  };
  
  const isDetailView = currentView === 'detail';
  const isCoffeeView = currentView === 'coffee';
  const isHowToDownloadView = currentView === 'howToDownload'; // corregido: antes era 'how-to-download'
  const showBackButton = isDetailView || isCoffeeView || isHowToDownloadView;
  
  // Solo renderizar si estamos en móvil
  if (!isMobile) {
    return null;
  }

  // --- Splash popup handlers ---
  const handleSplashOpen = () => {
    setSplashOpen(true);
    setTimeout(() => {
      if (audioRef.current) {
        const audios = ["/imagenes/samurai.mp3", "/imagenes/samurai.wav"];
        const random = Math.floor(Math.random() * audios.length);
        audioRef.current.src = audios[random];
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    }, 100);
  };
  const handleSplashClose = () => {
    setSplashOpen(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };
  
  // Usar items custom si se pasan, si no usar hook por defecto
  const menuItems = Array.isArray(menuItemsProp) ? menuItemsProp : useMenuItems(handleSplashOpen);

  const handleLanguageChange = (lng) => {
    changeLanguage(lng);
    setDrawerOpen(false);
  };

  // Forzar rerender al cambiar tema para actualizar el literal del botón
  const [, forceUpdate] = useState(false);
  useEffect(() => {
    forceUpdate(f => !f);
  }, [isDarkMode]);

  // Mostrar FAB de volver solo en móvil y solo en las páginas de donaciones y cómo descargar
  const showFabBackButton = isMobile && (currentView === 'coffee' || currentView === 'howToDownload');
  // Determinar el top dinámico para el botón
  const fabTop = (currentView === 'coffee' || currentView === 'howToDownload') ? 63 : 16;

  return (
    <>
      <AppBar 
        position="fixed" 
        elevation={1}
        sx={{ 
          backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
          color: isDarkMode ? '#ffffff' : '#000000',
          borderBottom: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0',
          height: '48px',
          minHeight: '48px',
          top: '0 !important',
          left: '0 !important',
          right: '0 !important',
          margin: 0,
          padding: 0,
          zIndex: theme.zIndex.appBar || 1100,
          position: 'fixed !important',
          ...sx.appBar
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
              color: isDarkMode ? '#ffffff' : '#000000',
              cursor: 'pointer',
              userSelect: 'none'
            }}
            onClick={handleSplashOpen}
          >
            Masterpiece
          </Typography>
          
          <IconButton
            edge="end"
            color="inherit"
            aria-label="abrir menú"
            onClick={() => setDrawerOpen(true)}
            sx={{ 
              color: isDarkMode ? '#ffffff' : '#0078d4',
              fontSize: '1.5rem'
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {/* Splash Dialog */}
      <Dialog open={splashOpen} onClose={handleSplashClose} maxWidth="xs" PaperProps={{ style: { borderRadius: 18, background: isDarkMode ? '#222' : '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' } }}>
        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', background: isDarkMode ? '#222' : '#fff' }}>
          <img 
            src="/imagenes/splash_image.png" 
            alt="Splash" 
            style={{ width: '100%', maxWidth: 320, borderRadius: 16, margin: 0, cursor: 'pointer' }} 
            onClick={handleSplashClose}
          />
          <audio ref={audioRef} src="/imagenes/samurai.mp3" preload="auto" loop />
        </DialogContent>
      </Dialog>
        <Drawer
        key={lang} // Solo key={lang} para forzar desmontaje/montaje al cambiar idioma
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 'min(80vw, 320px)',
            backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            ...sx.drawer
          }
        }}
      >
        <Box sx={{ padding: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {getTranslation('ui.menu')}
          </Typography>
          <IconButton 
            onClick={() => setDrawerOpen(false)}
            sx={{ color: isDarkMode ? '#ffffff' : '#000000' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider />
        
        <List sx={{ padding: 0 }}>
          {menuItems.map((item, index) => {
            if (!item.show) return null;
            if (renderMenuItem) return renderMenuItem(item, index);
            return (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => { item.action && item.action(); setDrawerOpen(false); }}
                  sx={{
                    padding: '12px 16px',
                    background: index === menuItems.findIndex(i => i.label === (t.how_to_download || '¿Cómo descargar?'))
                      ? 'linear-gradient(90deg, #e0eafc 0%, #cfdef3 100%)'
                      : item.special
                        ? '#ffc439'
                        : 'transparent',
                    color: index === menuItems.findIndex(i => i.label === (t.how_to_download || '¿Cómo descargar?'))
                      ? '#1e3c72'
                      : item.special
                        ? '#333333'
                        : (isDarkMode ? '#ffffff' : '#000000'),
                    margin: item.special || index === menuItems.findIndex(i => i.label === (t.how_to_download || '¿Cómo descargar?'))
                      ? '8px 16px'
                      : '0',
                    borderRadius: item.special || index === menuItems.findIndex(i => i.label === (t.how_to_download || '¿Cómo descargar?'))
                      ? '20px'
                      : '0',
                    border: index === menuItems.findIndex(i => i.label === (t.how_to_download || '¿Cómo descargar?'))
                      ? '2px solid #b2c2e0'
                      : undefined,
                    fontWeight: item.special || index === menuItems.findIndex(i => i.label === (t.how_to_download || '¿Cómo descargar?'))
                      ? 'bold'
                      : 'normal',
                    boxShadow: index === menuItems.findIndex(i => i.label === (t.how_to_download || '¿Cómo descargar?'))
                      ? '0 2px 8px rgba(180,200,230,0.18)'
                      : undefined,
                    '&:hover': {
                      backgroundColor: item.special
                        ? '#ffb700'
                        : index === menuItems.findIndex(i => i.label === (t.how_to_download || '¿Cómo descargar?'))
                          ? '#d2e2f6'
                          : (isDarkMode ? '#404040' : '#f5f5f5')
                    }
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      color: item.special ? '#333333' : (isDarkMode ? '#ffffff' : '#000000'),
                      minWidth: '40px'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label}
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
          <ThemeToggle showLabel />
        </Box>
        
        {/* Selector de idioma */}
        <Box sx={{ padding: '0 16px', marginBottom: '16px' }}>
          <Typography variant="subtitle2" sx={{ marginBottom: '8px', color: isDarkMode ? '#cccccc' : '#666666' }}>
            {getTranslation('ui.language')}
          </Typography>
          <LanguageSelector variant="mobile" />
        </Box>
      </Drawer>
      {/* FAB de volver flotante */}
      {showFabBackButton && (
        <FabBackButton onClick={navigation.goBackFromDetail} sx={{ top: fabTop }} />
      )}
    </>
  );
};

export default MaterialMobileMenu;
