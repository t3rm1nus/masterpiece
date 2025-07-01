import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../LanguageContext';
import { useAppData, useAppView } from '../store/useAppStore';
import { useTitleSync } from '../hooks/useTitleSync';
import { loadRealData } from '../utils/dataLoader';
import RecommendationsList from './RecommendationsList';
import ThemeToggle from './ThemeToggle';
import UnifiedItemDetail from './UnifiedItemDetail';
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
import { getSubcategoryLabel } from '../utils/getSubcategoryLabel';
import MaterialContentWrapper from './MaterialContentWrapper';
import DesktopRecommendationsList from './DesktopRecommendationsList';
import useAppStore from '../store/useAppStore'; // <-- Usar solo el store NUEVO
import { normalizeSubcategoryInternal } from '../utils/categoryUtils';
import { keyframes, styled } from '@mui/system';

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

// Definir keyframes para el gradiente animado de fondo
const animatedGradientBG = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const AnimatedH1 = styled('h1')(({ isMobile, h1Gradient }) => ({
  textTransform: 'capitalize',
  textAlign: 'center',
  margin: isMobile ? '4px 0 32px 0' : '20px auto 32px auto',
  fontWeight: 700,
  fontSize: isMobile ? '1.4rem' : '2.2rem',
  color: 'black',
  borderRadius: 0,
  position: 'relative',
  zIndex: 2,
  border: 'none',
  width: isMobile ? '100vw' : '99vw',
  maxWidth: isMobile ? '100vw' : '1600px',
  minWidth: isMobile ? '100vw' : '0',
  minHeight: isMobile ? 0 : '70px',
  padding: isMobile ? '12px 0 10px 0' : '32px 0 28px 0',
  display: 'block',
  boxShadow: 'none',
  borderTop: '2px solid #bbb',
  borderBottom: '2px solid #bbb',
  background: h1Gradient,
  backgroundSize: '200% 200%',
  animation: `${animatedGradientBG} 6s ease-in-out infinite`,
  transition: 'background 0.3s',
  cursor: isMobile ? 'pointer' : 'default',
  // Desactivar cualquier efecto hover en desktop
  '&:hover': isMobile ? {} : {
    color: 'black',
    background: h1Gradient,
    boxShadow: 'none',
    cursor: 'default',
    filter: 'none',
    textDecoration: 'none',
  },
}));

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
  splashAudio,
  splashOpen,
  onSplashOpen,
  onSplashClose,
  audioRef,
  ...rest
} = {}) => {
  const { lang, t, getTranslation } = useLanguage();
  // Hook para sincronizar títulos automáticamente
  useTitleSync();
  const [splashOpenLocal, setSplashOpen] = useState(false);
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
  const [splashAudioLocal, setSplashAudio] = useState(splashAudios[0]);
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
    isSpanishCinemaActive,
    isMasterpieceActive,
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
    toggleSpanishSeries,
    setSpanishCinemaActive,
    setSpanishSeriesActive,
    setMasterpieceActive,
  } = useAppData();
  
  // Efecto para actualizar título cuando cambia el idioma
  useEffect(() => {
    if (lang) {
      updateTitleForLanguage();
    }
  }, [lang, selectedCategory, updateTitleForLanguage]);
    // Obtener funciones de procesamiento del store de vista
  // const { goBackFromDetail, selectedItem, goToDetail } = useAppView();
  // Usar Zustand directo para selectedItem y navegación
  const selectedItem = useAppStore(state => state.selectedItem);
  const goToDetail = useAppStore(state => state.goToDetail);
  const goBackFromDetail = useAppStore(state => state.goBackFromDetail);
  const currentView = useAppStore(state => state.currentView);
  const activePodcastDocumentaryLanguage = useAppStore(state => state.activePodcastDocumentaryLanguage);
  const resetActivePodcastDocumentaryLanguage = useAppStore(state => state.resetActivePodcastDocumentaryLanguage);
  // LOGS DE DEPURACIÓN
  // Eliminado: console.log('[HomePage] currentView:', currentView, 'selectedItem:', selectedItem);

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
    if (!isDataInitialized && mounted) {
      // Resetear filtros especiales al cargar datos reales
      setMasterpieceActive(false);
      setSpanishCinemaActive(false);
      setSpanishSeriesActive(false);
      loadRealData().then(realData => {
        if (mounted) {
          updateWithRealData(realData);
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
      if (!selectedCategory || selectedCategory === 'all') {
        filteredData = recommendations;
      } else {
        filteredData = allData[selectedCategory] || [];
      }
      if (selectedCategory && selectedCategory !== 'all') {
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
        }
        if (isMasterpieceActive) {
          filteredData = filteredData.filter(item => 
            item.masterpiece === true || 
            item.obra_maestra === true
          );
        }
        // Filtro de Series Españolas (solo para series)
        if (selectedCategory === 'series' && isSpanishSeriesActive) {
          filteredData = filteredData.filter(item =>
            (item.tags && item.tags.includes('spanish'))
          );
        }
        // Filtro de idioma para Podcasts/Documentales
        if ((selectedCategory === 'podcast' || selectedCategory === 'documentales') && activePodcastDocumentaryLanguage) {
          filteredData = filteredData.filter(item => item.idioma === activePodcastDocumentaryLanguage);
        }
        // Filtro de subcategoría (AJUSTE PARA MÓVIL TAMBIÉN)
        if (activeSubcategory && activeSubcategory !== 'all') {
          const normalizedActiveSubcat = normalizeSubcategoryInternal(activeSubcategory);
          filteredData = filteredData.filter(item => {
            // Prioridad: subcategoria (sin tilde), luego subcategory, categoria, genre, genero
            return (
              (item.subcategory && normalizeSubcategoryInternal(item.subcategory) === normalizedActiveSubcat)
              || (item.categoria && normalizeSubcategoryInternal(item.categoria) === normalizedActiveSubcat)
              || (item.genre && normalizeSubcategoryInternal(item.genre) === normalizedActiveSubcat)
              || (item.genero && normalizeSubcategoryInternal(item.genero) === normalizedActiveSubcat)
            );
          });
        }
      }
      // Ordenar alfabéticamente por título (soporta objetos multiidioma)
      filteredData = filteredData.slice().sort((a, b) => {
        const titleA = typeof a.title === 'object' ? (a.title.es || a.title.en || Object.values(a.title)[0] || '') : (a.title || '');
        const titleB = typeof b.title === 'object' ? (b.title.es || b.title.en || Object.values(b.title)[0] || '') : (b.title || '');
        return titleA.localeCompare(titleB, 'es', { sensitivity: 'base' });
      });
      updateFilteredItems(filteredData);
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
    activePodcastDocumentaryLanguage,
    updateFilteredItems
  ]);
  const handleCategoryClick = (category) => {
    setCategory(category);
    setActiveSubcategory(null);
    setActiveLanguage('all');
    setMasterpieceActive(false);
    setSpanishCinemaActive(false);
    setSpanishSeriesActive(false);
    resetActivePodcastDocumentaryLanguage(); // Reset filtro idioma al cambiar categoría
  };// Manejar toggle de cine español
  const handleSpanishCinemaToggle = () => {
    toggleSpanishCinema();
  };

  // Manejar toggle de masterpiece
  const handleMasterpieceToggle = () => {
    toggleMasterpiece();
  };// Manejar clic en elemento
  const handleItemClick = (item) => {
    goToDetail(item);
  };  // Manejar cierre del detalle
  const handleCloseDetail = () => {
    goBackFromDetail();
  };  // Renderizar el detalle del elemento
  // const renderItemDetail = () => {
  //   if (!selectedItem) {
  //     return null;
  //   }
  //   return (
  //     <UnifiedItemDetail
  //       item={selectedItem}
  //       onClose={handleCloseDetail}
  //       selectedCategory={selectedCategory}
  //     />
  //   );
  // }

  // Scroll al top al mostrar detalle en móvil (debug exhaustivo: logs y varios intentos)
  useEffect(() => {
    if (selectedItem && typeof window !== 'undefined' && window.innerWidth < 900) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        const main = document.querySelector('main');
        if (main) main.scrollTop = 0;
        const root = document.getElementById('root');
        if (root) root.scrollTop = 0;
      }, 100);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        const main = document.querySelector('main');
        if (main) main.scrollTop = 0;
        const root = document.getElementById('root');
        if (root) root.scrollTop = 0;
      }, 300);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        const main = document.querySelector('main');
        if (main) main.scrollTop = 0;
        const root = document.getElementById('root');
        if (root) root.scrollTop = 0;
      }, 600);
    }
  }, [selectedItem]);

  const isMobile = useIsMobile();
  const isCategoryListMobile = isMobile && selectedCategory && selectedCategory !== 'all';

  // Estado de paginación para móvil y desktop (independientes)
  const [mobilePage, setMobilePage] = useState(1);
  const [desktopPage, setDesktopPage] = useState(1);
  const [loadingMoreMobile, setLoadingMoreMobile] = useState(false);
  const [loadingMoreDesktop, setLoadingMoreDesktop] = useState(false);
  const pageSize = 10; // Ajusta a 10 para cumplir el requerimiento

  // Resetear página al cambiar de categoría, subcategoría o filtros relevantes
  useEffect(() => {
    if (isMobile) setMobilePage(1);
    else setDesktopPage(1);
  }, [selectedCategory, activeSubcategory, isSpanishCinemaActive, isMasterpieceActive, isMobile]);

  // Calcular los ítems a mostrar con paginación (móvil y desktop)
  const paginatedItems = React.useMemo(() => {
    const page = isMobile ? mobilePage : desktopPage;
    console.log('[HomePage] paginatedItems:', {
      filteredItemsLength: filteredItems.length,
      selectedCategory,
      isMobile,
      mobilePage,
      desktopPage,
      pageSize,
      filteredItems,
    });
    // En home sin categoría seleccionada, mostrar solo las recomendaciones curadas
    if (!selectedCategory || selectedCategory === 'all') {
      console.log('[HomePage] Home: mostrando recomendaciones curadas', filteredItems);
      return filteredItems; // Mostrar las 12 recomendaciones curadas
    }
    // En categorías específicas, usar paginación tanto en móvil como desktop
    const result = filteredItems.slice(0, page * pageSize);
    console.log('[HomePage] Categoria:', selectedCategory, 'Mostrando', result.length, 'de', filteredItems.length, 'items', result);
    return result;
  }, [filteredItems, mobilePage, desktopPage, selectedCategory, isMobile, pageSize]);

  // Calcular si hay más para infinite scroll (móvil y desktop)
  const hasMore = (selectedCategory && selectedCategory !== 'all') && (paginatedItems.length < filteredItems.length);

  // Callback para cargar más (móvil y desktop)
  const handleLoadMore = React.useCallback(() => {
    if (isMobile) {
      if (hasMore && !loadingMoreMobile) {
        setLoadingMoreMobile(true);
        setTimeout(() => {
          setMobilePage(p => p + 1);
          setLoadingMoreMobile(false);
        }, 600); // Simula carga para mostrar el loader
      }
    } else {
      if (hasMore && !loadingMoreDesktop) {
        setLoadingMoreDesktop(true);
        setTimeout(() => {
          setDesktopPage(p => p + 1);
          setLoadingMoreDesktop(false);
        }, 600); // Simula carga para mostrar el loader
      }
    }
  }, [hasMore, loadingMoreMobile, loadingMoreDesktop, isMobile]);

  // Verificar si hay datos disponibles
  if (!allData || Object.keys(allData).length === 0) {
    return (
      <div
        style={{ width: '100vw', height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
      >
        <div style={{ width: 48, height: 48, border: '4px solid #ccc', borderTop: '4px solid #888', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: 16 }}>{getTranslation('ui.states.loading', 'Cargando...')}</p>
      </div>
    );
  }

  // Desactiva la restauración automática de scroll del navegador
  if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
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

  // Scroll al top en el primer render de la home
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, []);

  // Setea las variables CSS para los gradientes animados
  useEffect(() => {
    const root = document.documentElement;
    // Usar solo en la home el gradiente dorado+grises+blancos
    root.style.setProperty('--all-categories-animated-gradient', getMasterpieceAnimatedGradient());
    root.style.setProperty('--category-animated-gradient', getCategoryAnimatedGradient(selectedCategory));
  }, [selectedCategory]);

  // Callback unificado para cambios de categoría o subcategoría en móvil
  const handleCategoryOrSubcategoryChange = (category, subcategory) => {
    if (category !== selectedCategory) {
      setCategory(category);
      setActiveSubcategory(null);
      setActiveLanguage('all');
    } else if (subcategory !== undefined) {
      setActiveSubcategory(subcategory);
    }
  };

  // Obtener gradiente animado según categoría
  const h1Gradient = (!selectedCategory || selectedCategory === 'all')
    ? getMasterpieceAnimatedGradient()
    : getCategoryAnimatedGradient(selectedCategory);

  const [isClosingDetail, setIsClosingDetail] = useState(false);
  // Función de cierre animado para detalle
  const handleRequestClose = useCallback(() => {
    console.log('[HomePage] handleRequestClose: INICIO (usuario pulsa volver)');
    setIsClosingDetail(true);
  }, []);

  // Efecto: desmontar el detalle solo después de la animación de salida (0.6s)
  useEffect(() => {
    if (isClosingDetail) {
      console.log('[HomePage] isClosingDetail=true: Esperando animación de salida...');
      const timeout = setTimeout(() => {
        console.log('[HomePage] Animación de salida terminada, desmontando detalle y llamando goBackFromDetail');
        goBackFromDetail();
        setIsClosingDetail(false);
      }, 600); // Duración igual que la animación (600ms)
      return () => clearTimeout(timeout);
    }
  }, [isClosingDetail, goBackFromDetail]);

  return (
    <UiLayout sx={{ marginTop: 8, width: '100vw', maxWidth: '100vw', px: 0 }}>
      {/* Título principal */}
      {!selectedItem && (
        <>
          <AnimatedH1 isMobile={isMobile} h1Gradient={h1Gradient}>
            {(!selectedCategory || selectedCategory === 'all')
              ? (t?.ui?.titles?.home_title || 'Lista de recomendados')
              : (t?.categories?.[selectedCategory] || selectedCategory)
            }
          </AnimatedH1>
          {/* SOLO MÓVIL: Selector de categorías justo debajo del h1 */}
          {isMobile && (
            <div style={{ width: '96vw', maxWidth: '96vw', margin: '0 auto', marginBottom: 4, marginTop: 4, zIndex: 2, position: 'relative', marginLeft: '10px' }}>
              <MaterialCategorySelect
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryOrSubcategoryChange}
                subcategories={categorySubcategories}
                activeSubcategory={activeSubcategory}
                sx={materialCategorySelectSx}
                {...materialCategorySelectProps}
              />
              {/* Botones especiales SOLO en móvil y SOLO si hay categoría seleccionada */}
              {selectedCategory && selectedCategory !== 'all' && (
                <SpecialButtons
                  selectedCategory={selectedCategory}
                  isSpanishCinemaActive={isSpanishCinemaActive}
                  handleSpanishCinemaToggle={handleSpanishCinemaToggle}
                  isMasterpieceActive={isMasterpieceActive}
                  handleMasterpieceToggle={handleMasterpieceToggle}
                  lang={lang}
                  isRecommendedActive={isRecommendedActive}
                  isSpanishSeriesActive={isSpanishSeriesActive}
                  handleSpanishSeriesToggle={toggleSpanishSeries}
                  {...specialButtonsProps}
                  isMobile={true}
                />
              )}
            </div>
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
      {!selectedItem && (
        <div
          style={{
            width: isMobile ? '96vw' : '100%',
            maxWidth: isMobile ? '96vw' : undefined,
            margin: isMobile ? '0 auto' : undefined,
            display: 'flex',
            justifyContent: 'center',
            ...(isMobile ? { marginTop: 28, marginLeft: '10px' } : {}),
            ...(isMobile && (!selectedCategory || selectedCategory === 'all')
              ? { paddingTop: 0 }
              : {})
          }}
        >
          {/* Renderizado condicional: para listado de categorías específicas, usar MaterialContentWrapper con infinite scroll */}
          {(selectedCategory && selectedCategory !== 'all') ? (
            <MaterialContentWrapper
              recommendations={isMobile ? paginatedItems : undefined}
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryClick={handleCategoryClick}
              subcategories={categorySubcategories}
              activeSubcategory={activeSubcategory}
              onSubcategoryClick={setActiveSubcategory}
              renderCategoryButton={renderCategoryButton}
              renderSubcategoryChip={renderSubcategoryChip}
              categorySelectSx={materialCategorySelectSx}
              subcategoryChipsSx={subcategoryBarSx}
              categorySelectProps={materialCategorySelectProps}
              subcategoryChipsProps={subcategoryBarProps}
              isHome={false}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              loadingMore={isMobile ? loadingMoreMobile : loadingMoreDesktop}
              categoryColor={categoryColor(selectedCategory)}
              showCategorySelect={!isMobile}
              showSubcategoryChips={!isMobile}
            >
              {/* Desktop: Render the recommendations list as a child */}
              {!isMobile && (
                <DesktopRecommendationsList
                  items={paginatedItems}
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryClick={handleCategoryClick}
                  subcategories={categorySubcategories}
                  activeSubcategory={activeSubcategory}
                  onSubcategoryClick={setActiveSubcategory}
                  renderCategoryButton={renderCategoryButton}
                  renderSubcategoryChip={renderSubcategoryChip}
                  categoryBarSx={categoryBarSx}
                  subcategoryBarSx={subcategoryBarSx}
                  showCategoryBar={false}
                  showSubcategoryBar={false}
                  onLoadMore={handleLoadMore}
                  hasMore={hasMore}
                  loadingMore={loadingMoreDesktop}
                  categoryColor={categoryColor(selectedCategory)}
                />
              )}
            </MaterialContentWrapper>
          ) : (
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
          )}
        </div>
      )}
      {(selectedItem || isClosingDetail) && (
        <UnifiedItemDetail
          item={selectedItem}
          onClose={handleRequestClose}
          onRequestClose={handleRequestClose} // <-- Añadido para interceptar el botón volver
          selectedCategory={selectedCategory}
          isClosing={isClosingDetail}
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

// =============================================================
// NOTA SOBRE FILTROS DE IDIOMA (podcast/documentales):
// - Los filtros de idioma (activePodcastLanguages, activeDocumentaryLanguages) solo se aplican a las categorías 'podcast' y 'documentales'.
// - Al entrar en la categoría, pueden estar activos hasta dos idiomas simultáneamente.
// - Tras seleccionar un idioma, solo puede quedar uno activo.
// - El resto de categorías no usan ni muestran estos filtros.
// - Esta lógica está centralizada en el store y reflejada en el UI.
// =============================================================

export default HomePage;
