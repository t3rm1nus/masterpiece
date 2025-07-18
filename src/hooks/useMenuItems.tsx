// =============================================
// useMenuItems: Hook para generar dinámicamente los items del menú
// Genera los items del menú según idioma, contexto y vista actual, optimizando la navegación y la experiencia de usuario en móvil y desktop.
// =============================================
import { useLanguage } from '../LanguageContext';
import { useAppView, useAppData } from '../store/useAppStore';
import useAppStore from '../store/useAppStore';
import { useCallback, useMemo, useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import CoffeeIcon from '@mui/icons-material/Coffee';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect';
import { getLocalizedPath } from '../utils/urlHelpers';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  action: () => void;
  show: boolean;
  special?: boolean;
  path?: string; // NUEVO: ruta asociada para navegación robusta
}

interface UseMenuItemsProps {
  handleSplashOpen?: (audio?: string) => void;
  onOverlayNavigate?: (path: string) => void;
}

export function useMenuItems(handleSplashOpen?: (audio?: string) => void, onOverlayNavigate?: (path: string) => void): MenuItem[] {
  const { t, lang, getTranslation } = useLanguage();
  const { resetAllFilters, generateNewRecommendations } = useAppData();
  const navigate = useNavigate();

  // Audios disponibles para el splash (igual que en MaterialMobileMenu)
  const splashAudios = useMemo(() => [
    "/sonidos/samurai.mp3",
    "/sonidos/samurai.wav",
    "/sonidos/samurai1.mp3",
    "/sonidos/samurai2.mp3",
    "/sonidos/samurai3.mp3",
    "/sonidos/samurai4.mp3"
  ], []);
  
  // Estado para controlar los audios pendientes (no repetir hasta que suenen todos)
  const [pendingAudios, setPendingAudios] = useState<string[]>([...splashAudios]);

  // Estado para controlar si es móvil (SSR-safe)
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useIsomorphicLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 1024);
    }
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 1024);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handlers de navegación usando callback del HomeLayout
  const handleNewRecommendations = useCallback(() => {
    resetAllFilters(lang);
    generateNewRecommendations();
    if (onOverlayNavigate) {
      onOverlayNavigate(getLocalizedPath('/', lang));
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else {
      navigate(getLocalizedPath('/', lang));
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [resetAllFilters, generateNewRecommendations, lang, onOverlayNavigate, navigate]);

  const handleCoffeeNavigation = useCallback(() => {
    if (onOverlayNavigate) {
      onOverlayNavigate(getLocalizedPath('/donaciones', lang));
    }
  }, [onOverlayNavigate, lang]);

  const handleHowToDownload = useCallback(() => {
    if (onOverlayNavigate) {
      onOverlayNavigate(getLocalizedPath('/como-descargar', lang));
    }
  }, [onOverlayNavigate, lang]);

  const handleAbout = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024 && handleSplashOpen) {
      let audiosToUse = pendingAudios.length > 0 ? pendingAudios : [...splashAudios];
      const randomIdx = Math.floor(Math.random() * audiosToUse.length);
      const randomAudio = audiosToUse[randomIdx];
      handleSplashOpen(randomAudio);
      // Eliminar el audio elegido de los pendientes
      const newPending = audiosToUse.filter((a, i) => i !== randomIdx);
      setPendingAudios(newPending);
    } else if (handleSplashOpen) {
      handleSplashOpen();
    }
  }, [handleSplashOpen, pendingAudios, splashAudios]);

  // Splash handler: lo debe pasar el componente como prop si se quiere usar

  const menu = useMemo(() => {
    let menuItems: MenuItem[] = [
      {
        label: getTranslation('ui.titles.home_title', 'Nuevas Recomendaciones'),
        icon: <HomeIcon />,
        action: handleNewRecommendations,
        show: true
      },
      {
        label: getTranslation('ui.navigation.buy_me_coffee'),
        icon: <CoffeeIcon />,
        action: handleCoffeeNavigation,
        show: true,
        special: true,
        path: getLocalizedPath('/donaciones', lang) // <-- Path multilingüe
      },
      {
        label: getTranslation('ui.navigation.how_to_download'),
        icon: (
          <React.Fragment>
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
          </React.Fragment>
        ),
        action: handleHowToDownload,
        show: true,
        special: false,
        path: getLocalizedPath('/como-descargar', lang) // <-- Path multilingüe
      },
      {
        label: getTranslation('ui.navigation.about'),
        icon: (
          <React.Fragment>
            <span style={{display:'flex',alignItems:'center'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                <polygon points="12,2 15,9 22,9.5 17,14.5 18.5,22 12,18 5.5,22 7,14.5 2,9.5 9,9" />
              </svg>
            </span>
          </React.Fragment>
        ),
        action: handleAbout,
        show: true,
        special: false
      }
    ];

    // Reordenar menú SOLO en móvil: '¿Quiénes somos?' antes que 'Invítame a un café'
    if (isMobile) {
      const aboutIdx = menuItems.findIndex(item => item.label === getTranslation('ui.navigation.about'));
      const coffeeIdx = menuItems.findIndex(item => item.label === getTranslation('ui.navigation.buy_me_coffee'));
      if (aboutIdx !== -1 && coffeeIdx !== -1 && coffeeIdx < aboutIdx) {
        const [coffee] = menuItems.splice(coffeeIdx, 1);
        menuItems.splice(aboutIdx + 1, 0, coffee);
      }
    }
    
    return menuItems;
  }, [getTranslation, handleNewRecommendations, handleCoffeeNavigation, handleHowToDownload, handleAbout, isMobile, lang]);

  return menu;
} 