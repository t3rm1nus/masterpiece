import React, { useEffect, useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { useAppView, useAppTheme, useAppData } from '../store/useAppStore';
import { getCategoryColor, getCategoryGradient } from '../utils/categoryPalette';
import { ensureString } from '../utils/stringUtils';
import { useTrailerUrl } from '../hooks/useTrailerUrl';
import MobileItemDetail from './shared/MobileItemDetail';
import { MobileActionButtons, DesktopActionButtons } from './shared/ItemActionButtons';
import { MobileCategorySpecificContent, DesktopCategorySpecificContent } from './shared/CategorySpecificContent';
import { processTitle, processDescription } from '../store/utils';
import { useParams, useNavigate } from 'react-router-dom';
import { findItemByGlobalId } from '../utils/appUtils';
import useBackNavigation from '../hooks/useBackNavigation';
import { CircularProgress } from '@mui/material';

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
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  ChildCare as ChildCareIcon,
  Code as DeveloperIcon,
  Gamepad as PlatformIcon,
  Translate as TranslateIcon,
  PlaylistPlay as PlaylistPlayIcon
} from '@mui/icons-material';

// =============================================
// UnifiedItemDetail: Componente de detalle unificado para ítems
// Optimizado para móviles y desktop, soporta accesibilidad, animaciones y customización avanzada por categoría.
// =============================================

/**
 * UnifiedItemDetail: Detalle unificado de ítem para todas las categorías.
 * Permite pasar acciones extra, customizar layout y mostrar/ocultar secciones.
 *
 * Props:
 * - item: objeto de datos del ítem a mostrar
 * - onClose: función para cerrar el detalle
 * - selectedCategory: string (categoría activa)
 * - renderMobileActionButtons: función opcional para renderizar acciones extra en mobile
 * - renderDesktopActionButtons: función opcional para renderizar acciones extra en desktop
 * - renderMobileSpecificContent: función opcional para renderizar contenido extra en mobile
 * - renderDesktopSpecificContent: función opcional para renderizar contenido extra en desktop
 * - showSections: objeto opcional para mostrar/ocultar secciones (por ejemplo: { trailer: true, description: false })
 *
 * Ejemplo de uso:
 * <UnifiedItemDetail
 *   item={item}
 *   onClose={() => setOpen(false)}
 *   selectedCategory="movies"
 *   renderMobileActionButtons={() => <CustomActions />}
 *   showSections={{ trailer: true, description: false }}
 * />
 */
