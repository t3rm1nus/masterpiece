import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLanguage } from '../LanguageContext';
import { useAppView, useAppTheme, useAppData } from '../store/useAppStore';
import { getCategoryColor, getCategoryGradient } from '../utils/categoryPalette';
import { ensureString } from '../utils/stringUtils';
import { useTrailerUrl } from '../hooks/useTrailerUrl';
import { applyDetailScrollFixForIPhone, isIPhone } from '../utils/iPhoneScrollFix';
import MobileItemDetail from './shared/MobileItemDetail';
import { MobileActionButtons, DesktopActionButtons } from './shared/ItemActionButtons';
import { MobileCategorySpecificContent, DesktopCategorySpecificContent } from './shared/CategorySpecificContent';
import { processTitle, processDescription } from '../store/utils';
import { useParams, useNavigate } from 'react-router-dom';
import { findItemByGlobalId } from '../utils/appUtils';
import { CircularProgress } from '@mui/material';
import DesktopItemDetail from './shared/DesktopItemDetail';
import { Helmet } from 'react-helmet-async';
import useIsomorphicLayoutEffect from '../hooks/useIsomorphicLayoutEffect';
import { getLocalizedPath } from '../utils/urlHelpers';
import { useShare } from '../hooks/useShare';

// Material UI imports (solo para mobile)
import {
  Fab,
  useTheme,
  useMediaQuery,
  Box,
  Typography,
  Chip,
  Stack,
  Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import MovieIcon from '@mui/icons-material/Movie';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import MicIcon from '@mui/icons-material/Mic';
import ExtensionIcon from '@mui/icons-material/Extension';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import CodeIcon from '@mui/icons-material/Code';
import GamepadIcon from '@mui/icons-material/Gamepad';
import TranslateIcon from '@mui/icons-material/Translate';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';

// =============================================
// UnifiedItemDetail: Componente de detalle unificado para ítems
// Optimizado para móviles y desktop, soporta accesibilidad, animaciones y customización avanzada por categoría.
// =============================================

// Definir estilos CSS-in-JS
const styles: any = {
  page: (theme: any) => ({
    background: '#ffffff', // Fondo blanco sólido
    position: 'fixed',
    top: '70px', // Espacio para el menú superior en desktop
    left: 0,
    width: '100vw',
    height: 'calc(100vh - 70px)',
    color: 'var(--text-color)',
    padding: 0,
    margin: 0,
    overflowY: 'auto',
    zIndex: 1050, // Bajado para que el menú híbrido (1100) quede por encima
  }),
  desktopWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 40,
    maxWidth: 1000,
    margin: '40px auto 0 auto', // Ajustar margen superior para compensar el top del contenedor padre
    padding: '32px 24px',
    background: 'transparent', // Sin fondo para que use el del contenedor padre
    borderRadius: 24,
    boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
    position: 'relative',
    zIndex: 1,
  },
  desktopWrapperMasterpiece: {
    boxShadow: '0 0 0 4px gold, 0 8px 32px rgba(255,215,0,0.15), 0 8px 32px rgba(0,0,0,0.10)',
    borderRadius: 24,
    background: 'linear-gradient(120deg, #fffbe6 0%, #ffe066 100%)',
    position: 'relative',
    zIndex: 2,
  },
  desktopBadge: {
    position: 'absolute',
    top: -28,
    left: 24,
    zIndex: 20,
    width: 48,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    filter: 'drop-shadow(0 4px 12px rgba(255,215,0,0.4))',
    animation: 'pulseGlow 2s ease-in-out infinite',
  },
  desktopBadgeRight: {
    position: 'absolute',
    top: -22,
    right: -23,
    zIndex: 30,
    width: 44,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    filter: 'drop-shadow(0 4px 16px rgba(255,215,0,0.5))',
    border: '2.5px solid #111',
    borderRadius: '50%',
    background: '#FFD700',
    boxSizing: 'border-box',
    animation: 'pulseGlow 2s ease-in-out infinite',
    transition: 'box-shadow 0.3s',
  },
  leftCol: {
    flex: '0 0 320px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minWidth: 260,
    maxWidth: 340,
    marginRight: 0,
  },
  rightCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    minWidth: 0,
    maxWidth: 600,
    paddingLeft: 0,
  },
  imageContainer: {
    position: 'relative',
    display: 'inline-block',
    marginBottom: 'var(--space-lg)',
    perspective: 1000,
    transition: 'box-shadow 0.4s',
  },
  imageContainerMasterpiece: {
    boxShadow: '0 0 0 4px gold, 0 8px 32px rgba(255,215,0,0.15), 0 8px 32px rgba(0,0,0,0.10)',
    borderRadius: 24,
    background: 'linear-gradient(120deg, #fffbe6 0%, #ffe066 100%)',
    padding: 8,
    position: 'relative',
    zIndex: 2,
  },
  image: {
    maxWidth: '100%',
    maxHeight: 450,
    width: 'auto',
    height: 'auto',
    borderRadius: 20,
    boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.1), 0 5px 10px rgba(0,0,0,0.1)',
    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    transformStyle: 'preserve-3d',
    border: '2px solid #111', // Borde negro en todos los dispositivos
  },
  imageHover: {
    transform: 'scale(1.03) rotateY(5deg)',
    boxShadow: '0 30px 60px rgba(0,0,0,0.15), 0 15px 30px rgba(0,0,0,0.12), 0 8px 15px rgba(0,0,0,0.1)',
  },
  badge: {
    position: 'absolute',
    top: -18,
    right: -18,
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: 'radial-gradient(circle, gold 60%, #fffbe6 100%)',
    boxShadow: '0 0 16px 4px rgba(255,215,0,0.25)',
    animation: 'pulseGlow 2s ease-in-out infinite',
    filter: 'drop-shadow(0 4px 12px rgba(255,215,0,0.4))',
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    margin: '0 0 12px 0',
    color: 'var(--text-color)',
    lineHeight: 1.1,
    textAlign: 'left',
  },
  chipRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  chip: {
    color: '#fff',
    fontWeight: 600,
    fontSize: 14,
    borderRadius: 16,
    padding: '4px 14px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
    letterSpacing: 0.2,
    marginRight: 0,
    marginBottom: 0,
    display: 'inline-block',
    minWidth: 48,
    textAlign: 'center',
    border: '2px solid #fff',
    textShadow: '0 1px 4px rgba(0,0,0,0.18)',
  },
  metaRow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    marginBottom: 18,
    alignItems: 'center',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 15,
    color: 'var(--text-color)',
    background: 'rgba(0,0,0,0.06)',
    borderRadius: 12,
    padding: '2px 10px 2px 6px',
    fontWeight: 500,
    marginRight: 0,
    marginBottom: 0,
    lineHeight: 1.2,
  },
  metaIcon: {
    fontSize: 18,
    marginRight: 6,
    opacity: 0.7,
  },
  description: {
    fontSize: 17,
    color: 'var(--text-color)',
    margin: '0 0 22px 0',
    lineHeight: 1.6,
    textAlign: 'left',
    whiteSpace: 'pre-line',
  },
  actionsRow: {
    margin: '10px 0 18px 0',
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  extraContentRow: {
    marginTop: 10,
    width: '100%',
  },
  descriptionRow: {
    marginBottom: 22,
  },
};

