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
  DialogContent,
  Fab
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  Coffee as CoffeeIcon,
  Close as CloseIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useLanguage } from '../LanguageContext';
import { useAppData, useAppView, useAppTheme } from '../store/useAppStore';
import { useNavigationActions } from '../hooks/useNavigationActions';
import { useMenuItems } from '../hooks/useMenuItems.jsx';
import { useNavigate } from 'react-router-dom';
import LanguageSelector from './ui/LanguageSelector';
import SplashDialog from './SplashDialog';
import MaterialCategorySelect from './MaterialCategorySelect';
import useBackNavigation from '../hooks/useBackNavigation';

// =============================================
// MaterialMobileMenu: Menú de navegación lateral y AppBar para móviles
// Menú de navegación lateral y AppBar para móviles. Optimizado para UX, accesibilidad, performance y customización avanzada.
// =============================================

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
  onOverlayNavigate,
} = {}) => {
  const { t, lang, changeLanguage, getTranslation } = useLanguage();
  const { resetAllFilters } = useAppData();
  const { currentView, goBackFromDetail, goBackFromCoffee, goHome, goToCoffee, goToHowToDownload } = useAppView();
  const { isDarkMode } = useAppTheme();
  const navigation = useNavigationActions();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg')); // Cambiado de 'md' a 'lg' para incluir tablets
  const { handleBack, isAnimating } = useBackNavigation();

  // Audios disponibles para el splash
  const splashAudios = [
    "/sonidos/samurai.mp3",
    "/sonidos/samurai.wav",
    "/sonidos/samurai1.mp3",
    "/sonidos/samurai2.mp3",
    "/sonidos/samurai3.mp3",
    "/sonidos/samurai4.mp3"
  ];
  // Estado para controlar los audios pendientes (no repetir hasta que suenen todos)
  const [pendingAudios, setPendingAudios] = useState([...splashAudios]);

  // Cerrar Drawer al cambiar idioma para forzar recarga de textos
  useEffect(() => {
    if (drawerOpen) setDrawerOpen(false);
  }, [lang]);
  
  // Usar items custom si se pasan, si no usar hook por defecto
  const menuItems = Array.isArray(menuItemsProp) ? menuItemsProp : useMenuItems(onSplashOpen, navigate);

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

  // Botón de donaciones y cómo descargar en menú móvil
  const handleGoToCoffee = () => {
    if (typeof onOverlayNavigate === 'function') {
      console.log('[MaterialMobileMenu] Navegando a /donaciones vía onOverlayNavigate');
      onOverlayNavigate('/donaciones');
    } else {
      console.log('[MaterialMobileMenu] Navegando a /donaciones vía navigate directo');
      navigate('/donaciones');
    }
  };
  const handleGoToHowToDownload = () => {
    if (typeof onOverlayNavigate === 'function') {
      console.log('[MaterialMobileMenu] Navegando a /como-descargar vía onOverlayNavigate');
      onOverlayNavigate('/como-descargar');
    } else {
      console.log('[MaterialMobileMenu] Navegando a /como-descargar vía navigate directo');
      navigate('/como-descargar');
    }
  };

  // Solo renderizar si estamos en móvil
  // (El AppBar debe mostrarse siempre en móvil, independientemente de la vista)
  if (!isMobile) {
    return null;
  }

  return (
    <>
      {/* AppBar siempre visible en móvil para acceso al splash */}
      <AppBar 
        position="fixed" 
        elevation={1}
        sx={{ 
          backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
          color: isDarkMode ? '#ffffff' : '#000000',
          borderBottom: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0',
          height: 'auto',
          minHeight: '48px',
          top: '0 !important',
          left: '0 !important',
          right: '0 !important',
          margin: 0,
          padding: 0,
          zIndex: 1200, // Más alto que el detalle móvil (z-index 1)
          position: 'fixed !important',
          ...sx.appBar
        }}
      >
        <Toolbar 
          variant="dense"
          sx={{ 
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 0,
            minHeight: '48px !important',
            height: 'auto',
          }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', minHeight: 48, px: 1 }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                fontSize: '1.1rem',
                color: isDarkMode ? '#ffffff' : '#000000',
                cursor: 'pointer',
                userSelect: 'none',
                m: 0, p: 0
              }}
              onClick={() => {
                if (onSplashOpen) {
                  let audiosToUse = pendingAudios.length > 0 ? pendingAudios : [...splashAudios];
                  const randomIdx = Math.floor(Math.random() * audiosToUse.length);
                  const randomAudio = audiosToUse[randomIdx];
                  onSplashOpen(randomAudio);
                  // Eliminar el audio elegido de los pendientes
                  const newPending = audiosToUse.filter((a, i) => i !== randomIdx);
                  setPendingAudios(newPending);
                }
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
                color: isDarkMode ? '#ffffff' : '#0078d4',
                fontSize: '1.5rem',
                m: 0, p: 0
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {/* Splash Dialog */}
      <SplashDialog
        open={splashOpen}
        onClose={onSplashClose}
        audio={splashAudio}
        content={
          <img
            src="https://raw.githubusercontent.com/t3rm1nus/masterpiece/main/public/imagenes/splash_image.png"
            alt={getTranslation('ui.alt.splash', 'Splash')}
            style={{ width: '100%', maxWidth: 320, borderRadius: 16, margin: 0, cursor: 'pointer', background: 'none' }}
          />
        }
        sx={{
          content: {
            background: isDarkMode ? '#222' : '#fff',
            border: 'none',
            borderRadius: 18,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)'
          },
          paper: {
            borderRadius: 18,
            background: isDarkMode ? '#222' : '#fff',
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)'
          }
        }}
      />
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
            zIndex: 1300, // Más alto que el AppBar (1200) y el detalle móvil (1)
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
          {/* Botón de tema eliminado */}
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
        <Fab
          color="primary"
          aria-label="volver"
          onClick={handleBack}
          disabled={isAnimating}
          sx={{
            position: 'fixed',
            top: '63px',
            left: 16,
            zIndex: 1300, // Igual que el botón de volver en MobileItemDetail
            backgroundColor: theme?.palette?.primary?.main,
            opacity: isAnimating ? 0.5 : 1,
            '&:hover': {
              backgroundColor: theme?.palette?.primary?.dark,
            }
          }}
        >
          <ArrowBackIcon />
        </Fab>
      )}
    </>
  );
};

export default MaterialMobileMenu;
