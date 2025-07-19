import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLanguage } from '../LanguageContext';
import { useAppData, useAppView } from '../store/useAppStore';
import { useTitleSync } from '../hooks/useTitleSync';
import { useGoogleAnalytics } from '../hooks/useGoogleAnalytics';
import { loadRealData } from '../utils/dataLoader';
import RecommendationsList from './RecommendationsList';
import UnifiedItemDetail from './UnifiedItemDetail';
import MaterialCategorySelect from './MaterialCategorySelect';
import { useTheme } from '@mui/material/styles';
import SplashDialog from './SplashDialog';
import CategoryBar from './home/CategoryBar';
import SubcategoryBar from './home/SubcategoryBar';
import SpecialButtons from './home/SpecialButtons';
import UiLayout from './ui/UiLayout';
import { getCategoryGradient, getAllCategoriesAnimatedGradient, getCategoryAnimatedGradient, getMasterpieceAnimatedGradient, getCategoryColor } from '../utils/categoryPalette';
import HybridMenu from './HybridMenu';
import MaterialMobileMenu from './MaterialMobileMenu';
import { getSubcategoryLabel } from '../utils/getSubcategoryLabel';
import MaterialContentWrapper from './MaterialContentWrapper';
import DesktopRecommendationsList from './DesktopRecommendationsList';
import useAppStore from '../store/useAppStore';
import { normalizeSubcategoryInternal } from '../utils/categoryUtils';
import { keyframes, styled } from '@mui/system';
import { generateUniqueId } from '../utils/appUtils';
import Chip from '@mui/material/Chip';
import UiButton from './ui/UiButton';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { findItemByGlobalId } from '../utils/appUtils';
import { Helmet } from 'react-helmet-async';
import useIsomorphicLayoutEffect from '../hooks/useIsomorphicLayoutEffect';
import { getLocalizedPath } from '../utils/urlHelpers';

// =============================================
// HomePage: Página principal de recomendaciones
// Gestiona filtros, categorías, subcategorías y estado responsive.
// Optimizada para performance, móviles y desktop, con integración de stores y hooks avanzados.
// =============================================

interface Category {
  key: string;
  label: string;
  isMasterpiece?: boolean;
  color?: string;
  gradient?: string;
}

interface Subcategory {
  sub: string;
  label: string;
  [key: string]: any;
}

interface HomePageProps {
  categoryBarProps?: Record<string, any>;
  subcategoryBarProps?: Record<string, any>;
  materialCategorySelectProps?: Record<string, any>;
  specialButtonsProps?: Record<string, any>;
  renderCategoryButton?: (category: Category) => React.ReactNode;
  renderSubcategoryChip?: (subcategory: Subcategory) => React.ReactNode;
  categoryBarSx?: Record<string, any>;
  subcategoryBarSx?: Record<string, any>;
  materialCategorySelectSx?: Record<string, any>;
  [key: string]: any;
}

