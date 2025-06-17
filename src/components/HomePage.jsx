import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import useDataStore from '../store/dataStore';
import useThemeStore from '../store/themeStore';
import { useTitleSync } from '../hooks/useTitleSync';
import MaterialContentWrapper from './MaterialContentWrapper';
import RecommendationsList from './RecommendationsList';
import ThemeToggle from './ThemeToggle';
import { categories } from '../data/categories';
import '../styles/components/buttons.css';

const HomePage = () => {
  const { lang, t, getSubcategoryTranslation } = useLanguage();
    // Hook para sincronizar títulos automáticamente
  useTitleSync();
  
  // Stores consolidados
  const { 
    selectedCategory, 
    setSelectedCategory, 
    selectedCategoryLabel, 
    setSelectedCategoryLabel,
    activeSubcategory,
    setActiveSubcategory,
    getSubcategoriesForCategory,
    getCategories
  } = useDataStore();
  
  // Obtener configuración de estilos del store consolidado
  const { getSpecialButtonLabel } = useThemeStore();  
  // Obtener categorías traducidas
  const categories = getCategories(lang);
  
  // Obtener subcategorías del store para la categoría seleccionada
  const categorySubcategories = getSubcategoriesForCategory();
  
  const [isSpanishCinemaActive, setIsSpanishCinemaActive] = useState(false);
  const [isMasterpieceActive, setIsMasterpieceActive] = useState(false);
  const [podcastLanguage, setPodcastLanguage] = useState('es');
  const [isRecommendedActive, setIsRecommendedActive] = useState(false);

  const handleCategoryClick = (key, label) => {
    setSelectedCategory(key);
    setSelectedCategoryLabel(label);
    setActiveSubcategory(null);
    setIsSpanishCinemaActive(false);
    setIsMasterpieceActive(false);
    setIsRecommendedActive(key === 'recommended');
  };

  // Función para obtener el color de la categoría
  const getCategoryColor = (categoryKey) => {
    switch (categoryKey) {
      case 'movies':
      case 'peliculas':
        return '#2196f3';
      case 'videogames':
      case 'videojuegos':
        return '#9c27b0';
      case 'books':
      case 'libros':
        return '#4caf50';
      case 'music':
      case 'musica':
        return '#00bcd4';
      case 'podcast':
      case 'podcasts':
        return '#8bc34a';
      case 'boardgames':
      case 'juegos de mesa':
        return '#e91e63';
      case 'comics':
        return '#ff9800';
      default:
        return '#0078d4';
    }
  };

  const getSubcategoryLabel = (subcategory) => {
    return t.subcategories[subcategory] || subcategory;
  };

  const toggleMasterpiece = () => {
    setIsMasterpieceActive(!isMasterpieceActive);
    setIsSpanishCinemaActive(false);
  };

  const toggleSpanishCinema = () => {
    setIsSpanishCinemaActive(!isSpanishCinemaActive);
    setIsMasterpieceActive(false);
  };

  return (
    <div className="home-page">
      <div className="header-controls">
        <ThemeToggle />
      </div>

      <div className="categories-container">
        <div className="categories-list">
          {categories.map(({ key, label }) => (
            <button
              key={key}
              className={`category-btn${selectedCategory === key ? ' active' : ''}`}
              onClick={() => handleCategoryClick(key, label)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {selectedCategory && (
        <div className="subcategories-container">
          {categorySubcategories.map(({ sub }) => (
            <button
              key={sub}
              className={`subcategory-btn${activeSubcategory === sub ? ' active' : ''}`}
              onClick={() => setActiveSubcategory(sub)}
            >
              {getSubcategoryLabel(sub)}
            </button>
          ))}
        </div>
      )}

      <div className="special-buttons-container">
        {selectedCategory === 'movies' && (
          <button
            className={`subcategory-btn spanish-cinema${isSpanishCinemaActive ? ' active' : ''}`}              
            onClick={toggleSpanishCinema}
          >
            {lang === 'es' ? 'Cine Español' : 'Spanish Cinema'}
          </button>
        )}

        {selectedCategory === 'podcast' && (
          <>
            <button
              className={`subcategory-btn podcast-language${podcastLanguage === 'es' ? ' active' : ''}`}              
              onClick={() => setPodcastLanguage('es')}
            >
              {lang === 'es' ? 'Español' : 'Spanish'}
            </button>
            <button
              className={`subcategory-btn podcast-language${podcastLanguage === 'en' ? ' active' : ''}`}              
              onClick={() => setPodcastLanguage('en')}
            >
              {lang === 'es' ? 'Inglés' : 'English'}
            </button>
          </>
        )}

        {!isRecommendedActive && (
          <button
            className={`subcategory-btn masterpiece-btn${isMasterpieceActive ? ' active' : ''}`}
            onClick={toggleMasterpiece}
          >
            {lang === 'es' ? 'Obras Maestras' : 'Masterpieces'}
          </button>
        )}
      </div>

      <h1 className={selectedCategory ? 'after-subcategories' : ''}>{selectedCategoryLabel}</h1>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <RecommendationsList
          recommendations={filteredItems}
          isHome={!selectedCategory && !activeSubcategory}
        />
      </div>
    </div>
  );
};

export default HomePage;