interface Item {
  id: string | number;
  title?: string;
  name?: string;
  description?: any;
  category?: string;
  trailer?: string;
  [key: string]: any;
}

interface UnifiedItemDetailProps {
  item?: Item;
  category?: string;
  id?: string | number;
  selectedCategory?: string;
  onClose?: () => void;
  onBack?: () => void;
  onOverlayNavigate?: (path: string) => void;
  renderMobileActionButtons?: () => React.ReactNode;
  renderDesktopActionButtons?: () => React.ReactNode;
  renderMobileSpecificContent?: () => React.ReactNode;
  renderDesktopSpecificContent?: () => React.ReactNode;
  showSections?: {
    trailer?: boolean;
    description?: boolean;
    [key: string]: boolean | undefined;
  };
  isClosing?: boolean;
  getSubcategoryTranslation?: (subcategory: any, category: string | null) => string;
}

/**
 * UnifiedItemDetail: Detalle unificado de ítem para todas las categorías.
 * Permite pasar acciones extra, customizar layout y mostrar/ocultar secciones.
 */
const UnifiedItemDetail: React.FC<UnifiedItemDetailProps> = (props) => {
  // 1. TODOS los hooks y variables aquí arriba
  const category = props.category;
  const id = props.id;
  const { allData, selectedCategory: storeSelectedCategory, isDataInitialized } = useAppData();
  const selectedCategory = props.selectedCategory || storeSelectedCategory;
  const { lang, t, getCategoryTranslation, getSubcategoryTranslation, getTranslation } = useLanguage();
  const { goToHowToDownload } = useAppView();
  const goBackFromDetail = () => {
    if (props.onClose) {
      props.onClose();
    } else {
      window.history.back();
    }
  };
  const { getMasterpieceBadgeConfig } = useAppTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const badgeConfig = getMasterpieceBadgeConfig();
  const [imgLoaded, setImgLoaded] = React.useState<boolean>(false);
  const [imageHover, setImageHover] = React.useState<boolean>(false);
  const [internalClosing, setInternalClosing] = React.useState<boolean>(false);
  const [isVisible, setIsVisible] = React.useState<boolean>(false);
  const lastItemRef = React.useRef<Item | null>(null);
  const navigate = useNavigate();
  
  React.useEffect(() => {
  }, [props.category, props.id]);
  
  // 2. Lógica de obtención de selectedItem DESPUÉS de los hooks
  let selectedItem: Item | null = props.item || null;
  if (!selectedItem && id && allData && category && allData[category]) {
    selectedItem = allData[category].find((item: Item) => `${item.id}` === `${id}`) || null;
  }
  
  if (!selectedItem) {
    if (typeof window === 'undefined') {
      // Solo log en SSR
      console.log('SSR UnifiedItemDetail: selectedItem es null', { category, id, allDataKeys: allData ? Object.keys(allData) : null });
    }
  }
  
  // Hook para trailer URL - debe estar antes de cualquier return condicional
  const trailerUrl = useTrailerUrl(selectedItem?.trailer || '');
  
  // Guardar referencia al último item mostrado
  useEffect(() => {
    if (selectedItem) lastItemRef.current = selectedItem;
  }, [selectedItem]);

  // Animación fade in al cargar el detalle
  useIsomorphicLayoutEffect(() => {
    if (selectedItem) {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [selectedItem]);

  // Aplicar fixes específicos para iPhone cuando el componente se monta
  useIsomorphicLayoutEffect(() => {
    if (isIPhone() && selectedItem) {
      const timer = setTimeout(() => {
        applyDetailScrollFixForIPhone();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [selectedItem]);

  // Handler simplificado para cerrar - DEBE estar antes de cualquier return condicional
  const handleClose = useCallback(() => {
    if (internalClosing) return;
    setInternalClosing(true);
    
    if (props.onOverlayNavigate) {
      // No guardar scroll al cerrar, solo al abrir
      props.onOverlayNavigate(getLocalizedPath('/', lang));
      return;
    }
    if (typeof props.onBack === 'function') {
      props.onBack();
    } else {
      goBackFromDetail();
    }
    // Navegar siempre a la Home para limpiar la URL
    navigate(getLocalizedPath('/', lang));
  }, [internalClosing, props.onOverlayNavigate, props.onBack, goBackFromDetail, navigate, lang]);

  // Handler para navegación con overlay
  const handleOverlayNavigate = useCallback((path: string): void => {
    window.dispatchEvent(new CustomEvent('overlay-detail-exit'));
    setTimeout(() => {
      window.location.href = path;
    }, 400);
  }, []);

  const { share } = useShare();
  const canShare = typeof share === 'function';

  // Añadir handler para compartir
  const handleShare = () => {
    if (!canShare) {
      alert('La función de compartir no está disponible en este dispositivo o navegador.');
      return;
    }
    const currentLang = lang || 'es';
    const title = selectedItem?.title || selectedItem?.name || 'Recomendación de Masterpiece';
    let description = 'Mira esta recomendación en Masterpiece';
    if (selectedItem?.description) {
      if (typeof selectedItem.description === 'string') {
        description = selectedItem.description;
      } else if (typeof selectedItem.description === 'object') {
        description =
          (currentLang && selectedItem.description[currentLang] && typeof selectedItem.description[currentLang] === 'string' && selectedItem.description[currentLang]) ||
          selectedItem.description.es ||
          selectedItem.description.en ||
          Object.values(selectedItem.description).find(v => typeof v === 'string') ||
          description;
      }
    }
    const url = typeof window !== 'undefined' ? window.location.href : 'https://masterpiece.es/';
    share({
      title: String(title),
      text: String(description),
      url: String(url),
      dialogTitle: 'Compartir recomendación'
    });
  };

  // Guardar scroll al navegar al detalle (solo en móviles)
  // useEffect(() => {
  //   if (typeof window !== 'undefined' && isMobile) {
  //     console.log('[UnifiedItemDetail] Guardando scrollY al entrar en detalle:', window.scrollY);
  //     sessionStorage.setItem('homeScrollY', String(window.scrollY));
  //   }
  // }, []);

  // Centralizar lógica de imagen OG
  function getOgImage(item: Item) {
    if (item && item.image && typeof item.image === 'string' && item.image.startsWith('http')) {
      return item.image;
    }
    if (item && item.category) {
      const ogMap: { [key: string]: string } = {
        books: 'books', comics: 'comics', documentales: 'documentaries', boardgames: 'gameboard', movies: 'movies', music: 'music', podcast: 'podcasts', podcasts: 'podcasts', series: 'series', videogames: 'videogames', videogame: 'videogames',
      };
      const ogKey = ogMap[item.category as string] || null;
      if (ogKey) return `https://masterpiece.es/og/${ogKey}.png`;
    }
    // Solo usar el splash si no hay imagen de categoría ni de item
    return 'https://masterpiece.es/imagenes/splash_image.png';
  }

  // Definir getJsonLd al principio para que esté disponible siempre
  function getJsonLd(item: Item = { id: '' }) {
    const itemTitle = (item as any).title || (item as any).name || 'Detalle - Masterpiece';
    const itemDescription = (item as any).description || 'Descubre detalles de esta obra recomendada en Masterpiece.';
    const itemImage = getOgImage(item);
    const itemUrl = typeof window !== 'undefined'
      ? window.location.href
      : (item ? `https://masterpiece.es/detalle/${(item as any).category || 'detalle'}/${(item as any).id}` : 'https://masterpiece.es/');
    const base = {
      '@context': 'https://schema.org',
      name: itemTitle,
      description: itemDescription,
      image: itemImage,
      url: itemUrl,
      inLanguage: 'es',
      publisher: {
        '@type': 'Organization',
        name: 'Masterpiece',
        url: 'https://masterpiece.com/'
      }
    };
    // Obtener subcategoría traducida si existe
    let translatedSubcat: string | undefined = undefined;
    if (item.subcategory) {
      if (typeof props.getSubcategoryTranslation === 'function') {
        translatedSubcat = props.getSubcategoryTranslation(item.subcategory, item.category || '');
      } else if (typeof item.subcategory === 'string') {
        translatedSubcat = item.subcategory;
      }
    }
    switch ((item.category || '').toLowerCase()) {
      case 'movies':
        return {
          ...base,
          '@type': 'Movie',
          datePublished: item.year || undefined,
          director: item.director ? { '@type': 'Person', name: item.director } : undefined,
          actor: item.actors ? item.actors.map((a: any) => ({ '@type': 'Person', name: a })) : undefined,
          ...(translatedSubcat ? { genre: translatedSubcat } : {})
        };
      case 'documentales':
        return {
          ...base,
          '@type': 'Movie',
          genre: 'Documentary',
          datePublished: item.year || undefined,
          director: item.director ? { '@type': 'Person', name: item.director } : undefined,
          actor: item.actors ? item.actors.map((a: any) => ({ '@type': 'Person', name: a })) : undefined,
          ...(translatedSubcat ? { genre: translatedSubcat } : {})
        };
      case 'series':
        return {
          ...base,
          '@type': 'TVSeries',
          datePublished: item.year || undefined,
          actor: item.actors ? item.actors.map((a: any) => ({ '@type': 'Person', name: a })) : undefined,
          director: item.director ? { '@type': 'Person', name: item.director } : undefined,
          ...(translatedSubcat ? { genre: translatedSubcat } : {})
        };
      case 'books':
        return {
          ...base,
          '@type': 'Book',
          author: item.author ? { '@type': 'Person', name: item.author } : undefined,
          datePublished: item.year || undefined,
          isbn: item.isbn || undefined,
          ...(translatedSubcat ? { bookGenre: translatedSubcat } : {})
        };
      case 'comics':
        return {
          ...base,
          '@type': 'Book',
          bookFormat: 'GraphicNovel',
          author: item.author ? { '@type': 'Person', name: item.author } : undefined,
          datePublished: item.year || undefined,
          ...(translatedSubcat ? { bookGenre: translatedSubcat } : {})
        };
      case 'music':
        return {
          ...base,
          '@type': 'MusicAlbum',
          byArtist: item.author ? { '@type': 'MusicGroup', name: item.author } : undefined,
          datePublished: item.year || undefined,
          ...(translatedSubcat ? { genre: translatedSubcat } : {})
        };
      case 'videogames':
        return {
          ...base,
          '@type': 'VideoGame',
          author: item.author ? { '@type': 'Person', name: item.author } : undefined,
          datePublished: item.year || undefined,
          ...(translatedSubcat ? { genre: translatedSubcat } : {})
        };
      case 'boardgames':
        return {
          ...base,
          '@type': 'BoardGame',
          author: item.author ? { '@type': 'Person', name: item.author } : undefined,
          datePublished: item.year || undefined,
          ...(translatedSubcat ? { genre: translatedSubcat } : {})
        };
      case 'podcast':
      case 'podcasts':
        return {
          ...base,
          '@type': 'PodcastSeries',
          author: item.author ? { '@type': 'Person', name: item.author } : undefined,
          datePublished: item.year || undefined,
          ...(translatedSubcat ? { genre: translatedSubcat } : {})
        };
      default:
        return {
          ...base,
          '@type': 'CreativeWork',
          ...(translatedSubcat ? { genre: translatedSubcat } : {})
        };
    }
  }

  // Renderizado para móviles usando subcomponente
  if (isMobile) {
    const safeItem: Item | undefined = props.item || selectedItem || (lastItemRef.current === null ? undefined : lastItemRef.current);
    if (!safeItem) {
      return null;
    }
    // Calcular valores OG usando safeItem o valores por defecto
    const ogTitle = safeItem?.title || safeItem?.name || 'Masterpiece';
    const ogDescription = typeof safeItem?.description === 'string'
      ? safeItem?.description
      : (safeItem?.description?.es || safeItem?.description?.en || 'Descubre detalles de esta obra recomendada en Masterpiece.');
    const ogImage = getOgImage(safeItem ? safeItem : { id: '' });
    const ogUrl = typeof window !== 'undefined' ? window.location.href : (safeItem ? `https://masterpiece.es/detalle/${safeItem.category || 'detalle'}/${safeItem.id}` : 'https://masterpiece.es/');

    // Helmet siempre presente
    const helmetMeta = (
      <Helmet>
        <title>{(ogTitle || 'Detalle') + ' | Masterpiece'}</title>
        <meta name="description" content={ogDescription} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={ogUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={ogUrl} />
        <link rel="alternate" href={`https://masterpiece.com/${safeItem?.category || 'detalle'}/${safeItem?.id || ''}`} hrefLang="es" />
        <link rel="alternate" href={`https://masterpiece.com/en/${safeItem?.category || 'detalle'}/${safeItem?.id || ''}`} hrefLang="en" />
        <link rel="alternate" href={`https://masterpiece.com/${safeItem?.category || 'detalle'}/${safeItem?.id || ''}`} hrefLang="x-default" />
        <script type="application/ld+json">{JSON.stringify(getJsonLd(safeItem ? safeItem : { id: '' }))}</script>
      </Helmet>
    );

    return (
      <>
        {helmetMeta}
        <Box
          sx={{
            position: 'fixed',
            top: '49px',
            left: 0,
            width: '100vw',
            height: 'calc(100vh - 49px)',
            background: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(2px)',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            scrollBehavior: 'smooth',
            zIndex: 1100,
            isolation: 'isolate',
          }}
        >
          {safeItem && (
            <MobileItemDetail
              selectedItem={safeItem}
              title={ogTitle}
              description={ogDescription}
              lang={lang}
              t={t}
              theme={theme}
              getCategoryTranslation={getCategoryTranslation}
              getSubcategoryTranslation={getSubcategoryTranslation}
              getTranslation={getTranslation}
              goBackFromDetail={goBackFromDetail}
              goToHowToDownload={goToHowToDownload}
              imgLoaded={imgLoaded}
              setImgLoaded={setImgLoaded}
              renderMobileSpecificContent={props.renderMobileSpecificContent}
              renderMobileActionButtons={props.renderMobileActionButtons}
              showSections={props.showSections ? Object.fromEntries(Object.entries(props.showSections).map(([k, v]) => [k, !!v])) as Record<string, boolean> : {}}
              isClosing={props.isClosing || false}
              onClose={handleClose}
              onBack={handleClose}
              renderHeader={undefined}
              renderImage={undefined}
              renderCategory={undefined}
              renderSubcategory={undefined}
              renderYear={undefined}
              renderDescription={undefined}
              renderActions={undefined}
              renderFooter={undefined}
            />
          )}
        </Box>
      </>
    );
  }

  // Renderizado para desktop usando estilos CSS-in-JS directamente
  if (!isMobile) {
    const safeItem: Item | undefined = props.item || selectedItem || (lastItemRef.current === null ? undefined : lastItemRef.current);
    if (!safeItem) {
      return null;
    }
    const realCategory = safeItem?.category || selectedCategory;
    // Asegurar que ogTitle y ogDescription sean siempre strings
    const ogTitle = typeof (safeItem?.title || safeItem?.name) === 'string'
      ? (safeItem?.title || safeItem?.name)
      : (typeof safeItem?.title === 'object' && safeItem?.title !== null ? (safeItem?.title[lang] || (safeItem?.title as any).es || (safeItem?.title as any).en) : undefined)
        || (typeof safeItem?.name === 'object' && safeItem?.name !== null ? (safeItem?.name[lang] || (safeItem?.name as any).es || (safeItem?.name as any).en) : undefined)
        || 'Masterpiece';
    const ogDescription = typeof safeItem?.description === 'string'
      ? safeItem.description
      : (typeof safeItem?.description === 'object' && safeItem?.description !== null ? (safeItem?.description[lang] || (safeItem?.description as any).es || (safeItem?.description as any).en) : undefined)
        || 'Descubre detalles de esta obra recomendada en Masterpiece.';
    const ogImage = getOgImage(safeItem);
    // Construir la URL canónica pública preferida
    const baseUrl = 'https://masterpiece.es';
    const currentLang = lang || 'es';
    const ogUrl = currentLang === 'en'
      ? `${baseUrl}/en/${safeItem.category || 'detalle'}/${safeItem.id}`
      : `${baseUrl}/${safeItem.category || 'detalle'}/${safeItem.id}`;
    const isMasterpiece = !!safeItem.masterpiece;
    const categoryColor = getCategoryColor(realCategory, 'color');
    const gradientBg = `linear-gradient(135deg, ${categoryColor} 0%, ${theme.palette.mode === 'dark' ? 'rgba(24,24,24,0.92)' : 'rgba(255,255,255,0.85)'} 100%)`;

    // Helmet siempre presente
    const helmetMeta = (
      <Helmet>
        <meta name="ssr-debug-detail" content="SSR_HELMET_DETAIL_OK" />
        <title>{(ogTitle || 'Detalle') + ' | Masterpiece'}</title>
        <meta name="description" content={ogDescription} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={ogUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={ogUrl} />
        <link rel="alternate" href={`https://masterpiece.com/${safeItem.category || 'detalle'}/${safeItem.id}`} hrefLang="es" />
        <link rel="alternate" href={`https://masterpiece.com/en/${safeItem.category || 'detalle'}/${safeItem.id}`} hrefLang="en" />
        <link rel="alternate" href={`https://masterpiece.com/${safeItem.category || 'detalle'}/${safeItem.id}`} hrefLang="x-default" />
        <script type="application/ld+json">{JSON.stringify(getJsonLd(safeItem ? safeItem : { id: '' }))}</script>
      </Helmet>
    );

    return (
      <>
        {helmetMeta}
        <article>
          <div
            key={safeItem.id}
            style={{
              ...styles.page(theme),
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'scale(1)' : 'scale(0.95)',
              transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-out',
            }}
          >
            <div
              style={{
                ...styles.desktopWrapper,
                ...(isMasterpiece ? styles.desktopWrapperMasterpiece : {}),
                ...(isMasterpiece ? {} : { background: gradientBg })
              }}
            >
              {/* Botón volver FAB azul arriba a la izquierda, igual que en donaciones/descargar */}
              <Fab
                color="primary"
                size="large"
                aria-label={typeof t === 'function' ? t('Volver') : 'Volver'}
                onClick={handleClose}
                sx={{
                  position: 'absolute',
                  top: 18,
                  left: 18,
                  zIndex: 50,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                  opacity: (internalClosing || props.isClosing) ? 0.5 : 1,
                  cursor: (internalClosing || props.isClosing) ? 'not-allowed' : 'pointer',
                  transition: 'none',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                    transform: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.10)'
                  }
                }}
                tabIndex={0}
                disabled={internalClosing || props.isClosing}
              >
                <ArrowBackIcon style={{ fontSize: 28, color: '#fff' }} />
              </Fab>
              {isMasterpiece && (
                <div style={styles.desktopBadgeRight}>
                  {/* SVG estrella solo negro */}
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="22" cy="22" r="22" fill="#FFD700"/>
                    <path
                      d="M22 10l3.6 7.3 8.1 1.2-5.85 5.7 1.38 8.06L22 28.1l-7.23 3.8 1.38-8.06L10.3 18.5l8.1-1.2L22 10z"
                      fill="#111"
                    />
                  </svg>
                </div>
              )}
              {/* MAQUETACIÓN CORRECTA: leftCol (imagen) y rightCol (textos) como hermanos */}
              <div style={styles.leftCol}>
                <figure style={styles.imageContainer}>
                  <img
                    src={safeItem.image}
                    alt={`Portada de ${ogTitle}`}
                    style={imageHover ? { ...styles.image, ...styles.imageHover } : styles.image}
                    onLoad={() => setImgLoaded(true)}
                    onMouseEnter={() => setImageHover(true)}
                    onMouseLeave={() => setImageHover(false)}
                    loading="lazy"
                  />
                  <figcaption style={{ textAlign: 'center', fontSize: '0.95em', color: '#666' }}>{ogTitle}</figcaption>
                </figure>
              </div>
              <div style={styles.rightCol}>
                <header>
                  {/* Título y metadatos */}
                  <h2 style={styles.title}>{ogTitle}</h2>
                  <div style={styles.chipRow}>
                    <span style={{...styles.chip, background: getCategoryColor(realCategory, 'strong')}}>
                      {getCategoryTranslation(realCategory)}
                    </span>
                    {safeItem.subcategory && (
                      <span style={{...styles.chip, background: getCategoryColor(realCategory, 'strong')}}>
                        {(() => {
                          const subcat = safeItem.subcategory;
                          if (typeof subcat === 'object' && subcat !== null) {
                            if (subcat[lang]) return ensureString(subcat[lang], lang);
                            const firstValue = Object.values(subcat)[0];
                            return ensureString(firstValue, lang);
                          }
                          return ensureString(getSubcategoryTranslation(subcat), lang);
                        })()}
                      </span>
                    )}
                  </div>
                  <div style={styles.metaRow}>
                    {/* Mostrar autor/artista para música */}
                    {safeItem.category === 'music' && safeItem.artist && (
                      <span style={styles.meta}><PersonIcon style={styles.metaIcon}/> {safeItem.artist}</span>
                    )}
                    {/* Mostrar autor para otras categorías */}
                    {safeItem.category !== 'music' && safeItem.author && (
                      <span style={styles.meta}><PersonIcon style={styles.metaIcon}/> {safeItem.author}</span>
                    )}
                    {safeItem.year && (
                      <span style={styles.meta}><AccessTimeIcon style={styles.metaIcon}/> {safeItem.year}</span>
                    )}
                    {safeItem.duration && (
                      <span style={styles.meta}><PlaylistPlayIcon style={styles.metaIcon}/> {safeItem.duration}</span>
                    )}
                    {safeItem.language && (
                      <span style={styles.meta}><TranslateIcon style={styles.metaIcon}/> {safeItem.language}</span>
                    )}
                    {safeItem.platform && (
                      <span style={styles.meta}><GamepadIcon style={styles.metaIcon}/> {safeItem.platform}</span>
                    )}
                    {safeItem.age && (
                      <span style={styles.meta}><ChildCareIcon style={styles.metaIcon}/> {safeItem.age}+</span>
                    )}
                    {safeItem.developer && (
                      <span style={styles.meta}><CodeIcon style={styles.metaIcon}/> {safeItem.developer}</span>
                    )}
                  </div>
                </header>
                <section style={styles.descriptionRow}>
                  <p style={styles.description}>{ogDescription}</p>
                </section>
                <div style={styles.extraContentRow}>
                  <DesktopCategorySpecificContent selectedItem={safeItem} lang={lang} t={t} getTranslation={getTranslation} />
                </div>
                <div style={styles.actionsRow}>
                  <DesktopActionButtons
                    selectedItem={safeItem}
                    trailerUrl={trailerUrl}
                    lang={lang}
                    t={t}
                    goToHowToDownload={goToHowToDownload}
                    onOverlayNavigate={props.onOverlayNavigate}
                  />
                  {canShare && (
                    <img
                      src="/icons/share.png"
                      alt="Compartir"
                      style={{
                        position: 'absolute',
                        bottom: 12,
                        right: 12,
                        width: 48,
                        height: 48,
                        zIndex: 1200,
                        cursor: 'pointer',
                      }}
                      onClick={handleShare}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </article>
      </>
    );
  }

  // Return por defecto (nunca debería llegar aquí)
  return null;
}

export default UnifiedItemDetail;