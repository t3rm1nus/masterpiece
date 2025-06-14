import React from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { useLanguage } from '../LanguageContext';
import useDataStore from '../store/dataStore';
import useViewStore from '../store/viewStore';
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
  const { t, lang } = useLanguage();
  const { resetAllFilters } = useDataStore();
  const { currentView, goBackFromDetail, goBackFromCoffee, navigate, navigateToCoffee } = useViewStore();
  
  const handleNewRecommendations = () => {
    resetAllFilters(lang);
    navigate('home');
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
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Botón de inicio a la izquierda que resetea todos los filtros */}
        <button 
          onClick={handleNewRecommendations} 
          style={{ fontWeight: 'bold' }}
        >
          {t.home_title}
        </button>
        {/* Mostrar botón volver solo en vista de detalle */}
        {isDetailView && (
          <button 
            className="category-btn" 
            onClick={goBackFromDetail}
            style={{ 
              background: 'var(--hover-color)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-color)',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            ← {t.back || 'Volver'}
          </button>
        )}
        {/* Mostrar botón volver en vista de café */}
        {isCoffeeView && (
          <button 
            className="category-btn" 
            onClick={goBackFromCoffee}
            style={{ 
              background: 'var(--hover-color)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-color)',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            ← {t.back || 'Volver'}
          </button>
        )}
        {/* Botón de donación - solo mostrar si no estamos en la página de café */}
        {!isCoffeeView && (
          <button 
            onClick={navigateToCoffee}
            style={{ 
              background: '#ffc439',
              color: '#333',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.background = '#ffb700'}
            onMouseOut={(e) => e.target.style.background = '#ffc439'}
          >
            ☕ {t.buy_me_coffee}
          </button>
        )}
      </div>
      {/* Selector de idioma - siempre a la derecha */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <ThemeToggle />        <LanguageSelector />
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
