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
import { getCategoryGradient, getAllCategoriesAnimatedGradient, getCategoryAnimatedGradient, getMasterpieceAnimatedGradient } from '../utils/categoryPalette';
import HybridMenu from './HybridMenu';
import MaterialMobileMenu from './MaterialMobileMenu';
import { getSubcategoryLabel } from '../utils/subcategoryLabel';
import '../styles/components/animations.css';

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
  const { lang, t, getTranslation } = useLanguage();
  // Hook para sincronizar títulos automáticamente
  useTitleSync();
  const [splashOpen, setSplashOpen] = useState(false);
  const audioRef = useRef(null);
  // Audios disponibles para el splash
  const splashAudios = [
    "/sonidos/samurai.mp3",
    "/sonidos/samurai.wav",
    "/sonidos/samurai1.mp3",
    "/sonidos/samurai2.mp3",
    "/sonidos/samurai3.mp3",
    "/sonidos/samurai4.mp3"
  ];
  // Estado para controlar los audios pendientes (no repetir hasta que suenen todos)
  const [pendingAudios, setPendingAudios] = useState([...splashAudios]);
  const [splashAudio, setSplashAudio] = useState(splashAudios[0]);
  const handleSplashOpen = () => {
    let audiosToUse = pendingAudios.length > 0 ? pendingAudios : [...splashAudios];
    // Elegir audio aleatorio de los pendientes
    const randomIdx = Math.floor(Math.random() * audiosToUse.length);
    const randomAudio = audiosToUse[randomIdx];
    setSplashAudio(randomAudio);
    setSplashOpen(true);
    // Eliminar el audio elegido de los pendientes
    const newPending = audiosToUse.filter((a, i) => i !== randomIdx);
    setPendingAudios(newPending);
    // (No play here, let SplashDialog handle it)
  };

  // Log del audio elegido SIEMPRE que se abra el splash (móvil o desktop)
  useEffect(() => {
    if (splashOpen && splashAudio) {
      console.log('[Splash] Sonido elegido:', splashAudio);
    }
  }, [splashOpen, splashAudio]);

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
    updateTitleForLanguage,
    isSpanishSeriesActive,
    toggleSpanishSeries
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
    isMasterpiece: cat.key === 'masterpiece' || cat.masterpiece === true,
    color: categoryColor(cat.key),
    gradient: getCategoryGradient(cat.key)
  }));
  // Obtener subcategorías del store para la categoría seleccionada
  const categorySubcategories = React.useMemo(() => {
    let subs = getSubcategoriesForCategory(selectedCategory);
    if (selectedCategory === 'boardgames' && Array.isArray(subs)) {
      return subs.map(({ sub, ...rest }) => {
        const normalized = normalizeSubcategoryInternal(sub);
        return {
          sub: normalized,
          label: getSubcategoryLabel(normalized, 'boardgames', t, lang),
          ...rest
        };
      });
    }
    // Normalizar formato para todos los componentes parametrizables
    if (Array.isArray(subs)) {
      return subs.map(s => {
        const normalized = typeof s === 'string' ? normalizeSubcategoryInternal(s) : s.sub;
        return {
          sub: normalized,
          label: getSubcategoryLabel(normalized, selectedCategory, t, lang),
          ...(typeof s === 'object' ? s : {})
        };
      });
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

        // Filtro de Series Españolas (solo para series)
        if (selectedCategory === 'series' && isSpanishSeriesActive) {
          console.log('[Filtro Series Españolas] Estado activo:', isSpanishSeriesActive);
          console.log('[Filtro Series Españolas] Antes de filtrar:', filteredData.map(i => ({id: i.id, tags: i.tags})));
          filteredData = filteredData.filter(item =>
            (item.tags && item.tags.includes('spanish'))
          );
          console.log('[Filtro Series Españolas] Después de filtrar:', filteredData.map(i => ({id: i.id, tags: i.tags})));
        } else if (selectedCategory === 'series') {
          console.log('[Filtro Series Españolas] Estado activo:', isSpanishSeriesActive, '(NO FILTRO APLICADO)');
          console.log('[Filtro Series Españolas] Series visibles:', filteredData.map(i => ({id: i.id, tags: i.tags})));
        }

        // Filtro de subcategoría (AJUSTE PARA MÓVIL TAMBIÉN)
        if (activeSubcategory && activeSubcategory !== 'all') {
          const normalizedActiveSubcat = normalizeSubcategoryInternal(activeSubcategory);
          filteredData = filteredData.filter(item => {
            // Prioridad: subcategoria (sin tilde), luego subcategory, categoria, genre, genero
            return (
              (item.subcategoria && normalizeSubcategoryInternal(item.subcategoria) === normalizedActiveSubcat)
              || (item.subcategory && normalizeSubcategoryInternal(item.subcategory) === normalizedActiveSubcat)
              || (item.categoria && normalizeSubcategoryInternal(item.categoria) === normalizedActiveSubcat)
              || (item.genre && normalizeSubcategoryInternal(item.genre) === normalizedActiveSubcat)
              || (item.genero && normalizeSubcategoryInternal(item.genero) === normalizedActiveSubcat)
            );
          });
          console.log(`📂 Filtro subcategoría (normalizado) "${activeSubcategory}" aplicado (desktop/móvil):`, filteredData.length);
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
    isSpanishSeriesActive, // <-- añadido para que el filtro reaccione al cambio
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
    // Hacer scroll al inicio de la página solo en móviles, subiendo 100px más
    if (window.innerWidth < 900) {
      setTimeout(() => {
        window.scrollTo({ top: Math.max(0, window.scrollY - window.scrollY + 0 - 100), behavior: 'smooth' });
      }, 0);
    }
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
  }

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

  // Subir scroll arriba al volver atrás en móviles
  useEffect(() => {
    const handlePopState = () => {
      if (window.innerWidth < 900) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Subir scroll arriba al recargar en móviles
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 900) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Setea las variables CSS para los gradientes animados
  useEffect(() => {
    const root = document.documentElement;
    // Usar solo en la home el gradiente dorado+grises+blancos
    root.style.setProperty('--all-categories-animated-gradient', getMasterpieceAnimatedGradient());
    root.style.setProperty('--category-animated-gradient', getCategoryAnimatedGradient(selectedCategory));
  }, [selectedCategory]);

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
              'home-title animated-gradient-title' +
              (isMobile ? ' home-mobile-title' : '') +
              (selectedCategory ? ' after-subcategories' : '')
            }
            style={{
              textTransform: 'capitalize',
              textAlign: 'center',
              margin: '20px 0 32px 0',
              fontWeight: 700,
              fontSize: '2.2rem',
              backgroundImage: (!selectedCategory || selectedCategory === 'all')
                ? 'var(--all-categories-animated-gradient)'
                : 'var(--category-animated-gradient)',
              color: 'black',
              borderRadius: 0,
              position: 'relative',
              zIndex: 2,
              border: 'none',
              transition: 'background-image 0.3s',
              width: isMobile ? '100vw' : '99vw',
              left: '50%',
              right: '50%',
              transform: 'translateX(-50%)',
              maxWidth: isMobile ? '100vw' : '1600px',
              minWidth: isMobile ? '100vw' : '0',
              minHeight: isMobile ? 0 : '70px',
              padding: isMobile ? undefined : '32px 0 28px 0',
              display: 'block',
              boxShadow: 'none',
              borderTop: isMobile ? undefined : '2px solid #bbb',
              borderBottom: isMobile ? undefined : '2px solid #bbb',
              backgroundSize: '200% 200%',
              animation: 'animatedGradientBG 6s ease-in-out infinite',
            }}
          >
            {(!selectedCategory || selectedCategory === 'all')
              ? (t?.ui?.titles?.home_title || 'Lista de recomendados')
              : (t?.categories?.[selectedCategory] || selectedCategory)
            }
          </h1>
          {/* SOLO DESKTOP: Menú superior y controles */}
          {!isMobile && (
            <HybridMenu
              onSplashOpen={handleSplashOpen}
              splashAudio={splashAudio}
              splashOpen={splashOpen}
              onSplashClose={handleSplashClose}
              audioRef={audioRef}
            />
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
              {console.log('[HomePage] categorySubcategories:', categorySubcategories)}
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
                isSpanishSeriesActive={isSpanishSeriesActive}
                handleSpanishSeriesToggle={toggleSpanishSeries}
                {...specialButtonsProps}
              />
            </>
          )}
        </>
      )}
      {/* Render either the recommendations list OR the item detail, not both */}
      {selectedItem ? (
        renderItemDetail()
      ) : (
        <div
          style={{
            width: isMobile ? '92%' : '100%',
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
      {/* SOLO EN MÓVIL: Menú superior centralizado para splash/audio */}
      {isMobile && (
        <MaterialMobileMenu
          onSplashOpen={handleSplashOpen}
          splashAudio={splashAudio}
          splashOpen={splashOpen}
          onSplashClose={handleSplashClose}
          audioRef={audioRef}
        />
      )}
    </UiLayout>
  );
};

// Fuera del componente HomePage
function categoryColor(categoryKey) {
  // Definir colores específicos para categorías concretas
  const specificColors = {
    'movies': '#FF5733', // Ejemplo: color rojo para películas
    'series': '#33C3FF', // Ejemplo: color azul para series
    'documentales': '#75FF33', // Ejemplo: color verde para documentales
    'podcast': '#FF33A1', // Ejemplo: color rosa para podcasts
    'masterpiece': '#FFC300', // Color dorado para masterpiece
    'default': '#FFFFFF' // Color por defecto (blanco)
  };

  // Devolver el color específico si existe, o el color por defecto
  return specificColors[categoryKey] || specificColors['default'];
}

export default HomePage;
