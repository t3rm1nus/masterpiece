import React from 'react';
import { useLanguage } from '../LanguageContext';
import useDataStore from '../store/dataStore';
import useThemeStore from '../store/themeStore';
import { useTitleSync } from '../hooks/useTitleSync';
import MaterialContentWrapper from './MaterialContentWrapper';
import RecommendationsList from './RecommendationsList';

const HomePage = () => {
  const { lang, t, getSubcategoryTranslation } = useLanguage();
    // Hook para sincronizar títulos automáticamente
  useTitleSync();
  
  // Stores consolidados
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
    getSubcategoriesForCategory,
    getCategories
  } = useDataStore();
  
  // Obtener configuración de estilos del store consolidado
  const { getSpecialButtonLabel, containerStyles } = useThemeStore();  
  // Obtener categorías traducidas
  const categories = getCategories(lang);
  
  // Obtener subcategorías del store para la categoría seleccionada
  const categorySubcategories = getSubcategoriesForCategory();
  
  const handleCategoryClick = (key, label) => {
    // Usar la etiqueta traducida según el idioma actual
    const translatedLabel = categories.find(cat => cat.key === key)?.label || label;
    setSelectedCategory(key, translatedLabel);
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

  return (
    <MaterialContentWrapper
      categories={categories}
      selectedCategory={selectedCategory}
      onCategoryClick={handleCategoryClick}
      subcategories={selectedCategory ? categorySubcategories : []}
      activeSubcategory={activeSubcategory}
      onSubcategoryClick={setActiveSubcategory}
      categoryColor={selectedCategory ? getCategoryColor(selectedCategory) : '#0078d4'}
      recommendations={filteredItems}
      isHome={!selectedCategory && !activeSubcategory}
    >
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
        <h1 className={selectedCategory ? 'after-subcategories' : ''}>{title}</h1>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <RecommendationsList
            recommendations={filteredItems}
            isHome={!selectedCategory && !activeSubcategory}
          />
        </div>
      </>
    </MaterialContentWrapper>
  );
};

export default HomePage;
