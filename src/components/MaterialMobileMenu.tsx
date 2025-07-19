import React, { useState, useEffect, MutableRefObject } from 'react';
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
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import StarIcon from '@mui/icons-material/Star';
import CoffeeIcon from '@mui/icons-material/Coffee';
import DownloadIcon from '@mui/icons-material/Download';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLanguage } from '../LanguageContext';
import { useAppData, useAppTheme } from '../store/useAppStore';
import { useNavigationActions } from '../hooks/useNavigationActions';
import { useMenuItems } from '../hooks/useMenuItems';
import { useNavigate, useLocation } from 'react-router-dom';
import SplashDialog from './SplashDialog';
import useBackNavigation from '../hooks/useBackNavigation';
import LanguageSelector from './LanguageSelector';
import { getLocalizedPath } from '../utils/urlHelpers';

// Tipos para props
interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  action?: () => void;
  show?: boolean;
}

interface MaterialMobileMenuProps {
  onSplashOpen?: (audio: string) => void;
  splashOpen?: boolean;
  onSplashClose?: () => void;
  splashAudio?: string;
  audioRef?: MutableRefObject<HTMLAudioElement | null>;
  onOverlayNavigate?: (ruta: string) => void;
  renderMenuItem?: (item: MenuItem, idx: number) => React.ReactNode;
  menuItems?: MenuItem[];
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  sx?: Record<string, any>;
  onBack?: () => void;
}

const MaterialMobileMenu: React.FC<MaterialMobileMenuProps> = ({
  onSplashOpen,
  splashOpen,
  onSplashClose,
  splashAudio,
  audioRef,
  onOverlayNavigate,
  renderMenuItem,
  menuItems: menuItemsProp,
  onMenuOpen,
  onMenuClose,
  sx = {},
  onBack,
}) => {
  const { t, lang, changeLanguage, getTranslation } = useLanguage();
  const { resetAllFilters } = useAppData();
  const { isDarkMode } = useAppTheme();
  const navigation = useNavigationActions();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const { handleBack: useBackNavigationHandleBack, isAnimating } = useBackNavigation();
  const handleBack = onBack || useBackNavigationHandleBack;

  const splashAudios = [
    "/sonidos/samurai.mp3",
    "/sonidos/samurai.wav",
    "/sonidos/samurai1.mp3",
    "/sonidos/samurai2.mp3",
    "/sonidos/samurai3.mp3",
    "/sonidos/samurai4.mp3"
  ];
  const [pendingAudios, setPendingAudios] = useState([...splashAudios]);

  useEffect(() => {
    if (drawerOpen) setDrawerOpen(false);
  }, [lang]);

  const menuItems = Array.isArray(menuItemsProp) ? menuItemsProp : useMenuItems((audio?: string) => {
    if (audio && onSplashOpen) onSplashOpen(audio);
  }, (ruta: string) => {
    const localizedPath = getLocalizedPath(ruta, lang);
    if (onOverlayNavigate) onOverlayNavigate(localizedPath);
    else navigate(localizedPath);
  });

  const handleLanguageChange = (lng: string) => {
    const currentPath = location.pathname + location.search + location.hash;
    if (lng === 'en') {
      if (!currentPath.startsWith('/en/')) {
        navigate('/en' + (currentPath.startsWith('/') ? currentPath : '/' + currentPath));
      }
    } else {
      if (currentPath.startsWith('/en/')) {
        navigate(currentPath.replace(/^\/en/, '') || '/');
      }
    }
    changeLanguage(lng);
    setDrawerOpen(false);
  };

  const [, forceUpdate] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  useEffect(() => { forceUpdate(f => !f); }, [isDarkMode]);
  useEffect(() => { const timer = setTimeout(() => { setIsPageLoaded(true); }, 100); return () => clearTimeout(timer); }, []);

  const showFabBackButton = false;

  if (!isMobile) return null;

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
          color: isDarkMode ? '#ffffff' : '#000000',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderBottom: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0',
          zIndex: 1200,
          ...sx
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
      {splashOpen && (
        <SplashDialog
          open={splashOpen}
          onClose={onSplashClose}
          audio={splashAudio}
          audioRef={audioRef as any}
          content={
            <img src="https://github.com/t3rm1nus/masterpiece/raw/main/public/imagenes/splash_image.png" alt="Splash" style={{ width: 48, height: 48, marginRight: 8, borderRadius: 12 }} />
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
      )}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '280px', sm: '320px' },
            backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            borderRight: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0',
            boxShadow: '4px 0 16px rgba(0,0,0,0.15)',
            zIndex: 1600,
            ...sx.drawer
          }
        }}
        sx={{
          zIndex: 1600,
          ...sx
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
            let customIcon = null;
            const iconStyle = { color: '#000 !important', minWidth: 24, minHeight: 24 };
            let bgColor = '';
            if (item.label && (item.label.toLowerCase().includes('inicio') || item.label.toLowerCase().includes('home'))) {
              customIcon = (
                <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1umw9bq-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="HomeIcon" style={iconStyle}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path></svg>
              );
              bgColor = 'rgba(0,120,212,0.10)';
            } else if (item.label && (item.label.toLowerCase().includes('café') || item.label.toLowerCase().includes('coffee'))) {
              customIcon = (
                <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1umw9bq-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CoffeeIcon" style={{ ...iconStyle, width: 22, height: 22, minWidth: 22, minHeight: 22 }}><path d="M18.5 3H6c-1.1 0-2 .9-2 2v5.71c0 3.83 2.95 7.18 6.78 7.29 3.96.12 7.22-3.06 7.22-7v-1h.5c1.93 0 3.5-1.57 3.5-3.5S20.43 3 18.5 3M16 5v3H6V5zm2.5 3H18V5h.5c.83 0 1.5.67 1.5 1.5S19.33 8 18.5 8M4 19h16v2H4z"></path></svg>
              );
              bgColor = '#ffc439';
            } else if (item.label && (
              item.label.toLowerCase().replace(/[¿?¡!.,]/g, '').replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u').includes('quienes somos') ||
              item.label.toLowerCase().includes('about')
            )) {
              bgColor = 'var(--color-primary)';
            } else if (item.label && (
              item.label.toLowerCase().includes('descargar') ||
              item.label.toLowerCase().includes('download') ||
              item.label.toLowerCase().includes('nuevas recomendaciones') ||
              item.label.toLowerCase().includes('new recommendations')
            )) {
              bgColor = 'var(--color-primary)';
            }
            else if (item.label && (item.label.toLowerCase().includes('cómprame un café') || item.label.toLowerCase().includes('buy me a coffee'))) {
              bgColor = 'rgba(255, 244, 229, 0.95)';
            }
            return renderMenuItem
              ? renderMenuItem(item, index)
              : (
                <ListItem key={index} disablePadding>
                  <ListItemButton onClick={() => {
                    setDrawerOpen(false);
                    if (item && item.action) {
                      item.action();
                    }
                  }}
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start' }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 'medium', 
                textAlign: 'left', 
                pl: 0.5,
                display: 'none'
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
            top: '3px',
            left: 16,
            zIndex: 4000,
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