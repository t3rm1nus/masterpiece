import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import useDataStore from '../store/dataStore';
import useThemeStore from '../store/themeStore';
import useViewStore from '../store/viewStore';
import { useTitleSync } from '../hooks/useTitleSync';
import MaterialContentWrapper from './MaterialContentWrapper';
import RecommendationsList from './RecommendationsList';
import ThemeToggle from './ThemeToggle';
import '../styles/components/buttons.css';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ItemDetail from './ItemDetail';
import MaterialItemDetail from './MaterialItemDetail';

const HomePage = () => {
  const { lang, t } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // Hook para sincronizar títulos automáticamente
  useTitleSync();
  
  // Stores consolidados
  const { 
    selectedCategory, 
    setSelectedCategory,
    activeSubcategory,
    setActiveSubcategory,
    getSubcategoriesForCategory,
    getCategories,
    filteredItems,
    toggleSpanishCinema,
    toggleMasterpiece,
    setPodcastLanguage,
    setDocumentaryLanguage,
    isSpanishCinemaActive,
    isMasterpieceActive,
    podcastLanguage,
    documentaryLanguage,
    title,
    initializeFilteredItems,
    updateFilteredItems,
    setActiveLanguage,
    activeLanguage,
    availableLanguages,
    allData,
    initializeData  } = useDataStore();
  
  // Obtener configuración de estilos del store consolidado
  const { getSpecialButtonLabel } = useThemeStore();
  
  // Obtener funciones de procesamiento del store de vista
  const { processTitle } = useViewStore();
  // Obtener categorías traducidas
  const categories = getCategories(lang);
  
  // Obtener subcategorías del store para la categoría seleccionada
  const categorySubcategories = getSubcategoriesForCategory();
  
  const [isRecommendedActive, setIsRecommendedActive] = useState(false);

  // Estado local para el elemento seleccionado
  const [selectedItem, setSelectedItem] = useState(null);

  // Efecto para inicializar los datos
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Efecto para inicializar los datos filtrados
  useEffect(() => {
    if (allData && Object.keys(allData).length > 0) {
      initializeFilteredItems();
    }
  }, [allData, initializeFilteredItems]);

  // Efecto para actualizar los items filtrados cuando cambian los filtros
  useEffect(() => {
    if (selectedCategory) {
      updateFilteredItems();
    }
  }, [selectedCategory, activeSubcategory, activeLanguage, updateFilteredItems]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setActiveSubcategory(null);
    setActiveLanguage('all');
    setSelectedItem(null);
  };

  // Manejar clic en elemento
  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  // Manejar cierre del detalle
  const handleCloseDetail = () => {
    setSelectedItem(null);
  };

  // Renderizar el detalle del elemento
  const renderItemDetail = () => {
    if (!selectedItem) return null;

    if (isMobile) {
      return (
        <MaterialItemDetail
          item={selectedItem}
          onClose={handleCloseDetail}
          selectedCategory={selectedCategory}
        />
      );
    }

    return (
      <ItemDetail
        item={selectedItem}
        onClose={handleCloseDetail}
        selectedCategory={selectedCategory}
      />
    );
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

  // Verificar si hay datos disponibles
  if (!allData || Object.keys(allData).length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{t.ui.loading}</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="header-controls">
        <ThemeToggle />
      </div>      <div className="categories-container">
        <div className="categories-list">
          {Array.isArray(categories) && categories.map((category) => (
            <button
              key={category.key}
              className={`category-btn${selectedCategory === category.key ? ' active' : ''}`}
              onClick={() => handleCategoryClick(category.key)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>      {selectedCategory && (
        <div className="subcategories-container">
          {Array.isArray(categorySubcategories) && categorySubcategories.length > 0 ? (
            categorySubcategories
              .sort((a, b) => a.order - b.order)
              .map(({ sub }) => (
                <button
                  key={sub}
                  className={`subcategory-btn${activeSubcategory === sub ? ' active' : ''}`}
                  onClick={() => setActiveSubcategory(sub)}
                >
                  {t.subcategories[selectedCategory]?.[sub] || sub}
                </button>
              ))
          ) : (
            <div className="no-subcategories">
              {t.ui.noSubcategories}
            </div>
          )}
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

        {selectedCategory === 'documentales' && (
          <div className="language-filters">
            <button
              className={`language-btn${activeLanguage === 'all' ? ' active' : ''}`}
              onClick={() => setActiveLanguage('all')}
            >
              {t.filters.languages.all}
            </button>            {Array.isArray(availableLanguages) && availableLanguages.map(language => (
              <button
                key={language}
                className={`language-btn${activeLanguage === language ? ' active' : ''}`}
                onClick={() => setActiveLanguage(language)}
              >
                {t.filters.languages[language] || language}
              </button>
            ))}
          </div>
        )}

        {!isRecommendedActive && selectedCategory && (
          <button
            className={`subcategory-btn masterpiece-btn${isMasterpieceActive ? ' active' : ''}`}
            onClick={toggleMasterpiece}
          >
            {lang === 'es' ? 'Obras Maestras' : 'Masterpieces'}
          </button>
        )}
      </div>

      {title && (
        <h1 
          className={selectedCategory ? 'after-subcategories' : ''}
          style={{ textTransform: 'capitalize' }}
        >
          {title}
        </h1>
      )}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <RecommendationsList 
          recommendations={filteredItems} 
          isHome={!selectedCategory}
        />
      </div>      <div className="items-grid">
        {Array.isArray(filteredItems) && filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div
              key={item.id}
              className="item-card"
              onClick={() => handleItemClick(item)}
            >
              <h3>{processTitle(item.title, lang)}</h3>
              {item.subcategory && (
                <span className="item-subcategory">
                  {t.subcategories[selectedCategory]?.[item.subcategory] || item.subcategory}
                </span>
              )}
            </div>
          ))
        ) : (
          <div className="no-items">
            {t.ui?.noResults || t.ui?.no_results || 'No se encontraron resultados'}
          </div>
        )}
      </div>

      {renderItemDetail()}

      <div className="coffee-section">
        <h2>{t.coffee.title}</h2>
        <p>{t.coffee.description}</p>
        <a 
          href="https://www.buymeacoffee.com/masterpiece" 
          target="_blank" 
          rel="noopener noreferrer"
          className="coffee-button"
        >
          {t.coffee.button}
        </a>
      </div>
    </div>
  );
};

export default HomePage;
