import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import { useAppData, useAppView } from '../store/useAppStore';
import { useTitleSync } from '../hooks/useTitleSync';
import { loadRealData } from '../utils/dataLoader';
import RecommendationsList from './RecommendationsList';
import ThemeToggle from './ThemeToggle';
import '../styles/components/buttons.css';
import '../styles/components/home-page.css';
import '../styles/components/home-title-mobile.css';
import UnifiedItemDetail from './UnifiedItemDetail';
import { normalizeSubcategoryInternal } from '../utils/categoryUtils';
import MaterialCategorySelect from './MaterialCategorySelect';
import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import SplashDialog from './SplashDialog';
import CategoryBar from './home/CategoryBar';
import SubcategoryBar from './home/SubcategoryBar';
import SpecialButtons from './home/SpecialButtons';
import UiLayout from './ui/UiLayout';

// Hook para detectar si es móvil SOLO por ancho de pantalla (robusto y compatible móvil)
function useIsMobile() {
  const getIsMobile = () => typeof window !== 'undefined' ? window.innerWidth < 900 : false;
  const [isMobile, setIsMobile] = React.useState(getIsMobile);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(getIsMobile());
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    // Forzar comprobación tras el primer render (por si el valor inicial es incorrecto)
    setTimeout(handleResize, 100);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);
  return isMobile;
}

