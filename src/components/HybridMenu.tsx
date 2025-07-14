import React, { useCallback } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { useLanguage } from '../LanguageContext';
import { useAppData, useAppView } from '../store/useAppStore';
import MaterialMobileMenu from './MaterialMobileMenu';
import DownloadIcon from '@mui/icons-material/Download';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useMenuItems } from '../hooks/useMenuItems';
import { useNavigate, useLocation, matchPath } from 'react-router-dom';
import LanguageSelector from './ui/LanguageSelector';
import SplashDialog from './SplashDialog';

// Tipos para las props del menú
interface MenuItem {
  label: string;
  icon: React.ReactNode;
  action: () => void;
  show: boolean;
  special?: boolean;
}

interface HybridMenuProps {
  renderMenuItem?: (item: MenuItem, index: number) => React.ReactNode;
  menuItems?: MenuItem[];
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  sx?: {
    menu?: React.CSSProperties;
  };
  onSplashOpen?: (audio?: HTMLAudioElement) => void;
  splashAudio?: HTMLAudioElement | null;
  splashOpen?: boolean;
  onSplashClose?: () => void;
  audioRef?: React.RefObject<HTMLAudioElement>;
  onBack?: () => void;
  onOverlayNavigate?: (path: string) => void;
}

interface DesktopMenuProps extends HybridMenuProps {}

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
function DesktopMenu(props: DesktopMenuProps): React.JSX.Element | null {
  const {
    renderMenuItem,
    menuItems: menuItemsProp,
    sx = {},
    onSplashOpen,
    splashAudio,
    splashOpen,
    onSplashClose,
    audioRef,
    onBack,
    onOverlayNavigate
  } = props;
  const { t, lang, getTranslation } = useLanguage();
  const { resetAllFilters, generateNewRecommendations } = useAppData();
  const { currentView, goBackFromDetail, goBackFromCoffee, goHome, goToCoffee, goToHowToDownload } = useAppView();  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const navigate = useNavigate();
  const location = useLocation();
  if (isMobile) return null;

  // Detectar si estamos en detalle, donación o cómo descargar para mostrar el botón Volver en el menú superior
  const isDetailView = currentView === 'detail' || matchPath('/detalle/:id', location.pathname);
  const isCoffeeView = currentView === 'coffee' || location.pathname === '/donaciones';
  const isHowToDownloadView = currentView === 'howToDownload' || location.pathname === '/como-descargar';
  const showBackButton = false; // Ocultar completamente el botón volver del menú superior

  // --- Splash popup handlers ---
  const handleSplashOpenWithAudio = useCallback((audio?: HTMLAudioElement) => {
    if (typeof onSplashOpen === 'function') {
      onSplashOpen(audio);
    }
    if (audioRef && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setTimeout(() => {
        audioRef.current?.play && audioRef.current.play();
      }, 50);
    }
  }, [onSplashOpen, audioRef]);

  // Usar items custom si se pasan, si no usar hook por defecto
  const menuItems = Array.isArray(menuItemsProp) ? menuItemsProp : useMenuItems(onSplashOpen, onOverlayNavigate);

  return (
    <nav className="main-menu" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      zIndex: 1100,
      background: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      borderBottom: '2px solid #e0e0e0', // Borde inferior gris de 2px
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
                : <button onClick={() => {
                    const label = item.label.toLowerCase();
                    console.log('[HybridMenu] Click en botón:', label);
                    if (label.includes('descargar')) {
                      if (onOverlayNavigate) {
                        onOverlayNavigate('/como-descargar');
                      } else {
                        navigate('/como-descargar');
                      }
                    } else if (label.includes('donacion') || label.includes('café') || label.includes('cafe')) {
                      if (onOverlayNavigate) {
                        onOverlayNavigate('/donaciones');
                      } else {
                        navigate('/donaciones');
                      }
                    } else if (item.action) {
                      item.action();
                    }
                  }} style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {item.icon}
                    {item.label}
                  </button>
              }
            </React.Fragment>
          ))}

        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {/* Selector de idioma (LanguageSelector) siempre visible en desktop */}
          <LanguageSelector variant="desktop" sx={{}} />
          {/* Icono quienes somos (about) como imagen suelta a la izquierda del botón donación */}
          <img
            src="https://raw.githubusercontent.com/t3rm1nus/masterpiece/main/public/imagenes/icono.png"
            alt={getTranslation('ui.alt.info', 'info')}
            title={getTranslation('ui.titles.show_info', lang === 'en' ? 'Show info' : 'Mostrar información')}
            onClick={() => {
              console.log('[HybridMenu] Click en imagen info, onSplashOpen existe:', !!onSplashOpen);
              if (onSplashOpen) onSplashOpen();
            }}
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
              : <button key={idx} className="donation-btn" onClick={() => {
                  const label = item.label.toLowerCase();
                  console.log('[HybridMenu] Click en botón especial:', label);
                  if (label.includes('donacion') || label.includes('café') || label.includes('cafe')) {
                    if (onOverlayNavigate) {
                      onOverlayNavigate('/donaciones');
                    } else {
                      navigate('/donaciones');
                    }
                  } else if (item.action) {
                    item.action();
                  }
                }} style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {item.icon}
                  {item.label}
                </button>
          ))}
          {/* Splash Dialog Desktop */}
          {splashOpen && (
            <SplashDialog
              open={splashOpen}
              onClose={onSplashClose}
              dark={true}
              sx={{
                paper: { borderRadius: 18, background: 'rgba(34,34,34,0.92)', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', overflow: 'hidden', padding: 0, margin: 0, maxWidth: '100vw', maxHeight: '100vh' },
                content: { p: 0, m: 0, width: '100vw', height: '100vh', maxWidth: '100vw', maxHeight: '100vh', overflow: 'hidden', background: 'transparent' }
              }}
              audioRef={audioRef}
            />
          )}
        </div>
      </div>
    </nav>
  );
}

// Componente híbrido que decide qué menú mostrar
const HybridMenu: React.FC<HybridMenuProps> = ({
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
  onBack, // <-- AGREGADO para evitar ReferenceError
  onOverlayNavigate // <-- NUEVO para navegación robusta entre overlays
} = {}) => {
  const { lang } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  // [HybridMenu] RENDER GLOBAL - ESTE ES EL MENU QUE SE EJECUTA (onBack eliminado del log para evitar error de referencia)

  if (isMobile) {
    // No renderizar nada en móvil para evitar duplicados del menú móvil
    return null;
  } else {
    return <DesktopMenu renderMenuItem={renderMenuItem} menuItems={menuItems} sx={sx} onSplashOpen={onSplashOpen} splashAudio={splashAudio} splashOpen={splashOpen} onSplashClose={onSplashClose} audioRef={audioRef} onBack={onBack} onOverlayNavigate={onOverlayNavigate} />;
  }
};

export default HybridMenu; 