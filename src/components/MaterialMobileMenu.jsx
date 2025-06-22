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
import ThemeToggle from './ThemeToggle';

const MaterialMobileMenu = () => {
  const { t, lang, changeLanguage } = useLanguage();
  const { resetAllFilters } = useAppData();
  const { currentView, goBackFromDetail, goBackFromCoffee, goHome, goToCoffee, goToHowToDownload } = useAppView();
  const { isDarkTheme, toggleTheme } = useAppTheme();
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
  
  // Declarar menuItems dentro del render SIEMPRE, para que use los textos actualizados
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
    },
    {
      text: t.how_to_download || '¿Cómo descargar?',
      icon: (
        <span style={{display:'flex',alignItems:'center'}}>
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" style={{verticalAlign:'middle'}} xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="#111" />
            <path d="M8 12C8 10 12 8 16 8C20 8 24 10 24 12C24 14 20 16 16 16C12 16 8 14 8 12Z" fill="#fff" stroke="#fff" strokeWidth="1.5"/>
            <rect x="13.5" y="11" width="2" height="2" rx="1" fill="#111"/>
            <rect x="17" y="11" width="2" height="2" rx="1" fill="#111"/>
            <path d="M12 18C13.5 20 18.5 20 20 18" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M6 24C10 22 22 22 26 24" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            <rect x="21" y="6" width="2" height="8" rx="1" fill="#fff"/>
            <rect x="9" y="6" width="2" height="8" rx="1" fill="#fff"/>
          </svg>
        </span>
      ),
      action: handleHowToDownload,
      show: true,
      special: false
    },
    {
      text: lang === 'en' ? 'About Us' : '¿Quiénes somos?',
      icon: (
        <span style={{display:'flex',alignItems:'center'}}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
            <polygon points="12,2 15,9 22,9.5 17,14.5 18.5,22 12,18 5.5,22 7,14.5 2,9.5 9,9" />
          </svg>
        </span>
      ),
      action: handleSplashOpen,
      show: true,
      special: false
    }
  ];
  
  const handleLanguageChange = (lng) => {
    changeLanguage(lng);
    setDrawerOpen(false);
  };

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
              color: isDarkTheme ? '#ffffff' : '#000000',
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
              color: isDarkTheme ? '#ffffff' : '#0078d4',
              fontSize: '1.5rem'
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {/* Splash Dialog */}
      <Dialog open={splashOpen} onClose={handleSplashClose} maxWidth="xs" PaperProps={{ style: { borderRadius: 18, background: isDarkTheme ? '#222' : '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' } }}>
        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', background: isDarkTheme ? '#222' : '#fff' }}>
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
            backgroundColor: isDarkTheme ? '#2d2d2d' : '#ffffff',
            color: isDarkTheme ? '#ffffff' : '#000000'
          }
        }}
      >
        <Box sx={{ padding: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {t.menu || (lang === 'en' ? 'Menu' : 'Menú')}
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
                    background: index === menuItems.findIndex(i => i.text === (t.how_to_download || '¿Cómo descargar?'))
                      ? 'linear-gradient(90deg, #e0eafc 0%, #cfdef3 100%)'
                      : item.special
                        ? '#ffc439'
                        : 'transparent',
                    color: index === menuItems.findIndex(i => i.text === (t.how_to_download || '¿Cómo descargar?'))
                      ? '#1e3c72'
                      : item.special
                        ? '#333333'
                        : (isDarkTheme ? '#ffffff' : '#000000'),
                    margin: item.special || index === menuItems.findIndex(i => i.text === (t.how_to_download || '¿Cómo descargar?'))
                      ? '8px 16px'
                      : '0',
                    borderRadius: item.special || index === menuItems.findIndex(i => i.text === (t.how_to_download || '¿Cómo descargar?'))
                      ? '20px'
                      : '0',
                    border: index === menuItems.findIndex(i => i.text === (t.how_to_download || '¿Cómo descargar?'))
                      ? '2px solid #b2c2e0'
                      : undefined,
                    fontWeight: item.special || index === menuItems.findIndex(i => i.text === (t.how_to_download || '¿Cómo descargar?'))
                      ? 'bold'
                      : 'normal',
                    boxShadow: index === menuItems.findIndex(i => i.text === (t.how_to_download || '¿Cómo descargar?'))
                      ? '0 2px 8px rgba(180,200,230,0.18)'
                      : undefined,
                    '&:hover': {
                      backgroundColor: item.special
                        ? '#ffb700'
                        : index === menuItems.findIndex(i => i.text === (t.how_to_download || '¿Cómo descargar?'))
                          ? '#d2e2f6'
                          : (isDarkTheme ? '#404040' : '#f5f5f5')
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
            </ListItemIcon>            <ListItemText 
              primary={isDarkTheme ? (t.light_mode || 'Modo Claro') : (t.dark_mode || 'Modo Oscuro')}
              sx={{ color: isDarkTheme ? '#ffffff' : '#000000' }}
            />
          </ListItemButton>
        </Box>
        
        {/* Selector de idioma */}
        <Box sx={{ padding: '0 16px', marginBottom: '16px' }}>
          <Typography variant="subtitle2" sx={{ marginBottom: '8px', color: isDarkTheme ? '#cccccc' : '#666666' }}>
            {t.language || (lang === 'en' ? 'Language' : 'Idioma')}
          </Typography>
          <Box sx={{ display: 'flex', gap: '8px' }}>
            <Button
              variant={lang === 'es' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => handleLanguageChange('es')}
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
              onClick={() => handleLanguageChange('en')}
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
