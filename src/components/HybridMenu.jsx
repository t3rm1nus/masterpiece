import React from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { useLanguage } from '../LanguageContext';
import { useAppData, useAppView } from '../store/useAppStore';
import ThemeToggle from './ThemeToggle';
import MaterialMobileMenu from './MaterialMobileMenu';
import DownloadIcon from '@mui/icons-material/Download';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useMenuItems } from '../hooks/useMenuItems';
import LanguageSelector from './ui/LanguageSelector';

// Menú clásico para desktop
function DesktopMenu() {
  const { t, lang, getTranslation } = useLanguage();
  const { resetAllFilters, generateNewRecommendations } = useAppData();
  const { currentView, goBackFromDetail, goBackFromCoffee, goHome, goToCoffee, goToHowToDownload } = useAppView();  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [splashOpen, setSplashOpen] = React.useState(false);
  const audioRef = React.useRef(null);
  if (isMobile) return null;

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

  // Usar hook centralizado para los items del menú
  // Para desktop, excluimos el ítem 'about' y renderizamos el icono manualmente
  const menuItems = useMenuItems();

  return (
    <nav className="main-menu">
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Renderizar los items principales del menú */}
          {menuItems.filter(item => item.show && !item.special && item.label !== getTranslation('ui.navigation.about')).map((item, idx) => (
            <button key={idx} onClick={item.action} style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 8 }}>
              {item.icon}
              {/* Si es el botón de inicio, mostrar literal personalizado */}
              {item.label === getTranslation('ui.navigation.home') ? getTranslation('ui.titles.home_title', 'Nuevas Recomendaciones') : item.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Renderizar los items especiales (donación, etc) */}
          {menuItems.filter(item => item.show && item.special).map((item, idx) => (
            <button key={idx} className="donation-btn" onClick={item.action} style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 8 }}>
              {item.icon}
              {item.label}
            </button>
          ))}
          {/* Icono quienes somos (about) como imagen suelta a la derecha */}
          <img
            src="/imagenes/icono.png"
            alt="info"
            title={lang === 'en' ? 'Show info' : 'Mostrar información'}
            onClick={handleSplashOpen}
            style={{
              width: '36px',
              height: '36px',
              marginLeft: '8px',
              cursor: 'pointer',
              verticalAlign: 'middle',
              display: 'inline-block',
              borderRadius: '6px'
            }}
          />
          {/* Splash Dialog Desktop */}
          <Dialog open={splashOpen} onClose={handleSplashClose} maxWidth="xl" fullWidth
            PaperProps={{
              style: {
                borderRadius: 18,
                background: '#222',
                boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                overflow: 'hidden',
                padding: 0,
                margin: 0,
                maxWidth: '100vw',
                maxHeight: '100vh',
              }
            }}
          >
            <DialogContent sx={{
              p: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: '#222',
              width: '100vw',
              height: '100vh',
              maxWidth: '100vw',
              maxHeight: '100vh',
              overflow: 'hidden',
            }}>
              <img 
                src="/imagenes/splash_image.png" 
                alt="Splash" 
                style={{
                  width: '100%',
                  height: '100%',
                  maxWidth: '100vw',
                  maxHeight: '100vh',
                  borderRadius: 0,
                  margin: 0,
                  cursor: 'pointer',
                  objectFit: 'contain',
                  background: '#111',
                  display: 'block',
                }} 
                onClick={handleSplashClose}
              />
              <audio ref={audioRef} src="/imagenes/samurai.mp3" preload="auto" loop />
            </DialogContent>
          </Dialog>
          <ThemeToggle />
          <LanguageSelector variant="desktop" sx={{ marginLeft: 1 }} />
        </div>
      </div>
    </nav>
  );
}

// Componente híbrido que decide qué menú mostrar
const HybridMenu = () => {
  const { lang } = useLanguage(); // <--- Añadido para obtener el idioma actual
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg')); // Cambiado de 'md' a 'lg' para incluir tablets
  
  if (isMobile) {
    return <MaterialMobileMenu key={lang} />;
  } else {
    return <DesktopMenu />;
  }
};

export default HybridMenu;