export default function UnifiedItemDetail(props) {
  // 1. TODOS los hooks y variables aquí arriba
  const { category, id } = useParams();
  const navigate = useNavigate();
  const { allData, selectedCategory: storeSelectedCategory, isDataInitialized } = useAppData();
  const selectedCategory = props.selectedCategory || storeSelectedCategory;
  const { lang, t, getCategoryTranslation, getSubcategoryTranslation } = useLanguage();
  const { goBackFromDetail, goToHowToDownload } = useAppView();
  const { getMasterpieceBadgeConfig } = useAppTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const badgeConfig = getMasterpieceBadgeConfig();
  const [imgLoaded, setImgLoaded] = React.useState(false);
  const [imageHover, setImageHover] = React.useState(false);
  const [internalClosing, setInternalClosing] = React.useState(false);
  const [cardAnim, setCardAnim] = useState('slideInUpFast');
  const lastItemRef = React.useRef(null);
  const { handleBack, isAnimating } = useBackNavigation();

  // 2. Lógica de obtención de selectedItem DESPUÉS de los hooks
  let selectedItem = props.item;
  if (!selectedItem && id && allData && category && allData[category]) {
    selectedItem = allData[category].find(item => `${item.id}` === `${id}`) || null;
  }

  // 3. Returns condicionales después de los hooks
  if (!isDataInitialized) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <CircularProgress color="primary" size={48} />
        <div style={{ marginTop: 16, fontSize: 18, color: '#888' }}>Cargando datos...</div>
      </div>
    );
  }
  if (!selectedItem && id && category && allData && !allData[category]) {
    return <div style={{padding:32, textAlign:'center'}}>Categoría no encontrada.</div>;
  }
  if (!selectedItem) {
    return <div style={{padding:32, textAlign:'center'}}>No se encontró el elemento solicitado.</div>;
  }
  
  const rawTitle = processTitle(selectedItem.title || selectedItem.name, lang);
  const rawDescription = processDescription(selectedItem.description, lang);
  
  const title = ensureString(rawTitle, lang);
  const description = ensureString(rawDescription, lang);
  
  const trailerUrl = useTrailerUrl(selectedItem ? selectedItem.trailer : undefined);
  
  // Determinar la categoría real del item para color y chip
  const realCategory = selectedItem.category || selectedCategory;
  
  // Eliminado: handleBack redundante - se maneja en useBackNavigation

  // Inyectar keyframes globales SOLO una vez (fade+scale, igual que páginas)
  useEffect(() => {
    if (!document.getElementById('detail-scale-keyframes')) {
      const style = document.createElement('style');
      style.id = 'detail-scale-keyframes';
      style.innerHTML = `@keyframes scaleFadeIn {0%{opacity:0;transform:scale(0.92);}100%{opacity:1;transform:scale(1);}}@keyframes scaleFadeOut {0%{opacity:1;transform:scale(1);}100%{opacity:0;transform:scale(0.92);}}.slideInUpFast{animation:scaleFadeIn 0.4s cubic-bezier(0.25,0.46,0.45,0.94) forwards;}.slideOutDownFast{animation:scaleFadeOut 0.4s cubic-bezier(0.25,0.46,0.45,0.94) forwards;}`;
      document.head.appendChild(style);
    }
  }, []);

  // Debug: monitorear cambios en internalClosing
  useEffect(() => {}, [internalClosing]);
  // Al montar, animación de entrada
  useEffect(() => {
    setCardAnim('slideInUpFast');
  }, []);
  // Cuando isExiting cambia a true, animación de salida
  useEffect(() => {
    if (props.isExiting) {
      setCardAnim('slideOutDownFast');
    }
  }, [props.isExiting]);
  // Handler para cerrar con animación
  const triggerExitAnimation = () => {
    if (!props.isExiting && !internalClosing) {
      setInternalClosing(true); // Activar animación de cierre interna
      if (props.onRequestClose) {
        props.onRequestClose();
      }
      if (!isMobile) {
        setCardAnim('slideOutDownFast');
      }
    }
  };
  useEffect(() => {
    const onOverlayDetailExit = () => {
      triggerExitAnimation();
    };
    window.addEventListener('overlay-detail-exit', onOverlayDetailExit);
    return () => window.removeEventListener('overlay-detail-exit', onOverlayDetailExit);
  }, [props.isExiting, internalClosing]);
  // Handler para cerrar con animación (desktop)
  const handleCloseDesktop = (e) => {
    e?.preventDefault?.();
    handleBack();
  };
  // Guardar referencia al último item mostrado para animación de cierre
  useEffect(() => {
    if (selectedItem) lastItemRef.current = selectedItem;
  }, [selectedItem]);
  const handleClose = () => {
    if (props.onRequestClose) {
      props.onRequestClose();
    } else {
      setInternalClosing(true);
    }
  };

  // Eliminado: handleAnimationEnd redundante - se maneja en MobileItemDetail

  // Eliminar el useEffect que fuerza el scroll al top en móviles tras mostrar el detalle

  // Renderizado para móviles usando subcomponente
  if (isMobile) {
    const safeItem = selectedItem || lastItemRef.current;
    return (
      <Box
        sx={{
          position: 'fixed',
          top: '49px', // Dejar espacio para el AppBar móvil + borde inferior
          left: 0,
          width: '100vw',
          height: 'calc(100vh - 49px)', // Ajustar altura para no cubrir el AppBar + borde
          background: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(2px)',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          zIndex: 2000, // 5. Páginas detalles en móvil - por debajo de páginas descargar/donaciones (3000)
          isolation: 'isolate',
          transform: 'translateZ(0)',
        }}
      >
        <MobileItemDetail
          selectedItem={safeItem}
          title={title}
          description={description}
          lang={lang}
          t={t}
          theme={theme}
          getCategoryTranslation={getCategoryTranslation}
          getSubcategoryTranslation={getSubcategoryTranslation}
          goBackFromDetail={goBackFromDetail}
          goToHowToDownload={goToHowToDownload}
          imgLoaded={imgLoaded}
          setImgLoaded={setImgLoaded}
          renderMobileSpecificContent={() => (
            <MobileCategorySpecificContent selectedItem={safeItem} lang={lang} t={t} />
          )}
          renderMobileActionButtons={() => (
            <MobileActionButtons
              selectedItem={safeItem}
              trailerUrl={trailerUrl}
              lang={lang}
              t={t}
              goToHowToDownload={goToHowToDownload}
              onOverlayNavigate={props.onOverlayNavigate}
            />
          )}
          isClosing={props.isClosing}
          onClose={() => {
            if (props.onClose) props.onClose();
          }}
          onBack={props.onBack}
        />
      </Box>
    );
  }
  // Renderizado para desktop usando estilos CSS-in-JS directamente
  if (!isMobile) {
    const isMasterpiece = !!selectedItem.masterpiece;
    const categoryColor = getCategoryColor(realCategory, 'color');
    const gradientBg = `linear-gradient(135deg, ${categoryColor} 0%, ${theme.palette.mode === 'dark' ? 'rgba(24,24,24,0.92)' : 'rgba(255,255,255,0.85)'} 100%)`;
    return (
      <div style={styles.page(theme)}>
        <div
          className={cardAnim}
          style={{
            ...styles.desktopWrapper,
            ...(isMasterpiece ? styles.desktopWrapperMasterpiece : {}),
            ...(isMasterpiece ? {} : { background: gradientBg })
          }}
          onAnimationEnd={e => {
            if ((props.isExiting || internalClosing) && cardAnim === 'slideOutDownFast' && typeof props.onExited === 'function') {
              props.onExited();
            }
          }}
        >
          {/* Botón volver FAB azul arriba a la izquierda, igual que en donaciones/descargar */}
          <Fab
            color="primary"
            size="large"
            aria-label={typeof t === 'function' ? t('Volver') : 'Volver'}
            onClick={handleCloseDesktop}
            disabled={isAnimating}
            sx={{
              position: 'absolute',
              top: 18,
              left: 18,
              zIndex: 50,
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
              opacity: isAnimating ? 0.5 : 1,
              cursor: isAnimating ? 'not-allowed' : 'pointer',
            }}
            tabIndex={0}
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
            <div style={styles.imageContainer}>
              <img
                src={selectedItem.image}
                alt={title}
                style={imageHover ? { ...styles.image, ...styles.imageHover } : styles.image}
                onLoad={() => setImgLoaded(true)}
                onMouseEnter={() => setImageHover(true)}
                onMouseLeave={() => setImageHover(false)}
              />
            </div>
          </div>
          <div style={styles.rightCol}>
            <h2 style={styles.title}>{title}</h2>
            <div style={styles.chipRow}>
              <span style={{...styles.chip, background: getCategoryColor(realCategory, 'strong')}}>
                {getCategoryTranslation(realCategory)}
              </span>
              {selectedItem.subcategory && (
                <span style={{...styles.chip, background: getCategoryColor(realCategory, 'strong')}}>
                  {(() => {
                    const subcat = selectedItem.subcategory;
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
              {selectedItem.category === 'music' && selectedItem.artist && (
                <span style={styles.meta}><PersonIcon style={styles.metaIcon}/> {selectedItem.artist}</span>
              )}
              {/* Mostrar autor para otras categorías */}
              {selectedItem.category !== 'music' && selectedItem.author && (
                <span style={styles.meta}><PersonIcon style={styles.metaIcon}/> {selectedItem.author}</span>
              )}
              {selectedItem.year && (
                <span style={styles.meta}><AccessTimeIcon style={styles.metaIcon}/> {selectedItem.year}</span>
              )}
              {selectedItem.duration && (
                <span style={styles.meta}><PlaylistPlayIcon style={styles.metaIcon}/> {selectedItem.duration}</span>
              )}
              {selectedItem.language && (
                <span style={styles.meta}><TranslateIcon style={styles.metaIcon}/> {selectedItem.language}</span>
              )}
              {selectedItem.platform && (
                <span style={styles.meta}><PlatformIcon style={styles.metaIcon}/> {selectedItem.platform}</span>
              )}
              {selectedItem.age && (
                <span style={styles.meta}><ChildCareIcon style={styles.metaIcon}/> {selectedItem.age}+</span>
              )}
              {selectedItem.developer && (
                <span style={styles.meta}><DeveloperIcon style={styles.metaIcon}/> {selectedItem.developer}</span>
              )}
            </div>
            <div style={styles.extraContentRow}>
              <DesktopCategorySpecificContent selectedItem={selectedItem} lang={lang} t={t} />
            </div>
            <p style={styles.description}>{description}</p>
            <div style={styles.actionsRow}>
              <DesktopActionButtons
                selectedItem={selectedItem}
                trailerUrl={trailerUrl}
                lang={lang}
                t={t}
                goToHowToDownload={goToHowToDownload}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
};

// 2. Definir estilos CSS-in-JS
const styles = {
  page: (theme) => ({
    background: '#fff', // FONDO BLANCO para el padre de detalles desktop
    position: 'relative',
    minHeight: '100vh',
    width: '100%',
    color: 'var(--text-color)',
    padding: 0,
    margin: 0,
    overflowY: 'auto',
    paddingTop: '80px', // Espacio para el menú superior en desktop
  }),
  desktopWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 40,
    maxWidth: 1000,
    margin: '20px auto 0 auto', // Reducir la distancia superior ya que el paddingTop del page lo maneja
    padding: '32px 24px',
    background: 'rgba(255,255,255,0.03)',
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
};

// Ejemplo de uso de los estilos migrados en UnifiedItemDetail.jsx
// En el render principal:
// <div style={styles.page(theme)}>
//   <div style={styles.container}>
//     <div style={styles.imageContainer}>
//       <img
//         style={isHovered ? { ...styles.image, ...styles.imageHover } : styles.image}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//         ...
//       />
//       <div style={styles.badge}>...</div>
//     </div>
//   </div>
// </div>
// NOTA: Si hay hover, usar useState para aplicar styles.imageHover
