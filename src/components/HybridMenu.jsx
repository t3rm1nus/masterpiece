import React from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { useLanguage } from '../LanguageContext';
import { useAppData, useAppView } from '../store/useAppStore';
import ThemeToggle from './ThemeToggle';
import MaterialMobileMenu from './MaterialMobileMenu';

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
  const { currentView, goBackFromDetail, goBackFromCoffee, goHome, goToCoffee } = useAppView();  
  const handleNewRecommendations = () => {
    console.log('Botón "Nuevas recomendaciones" clickeado');
    generateNewRecommendations();
  };
  
  const isDetailView = currentView === 'detail';
  const isCoffeeView = currentView === 'coffee';
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
        
        {/* Mostrar botón volver solo en vista de detalle */}
        {isDetailView && (
          <button 
            className="back-btn" 
            onClick={goBackFromDetail}
          >
            ← {t.back || 'Volver'}
          </button>
        )}
        
        {/* Mostrar botón volver en vista de café */}
        {isCoffeeView && (
          <button 
            className="back-btn" 
            onClick={goBackFromCoffee}
          >
            ← {t.back || 'Volver'}
          </button>
        )}
      </div>
      
      {/* Controles de la derecha: café, tema e idioma */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>        {/* Botón de donación - solo mostrar si no estamos en la página de café */}
        {!isCoffeeView && (          <button 
            className="donation-btn"
            onClick={goToCoffee}
          >
            {/* Usar emoji café bonito y literal correcto */}
            <span style={{fontSize: '1.2em', marginRight: 8}}>☕</span>
            Invitame a un café
          </button>
        )}
        
        <ThemeToggle />
        <LanguageSelector />
      </div>
      </div>
    </nav>
  );
}

// Componente híbrido que decide qué menú mostrar
const HybridMenu = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg')); // Cambiado de 'md' a 'lg' para incluir tablets
  
  if (isMobile) {
    return <MaterialMobileMenu />;
  } else {
    return <DesktopMenu />;
  }
};

export default HybridMenu;
