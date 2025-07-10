import React from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { useLanguage } from '../LanguageContext';
import { useAppData, useAppView } from '../store/useAppStore';
import ThemeToggle from './ui/ThemeToggle';
import MaterialMobileMenu from './MaterialMobileMenu';
import DownloadIcon from '@mui/icons-material/Download';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useMenuItems } from '../hooks/useMenuItems.jsx';
import LanguageSelector from './ui/LanguageSelector';
import SplashDialog from './SplashDialog';

// =============================================
// HybridMenu: Menú híbrido adaptable a desktop y móvil
// Menú híbrido adaptable a desktop y móvil. Optimizado para UX, accesibilidad, navegación moderna y customización avanzada.
// =============================================

/**
 * HybridMenu: Menú adaptable que muestra menú móvil o desktop según el dispositivo.
 * Permite customizar renderizado de items, estilos y callbacks.
 *
 * Props:
 * - renderMenuItem: función opcional para customizar el render de cada ítem del menú (item, index) => ReactNode
 * - menuItems: array opcional de items personalizados para el menú
 * - onMenuOpen/onMenuClose: callbacks opcionales al abrir/cerrar el menú
 * - sx: estilos adicionales para el menú
 *
 * Ejemplo de uso:
 * <HybridMenu
 *   renderMenuItem={(item, idx) => <CustomMenuItem item={item} key={idx} />}
 *   menuItems={[{ label: 'Inicio', icon: <HomeIcon />, action: () => {} }]}
 *   onMenuOpen={() => {}}
 *   onMenuClose={() => {}}
 *   sx={{ background: '#222' }}
 * />
 */

