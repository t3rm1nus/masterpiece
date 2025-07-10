// =============================================
// useMenuItems: Hook para generar dinámicamente los items del menú
// Genera los items del menú según idioma, contexto y vista actual, optimizando la navegación y la experiencia de usuario en móvil y desktop.
// =============================================
import { useLanguage } from '../LanguageContext';
import { useAppView, useAppData } from '../store/useAppStore';
import useAppStore from '../store/useAppStore';
import { useCallback } from 'react';
import { Home as HomeIcon, Coffee as CoffeeIcon } from '@mui/icons-material';
import React from 'react';

export function useMenuItems(handleSplashOpen, navigate) {
  const { t, lang, getTranslation } = useLanguage();
  const { resetAllFilters, generateNewRecommendations } = useAppData();
  const { goToCoffee, goToHowToDownload } = useAppView();

  // Audios disponibles para el splash (igual que en MaterialMobileMenu)
  const splashAudios = [
    "/sonidos/samurai.mp3",
    "/sonidos/samurai.wav",
    "/sonidos/samurai1.mp3",
    "/sonidos/samurai2.mp3",
    "/sonidos/samurai3.mp3",
    "/sonidos/samurai4.mp3"
  ];
  // Estado para controlar los audios pendientes (no repetir hasta que suenen todos)
  const [pendingAudios, setPendingAudios] = React.useState([...splashAudios]);

  // Handlers de navegación usando navigate de React Router
  const handleNewRecommendations = useCallback(() => {
    resetAllFilters(lang);
    generateNewRecommendations();
    navigate('/');
  }, [resetAllFilters, generateNewRecommendations, lang, navigate]);

  const handleCoffeeNavigation = useCallback(() => {
    // Verificar si hay un detalle abierto y cerrarlo primero
    const currentState = useAppStore.getState();
    if (currentState.currentView === 'detail' && currentState.selectedItem) {
      console.log('[useMenuItems] Detalle abierto detectado, cerrando antes de navegar a donaciones');
      // Disparar evento para cerrar el detalle con animación
      window.dispatchEvent(new CustomEvent('overlay-detail-exit'));
      // Esperar a que termine la animación antes de navegar
      setTimeout(() => {
        goToCoffee();
        navigate('/donaciones');
      }, 500); // Tiempo suficiente para que termine la animación
    } else {
      // No hay detalle abierto, navegar directamente
      goToCoffee();
      navigate('/donaciones');
    }
  }, [goToCoffee, navigate]);

  const handleHowToDownload = useCallback(() => {
    // Verificar si hay un detalle abierto y cerrarlo primero
    const currentState = useAppStore.getState();
    if (currentState.currentView === 'detail' && currentState.selectedItem) {
      console.log('[useMenuItems] Detalle abierto detectado, cerrando antes de navegar a descargas');
      // Disparar evento para cerrar el detalle con animación
      window.dispatchEvent(new CustomEvent('overlay-detail-exit'));
      // Esperar a que termine la animación antes de navegar
      setTimeout(() => {
        goToHowToDownload();
        navigate('/como-descargar');
      }, 500); // Tiempo suficiente para que termine la animación
    } else {
      // No hay detalle abierto, navegar directamente
      goToHowToDownload();
      navigate('/como-descargar');
    }
  }, [goToHowToDownload, navigate]);

  // Splash handler: lo debe pasar el componente como prop si se quiere usar

  let menu = [
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
      special: true
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
      special: false
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
      action: () => {
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
      },
      show: true,
      special: false
    }
  ];

  // Reordenar menú SOLO en móvil: '¿Quiénes somos?' antes que 'Invítame a un café'
  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    const aboutIdx = menu.findIndex(item => item.label === getTranslation('ui.navigation.about'));
    const coffeeIdx = menu.findIndex(item => item.label === getTranslation('ui.navigation.buy_me_coffee'));
    if (aboutIdx !== -1 && coffeeIdx !== -1 && coffeeIdx < aboutIdx) {
      const [coffee] = menu.splice(coffeeIdx, 1);
      menu.splice(aboutIdx + 1, 0, coffee);
    }
  }
  return menu;
}
