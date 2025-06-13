// Eliminar imports innecesarios ya que están en los stores
import { LanguageProvider, useLanguage } from "./LanguageContext";
import './App.css'
import { useState, useEffect } from "react";
import React from "react";
import { normalizeSubcategory, filterItemsBySubcategory, getUniqueSubcategories, normalizeSubcategoryInternal } from './utils/categoryUtils';
import useFiltersStore from './store/filtersStore';
import useUIStore from './store/uiStore';
import useAppDataStore from './store/appDataStore';
import useStylesStore from './store/stylesStore';
import useRenderStore from './store/renderStore';
import ErrorDisplay from './components/ErrorDisplay';
import { getDefaultTitle, isMobileDevice, generateRecommendationKey, getRandomNotFoundImage } from './utils/appUtils';
import ThemeToggle from './components/ThemeToggle';
import { useTitleSync } from './hooks/useTitleSync';

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

function Menu() {
  const { t, lang } = useLanguage();
  const { resetAllFilters } = useFiltersStore();
  const { currentView, goBackFromDetail, navigate } = useUIStore();
  
  const handleNewRecommendations = () => {
    resetAllFilters(lang);
    navigate('home'); // Asegurar que navegamos a home
  };
  
  const isDetailView = currentView === 'detail';
  
  return (
    <nav className="main-menu" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '1rem',
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      position: 'relative'
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
      </div>
        {/* Selector de idioma - siempre a la derecha */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <ThemeToggle />
        <LanguageSelector />
      </div>
    </nav>
  );
}

function RecommendationsList({ recommendations, isHome }) {
  const { lang, t, getCategoryTranslation, getSubcategoryTranslation } = useLanguage();
  const { isMobile, navigateToDetail } = useUIStore();
  
  // Obtener la imagen not found del store
  const { randomNotFoundImage } = useFiltersStore();
  
  // Obtener funciones de renderizado del store
  const { 
    processTitle, 
    processDescription, 
    getRecommendationCardClasses,
    noResultsConfig,
    mobileHomeStyles,
    desktopStyles
  } = useRenderStore();
  
  // Obtener configuración de estilos
  const { getMasterpieceBadgeConfig } = useStylesStore();
  const badgeConfig = getMasterpieceBadgeConfig();
  
  // Handler para hacer clic en un item
  const handleItemClick = (item) => {
    navigateToDetail(item);
  };
  
  return (
    <div className="recommendations-list" style={{ width: '100%', paddingTop: '2rem' }}>
      {recommendations.length === 0 ? (
        <div className="no-results-container" style={noResultsConfig.containerStyle}>
          <h3 className="no-results-title">
            {t.no_results}
          </h3>
          <p className="no-results-message">
            {t.try_different_filters}
          </p>
          <div style={noResultsConfig.imageContainerStyle}>
            <div className="no-results-image-container">
              <img 
                src={randomNotFoundImage}
                alt={t.no_results} 
                className="no-results-image"
              />
            </div>
          </div>
        </div>
      ) : (        recommendations.map((rec, idx) => {
          const title = processTitle(rec.title, lang);
          const description = processDescription(rec.description, lang);
          // Usar globalId si está disponible, sino usar la función de fallback
          const recKey = rec.globalId || generateRecommendationKey(rec, idx);
          const cardClasses = getRecommendationCardClasses(rec, isHome, isMobile);
            if (isHome && isMobile) {
            return (
              <div
                className={cardClasses}
                key={recKey}
                style={{...mobileHomeStyles.cardStyle, cursor: 'pointer'}}
                onClick={() => handleItemClick(rec)}
              >
                {/* Fila superior: solo el nombre, centrado */}
                <div className="rec-home-row rec-home-row-top">
                  <span className="rec-home-title">{title}</span>
                </div>
                {/* Fila inferior: imagen, debajo género y subgénero, y a la derecha la descripción */}
                <div className="rec-home-row rec-home-row-bottom">
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',minWidth:0}}>
                    <img 
                      src={rec.image} 
                      alt={title} 
                      width={80} 
                      height={110} 
                      style={mobileHomeStyles.imageStyle} 
                    />
                    <div className="rec-home-cats" style={mobileHomeStyles.categoryContainer}>
                      <span className="rec-home-cat" style={mobileHomeStyles.categoryStyle}>
                        {getCategoryTranslation(rec.category)}
                      </span>
                      <span className="rec-home-subcat" style={mobileHomeStyles.subcategoryStyle}>
                        {getSubcategoryTranslation(rec.subcategory)}
                      </span>
                    </div>
                  </div>
                  <div className="rec-home-info">
                    <p className="rec-home-desc">{description}</p>
                  </div>
                </div>
                {rec.masterpiece && (
                  <span className="masterpiece-badge" title="Obra maestra">
                    <svg 
                      width={badgeConfig.svg.width} 
                      height={badgeConfig.svg.height} 
                      viewBox={badgeConfig.svg.viewBox} 
                      fill={badgeConfig.svg.fill} 
                      xmlns={badgeConfig.svg.xmlns}
                    >
                      <circle 
                        cx={badgeConfig.circle.cx} 
                        cy={badgeConfig.circle.cy} 
                        r={badgeConfig.circle.r} 
                        fill={badgeConfig.circle.fill}
                      />
                      <text 
                        x={badgeConfig.text.x} 
                        y={badgeConfig.text.y} 
                        textAnchor={badgeConfig.text.textAnchor} 
                        fontSize={badgeConfig.text.fontSize} 
                        fontWeight={badgeConfig.text.fontWeight} 
                        fill={badgeConfig.text.fill}
                      >
                        {badgeConfig.text.content}
                      </text>
                    </svg>
                  </span>
                )}
              </div>
            );
          }
          
          // Layout normal para desktop/tablet o fuera de home
          return (
            <div
              className={cardClasses}
              key={recKey}
              style={desktopStyles.cardStyle}
              onClick={() => handleItemClick(rec)} // Agregar handler de clic
            >
              {rec.masterpiece && (
                <span className="masterpiece-badge" title="Obra maestra">
                  <svg 
                    width={badgeConfig.svg.width} 
                    height={badgeConfig.svg.height} 
                    viewBox={badgeConfig.svg.viewBox} 
                    fill={badgeConfig.svg.fill} 
                    xmlns={badgeConfig.svg.xmlns}
                  >
                    <circle 
                      cx={badgeConfig.circle.cx} 
                      cy={badgeConfig.circle.cy} 
                      r={badgeConfig.circle.r} 
                      fill={badgeConfig.circle.fill}
                    />
                    <text 
                      x={badgeConfig.text.x} 
                      y={badgeConfig.text.y} 
                      textAnchor={badgeConfig.text.textAnchor} 
                      fontSize={badgeConfig.text.fontSize} 
                      fontWeight={badgeConfig.text.fontWeight} 
                      fill={badgeConfig.text.fill}
                    >
                      {badgeConfig.text.content}
                    </text>
                  </svg>
                </span>
              )}
              <img 
                src={rec.image} 
                alt={title} 
                width={120} 
                height={170} 
                style={desktopStyles.imageStyle} 
              />
              <div style={desktopStyles.categoryContainer}>
                <span style={desktopStyles.categoryStyle}>
                  {getCategoryTranslation(rec.category)}
                </span>
                <span style={desktopStyles.subcategoryStyle}>
                  {getSubcategoryTranslation(rec.subcategory)}
                </span>
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          );
        })
      )}
    </div>
  );
}

function HomePage({ onCategory }) {
  const { lang, t, getSubcategoryTranslation } = useLanguage();
  
  // Hook para sincronizar títulos automáticamente
  useTitleSync();
  
  // Importar stores
  const { 
    selectedCategory, 
    activeSubcategory, 
    isSpanishCinemaActive, 
    isMasterpieceActive, 
    title,
    filteredItems,
    setSelectedCategory,
    setActiveSubcategory,
    toggleSpanishCinema,
    toggleMasterpiece,
    setTitle,    
    getSubcategoriesForCategory
  } = useFiltersStore();
    // Obtener categorías del store de datos de app
  const { getCategories } = useAppDataStore();
  const categories = getCategories(lang);
  
  // Obtener configuración de estilos del store
  const { getSpecialButtonLabel, containerStyles } = useStylesStore();
    // Obtener subcategorías del store para la categoría seleccionada
  const categorySubcategories = getSubcategoriesForCategory();
    const resetCategory = () => {
    useFiltersStore.getState().resetCategory();
  };
  
  const handleCategoryClick = (key, label) => {
    // Usar la etiqueta traducida según el idioma actual
    const translatedLabel = categories.find(cat => cat.key === key)?.label || label;
    // En lugar de usar el hook, usamos getState().acción para evitar re-renderizados
    useFiltersStore.getState().setSelectedCategory(key, translatedLabel);
  };
  return (
    <>
      <div className="categories-list" style={containerStyles.categoriesList}>
        {categories.map(({ key, label }) => (
          <button
            key={key}
            className="category-btn"
            style={{ display: 'inline-block' }}
            onClick={() => handleCategoryClick(key, label)}
          >
            {label}
          </button>
        ))}
      </div>
      
      {selectedCategory && (
        <>
          <div className="subcategories-list" style={containerStyles.subcategoriesList}>
            {categorySubcategories.map(({ sub }) => (
              <button
                key={sub}
                className={`subcategory-btn${activeSubcategory === sub ? ' active' : ''}`}
                style={{ display: 'inline-block', margin: '0.5rem' }}
                onClick={() => setActiveSubcategory(sub)}
              >
                {getSubcategoryTranslation(sub)}
              </button>
            ))}
          </div>

          <div style={containerStyles.specialButtonsContainer}>
            {/* Mostrar botón de Cine Español solo en la categoría de películas */}
            {selectedCategory === 'movies' && (
              <button
                className={`subcategory-btn spanish-cinema${isSpanishCinemaActive ? ' active' : ''}`}              
                onClick={() => {
                  toggleSpanishCinema();
                  console.log('Toggling Spanish Cinema:', !isSpanishCinemaActive);
                }}
              >
                {getSpecialButtonLabel('spanishCinema', lang)}
              </button>
            )}
            <button
              className={`subcategory-btn masterpiece-btn${isMasterpieceActive ? ' active' : ''}`}              
              onClick={() => {
                toggleMasterpiece();
              }}
            >
              {getSpecialButtonLabel('masterpiece', lang)}
            </button>
          </div>
        </>
      )}
      
      <h1>{title}</h1>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <RecommendationsList
          recommendations={filteredItems}
          isHome={!selectedCategory && !activeSubcategory}
        />
      </div>
    </>
  );
}



function MobileMenuBar() {
  // Utilizamos directamente la acción del store
  const { openMobileMenu } = useUIStore();
  
  return (
    <div className="mobile-menu-bar">
      <button aria-label="Abrir menú" onClick={openMobileMenu} style={{background:'none',border:'none',fontSize:'2rem',color:'#0078d4',cursor:'pointer',padding:0}}>
        <span style={{fontWeight:'bold'}}>&#9776;</span>
      </button>
      <span style={{fontWeight:'bold',fontSize:'1.1rem'}}>Masterpiece</span>
      <span></span>
    </div>
  );
}

function MobileMenu() {
  const { t, lang } = useLanguage();
  const { mobileMenuOpen, closeMobileMenu, navigate, currentView, goBackFromDetail } = useUIStore();
  const { resetAllFilters } = useFiltersStore();
  
  const handleNewRecommendations = () => {
    resetAllFilters(lang);
    navigate('home'); // Asegurar que navegamos a home
    closeMobileMenu();
  };
  
  const isDetailView = currentView === 'detail';
  
  if (!mobileMenuOpen) return null;
  
  // Componente simplificado y reescrito para evitar duplicaciones
  return (
    <div className="mobile-menu-overlay" onClick={closeMobileMenu}>
      <nav className="mobile-menu" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={closeMobileMenu} aria-label="Cerrar menú">&times;</button>
        
        {/* Botón de volver - solo visible en vista de detalle */}
        {isDetailView && (
          <button className="category-btn" onClick={() => {goBackFromDetail(); closeMobileMenu();}}>
            ← {t.back || 'Volver'}
          </button>
        )}
        
        {/* Botón de inicio */}        <button onClick={() => {navigate('home'); closeMobileMenu();}}>
          {t.categories ? t.categoriesTitle : (t.home_title || 'Inicio')}
        </button>
          {/* Botón de nuevas recomendaciones */}
        <button onClick={handleNewRecommendations}>
          {t.home_title}
        </button>
        
        {/* Selector de tema */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5rem 0' }}>
          <ThemeToggle />
        </div>
        
        {/* Selector de idioma */}
        <LanguageSelector />
      </nav>
    </div>
  );
}

function AppContent() {  
  const { lang } = useLanguage();
  
  // Usando el store de UI para toda la gestión de UI
  const { 
    isMobile: isMobileUI, 
    mobileMenuOpen, 
    setMobile, 
    openMobileMenu, 
    closeMobileMenu,
    currentView,
    navigate,
    lastCategory
  } = useUIStore();
  let content;
  switch (currentView) {
    case 'home':
      content = <HomePage />;
      break;
    case 'detail':
      content = <ItemDetail />;
      break;
    default:
      content = <div>Página no encontrada</div>;
  }
  // Usando useEffect para detectar cambios de tamaño y actualizar el estado en el store de UI
  useEffect(() => {
    const checkMobile = () => setMobile(isMobileDevice(window.innerWidth));
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setMobile]);return (
    <div className="container" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>      {isMobileUI ? (
        <>
          <MobileMenuBar />
          <MobileMenu />
        </>
      ) : (
        <Menu />
      )}
      {content}
    </div>
  );
}

function ItemDetail() {
  const { lang, t, getCategoryTranslation, getSubcategoryTranslation } = useLanguage();
  const { selectedItem, goBackFromDetail } = useUIStore();
  const { processTitle, processDescription } = useRenderStore();
  const { getMasterpieceBadgeConfig } = useStylesStore();
  
  if (!selectedItem) return null;
  
  const title = processTitle(selectedItem.title, lang);
  const description = processDescription(selectedItem.description, lang);
  const badgeConfig = getMasterpieceBadgeConfig();
  
  // Determinar qué trailer mostrar según el idioma
  const getTrailerUrl = () => {
    if (!selectedItem.trailer) return null;
    
    // Priorizar el idioma actual, si no existe usar el disponible
    if (lang === 'es' && selectedItem.trailer.es) {
      return selectedItem.trailer.es;
    } else if (lang === 'en' && selectedItem.trailer.en) {
      return selectedItem.trailer.en;
    } else if (selectedItem.trailer.es) {
      return selectedItem.trailer.es;
    } else if (selectedItem.trailer.en) {
      return selectedItem.trailer.en;
    }
    return null;
  };
  
  const trailerUrl = getTrailerUrl();
    return (
    <div className="item-detail-container" style={{ 
      width: '100%', 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '2rem',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div className={`item-detail ${selectedItem.category}${selectedItem.masterpiece ? ' masterpiece' : ''}`}>
        {selectedItem.masterpiece && (
          <span className="masterpiece-badge" title="Obra maestra">
            <svg 
              width={badgeConfig.svg.width} 
              height={badgeConfig.svg.height} 
              viewBox={badgeConfig.svg.viewBox} 
              fill={badgeConfig.svg.fill} 
              xmlns={badgeConfig.svg.xmlns}
            >
              <circle 
                cx={badgeConfig.circle.cx} 
                cy={badgeConfig.circle.cy} 
                r={badgeConfig.circle.r} 
                fill={badgeConfig.circle.fill}
              />
              <text 
                x={badgeConfig.text.x} 
                y={badgeConfig.text.y} 
                textAnchor={badgeConfig.text.textAnchor} 
                fontSize={badgeConfig.text.fontSize} 
                fontWeight={badgeConfig.text.fontWeight} 
                fill={badgeConfig.text.fill}
              >
                {badgeConfig.text.content}
              </text>
            </svg>
          </span>
        )}
        
        <img 
          src={selectedItem.image} 
          alt={title}
          style={{
            maxWidth: '300px',
            width: '100%',
            height: 'auto',
            borderRadius: '12px',
            marginBottom: '1.5rem'
          }}
        />
        
        <h2 style={{ marginBottom: '1rem', fontSize: '2rem' }}>{title}</h2>
        
        <div style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#666' }}>
          <span style={{ fontWeight: 'bold' }}>
            {getCategoryTranslation(selectedItem.category)}
          </span>
          {selectedItem.subcategory && (
            <span> - {getSubcategoryTranslation(selectedItem.subcategory)}</span>
          )}
        </div>
        
        {selectedItem.director && (
          <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
            <strong>{t.director || 'Director'}:</strong> {selectedItem.director}
          </p>
        )}
        
        {selectedItem.year && (
          <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
            <strong>{t.year || 'Año'}:</strong> {selectedItem.year}
          </p>
        )}
          <p style={{ 
          fontSize: '1.2rem', 
          lineHeight: '1.6', 
          marginBottom: '2rem',
          textAlign: 'left',
          maxWidth: '600px',
          margin: '0 auto 2rem auto'
        }}>
          {description}
        </p>
        
        {trailerUrl && (
          <div style={{ marginTop: '2rem' }}>
            <a 
              href={trailerUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="trailer-link"
              style={{
                display: 'inline-block',
                padding: '0.8rem 1.5rem',
                background: '#0078d4',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                transition: 'background 0.2s'
              }}
            >
              {t.watch_trailer || 'Ver Trailer'}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <div className="App" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
        <AppContent />
        <ErrorDisplay />
      </div>
    </LanguageProvider>
  );
}