// Menú clásico para desktop
function DesktopMenu(props) {
  const {
    renderMenuItem,
    menuItems: menuItemsProp,
    sx = {},
    onSplashOpen,
    splashAudio,
    splashOpen,
    onSplashClose,
    audioRef,
    onBack // <-- aseguramos que se desestructura correctamente
  } = props;
  const { t, lang, getTranslation } = useLanguage();
  const { resetAllFilters, generateNewRecommendations } = useAppData();
  const { currentView, goBackFromDetail, goBackFromCoffee, goHome, goToCoffee, goToHowToDownload } = useAppView();  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  if (isMobile) return null;

  // Detectar si estamos en detalle, donación o cómo descargar para mostrar el botón Volver en el menú superior
  const isDetailView = currentView === 'detail';
  const isCoffeeView = currentView === 'coffee';
  const isHowToDownloadView = currentView === 'howToDownload';
  const showBackButton = isDetailView || isCoffeeView || isHowToDownloadView;

  // --- Splash popup handlers ---
  // El handler y audio vienen de props (HomePage)
  // const handleSplashOpen = () => {
  //   setSplashOpen(true);
  //   setTimeout(() => {
  //     if (audioRef.current) {
  //       const audios = ["/sonidos/samurai.mp3", "/sonidos/samurai.wav"];
  //       const random = Math.floor(Math.random() * audios.length);
  //       audioRef.current.src = audios[random];
  //       audioRef.current.currentTime = 0;
  //       audioRef.current.play();
  //     }
  //   }, 100);
  // };
  // const handleSplashClose = () => {
  //   setSplashOpen(false);
  //   if (audioRef.current) {
  //     audioRef.current.pause();
  //     audioRef.current.currentTime = 0;
  //   }
  // };

  // Usar items custom si se pasan, si no usar hook por defecto
  const menuItems = Array.isArray(menuItemsProp) ? menuItemsProp : useMenuItems();

  return (
    <nav className="main-menu" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      zIndex: 1100,
      background: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      ...sx.menu
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
          {/* Renderizar los items principales del menú */}
          {menuItems.filter(item => item.show && !item.special && item.label !== getTranslation('ui.navigation.about')).map((item, idx, arr) => (
            <React.Fragment key={idx}>
              {renderMenuItem
                ? renderMenuItem(item, idx)
                : <button onClick={item.action} style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {item.icon}
                    {item.label}
                  </button>
              }
            </React.Fragment>
          ))}
          {/* Botón Volver visible en detalle, donación o cómo descargar (desktop) */}
          {showBackButton && (
            <button
              key="back-desktop-detail"
              onClick={e => {
                if (typeof onBack === 'function') {
                  onBack();
                } else if (isDetailView) {
                  goBackFromDetail();
                } else if (isCoffeeView) {
                  goBackFromCoffee();
                } else {
                  goHome();
                }
              }}
              style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }}
            >
              <span style={{display:'flex',alignItems:'center'}}>&larr;</span>
              {getTranslation('ui.navigation.back', 'Volver')}
            </button>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {/* Selector de idioma (LanguageSelector) siempre visible en desktop */}
          <LanguageSelector variant="desktop" sx={{}} />
          {/* Botón ThemeToggle a la derecha del selector de idioma */}
          <ThemeToggle />
          {/* Icono quienes somos (about) como imagen suelta a la izquierda del botón donación */}
          <img
            src="https://raw.githubusercontent.com/t3rm1nus/masterpiece/main/public/imagenes/icono.png"
            alt={getTranslation('ui.alt.info', 'info')}
            title={getTranslation('ui.titles.show_info', lang === 'en' ? 'Show info' : 'Mostrar información')}
            onClick={onSplashOpen}
            style={{
              width: '36px',
              height: '36px',
              marginLeft: '8px',
              marginRight: '8px', // Espacio a la derecha para separar del botón donación
              cursor: 'pointer',
              verticalAlign: 'middle',
              display: 'inline-block',
              borderRadius: '6px'
            }}
          />
          {/* Botón donación (Invítame a un café) a la derecha del icono info */}
          {menuItems.filter(item => item.show && item.special).map((item, idx) => (
            renderMenuItem
              ? renderMenuItem(item, idx)
              : <button key={idx} className="donation-btn" onClick={item.action} style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {item.icon}
                  {item.label}
                </button>
          ))}
          {/* Splash Dialog Desktop */}
          <SplashDialog
            open={splashOpen}
            onClose={onSplashClose}
            audio={splashAudio}
            dark={true}
            sx={{
              paper: { borderRadius: 18, background: 'rgba(34,34,34,0.92)', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', overflow: 'hidden', padding: 0, margin: 0, maxWidth: '100vw', maxHeight: '100vh' },
              content: { p: 0, m: 0, width: '100vw', height: '100vh', maxWidth: '100vw', maxHeight: '100vh', overflow: 'hidden', background: 'transparent' }
            }}
            audioRef={audioRef}
          />
        </div>
      </div>
    </nav>
  );
}

// Componente híbrido que decide qué menú mostrar
const HybridMenu = ({
  renderMenuItem,
  menuItems,
  onMenuOpen,
  onMenuClose,
  sx = {},
  onSplashOpen,
  splashAudio,
  splashOpen,
  onSplashClose,
  audioRef,
  onBack // <-- AGREGADO para evitar ReferenceError
} = {}) => {
  const { lang } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  // [HybridMenu] RENDER GLOBAL - ESTE ES EL MENU QUE SE EJECUTA (onBack eliminado del log para evitar error de referencia)

  if (isMobile) {
    // Pasar los props de splash también en móvil
    return <MaterialMobileMenu 
      key={lang} 
      renderMenuItem={renderMenuItem} 
      menuItems={menuItems} 
      onMenuOpen={onMenuOpen} 
      onMenuClose={onMenuClose} 
      sx={sx}
      onSplashOpen={onSplashOpen}
      splashAudio={splashAudio}
      splashOpen={splashOpen}
      onSplashClose={onSplashClose}
      audioRef={audioRef}
    />;
  } else {
    return <DesktopMenu renderMenuItem={renderMenuItem} menuItems={menuItems} sx={sx} onSplashOpen={onSplashOpen} splashAudio={splashAudio} splashOpen={splashOpen} onSplashClose={onSplashClose} audioRef={audioRef} onBack={onBack} />;
  }
};

export default HybridMenu;