// Hook para detectar si es móvil SOLO por ancho de pantalla (robusto y compatible móvil)
function useIsMobile(): boolean {
  const getIsMobile = (): boolean => typeof window !== 'undefined' ? window.innerWidth < 900 : false;
  const [isMobile, setIsMobile] = React.useState<boolean>(getIsMobile());

  useIsomorphicLayoutEffect(() => {
    const handleResize = (): void => {
      const newIsMobile = getIsMobile();
      setIsMobile(prev => {
        if (prev !== newIsMobile) {
          return newIsMobile;
        }
        return prev;
      });
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    const timeoutId = setTimeout(handleResize, 100);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      clearTimeout(timeoutId);
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

interface AnimatedH1Props {
  isMobile: boolean;
  h1Gradient: string;
  onClick: () => void;
}

const AnimatedH1 = styled('h1')<AnimatedH1Props>(({ isMobile, h1Gradient }) => ({
  textTransform: 'capitalize',
  textAlign: 'center',
  margin: isMobile ? '48px 0 32px 0' : '70px auto 32px auto', // 48px para móvil (AppBar), 70px para desktop (menú fijo)
  fontWeight: 700,
  fontSize: isMobile ? '1.4rem' : '2.2rem',
  color: 'black',
  borderRadius: 0,
  position: 'relative',
  zIndex: isMobile ? 2 : 1, // En móvil: z-index 2 (por debajo del menú móvil que es 1200)
  border: 'none',
  width: isMobile ? '102%' : '99vw',
  maxWidth: isMobile ? '102%' : '1600px',
  minWidth: isMobile ? '102%' : '0',
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
  '&:hover': isMobile ? {} : {
    color: 'black',
    background: h1Gradient,
    boxShadow: 'none',
    cursor: 'default',
    filter: 'none',
    textDecoration: 'none',
  },
}));

const HomePageComponent: React.FC<HomePageProps> = ({
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
}) => {
  const location = useLocation();
  // Estado para filtro especial de música (debe ir antes de cualquier uso)
  const [musicFilterType, setMusicFilterType] = React.useState<string | undefined>(undefined);
  // Estado para filtro especial de batalla (battle)
  const [battleFilterActive, setBattleFilterActive] = React.useState<boolean>(false);
  const [isDetailClosing, setIsDetailClosing] = React.useState<boolean>(false);
  // Eliminar localSelectedItem y su lógica
  // const [localSelectedItem, setLocalSelectedItem] = React.useState<any>(null);

  const { lang, t, getTranslation } = useLanguage();
  // Hook para sincronizar títulos automáticamente
  useTitleSync();
  // Hook para Google Analytics
  const { trackCategorySelection, trackSubcategorySelection, trackFilterUsage, trackItemDetailView } = useGoogleAnalytics();
  // Hook para detectar si es móvil
  const isMobile = useIsMobile();
  
  // Estado para el Splash - ELIMINADO: Solo se maneja desde HomeLayout

  // Restaurar scroll al volver de un detalle SOLO cuando la ruta es '/' (SSR safe)
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      if (location.pathname === '/') {
        const y = sessionStorage.getItem('homeScrollY');
        if (y) {
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              window.scrollTo(0, parseInt(y, 10));
            }
            sessionStorage.removeItem('homeScrollY');
          }, 50);
        }
      }
    }
  }, [location.pathname]);

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
    updateFilteredItems,
    allData,
    isDataInitialized,
    updateWithRealData,
    updateTitleForLanguage,
    isSpanishSeriesActive,
    toggleSpanishSeries,
    setSpanishCinemaActive,
    setSpanishSeriesActive,
    setMasterpieceActive,
    resetAllFilters,
    generateNewRecommendations,
    // Estado de paginación del store global
    mobilePage,
    desktopPage,
    setMobilePage,
    setDesktopPage,
    resetPagination,
  } = useAppData();

  // Efecto para actualizar título cuando cambia el idioma
  useEffect(() => {
    if (lang) {
      updateTitleForLanguage();
    }
  }, [lang, selectedCategory, updateTitleForLanguage]);

  // Obtener funciones de procesamiento del store de vista
  const selectedItem = useAppStore((state: any) => state.selectedItem);
  const goToDetail = useAppStore((state: any) => state.goToDetail);
  const currentView = useAppStore((state: any) => state.currentView);
  
  // Obtener goBackFromDetail del hook useAppView
  const goBackFromDetail = useAppStore((state: any) => state.goBackFromDetail);
  
  // Función para manejar clic en el título principal (solo en móvil)
  const handleTitleClick = useCallback(() => {
    if (isMobile && (!selectedCategory || selectedCategory === 'all')) {
      resetAllFilters(lang);
      generateNewRecommendations();
      // Hacer scroll al top
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [isMobile, selectedCategory, resetAllFilters, generateNewRecommendations, lang]);
  
  // Eliminar efectos de sincronización localSelectedItem
  // useEffect(() => {
  //   if (selectedItem && selectedItem !== localSelectedItem) {
  //     setLocalSelectedItem(selectedItem);
  //   }
  // }, [selectedItem]);

  // useEffect(() => {
  //   if (currentView === 'home' && localSelectedItem !== null) {
  //     setLocalSelectedItem(null);
  //   }
  // }, [currentView]);

  const activePodcastDocumentaryLanguage = useAppStore(state => state.activePodcastDocumentaryLanguage);
  const resetActivePodcastDocumentaryLanguage = useAppStore(state => state.resetActivePodcastDocumentaryLanguage);

  // Sincronizar el store con la URL para SEO y navegación directa
  useEffect(() => {
    // Detectar si la URL es /detalle/:category/:id
    const match = location.pathname.match(/^\/detalle\/([^/]+)\/([^/]+)/);
    if (match) {
      const category = match[1];
      const id = match[2];
      // Buscar el ítem en allData
      if (allData && allData[category]) {
        const item = allData[category].find((it: any) => `${it.id}` === id);
        if (item) {
          // Si el store no está ya en modo detalle con ese ítem, actualizarlo
          if (currentView !== 'detail' || !selectedItem || selectedItem.id !== item.id) {
            goToDetail(item);
          }
        }
      }
    }
  }, [location.pathname, allData, currentView, selectedItem, goToDetail]);

  // Obtener categorías traducidas (se actualizará cuando cambie el idioma)
  const categoriesFromStore = getCategories();
  const categories = categoriesFromStore.map((cat: any) => ({
    ...cat,
    label: t?.categories?.[cat.key] || cat.label,
    isMasterpiece: cat.key === 'masterpiece' || cat.masterpiece === true,
    color: categoryColor(cat.key),
    gradient: getCategoryGradient(cat.key)
  }));

  // Obtener subcategorías del store para la categoría seleccionada
  const categorySubcategories = React.useMemo(() => {
    let subs = getSubcategoriesForCategory(selectedCategory || '');
    if (selectedCategory === 'boardgames' && Array.isArray(subs)) {
      return subs.map(({ sub, ...rest }: any) => {
        const normalized = normalizeSubcategoryInternal(sub);
        return {
          sub: normalized,
          label: getSubcategoryLabel(normalized, 'boardgames', t),
          ...rest
        };
      });
    }
    // Normalizar formato para todos los componentes parametrizables
    if (Array.isArray(subs)) {
      return subs.map((s: any) => {
        const normalized = typeof s === 'string' ? normalizeSubcategoryInternal(s) : s.sub;
        const label = getSubcategoryLabel(normalized, selectedCategory || '', t);
        return {
          sub: normalized,
          label,
          ...(typeof s === 'object' ? s : {})
        };
      });
    }
    return [];
  }, [selectedCategory, getSubcategoriesForCategory, t, lang]);

  // Convertir subcategorías para MaterialSubcategoryChips (desktop)
  const materialSubcategories = React.useMemo(() => {
    return categorySubcategories.map(({ sub, label, ...rest }) => ({
      key: sub,
      label: label || sub,
      ...rest
    }));
  }, [categorySubcategories]);

  const [isRecommendedActive, setIsRecommendedActive] = useState<boolean>(false);

  // Efecto para cargar datos reales - solo una vez
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
          updateFilteredItems(realData.recommendations?.length === 14 ? realData.recommendations : realData.recommendations?.concat(Object.values(realData.allData).flat().filter((item: any) => !realData.recommendations.some((r: any) => r.id === item.id)).slice(0, 14 - (realData.recommendations?.length || 0))) || []);
        }
      }).catch(error => {
        console.error('❌ Error en HomePage:', error);
      });
    }
    return () => {
      mounted = false;
    };
  }, [isDataInitialized, updateWithRealData]);

  // Reemplazar con useMemo para mejor rendimiento
  const filteredItemsMemo = React.useMemo(() => {
    if (!allData || Object.keys(allData).length === 0) {
      return [];
    }

    let filteredData: any[] = [];
    if (!selectedCategory || selectedCategory === 'all') {
      filteredData = recommendations;
    } else {
      filteredData = allData[selectedCategory || ''] || [];
    }
    
    if (selectedCategory && selectedCategory !== 'all') {
      if (selectedCategory === 'movies' && isSpanishCinemaActive) {
        filteredData = filteredData.filter((item: any) => {
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
        filteredData = filteredData.filter((item: any) => 
          item.masterpiece === true || 
          item.obra_maestra === true
        );
      }
      
      // Filtro de Series Españolas (solo para series)
      if (selectedCategory === 'series' && isSpanishSeriesActive) {
        filteredData = filteredData.filter((item: any) =>
          (item.tags && item.tags.includes('spanish'))
        );
      }
      
      // Filtro de idioma para Podcasts/Documentales
      if ((selectedCategory === 'podcast' || selectedCategory === 'documentales') && activePodcastDocumentaryLanguage) {
        filteredData = filteredData.filter((item: any) => item.idioma === activePodcastDocumentaryLanguage);
      }
      
      // Filtro especial para música: song/album/session (session busca djset)
      if (selectedCategory === 'music' && musicFilterType) {
        if (musicFilterType === 'session') {
          filteredData = filteredData.filter((item: any) => item.tags && item.tags.includes('djset'));
        } else {
          filteredData = filteredData.filter((item: any) => item.tags && item.tags.includes(musicFilterType));
        }
      }
      
      // Filtro especial para batalla: solo si está activo
      if (selectedCategory === 'music' && activeSubcategory === 'rap' && battleFilterActive) {
        filteredData = filteredData.filter((item: any) => item.tags && item.tags.includes('battle'));
      }
      
      // Filtro de subcategoría
      if (activeSubcategory && activeSubcategory !== 'all') {
        const normalizedActiveSubcat = normalizeSubcategoryInternal(activeSubcategory);
        filteredData = filteredData.filter((item: any) => {
          return (
            (item.subcategory && normalizeSubcategoryInternal(item.subcategory) === normalizedActiveSubcat)
            || (item.categoria && normalizeSubcategoryInternal(item.categoria) === normalizedActiveSubcat)
            || (item.genre && normalizeSubcategoryInternal(item.genre) === normalizedActiveSubcat)
            || (item.genero && normalizeSubcategoryInternal(item.genero) === normalizedActiveSubcat)
          );
        });
      }
    }
    
    return filteredData;
  }, [
    allData, recommendations, selectedCategory, isSpanishCinemaActive, 
    isMasterpieceActive, isSpanishSeriesActive, activePodcastDocumentaryLanguage,
    musicFilterType, activeSubcategory, battleFilterActive
  ]);

  // Estados para infinite scroll
  const [loadingMoreMobile, setLoadingMoreMobile] = useState<boolean>(false);
  const [loadingMoreDesktop, setLoadingMoreDesktop] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Calcular items paginados
  const itemsPerPage = isMobile ? 12 : 20;
  const currentPage = isMobile ? mobilePage : desktopPage;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredItemsMemo.slice(0, endIndex);

  // Función para cargar más items
  const handleLoadMore = useCallback(async () => {
    if (isMobile) {
      setLoadingMoreMobile(true);
    } else {
      setLoadingMoreDesktop(true);
    }

    // Simular delay para mejor UX
    await new Promise(resolve => setTimeout(resolve, 500));

    if (isMobile) {
      setMobilePage(currentPage + 1);
      setLoadingMoreMobile(false);
    } else {
      setDesktopPage(currentPage + 1);
      setLoadingMoreDesktop(false);
    }

    // Verificar si hay más items
    setHasMore(endIndex < filteredItemsMemo.length);
  }, [isMobile, currentPage, endIndex, filteredItemsMemo.length, setMobilePage, setDesktopPage]);

  // Función para manejar clic en categoría
  const handleCategoryClick = useCallback((category: string) => {
    setCategory(category);
    setActiveSubcategory('all');
    resetPagination();
    trackCategorySelection(category);
  }, [setCategory, setActiveSubcategory, resetPagination, trackCategorySelection]);

  // Función para manejar clic en subcategoría
  const handleSubcategoryClick = useCallback((subcategory: string) => {
    setActiveSubcategory(subcategory);
    resetPagination();
    trackSubcategorySelection(selectedCategory || '', subcategory);
  }, [setActiveSubcategory, resetPagination, trackSubcategorySelection, selectedCategory]);

  // Ajuste de firma para handleCategoryOrSubcategoryChange
  const handleCategoryOrSubcategoryChange = useCallback((category: string, subcategory: string | null) => {
    if (category !== selectedCategory) {
      handleCategoryClick(category);
    } else if (subcategory && subcategory !== activeSubcategory) {
      handleSubcategoryClick(subcategory);
    }
  }, [selectedCategory, activeSubcategory, handleCategoryClick, handleSubcategoryClick]);

  const navigate = useNavigate();
  const onOverlayNavigate = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  // Función para manejar clic en item
  const handleItemClick = useCallback((item: any) => {
    if (typeof window !== 'undefined' && window.innerWidth < 900) {
      // Solo en móviles, guardar scroll antes de navegar
      sessionStorage.setItem('homeScrollY', String(window.scrollY));
    }
    navigate(getLocalizedPath(`/detalle/${item.category}/${item.id}`, lang));
    if (typeof trackItemDetailView === 'function') {
      trackItemDetailView(String(item.id), item.title || item.name, item.category);
    }
  }, [navigate, trackItemDetailView, lang]);

  // Funciones para filtros especiales
  const handleSpanishCinemaToggle = useCallback(() => {
    toggleSpanishCinema();
    trackFilterUsage('spanish_cinema', selectedCategory || '');
  }, [toggleSpanishCinema, trackFilterUsage, selectedCategory]);

  const handleMasterpieceToggle = useCallback(() => {
    toggleMasterpiece();
    trackFilterUsage('masterpiece', selectedCategory || '');
  }, [toggleMasterpiece, trackFilterUsage, selectedCategory]);

  // Función segura para renderizar subcategorías
  const safeRenderSubcategoryChip = useCallback((subcategory: Subcategory) => {
    if (renderSubcategoryChip) {
      return renderSubcategoryChip(subcategory);
    }
    
    // Asegurar que tenemos valores válidos para la clave y el label
    const subValue = typeof subcategory.sub === 'string' ? subcategory.sub : 'sub';
    const labelValue = typeof subcategory.label === 'string' ? subcategory.label : 
                      (typeof subcategory.sub === 'string' ? subcategory.sub : 'Subcategory');
    
    return (
      <Chip
        key={`chip-${subValue}-${labelValue}-${Math.random().toString(36).substr(2, 9)}`}
        label={labelValue}
        size="small"
        style={{ margin: '2px' }}
      />
    );
  }, [renderSubcategoryChip]);

  // Función para renderizar chips en SubcategoryBar (firma compatible)
  const renderSubcategoryChipForBar = useCallback((subcategory: any, isActive: boolean, index: number) => {
    // Si subcategory es string, lo convertimos a objeto
    const subcategoryObj: Subcategory = typeof subcategory === 'string'
      ? { sub: subcategory, label: subcategory }
      : subcategory;
    return (
      <UiButton
        key={`chip-sub-${subcategoryObj.sub}-${index}`}
        className={`subcategory-btn${isActive ? ' active' : ''}`}
        variant="outlined"
        color="secondary"
        size="medium"
        icon={null}
        onClick={() => handleSubcategoryClick(subcategoryObj.sub || '')}
        sx={{
          background: isActive ? getCategoryGradient(selectedCategory || '') : 'var(--background-secondary)',
          color: isActive ? '#222' : 'var(--text-color)',
          border: isActive ? `2px solid ${getCategoryColor(selectedCategory || '') || 'var(--color-primary)'}` : '1.5px solid var(--border-color)',
          borderRadius: 'var(--border-radius-md)',
          padding: '6px 18px',
          fontSize: '1rem',
          fontWeight: isActive ? 700 : 500,
          margin: '0 4px 8px 0',
          minWidth: 80,
          transition: 'all 0.2s',
          boxShadow: isActive ? '0 2px 8px 0 rgba(0,0,0,0.08)' : 'none',
        }}
      >
        {subcategoryObj.label || subcategoryObj.sub}
      </UiButton>
    );
  }, [handleSubcategoryClick, selectedCategory]);

  // Calcular gradiente del título
  const h1Gradient = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'all') {
      // Paleta de grises oscuros, blanco y gris claro, evitando negro puro
      return 'linear-gradient(270deg, #222, #fff, #888, #444, #eee, #222)';
    }
    if (selectedCategory === 'masterpiece') {
      return getMasterpieceAnimatedGradient();
    }
    return getCategoryAnimatedGradient(selectedCategory);
  }, [selectedCategory]);

  // Elimina todos los console.log relacionados con ScrollRestore y depuración (SSR safe)
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      if (location.pathname === '/' && sessionStorage.getItem('homeScrollY')) {
        const y = sessionStorage.getItem('homeScrollY');
        if (y) {
          const targetY = parseInt(y, 10);
          let restored = false;
          const tryRestore = () => {
            if (document.body.scrollHeight > targetY + window.innerHeight) {
              if (typeof window !== 'undefined') {
                window.scrollTo(0, targetY);
              }
              sessionStorage.removeItem('homeScrollY');
              return true;
            }
            return false;
          };
          if (!tryRestore()) {
            const interval = setInterval(() => {
              if (tryRestore()) {
                clearInterval(interval);
              }
            }, 50);
            setTimeout(() => {
              if (!restored) {
                clearInterval(interval);
              }
            }, 1000); // Máximo 1s
          }
        }
      }
    }
  }, [location.pathname, filteredItemsMemo.length]);
  // Renderizar el componente
  const url = typeof window !== 'undefined' ? window.location.href : 'https://masterpiece.com/';
  const isIPhone = typeof navigator !== 'undefined' && /iPhone|iPod/.test(navigator.userAgent);
  const isCategory = selectedCategory && selectedCategory !== 'all';
  const isSubcategory = isCategory && activeSubcategory && activeSubcategory !== 'all';
  const categoryLabel = isCategory ? (t?.categories?.[selectedCategory] || selectedCategory) : '';
  const subcategoryLabel = isSubcategory ? (categorySubcategories.find(s => s.sub === activeSubcategory)?.label || activeSubcategory) : '';
  const pageTitle = isCategory
    ? (isSubcategory
        ? `${categoryLabel} - ${subcategoryLabel} | Masterpiece`
        : `${categoryLabel} | Masterpiece`)
    : 'Masterpiece - Recomendaciones culturales';
  const pageDescription = isCategory
    ? (isSubcategory
        ? `Explora las mejores recomendaciones de ${categoryLabel} en la subcategoría ${subcategoryLabel}.`
        : `Explora las mejores recomendaciones de ${categoryLabel}.`)
    : 'Descubre las mejores recomendaciones de películas, cómics, libros, música, videojuegos, juegos de mesa y podcasts.';
  return (
    <>
      <Helmet>
        <link rel="preload" as="image" href="/imagenes/splash.png" />
        <link rel="preload" as="image" href="/imagenes/descargas/pirate.jpg" />
        <title>{pageTitle || 'Masterpiece'}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={(() => {
          if (isCategory && selectedCategory) {
            // Mapeo de categorías a nombres de archivo OG
            const ogMap: Record<string, string> = {
              books: 'books',
              comics: 'comics',
              documentales: 'documentaries',
              boardgames: 'gameboard',
              movies: 'movies',
              music: 'music',
              podcast: 'podcasts',
              podcasts: 'podcasts',
              series: 'series',
              videogames: 'videogames',
              videogame: 'videogames',
            };
            const ogKey = ogMap[selectedCategory];
            if (ogKey) {
              return `https://masterpiece.es/og/${ogKey}.png`;
            }
          }
          return "https://masterpiece.es/imagenes/splash_image.png";
        })()} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={url} />
        {/* Etiquetas hreflang para SEO multilingüe */}
        <link rel="alternate" href={`https://masterpiece.com${isCategory && selectedCategory ? `/${selectedCategory}` : ''}`} hrefLang="es" />
        <link rel="alternate" href={`https://masterpiece.com/en${isCategory && selectedCategory ? `/${selectedCategory}` : ''}`} hrefLang="en" />
        <link rel="alternate" href={`https://masterpiece.com${isCategory && selectedCategory ? `/${selectedCategory}` : ''}`} hrefLang="x-default" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Masterpiece",
              "url": "https://masterpiece.com/",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://masterpiece.com/?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "description": "Recomendaciones de películas, cómics, libros, música, videojuegos, juegos de mesa y podcasts."
            }
          `}
        </script>
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Masterpiece",
              "url": "https://masterpiece.com/",
              "logo": "https://masterpiece.com/favicon.png"
            }
          `}
        </script>
      </Helmet>
      {/* Precarga invisible para asegurar caché en cliente (SSR safe) */}
      <img src="/imagenes/splash.png" alt="" style={{ display: 'none' }} aria-hidden="true" />
      <img src="https://github.com/t3rm1nus/masterpiece/raw/main/public/imagenes/descargas/pirate.jpg" alt="" style={{ display: 'none' }} aria-hidden="true" />
    <UiLayout>
      {/* Splash Dialog - ELIMINADO: Solo se muestra desde HomeLayout cuando el usuario hace clic en "Quiénes Somos" */}
      {/* Hybrid Menu */}
      <HybridMenu />
      {/* Detail Dialog SOLO en móvil */}
      {isMobile && currentView === 'detail' && !!selectedItem ? (
        <UnifiedItemDetail
          item={selectedItem}
          onClose={goBackFromDetail}
          isClosing={isDetailClosing}
        />
      ) : null}
      {/* Detail Overlay SOLO en desktop */}
      {/* Contenido principal */}
        <main>
          <header>
          <AnimatedH1 isMobile={isMobile} h1Gradient={h1Gradient} onClick={handleTitleClick}>
            {(!selectedCategory || selectedCategory === 'all')
              ? (t?.ui?.titles?.home_title || t?.home_title || 'Nuevas Recomendaciones')
              : (t?.categories?.[selectedCategory] || selectedCategory)
            }
          </AnimatedH1>
          {/* SOLO MÓVIL: Selector de categorías justo debajo del h1 */}
          {isMobile && categories.length > 0 && (
            <div style={{ width: '96vw', maxWidth: '96vw', margin: '0 auto', marginBottom: 4, marginTop: 4, zIndex: 1, position: 'relative', marginLeft: '10px' }}>
              <MaterialCategorySelect
                categories={categories}
                selectedCategory={selectedCategory || ''}
                onCategoryChange={handleCategoryOrSubcategoryChange}
                subcategories={categorySubcategories}
                activeSubcategory={activeSubcategory || ''}
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
                  isMobile={true}
                  musicFilterType={musicFilterType}
                  setMusicFilterType={setMusicFilterType}
                  activeSubcategory={activeSubcategory}
                  battleFilterActive={battleFilterActive}
                  setBattleFilterActive={setBattleFilterActive}
                  {...specialButtonsProps}
                />
              )}
            </div>
          )}
          {/* SOLO DESKTOP: Categorías, subcategorías y botones especiales */}
          {!isMobile && categories.length > 0 && (
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
                setActiveSubcategory={handleSubcategoryClick}
                renderChip={renderSubcategoryChipForBar}
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
                isMobile={false}
                musicFilterType={musicFilterType}
                setMusicFilterType={setMusicFilterType}
                activeSubcategory={activeSubcategory}
                battleFilterActive={battleFilterActive}
                setBattleFilterActive={setBattleFilterActive}
                {...specialButtonsProps}
              />
            </>
          )}
          </header>
          <section>
      {/* Render the recommendations list */}
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
                subcategories={isMobile ? categorySubcategories : materialSubcategories}
                activeSubcategory={activeSubcategory}
                onSubcategoryClick={handleSubcategoryClick}
                renderCategoryButton={renderCategoryButton}
                renderSubcategoryChip={safeRenderSubcategoryChip}
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
                onItemClick={handleItemClick}
                currentPage={isMobile ? mobilePage : desktopPage}
                totalItems={filteredItemsMemo.length}
                skipEntryAnimation={false}
              >
              {/* Desktop: Render the recommendations list as a child */}
              {!isMobile && (
                <DesktopRecommendationsList
                  items={paginatedItems}
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryClick={handleCategoryClick}
                    subcategories={materialSubcategories} // <-- Usar siempre el array con label
                  activeSubcategory={activeSubcategory}
                  onSubcategoryClick={handleSubcategoryClick}
                  renderCategoryButton={renderCategoryButton}
                  renderSubcategoryChip={safeRenderSubcategoryChip}
                  categoryBarSx={categoryBarSx}
                  subcategoryBarSx={subcategoryBarSx}
                  showCategoryBar={false}
                  showSubcategoryBar={false}
                  onLoadMore={handleLoadMore}
                  hasMore={hasMore}
                  loadingMore={loadingMoreDesktop}
                  categoryColor={categoryColor(selectedCategory)}
                  onItemClick={handleItemClick}
                  recommendations={paginatedItems}
                  isHome={false}
                  showCategorySelect={false}
                  showSubcategoryChips={false}
                />
              )}
            </MaterialContentWrapper>
          ) : (
            <RecommendationsList            
              items={filteredItemsMemo}
              onItemClick={handleItemClick}
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryClick={handleCategoryClick}
              showCategoryBar={false}
              showSubcategoryBar={false}
              showCategorySelect={isMobile ? false : undefined}
              showSubcategoryChips={isMobile ? false : undefined}
              loading={!isDataInitialized || !allData || Object.keys(allData).length === 0}
            />
          )}
        </div>
          </section>
        </main>
    </UiLayout>
    </>
  );
};

// Fuera del componente HomePage
function categoryColor(categoryKey: string): string {
  // Definir colores específicos para categorías concretas
  const specificColors: Record<string, string> = {
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

export default React.memo(HomePageComponent); 