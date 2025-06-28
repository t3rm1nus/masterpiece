import React, { useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { useAppView, useAppTheme } from '../store/useAppStore';
import { getCategoryColor, getCategoryGradient } from '../utils/categoryPalette';
import { ensureString } from '../utils/stringUtils';
import { useTrailerUrl } from '../hooks/useTrailerUrl';
import MobileItemDetail from './shared/MobileItemDetail';
import { MobileActionButtons, DesktopActionButtons } from './shared/ItemActionButtons';
import { MobileCategorySpecificContent, DesktopCategorySpecificContent } from './shared/CategorySpecificContent';
import { processTitle, processDescription } from '../store/utils';

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
const UnifiedItemDetail = ({ item, onClose, selectedCategory, isClosing = false, onRequestClose }) => {
  // Inyectar keyframes globales SOLO una vez
  useEffect(() => {
    if (!document.getElementById('item-detail-keyframes')) {
      const style = document.createElement('style');
      style.id = 'item-detail-keyframes';
      style.innerHTML = `@keyframes slideInUp {0%{opacity:0;transform:translateY(60px);}100%{opacity:1;transform:translateY(0);}}
      @keyframes slideOutDown {0%{opacity:1;transform:translateY(0);}100%{opacity:0;transform:translateY(60px);}}`;
      // DURACIÓN REDUCIDA
      style.innerHTML += `
        .slideInUpFast {animation: slideInUp 0.3s cubic-bezier(0.25,0.46,0.45,0.94);}
        .slideOutDownFast {animation: slideOutDown 0.3s cubic-bezier(0.25,0.46,0.45,0.94);}
      `;
      document.head.appendChild(style);
    }
  }, []);

  const { lang, t, getCategoryTranslation, getSubcategoryTranslation } = useLanguage();
  const { goBackFromDetail, goToHowToDownload } = useAppView();
  const { getMasterpieceBadgeConfig } = useAppTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  
  const badgeConfig = getMasterpieceBadgeConfig();
  const selectedItem = item;

  const [imgLoaded, setImgLoaded] = React.useState(false);
  const [imageHover, setImageHover] = React.useState(false);
  const [internalClosing, setInternalClosing] = React.useState(false);

  // Guardar referencia al último item mostrado para animación de cierre
  const lastItemRef = React.useRef(item);
  useEffect(() => {
    if (item) lastItemRef.current = item;
  }, [item]);

  const handleClose = () => {
    if (onRequestClose) {
      onRequestClose();
    } else {
      setInternalClosing(true);
    }
  };

  // Cuando termina la animación de salida, cerrar realmente
  const handleAnimationEnd = () => {
    if ((isClosing || internalClosing) && onClose) onClose();
  };

  if (!selectedItem) {
    console.log('[UnifiedItemDetail] No selectedItem, no se renderiza detalle');
    return null;
  }
  
  const rawTitle = processTitle(selectedItem.title || selectedItem.name, lang);
  const rawDescription = processDescription(selectedItem.description, lang);
  
  const title = ensureString(rawTitle, lang);
  const description = ensureString(rawDescription, lang);
  
  const trailerUrl = useTrailerUrl(selectedItem.trailer);
  
  // Renderizado para móviles usando subcomponente
  if (isMobile) {
    const safeItem = item || lastItemRef.current;
    if (isClosing || internalClosing) {
      console.log('[UnifiedItemDetail] Animación de cierre iniciada en móvil (isClosing=true)');
    }
    return (
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
          />
        )}
        isClosing={isClosing || internalClosing}
        onClose={() => {
          console.log('[UnifiedItemDetail] Animación de cierre FINALIZADA en móvil (onClose llamado)');
          if (onClose) onClose();
        }}
        onBack={handleClose} // <-- Añadido para interceptar el botón volver y animar el cierre
      />
    );
  }
  // Renderizado para desktop usando estilos CSS-in-JS directamente
  if (!isMobile) {
    const isMasterpiece = !!selectedItem.masterpiece;
    const categoryColor = getCategoryColor(selectedCategory, 'color');
    const gradientBg = `linear-gradient(135deg, ${categoryColor} 0%, ${theme.palette.mode === 'dark' ? 'rgba(24,24,24,0.92)' : 'rgba(255,255,255,0.85)'} 100%)`;
    return (
      <div style={styles.page(theme)}>
        <div
          style={{
            ...styles.desktopWrapper,
            ...(isMasterpiece ? styles.desktopWrapperMasterpiece : {}),
            ...(isMasterpiece ? {} : { background: gradientBg }), // Solo aplica fondo de categoría si NO es masterpiece
            animation: isClosing
              ? 'slideOutDown 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              : 'slideInUp 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
          onAnimationEnd={handleAnimationEnd}
        >
          {/* Botón volver arriba a la izquierda */}
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: 18,
              left: 18,
              zIndex: 50,
              background: 'rgba(255,255,255,0.85)',
              border: 'none',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
              cursor: 'pointer',
              transition: 'background 0.2s',
              outline: 'none',
              padding: 0
            }}
            aria-label={typeof t === 'function' ? t('Volver') : 'Volver'}
            tabIndex={0}
          >
            <ArrowBackIcon style={{ fontSize: 24, color: '#222' }} />
          </button>
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
          <div style={styles.leftCol}>
            <div style={styles.imageContainer}>
              <img
                src={selectedItem.image}
                alt={title}
                style={imageHover ? { ...styles.image, ...styles.imageHover } : styles.image}
                onMouseEnter={() => setImageHover(true)}
                onMouseLeave={() => setImageHover(false)}
                onLoad={() => setImgLoaded(true)}
              />
            </div>
          </div>
          <div style={styles.rightCol}>
            <h2 style={styles.title}>{title}</h2>
            <div style={styles.chipRow}>
              <span style={{...styles.chip, background: getCategoryColor(selectedCategory, 'strong')}}>
                {getCategoryTranslation(selectedCategory)}
              </span>
              {selectedItem.subcategory && (
                <span style={{...styles.chip, background: getCategoryColor(selectedCategory, 'strong')}}>
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
              {selectedItem.author && (
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
  
  React.useEffect(() => {
    if (isMobile && selectedItem && imgLoaded) {
      setTimeout(() => {
        // Busca el primer .MuiBox-root que contenga un .MuiCard-root
        let scrollContainer = null;
        const boxRoots = document.querySelectorAll('.MuiBox-root');
        for (const box of boxRoots) {
          if (box.querySelector('.MuiCard-root')) {
            scrollContainer = box;
            break;
          }
        }
        if (scrollContainer) {
          const style = window.getComputedStyle(scrollContainer);
          const hasScroll = style.overflowY === 'auto' || style.overflowY === 'scroll' || scrollContainer.scrollHeight > scrollContainer.clientHeight;
          console.log('[UnifiedItemDetail] Scroll container encontrado:', scrollContainer.className, 'overflowY:', style.overflowY, 'scrollHeight:', scrollContainer.scrollHeight, 'clientHeight:', scrollContainer.clientHeight);
          if (hasScroll) {
            scrollContainer.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            scrollContainer.scrollTop = 0;
            console.log('[UnifiedItemDetail] Scroll aplicado en scrollContainer');
          } else if (scrollContainer.parentNode) {
            const parent = scrollContainer.parentNode;
            const parentStyle = window.getComputedStyle(parent);
            const parentHasScroll = parent.scrollHeight > parent.clientHeight;
            console.log('[UnifiedItemDetail] Intentando scroll en parentNode:', parent.className, 'scrollHeight:', parent.scrollHeight, 'clientHeight:', parent.clientHeight);
            if (parentHasScroll) {
              parent.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              parent.scrollTop = 0;
              console.log('[UnifiedItemDetail] Scroll aplicado en parentNode');
            } else {
              console.log('[UnifiedItemDetail] Ni scrollContainer ni parent tienen scroll. Fallback a window.');
              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            }
          } else {
            console.log('[UnifiedItemDetail] scrollContainer no tiene parentNode. Fallback a window.');
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          }
        } else {
          // Fallback a window
          console.log('[UnifiedItemDetail] Scroll to top en window (no se encontró .MuiBox-root contenedor de .MuiCard-root)');
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }
      }, 0);
    }
  }, [isMobile, selectedItem && (selectedItem.id || selectedItem.title || selectedItem.name), imgLoaded]);
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
    marginTop: '-42px',
  }),
  desktopWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 40,
    maxWidth: 1000,
    margin: '80px auto 0 auto', // Aumenta la distancia superior
    padding: '32px 24px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 24,
    boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
    position: 'relative',
    zIndex: 1,
    animation: 'slideInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
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

export default UnifiedItemDetail;

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
