import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import useDataStore from '../store/dataStore';
import useViewStore from '../store/viewStore';
import { useTitleSync } from '../hooks/useTitleSync';
import RecommendationsList from './RecommendationsList';
import ThemeToggle from './ThemeToggle';
import '../styles/components/buttons.css';
import '../styles/components/home-page.css';
import UnifiedItemDetail from './UnifiedItemDetail';

const HomePage = () => {
  const { lang, t } = useLanguage();
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
    allData,
    initializeData
  } = useDataStore();
  
  // Obtener funciones de procesamiento del store de vista
  const { goBackFromDetail, selectedItem, navigateToDetail } = useViewStore();
  // Obtener categorías traducidas
  const categories = getCategories(lang);
  
  // Obtener subcategorías del store para la categoría seleccionada
  const categorySubcategories = getSubcategoriesForCategory();
    const [isRecommendedActive, setIsRecommendedActive] = useState(false);
  // Efecto para inicializar los datos
  useEffect(() => {
    initializeData();
  }, [initializeData]);  // Efecto para inicializar los datos filtrados
  useEffect(() => {
    // Solo inicializar si no hay filteredItems y allData está listo
    if (allData && Object.keys(allData).length > 0 && (!filteredItems || filteredItems.length === 0)) {
      initializeFilteredItems();
    }
  }, [allData]); // Removemos initializeFilteredItems de las dependencias para evitar bucles
  // Efecto para actualizar los items filtrados cuando cambian los filtros
  useEffect(() => {
    if (selectedCategory) {
      updateFilteredItems();
    }
  }, [selectedCategory, activeSubcategory, activeLanguage, updateFilteredItems]);  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setActiveSubcategory(null);
    setActiveLanguage('all');
  };
  // Manejar toggle de cine español
  const handleSpanishCinemaToggle = () => {
    toggleSpanishCinema();
  };  // Manejar clic en elemento
  const handleItemClick = (item) => {
    // Usar el viewStore para navegar al detalle
    navigateToDetail(item);
    // Hacer scroll al inicio de la página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };  // Manejar cierre del detalle
  const handleCloseDetail = () => {
    // Volver a la vista anterior usando el viewStore
    goBackFromDetail();
  };  // Renderizar el detalle del elemento
  const renderItemDetail = () => {
    if (!selectedItem) {
      return null;
    }

    return (
      <UnifiedItemDetail
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
        return '#0078d4';    }
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
          </div>          {selectedCategory && selectedCategory !== 'documentales' && (
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
              <>                <button
                  className={`subcategory-btn podcast-language${activePodcastLanguages?.includes('es') ? ' active' : ''}`}              
                  onClick={() => togglePodcastLanguage('es')}
                >
                  {lang === 'es' ? 'Español' : 'Spanish'}
                </button>
                <button
                  className={`subcategory-btn podcast-language${activePodcastLanguages?.includes('en') ? ' active' : ''}`}              
                  onClick={() => togglePodcastLanguage('en')}
                >
                  {lang === 'es' ? 'Inglés' : 'English'}
                </button>
              </>
            )}            {selectedCategory === 'documentales' && (
              <>
                {/* Botones de idioma para documentales */}
                <button
                  className={`subcategory-btn podcast-language${activeDocumentaryLanguages?.includes('es') ? ' active' : ''}`}              
                  onClick={() => toggleDocumentaryLanguage('es')}
                >
                  {lang === 'es' ? 'Español' : 'Spanish'}
                </button>
                <button
                  className={`subcategory-btn podcast-language${activeDocumentaryLanguages?.includes('en') ? ' active' : ''}`}              
                  onClick={() => toggleDocumentaryLanguage('en')}
                >
                  {lang === 'es' ? 'Inglés' : 'English'}
                </button>
                
                {/* Subcategorías de documentales */}
                {Array.isArray(categorySubcategories) && categorySubcategories.length > 0 && (
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
                )}
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
