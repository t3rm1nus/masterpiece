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
import '../styles/components/home-page.css';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ItemDetail from './ItemDetail';
import MaterialItemDetail from './MaterialItemDetail';

const HomePage = () => {
  const { lang, t, getTranslation } = useLanguage();
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
    filteredItems,    toggleSpanishCinema,
    toggleMasterpiece,
    togglePodcastLanguage,
    toggleDocumentaryLanguage,
    isSpanishCinemaActive,
    isMasterpieceActive,
    activePodcastLanguages,
    activeDocumentaryLanguages,
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
  const { processTitle, navigate, goBackFromDetail, selectedItem, navigateToDetail } = useViewStore();
  // Obtener categorías traducidas
  const categories = getCategories(lang);
  
  // Obtener subcategorías del store para la categoría seleccionada
  const categorySubcategories = getSubcategoriesForCategory();
    const [isRecommendedActive, setIsRecommendedActive] = useState(false);

  // Efecto para inicializar los datos
  useEffect(() => {
    console.log('[HomePage] Component mounted, initializing data...');
    initializeData();
  }, [initializeData]);
  // Efecto para inicializar los datos filtrados
  useEffect(() => {
    console.log('[HomePage] AllData changed:', Object.keys(allData || {}).length, 'categories available');
    // Solo inicializar si no hay filteredItems y allData está listo
    if (allData && Object.keys(allData).length > 0 && (!filteredItems || filteredItems.length === 0)) {
      console.log('[HomePage] AllData is ready and filteredItems is empty, initializing...');
      initializeFilteredItems();
    } else {
      console.log('[HomePage] AllData ready but filteredItems already has', filteredItems?.length || 0, 'items');
    }
  }, [allData]); // Removemos initializeFilteredItems de las dependencias para evitar bucles

  // Efecto para actualizar los items filtrados cuando cambian los filtros
  useEffect(() => {
    console.log('[HomePage] Filters changed - Category:', selectedCategory, 'Subcategory:', activeSubcategory, 'Language:', activeLanguage);
    console.log('[HomePage] Current filteredItems count:', filteredItems?.length || 0);
    
    if (selectedCategory) {
      console.log('[HomePage] Updating filtered items for category:', selectedCategory);
      updateFilteredItems();
    } else {
      console.log('[HomePage] No category selected, showing home view');
    }
  }, [selectedCategory, activeSubcategory, activeLanguage, updateFilteredItems]);
  const handleCategoryClick = (category) => {
    console.log('[HomePage] Category clicked:', category);
    console.log('[HomePage] Current state before change:', { selectedCategory, activeSubcategory, activeLanguage });
      setSelectedCategory(category);
    setActiveSubcategory(null);
    setActiveLanguage('all');
    
    console.log('[HomePage] State should change to:', { 
      selectedCategory: category, 
      activeSubcategory: null, 
      activeLanguage: 'all' 
    });  };

  // Manejar toggle de cine español con logging
  const handleSpanishCinemaToggle = () => {
    console.log('[HomePage] Spanish Cinema button clicked, current state:', isSpanishCinemaActive);
    toggleSpanishCinema();
  };  // Manejar clic en elemento
  const handleItemClick = (item) => {
    console.log('[HomePage] Item clicked:', item?.title || item?.name, 'ID:', item?.id);
    // Usar el viewStore para navegar al detalle
    navigateToDetail(item);
    // Hacer scroll al inicio de la página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  // Manejar cierre del detalle
  const handleCloseDetail = () => {
    console.log('[HomePage] Closing item detail');
    // Volver a la vista anterior usando el viewStore
    goBackFromDetail();
  };
  // Renderizar el detalle del elemento
  const renderItemDetail = () => {
    console.log('[HomePage] renderItemDetail called, selectedItem:', selectedItem);
    if (!selectedItem) {
      console.log('[HomePage] No selectedItem, not rendering detail');
      return null;
    }

    console.log('[HomePage] Rendering item detail for:', selectedItem.title, 'isMobile:', isMobile);

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
        return '#e91e63';      case 'comics':
        return '#ff9800';
      case 'documentales':
      case 'documentaries':
        return '#9e9e9e';
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
      </div>

      {/* Hide all navigation controls when showing item detail */}
      {!selectedItem && (
        <>
          <div className="categories-container">
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
          </div>

          {selectedCategory && (
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
                onClick={handleSpanishCinemaToggle}
              >
                {lang === 'es' ? 'Cine Español' : 'Spanish Cinema'}
              </button>
            )}

            {selectedCategory === 'podcast' && (
              <>
                <button
                  className={`subcategory-btn podcast-language${activePodcastLanguages.includes('es') ? ' active' : ''}`}              
                  onClick={() => togglePodcastLanguage('es')}
                >
                  {lang === 'es' ? 'Español' : 'Spanish'}
                </button>
                <button
                  className={`subcategory-btn podcast-language${activePodcastLanguages.includes('en') ? ' active' : ''}`}              
                  onClick={() => togglePodcastLanguage('en')}
                >
                  {lang === 'es' ? 'Inglés' : 'English'}
                </button>
              </>
            )}

            {selectedCategory === 'documentales' && (
              <>
                <button
                  className={`subcategory-btn podcast-language${activeDocumentaryLanguages.includes('es') ? ' active' : ''}`}              
                  onClick={() => toggleDocumentaryLanguage('es')}
                >
                  {lang === 'es' ? 'Español' : 'Spanish'}
                </button>
                <button
                  className={`subcategory-btn podcast-language${activeDocumentaryLanguages.includes('en') ? ' active' : ''}`}              
                  onClick={() => toggleDocumentaryLanguage('en')}
                >
                  {lang === 'es' ? 'Inglés' : 'English'}
                </button>
              </>
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

          {/* Debug info */}
          {process.env.NODE_ENV === 'development' && (
            <div style={{ fontSize: '12px', color: '#666', margin: '10px 0' }}>
              [Debug] Title: "{title}" | Selected: {selectedCategory || 'none'} | Items: {filteredItems?.length || 0}
            </div>
          )}

          {title && (
            <h1 
              className={selectedCategory ? 'after-subcategories' : ''}
              style={{ textTransform: 'capitalize', textAlign: 'center', margin: '20px 0' }}
            >
              {title}
            </h1>
          )}
        </>
      )}

      {/* Render either the recommendations list OR the item detail, not both */}
      {selectedItem ? (
        renderItemDetail()
      ) : (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <RecommendationsList            
            recommendations={filteredItems} 
            isHome={!selectedCategory}
            onItemClick={handleItemClick}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;
