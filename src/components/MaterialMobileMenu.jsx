import React, { useState, useEffect } from 'react';
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
  sx = {},
  onSplashOpen,
  splashAudio,
  splashOpen,
  onSplashClose,
  audioRef,
} = {}) => {
  const { t, lang, changeLanguage, getTranslation } = useLanguage();
  const { resetAllFilters } = useAppData();
  const { currentView, goBackFromDetail, goBackFromCoffee, goHome, goToCoffee, goToHowToDownload } = useAppView();
  const { isDarkMode, toggleTheme } = useAppTheme();
  const navigation = useNavigationActions();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg')); // Cambiado de 'md' a 'lg' para incluir tablets

  // Cerrar Drawer al cambiar idioma para forzar recarga de textos
  useEffect(() => {
    if (drawerOpen) setDrawerOpen(false);
  }, [lang]);
  
  // Usar items custom si se pasan, si no usar hook por defecto
  const menuItems = Array.isArray(menuItemsProp) ? menuItemsProp : useMenuItems(onSplashOpen);

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

  // Solo renderizar si estamos en móvil
  if (!isMobile) {
    return null;
  }

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
            height: '48px',
            ...(typeof window !== 'undefined' && window.innerWidth < 900
              ? {
                  background: 'linear-gradient(135deg, #fffbe6 60%, #ffe29e 100%)',
                  boxShadow: '0 2px 12px 0 rgba(255, 200, 80, 0.13), 0 1.5px 0 #ffe29e',
                  borderRadius: 0,
                  position: 'relative',
                  zIndex: 2
                  // Bordes eliminados
                }
              : {})
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
            onClick={onSplashOpen}
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
      <Dialog open={splashOpen} onClose={onSplashClose} maxWidth="xs" PaperProps={{ style: { borderRadius: 18, background: isDarkMode ? '#222' : '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' } }}>
        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', background: isDarkMode ? '#222' : '#fff' }}>
          {/* Solo una imagen, sin fondo duplicado */}
          <img 
            src="/imagenes/splash_image.png" 
            alt={getTranslation('ui.alt.splash', 'Splash')}
            style={{ width: '100%', maxWidth: 320, borderRadius: 16, margin: 0, cursor: 'pointer', background: 'none' }} 
            onClick={onSplashClose}
          />
          <audio ref={audioRef} src={splashAudio} preload="auto" autoPlay loop />
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
            // Iconos SVG personalizados para Home y Coffee en negro
            let customIcon = null;
            const iconStyle = { color: '#000 !important', minWidth: 24, minHeight: 24 };
            let bgColor = '';
            if (item.label && (item.label.toLowerCase().includes('inicio') || item.label.toLowerCase().includes('home'))) {
              customIcon = (
                <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1umw9bq-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="HomeIcon" style={iconStyle}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path></svg>
              );
              bgColor = 'rgba(0,120,212,0.10)'; // azul suave
            } else if (item.label && (item.label.toLowerCase().includes('café') || item.label.toLowerCase().includes('coffee'))) {
              customIcon = (
                <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1umw9bq-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CoffeeIcon" style={{ ...iconStyle, width: 22, height: 22, minWidth: 22, minHeight: 22 }}><path d="M18.5 3H6c-1.1 0-2 .9-2 2v5.71c0 3.83 2.95 7.18 6.78 7.29 3.96.12 7.22-3.06 7.22-7v-1h.5c1.93 0 3.5-1.57 3.5-3.5S20.43 3 18.5 3M16 5v3H6V5zm2.5 3H18V5h.5c.83 0 1.5.67 1.5 1.5S19.33 8 18.5 8M4 19h16v2H4z"></path></svg>
              );
              bgColor = '#ffc439'; // amarillo café igual que desktop
            } else if (item.label && (
              item.label.toLowerCase().replace(/[¿?¡!.,]/g, '').replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u').includes('quienes somos') ||
              item.label.toLowerCase().includes('about')
            )) {
              bgColor = 'var(--color-primary)'; // azul primario para "¿Quiénes somos?" y "About" en ambos idiomas SOLO móvil
            } else if (item.label && (
              item.label.toLowerCase().includes('descargar') ||
              item.label.toLowerCase().includes('download') ||
              item.label.toLowerCase().includes('nuevas recomendaciones') ||
              item.label.toLowerCase().includes('new recommendations')
            )) {
              bgColor = 'var(--color-primary)'; // fondo primario para los demás
            }
            // Color para "Cómprame un café" igual que desktop
            else if (item.label && (item.label.toLowerCase().includes('cómprame un café') || item.label.toLowerCase().includes('buy me a coffee'))) {
              bgColor = 'rgba(255, 244, 229, 0.95)'; // amarillo suave, igual que desktop
            }
            return renderMenuItem
              ? renderMenuItem(item, index)
              : (
                <ListItem key={index} disablePadding>
                  <ListItemButton onClick={() => { item.action && item.action(); setDrawerOpen(false); }}
                    sx={{
                      borderRadius: 2,
                      my: 0.5,
                      backgroundColor: bgColor,
                      transition: 'background 0.2s',
                      '&:hover': { backgroundColor: bgColor }
                    }}>
                    <ListItemIcon sx={{ color: '#000 !important', minWidth: 28, minHeight: 28, width: customIcon ? 28 : undefined, height: customIcon ? 28 : undefined, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {customIcon ? customIcon : item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              );
          })}
        </List>
        
        <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* <Divider /> Eliminado para quitar borde superior */}
          <Button 
            variant="contained" 
            onClick={toggleTheme} 
            sx={{ 
              borderRadius: 14, 
              height: 32,
              minWidth: 32,
              fontSize: '0.95rem',
              px: 1.5,
              alignSelf: 'flex-start',
              boxShadow: isDarkMode ? 'none' : '0 2px 12px rgba(0,0,0,0.1)',
              backgroundColor: isDarkMode ? '#0078d4' : '#f0f0f0',
              color: isDarkMode ? '#ffffff' : '#000000',
              mt: 1.2, // Espacio arriba
              mb: 1.2, // Espacio abajo
              '&:hover': {
                backgroundColor: isDarkMode ? '#005ea6' : '#e0e0e0',
              },
              ...sx.themeButton
            }}
          >
            {isDarkMode ? <LightbulbIcon sx={{ mr: 1 }} /> : <DarkModeIcon sx={{ mr: 1 }} />}
            {getTranslation(isDarkMode ? 'ui.light_mode' : 'ui.dark_mode')}
          </Button>
          {/* <Divider /> Eliminado para quitar borde inferior */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start' }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 'medium', 
                textAlign: 'left', 
                pl: 0.5,
                display: 'none' // Oculta el subtítulo en el menú móvil
              }}
            >
              {getTranslation('ui.change_language', lang === 'es' ? 'Cambiar idioma' : 'Change language')}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1, mt: 1 }}>
              <Button
                variant={lang === 'es' ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => handleLanguageChange('es')}
                sx={{ borderRadius: 14, minWidth: 64, fontSize: '0.95rem', px: 1.5 }}
              >
                Español
              </Button>
              <Button
                variant={lang === 'en' ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => handleLanguageChange('en')}
                sx={{ borderRadius: 14, minWidth: 64, fontSize: '0.95rem', px: 1.5 }}
              >
                English
              </Button>
            </Box>
          </Box>
        </Box>
      </Drawer>
      {showFabBackButton && (
        <FabBackButton 
          onClick={() => {
            currentView === 'coffee' ? goBackFromCoffee() : goBackFromDetail();
          }}
          sx={{ 
            position: 'fixed',
            bottom: fabTop,
            right: 16,
            zIndex: 1200,
            backgroundColor: isDarkMode ? '#0078d4' : '#005ea6',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: isDarkMode ? '#005ea6' : '#004080',
            },
            ...sx.fabBackButton
          }}
        />
      )}
    </>
  );
};

export default MaterialMobileMenu;