const HomePage = ({
  categoryBarProps = {},
  subcategoryBarProps = {},
  materialCategorySelectProps = {},
  specialButtonsProps = {},
  renderCategoryButton,
  renderSubcategoryChip,
  categoryBarSx,
  subcategoryBarSx,
  materialCategorySelectSx,
  ...rest
} = {}) => {
  const { lang, t } = useLanguage();
  // Hook para sincronizar títulos automáticamente
  useTitleSync();
  const [splashOpen, setSplashOpen] = useState(false);
  const audioRef = useRef(null);
   const handleSplashClose = () => {
    setSplashOpen(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };
  // Stores consolidados
  const { 
    recommendations,
    selectedCategory, 
    setCategory,
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
    isDataInitialized,
    updateWithRealData,
    updateTitleForLanguage
  } = useAppData();
  
  // Efecto para actualizar título cuando cambia el idioma
  useEffect(() => {
    if (lang) {
      updateTitleForLanguage();
    }
  }, [lang, selectedCategory, updateTitleForLanguage]);
    // Obtener funciones de procesamiento del store de vista
  const { goBackFromDetail, selectedItem, goToDetail } = useAppView();
  // Obtener categorías traducidas (se actualizará cuando cambie el idioma)
  const categoriesFromStore = getCategories();
  const categories = categoriesFromStore.map(cat => ({
    ...cat,
    label: t?.categories?.[cat.key] || cat.label,
    isMasterpiece: cat.key === 'masterpiece' || cat.masterpiece === true
  }));
  // Obtener subcategorías del store para la categoría seleccionada
  const categorySubcategories = React.useMemo(() => {
    let subs = getSubcategoriesForCategory(selectedCategory);
    if (selectedCategory === 'boardgames' && Array.isArray(subs)) {
      return subs.map(({ sub, ...rest }) => ({
        sub: sub.toLowerCase().trim(),
        label: t?.subcategories?.boardgames?.[sub.toLowerCase().trim()] || sub,
        ...rest
      }));
    }
    // Normalizar formato para todos los componentes parametrizables
    if (Array.isArray(subs)) {
      return subs.map(s => typeof s === 'string' ? { sub: s, label: t?.subcategories?.[selectedCategory]?.[s] || s } : s);
    }
    return [];
  }, [selectedCategory, getSubcategoriesForCategory, t, lang]);
  const [isRecommendedActive, setIsRecommendedActive] = useState(false);  // Efecto para cargar datos reales - solo una vez
  useEffect(() => {
    let mounted = true;
    
    if (!isDataInitialized && mounted) {        console.log('🔄 Iniciando carga de datos reales...');
      loadRealData().then(realData => {
        if (mounted) {
          console.log('✅ Datos cargados, actualizando store con recomendaciones diarias...');
          updateWithRealData(realData);
          // Usar las recomendaciones finales del store (garantiza 14)
          updateFilteredItems(realData.recommendations?.length === 14 ? realData.recommendations : realData.recommendations?.concat(Object.values(realData.allData).flat().filter(item => !realData.recommendations.some(r => r.id === item.id)).slice(0, 14 - (realData.recommendations?.length || 0))) || []);
        }
      }).catch(error => {
        console.error('❌ Error en HomePage:', error);
      });
    }
    
    return () => {
      mounted = false;
    };
  }, [isDataInitialized, updateWithRealData]);  // Efecto para actualizar los items filtrados cuando cambian los filtros
  useEffect(() => {
    if (allData && Object.keys(allData).length > 0) {
      let filteredData = [];
      
      // Si no hay categoría seleccionada (null), mostrar recomendaciones diarias curadas
      if (!selectedCategory || selectedCategory === 'all') {
        filteredData = recommendations;
        console.log('📋 Mostrando recomendaciones diarias curadas:', filteredData.length);
      } else {
        // Filtrar elementos basado en la categoría seleccionada (mostrar TODAS de esa categoría)
        filteredData = allData[selectedCategory] || [];
        console.log(`🎯 Filtrando por categoría "${selectedCategory}":`, filteredData.length);
      }      // Aplicar filtros adicionales solo cuando hay una categoría específica seleccionada
      if (selectedCategory && selectedCategory !== 'all') {
        console.log('🔍 Aplicando filtros adicionales...', {
          isSpanishCinemaActive,
          isMasterpieceActive,
          activePodcastLanguages,
          activeDocumentaryLanguages,
          activeSubcategory
        });// Filtro de Cine Español (solo para películas)
        if (selectedCategory === 'movies' && isSpanishCinemaActive) {
          filteredData = filteredData.filter(item => {
            // Verificar múltiples propiedades que puedan indicar cine español
            const isSpanish = 
              item.spanish_cinema === true || 
              item.spanishCinema === true ||
              (item.tags && item.tags.includes('spanish')) ||
              (item.director && (
                item.director.includes('Luis García Berlanga') ||
                item.director.includes('Pedro Almodóvar') ||
                item.director.includes('Alejandro Amenábar') ||
                item.director.includes('Fernando Trueba') ||
                item.director.includes('Icíar Bollaín') ||
                item.director.includes('Carlos Saura') ||
                item.director.includes('Víctor Erice')
              )) ||
              (item.country && item.country === 'España') ||
              (item.pais && item.pais === 'España') ||
              (item.description && (
                item.description.es?.includes('español') ||
                item.description.es?.includes('España')
              ));
            
            return isSpanish;
          });
          console.log('🇪🇸 Filtro Cine Español aplicado:', filteredData.length);
        }

        // Filtro de Masterpiece (para cualquier categoría)
        if (isMasterpieceActive) {
          filteredData = filteredData.filter(item => 
            item.masterpiece === true || 
            item.obra_maestra === true
          );
          console.log('⭐ Filtro Masterpiece aplicado:', filteredData.length);
        }

        // Filtro de idioma para podcasts
        if (selectedCategory === 'podcast' && activePodcastLanguages.length > 0) {
          filteredData = filteredData.filter(item => 
            activePodcastLanguages.includes(item.language) ||
            activePodcastLanguages.includes(item.idioma)
          );
          console.log('🎧 Filtro idioma podcast aplicado:', filteredData.length);
        }

        // Filtro de idioma para documentales
        if (selectedCategory === 'documentales' && activeDocumentaryLanguages.length > 0) {
          filteredData = filteredData.filter(item => 
            activeDocumentaryLanguages.includes(item.language) ||
            activeDocumentaryLanguages.includes(item.idioma)
          );
          console.log('🎬 Filtro idioma documental aplicado:', filteredData.length);
        }

        // Filtro de subcategoría
        if (activeSubcategory && activeSubcategory !== 'all') {
          filteredData = filteredData.filter(item => 
            (item.subcategory && item.subcategory.toLowerCase().trim() === activeSubcategory)
            || (item.categoria && item.categoria.toLowerCase().trim() === activeSubcategory)
            || (item.genre && item.genre.toLowerCase().trim() === activeSubcategory)
            || (item.genero && item.generero.toLowerCase().trim() === activeSubcategory)
          );
          console.log(`📂 Filtro subcategoría (key directa) "${activeSubcategory}" aplicado:`, filteredData.length);
        }
      }

      // Ordenar alfabéticamente por título (soporta objetos multiidioma)
      filteredData = filteredData.slice().sort((a, b) => {
        const titleA = typeof a.title === 'object' ? (a.title.es || a.title.en || Object.values(a.title)[0] || '') : (a.title || '');
        const titleB = typeof b.title === 'object' ? (b.title.es || b.title.en || Object.values(b.title)[0] || '') : (b.title || '');
        return titleA.localeCompare(titleB, 'es', { sensitivity: 'base' });
      });

      updateFilteredItems(filteredData);
    } else {
      console.log('⚠️ allData no está disponible aún:', allData);
    }
  }, [
    selectedCategory, 
    activeSubcategory, 
    activeLanguage, 
    allData, 
    recommendations, 
    isSpanishCinemaActive,
    isMasterpieceActive,
    activePodcastLanguages,
    activeDocumentaryLanguages,
    updateFilteredItems
  ]);  const handleCategoryClick = (category) => {
    setCategory(category);
    setActiveSubcategory(null);
    setActiveLanguage('all');
  };// Manejar toggle de cine español
  const handleSpanishCinemaToggle = () => {
    console.log('🇪🇸 Toggle Cine Español:', !isSpanishCinemaActive);
    toggleSpanishCinema();
  };

  // Manejar toggle de masterpiece
  const handleMasterpieceToggle = () => {
    console.log('⭐ Toggle Masterpiece:', !isMasterpieceActive);
    toggleMasterpiece();
  };// Manejar clic en elemento
  const handleItemClick = (item) => {
    // Usar el viewStore para navegar al detalle
    goToDetail(item);
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
  const isMobile = useIsMobile();
  // Verificar si hay datos disponibles
  if (!allData || Object.keys(allData).length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{getTranslation('ui.states.loading', 'Cargando...')}</p>
      </div>
    );
  }
  return (
    <UiLayout sx={{ marginTop: 8, width: '100vw', maxWidth: '100vw', px: 0 }}>
      {/* Eliminar controles de cabecera solo en desktop */}
      {/* {isMobile && (
        <div className="header-controls">
          <ThemeToggle />
        </div>
      )} */}

      {/* Hide all navigation controls when showing item detail */}
      {!selectedItem && (
        <>
          {/* Mostrar título traducido */}
          <h1 
            className={
              'home-title' +
              (isMobile ? ' home-mobile-title' : '') +
              (selectedCategory ? ' after-subcategories' : '')
            }
            style={isMobile ? {
              textTransform: 'capitalize',
              textAlign: 'center',
              margin: '20px 0 32px 0',
              fontWeight: 700,
              fontSize: '2.2rem'
            } : {}}
          >
            {selectedCategory 
              ? (t?.categories?.[selectedCategory] || selectedCategory)
              : (t?.ui?.titles?.home_title || 'Recomendaciones diarias')
            }
          </h1>
          {isMobile && (
            <SplashDialog open={splashOpen} onClose={handleSplashClose} audio="/imagenes/samurai.mp3" dark />
          )}
          {/* SOLO DESKTOP: Categorías, subcategorías y botones especiales */}
          {!isMobile && (
            <>
              <CategoryBar
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryClick={handleCategoryClick}
                renderButton={renderCategoryButton}
                sx={categoryBarSx}
                {...categoryBarProps}
              />
              <SubcategoryBar
                selectedCategory={selectedCategory}
                categorySubcategories={categorySubcategories}
                activeSubcategory={activeSubcategory}
                setActiveSubcategory={setActiveSubcategory}
                renderChip={renderSubcategoryChip}
                sx={subcategoryBarSx}
                {...subcategoryBarProps}
                allData={allData}
                t={t}
                lang={lang}
              />
              <SpecialButtons
                selectedCategory={selectedCategory}
                isSpanishCinemaActive={isSpanishCinemaActive}
                handleSpanishCinemaToggle={handleSpanishCinemaToggle}
                isMasterpieceActive={isMasterpieceActive}
                handleMasterpieceToggle={handleMasterpieceToggle}
                activePodcastLanguages={activePodcastLanguages}
                togglePodcastLanguage={togglePodcastLanguage}
                activeDocumentaryLanguages={activeDocumentaryLanguages}
                toggleDocumentaryLanguage={toggleDocumentaryLanguage}
                lang={lang}
                isRecommendedActive={isRecommendedActive}
                {...specialButtonsProps}
              />
            </>
          )}
          {/* SOLO EN MÓVIL: Select y botones especiales debajo del h1 */}
          {isMobile && (
            <div style={{ width: '100%', maxWidth: 500, margin: '0 auto 12px auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ width: '100%', maxWidth: 400, display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                <MaterialCategorySelect
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={(cat, subcat) => {
                    if (subcat) {
                      setCategory(cat);
                      setActiveSubcategory(subcat);
                    } else {
                      setCategory(cat);
                      setActiveSubcategory(null);
                    }
                  }}
                  subcategories={(() => {
                    if (selectedCategory === 'documentales') {
                      const subcatsSet = new Set();
                      (allData['documentales'] || []).forEach(item => {
                        if (item.subcategory) subcatsSet.add(item.subcategory.toLowerCase().trim());
                      });
                      return Array.from(subcatsSet).map(sub => ({ sub, label: t?.subcategories?.documentales?.[sub] || sub }));
                    }
                    return Array.isArray(categorySubcategories) ? categorySubcategories : [];
                  })()}
                  activeSubcategory={activeSubcategory}
                  renderButton={renderCategoryButton}
                  renderChip={renderSubcategoryChip}
                  sx={materialCategorySelectSx}
                  {...materialCategorySelectProps}
                />
              </span>
              {selectedCategory && (
                <SpecialButtons
                  selectedCategory={selectedCategory}
                  isSpanishCinemaActive={isSpanishCinemaActive}
                  handleSpanishCinemaToggle={handleSpanishCinemaToggle}
                  isMasterpieceActive={isMasterpieceActive}
                  handleMasterpieceToggle={handleMasterpieceToggle}
                  activePodcastLanguages={activePodcastLanguages}
                  togglePodcastLanguage={togglePodcastLanguage}
                  activeDocumentaryLanguages={activeDocumentaryLanguages}
                  toggleDocumentaryLanguage={toggleDocumentaryLanguage}
                  lang={lang}
                  isRecommendedActive={isRecommendedActive}
                  isMobile
                  {...specialButtonsProps}
                />
              )}
            </div>
          )}
        </>
      )}

      {/* Render either the recommendations list OR the item detail, not both */}
      {selectedItem ? (
        renderItemDetail()
      ) : (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            // Quitar paddingTop en móvil cuando no hay categoría seleccionada
            ...(isMobile && (!selectedCategory || selectedCategory === 'all')
              ? { paddingTop: 0 }
              : {})
          }}
        >
          <RecommendationsList            
            recommendations={filteredItems} 
            isHome={!selectedCategory}
            onItemClick={handleItemClick}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryClick={handleCategoryClick}
            showCategoryBar={false}
            showSubcategoryBar={false}
            showCategorySelect={isMobile ? false : undefined}
            showSubcategoryChips={isMobile ? false : undefined}
          />
        </div>
      )}
    </UiLayout>
  );
};

export default HomePage;
