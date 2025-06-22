import React from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { useLanguage } from '../LanguageContext';
import { useAppData, useAppView } from '../store/useAppStore';
import ThemeToggle from './ThemeToggle';
import MaterialMobileMenu from './MaterialMobileMenu';
import DownloadIcon from '@mui/icons-material/Download';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

// Componente para el selector de idioma clásico
function LanguageSelector() {
  const { lang, changeLanguage } = useLanguage();
  return (
    <select
      id="language-selector"
      name="language-selector"
      value={lang}
      onChange={e => changeLanguage(e.target.value)}
      style={{ marginLeft: 8 }}
    >
      <option value="es">Español</option>
      <option value="en">English</option>
    </select>
  );
}

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
  
  const handleNewRecommendations = () => {
    console.log('Botón "Nuevas recomendaciones" clickeado');
    generateNewRecommendations();
  };
  
  const isDetailView = currentView === 'detail';
  const isCoffeeView = currentView === 'coffee';
  const isHowToDownloadView = currentView === 'howToDownload';
  
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
  
    return (
    <nav className="main-menu">
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>        {/* Botón de inicio a la izquierda que resetea todos los filtros */}
        <button 
          onClick={handleNewRecommendations} 
          style={{ fontWeight: 'bold' }}
        >
          {getTranslation('ui.titles.home_title', 'Nuevas Recomendaciones')}
        </button>
        
        {/* Mostrar botón volver solo en vista de detalle, café o howToDownload */}
        {(isDetailView || isCoffeeView || isHowToDownloadView) && (
          <button 
            className="back-btn" 
            onClick={() => {
              if (isDetailView) return goBackFromDetail();
              if (isCoffeeView) return goBackFromCoffee();
              if (isHowToDownloadView) return goHome();
            }}
          >
            ← {t?.ui?.navigation?.back || t.back || (lang === 'en' ? 'Back' : 'Volver')}
          </button>
        )}
      </div>
      
      {/* Controles de la derecha: café, tema e idioma */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>        {/* Botón de donación - solo mostrar si no estamos en la página de café */}
        {!isCoffeeView && (
          <button 
            className="donation-btn"
            onClick={goToCoffee}
          >
            {/* Usar emoji café bonito y literal correcto */}
            <span style={{fontSize: '1.2em', marginRight: 8}}>☕</span>
            {lang === 'en' ? 'Buy me a coffee' : 'Invítame a un café'}
          </button>
        )}
        {/* Botón ¿Cómo descargar? */}
        <button 
          className="donation-btn pirate-download-btn"
          onClick={goToHowToDownload}
          style={{
            background: 'linear-gradient(90deg, #e0eafc 0%, #cfdef3 100%)', // degradado azul claro elegante
            color: '#1e3c72',
            border: '2px solid #b2c2e0',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 2px 8px rgba(180,200,230,0.18)',
            borderRadius: 8,
            padding: '6px 18px',
            fontSize: '1.05em',
            transition: 'background 0.2s, box-shadow 0.2s',
          }}
        >
          {/* Bandera pirata SVG */}
          <span style={{fontSize: '1.2em', marginRight: 6, display: 'flex', alignItems: 'center'}}>
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none" style={{verticalAlign:'middle'}} xmlns="http://www.w3.org/2000/svg">
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
          {getTranslation('how_to_download.title', lang === 'en' ? 'How to download?' : '¿Cómo descargar?')}
        </button>
        {/* Icono a la derecha del botón ¿Cómo descargar? */}
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
            borderRadius: '6px' // Borde muy suave, sin borde visible
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
        <LanguageSelector />
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
