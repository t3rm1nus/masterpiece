// Hook para obtener los items del menú según idioma y contexto
import { useLanguage } from '../LanguageContext';
import { useAppView, useAppData } from '../store/useAppStore';
import { useCallback } from 'react';
import { Home as HomeIcon, Coffee as CoffeeIcon } from '@mui/icons-material';
import React from 'react';

export function useMenuItems(handleSplashOpen) {
  const { t, lang, getTranslation } = useLanguage();
  const { currentView, goBackFromDetail, goBackFromCoffee, goHome, goToCoffee, goToHowToDownload } = useAppView();
  const { resetAllFilters, generateNewRecommendations } = useAppData();

  // Handlers igual que en el componente original
  const handleNewRecommendations = useCallback(() => {
    console.log('Botón "Nuevas Recomendaciones" clickeado');
    resetAllFilters(lang);
    generateNewRecommendations();
    goHome();
  }, [resetAllFilters, generateNewRecommendations, lang, goHome]);

  const handleCoffeeNavigation = useCallback(() => {
    goToCoffee();
  }, [goToCoffee]);

  const handleGoBack = useCallback(() => {
    if (currentView === 'detail') {
      goBackFromDetail();
    } else if (currentView === 'coffee') {
      goBackFromCoffee();
    } else if (currentView === 'howToDownload') {
      goHome();
    }
  }, [currentView, goBackFromDetail, goBackFromCoffee, goHome]);

  const handleHowToDownload = useCallback(() => {
    goToHowToDownload();
  }, [goToHowToDownload]);

  // Splash handler: lo debe pasar el componente como prop si se quiere usar

  const isDetailView = currentView === 'detail';
  const isCoffeeView = currentView === 'coffee';
  const isHowToDownloadView = currentView === 'howToDownload';
  const showBackButton = isDetailView || isCoffeeView || isHowToDownloadView;

  // SVGs deben ir envueltos en un solo elemento React.Fragment
  let menu = [
    {
      label: getTranslation('ui.titles.home_title', 'Nuevas Recomendaciones'), // Usar el literal correcto
      icon: <HomeIcon />,
      action: () => {
        console.log('Handler de "Nuevas Recomendaciones" ejecutado');
        handleNewRecommendations();
      },
      show: true
    },
    {
      label: getTranslation('ui.navigation.buy_me_coffee'),
      icon: <CoffeeIcon />,
      action: handleCoffeeNavigation,
      show: !isCoffeeView,
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
      show: !isHowToDownloadView, // Ocultar en la página de cómo descargar
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
      action: handleSplashOpen || null,
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
