import React from 'react';
import { CardContent, CardMedia, Typography, Chip, Box, Stack, Fab, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Category as CategoryIcon, Extension as ExtensionIcon, Movie as MovieIcon, Book as BookIcon, MusicNote as MusicNoteIcon, SportsEsports as SportsEsportsIcon, Mic as MicIcon, Tv as TvIcon, AutoStories as ComicIcon } from '@mui/icons-material';
import { OndemandVideoIcon, LiveTvIcon } from './CategoryCustomIcons';
import { getCategoryColor, getCategoryGradient } from '../../utils/categoryPalette';
import { ensureString } from '../../utils/stringUtils';
import UiCard from '../ui/UiCard';
import { MobileActionButtons } from './ItemActionButtons';
import MasterpieceBadge from './MasterpieceBadge';
import { useNavigate } from 'react-router-dom';
// Eliminado fix iPhone scroll

// =============================================
// MobileItemDetail: Detalle de ítem optimizado para móviles
// Detalle de ítem optimizado para móviles. Altamente parametrizable, soporta accesibilidad, animaciones y customización avanzada.
// =============================================

/**
 * MobileItemDetail
 * Detalle de ítem para móvil, altamente parametrizable y unificado con DesktopItemDetail.
 *
 * Props avanzados:
 * - renderHeader, renderImage, renderCategory, renderSubcategory, renderYear, renderDescription, renderActions, renderFooter: funciones para custom render de cada sección
 * - showSections: objeto para mostrar/ocultar secciones (por ejemplo: { image: true, category: true, year: true, description: true, actions: true, footer: true })
 * - sx, className, style: estilos avanzados
 * - onBack: callback para botón de volver (opcional)
 * - ...props legacy
 *
 * Ejemplo de uso:
 * <MobileItemDetail
 *   selectedItem={item}
 *   renderHeader={...}
 *   renderImage={...}
 *   renderCategory={...}
 *   renderSubcategory={...}
 *   renderYear={...}
 *   renderDescription={...}
 *   renderActions={...}
 *   renderFooter={...}
 *   showSections={{ image: true, category: true, year: true, description: true, actions: true, footer: true }}
 *   sx={{ background: '#fafafa' }}
 *   onBack={() => ...}
 * />
 */
const MobileItemDetail = ({
  selectedItem,
  title,
  description,
  lang,
  t,
  theme,
  getCategoryTranslation,
  getSubcategoryTranslation,
  goBackFromDetail,
  goToHowToDownload,
  imgLoaded,
  setImgLoaded,
  renderMobileSpecificContent,
  renderMobileActionButtons,
  renderHeader,
  renderImage,
  renderCategory,
  renderSubcategory,
  renderYear,
  renderDescription,
  renderActions,
  renderFooter,
  showSections = {},
  sx = {},
  className = '',
  style = {},
  onBack,
  getTranslation, // <-- Añadido correctamente como prop
  isClosing = false,
  onClose,
  ...props
}) => {
  const navigate = useNavigate();
  const cardRef = React.useRef(null);
  
  // Inyectar keyframes globales para las animaciones móviles
  React.useEffect(() => {
    if (!document.getElementById('mobile-detail-keyframes')) {
      const style = document.createElement('style');
      style.id = 'mobile-detail-keyframes';
      style.innerHTML = `
        @keyframes slideInUpMobile {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes slideOutDownMobile {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
  
  // Filtrar props internos que no deben ir al DOM
  const domSafeProps = { ...props };
  delete domSafeProps.showCategorySelect;
  delete domSafeProps.showSubcategoryChips;

  // Permitir renderizar el detalle durante la animación de cierre aunque selectedItem sea null
  const shouldRender = selectedItem || isClosing;
  if (!shouldRender) return null;

  // Helper para iconos por categoría
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'boardgames':
        return <ExtensionIcon />;
      case 'movies':
        return <MovieIcon />;
      case 'books':
        return <BookIcon />;
      case 'music':
        return <MusicNoteIcon />;
      case 'videogames':
        return <SportsEsportsIcon />;
      case 'podcasts':
        return <MicIcon />;
      case 'series':
        return <LiveTvIcon />; // Icono TV para series
      case 'documentales':
        return <OndemandVideoIcon />; // Icono video para documentales
      case 'comics':
        return <ComicIcon />;
      default:
        return <CategoryIcon />;
    }
  };

  // Lógica para desmontar tras animación de salida
  const handleAnimationEnd = () => {
    console.log('[MobileItemDetail] handleAnimationEnd llamado', { isClosing, onClose: typeof onClose });
    if (isClosing) {
      console.log('[MobileItemDetail] Animación de cierre FINALIZADA (onAnimationEnd)');
    }
    if (isClosing && typeof onClose === 'function') {
      console.log('[MobileItemDetail] Llamando a onClose() desde onAnimationEnd');
      onClose();
    }
  };

  React.useEffect(() => {
    console.log('[MobileItemDetail] isClosing cambió:', { isClosing, selectedItem: selectedItem?.title });
    if (isClosing) {
      console.log('[MobileItemDetail] Animación de cierre INICIADA (isClosing=true)', { selectedItem });
      // Forzar la aplicación de la animación después de un pequeño delay
      setTimeout(() => {
        if (cardRef.current) {
          console.log('[MobileItemDetail] Forzando aplicación de animación de cierre');
          cardRef.current.style.animation = 'none';
          cardRef.current.offsetHeight; // Trigger reflow
          cardRef.current.style.animation = 'slideOutDownMobile 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
        }
      }, 10);
    }
  }, [isClosing, selectedItem]);

  // Monitorear desmontaje del componente
  React.useEffect(() => {
    return () => {
      console.log('[MobileItemDetail] Componente desmontado');
    };
  }, []);

  // Eliminado fix específico para iPhone, el scroll será nativo universal

  // Botón de volver flotante, fijo respecto a la ventana y fuera del Box animado
  const BackButton = (
    showSections.backButton !== false && (onBack || goBackFromDetail) && (
      <Fab
        color="primary"
        aria-label="volver"
        onClick={() => {
          if (onBack) {
            onBack();
          } else {
            // Disparar evento para animación de salida
            window.dispatchEvent(new CustomEvent('overlay-detail-exit'));
          }
        }}
        sx={{
          position: 'fixed',
          top: { xs: '63px', sm: 24 }, // Bajado 30px en móviles (de 33px a 63px)
          left: 16,
          zIndex: 1300,
          backgroundColor: theme?.palette?.primary?.main,
          '&:hover': {
            backgroundColor: theme?.palette?.primary?.dark,
          }
        }}
      >
        <ArrowBackIcon />
      </Fab>
    )
  );

  return (
    <>
      {BackButton}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          height: { xs: '100dvh', sm: 'auto' },
          width: '100%',
          padding: { xs: '90px 0 0 0', sm: '36px 0 0 0' }, // más separación del menú superior en móviles
          boxSizing: 'border-box',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          zIndex: 1, // Por debajo del menú superior (z-index 1100)
          position: 'relative',
        }}
      >
        <UiCard
          className="item-detail-mobile-card"
          ref={(el) => {
            cardRef.current = el;
            if (el) {
              console.log('[MobileItemDetail] Clases CSS aplicadas:', el.className);
              console.log('[MobileItemDetail] isClosing:', isClosing);
              // Verificar si la animación está activa
              const computedStyle = window.getComputedStyle(el);
              console.log('[MobileItemDetail] animation-name:', computedStyle.animationName);
              console.log('[MobileItemDetail] animation-duration:', computedStyle.animationDuration);
              console.log('[MobileItemDetail] opacity:', computedStyle.opacity);
              console.log('[MobileItemDetail] transform:', computedStyle.transform);
              console.log('[MobileItemDetail] animation-play-state:', computedStyle.animationPlayState);
            }
          }}
          sx={{
            position: 'relative',
            padding: '16px',
            width: { xs: 'calc(100vw - 40px)', sm: '96vw' },
            margin: '0 auto',
            marginTop: 0,
            marginBottom: { xs: '36px', sm: 0 }, // margen inferior reducido a la mitad en móvil
            border: selectedItem.masterpiece ? '3px solid #ffd700' : 'none',
            background: selectedItem.masterpiece ? '#fffbe6' : getCategoryGradient(selectedItem.category),
            zIndex: 1, // Por debajo del menú superior (z-index 1100)
            // --- iPhone/iOS override hacks ---
            overflow: 'visible !important',
            overflowY: 'visible !important',
            WebkitOverflowScrolling: 'touch',
            maxHeight: 'none !important',
            height: 'auto !important',
            // ---
            ...sx
          }}
          style={{
            // Forzar animación inline para asegurar que funcione
            animation: isClosing 
              ? 'slideOutDownMobile 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
              : 'slideInUpMobile 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
          }}
          onAnimationEnd={(e) => {
            console.log('[MobileItemDetail] onAnimationEnd event disparado:', e);
            console.log('[MobileItemDetail] onAnimationEnd - isClosing:', isClosing);
            console.log('[MobileItemDetail] onAnimationEnd - onClose type:', typeof onClose);
            console.log('[MobileItemDetail] onAnimationEnd - animationName:', e.animationName);
            console.log('[MobileItemDetail] onAnimationEnd - elapsedTime:', e.elapsedTime);
            handleAnimationEnd();
          }}
          {...domSafeProps}
        >
          {/* Badge de masterpiece en la esquina del detalle */}
          {selectedItem.masterpiece && (
            <MasterpieceBadge
              alt={getTranslation ? getTranslation('ui.alt.masterpiece', 'Obra maestra') : 'Obra maestra'}
              title={getTranslation ? getTranslation('ui.badges.masterpiece', 'Obra maestra') : 'Obra maestra'}
              absolute={true}
              size={40}
              sx={{
                position: 'absolute',
                top: -17,
                right: -18,
                zIndex: 1201,
                filter: 'drop-shadow(0 4px 16px rgba(255,215,0,0.5))',
                background: '#FFD700',
                border: '2.5px solid #111',
                animation: 'pulseGlow 2s ease-in-out infinite',
                transition: 'box-shadow 0.3s',
                pointerEvents: 'none',
              }}
            />
          )}
          {/* Header custom */}
          {renderHeader && renderHeader(selectedItem)}
          {/* Imagen principal + badge masterpiece */}
          <Box sx={{ position: 'relative' }}>
            {showSections.image !== false && (renderImage
              ? renderImage(selectedItem)
              : <CardMedia
                  component="img"
                  sx={{ height: 300, objectFit: 'cover', position: 'relative', border: '2px solid #111' }}
                  image={selectedItem.image}
                  alt={title}
                  onLoad={() => setImgLoaded && setImgLoaded(true)}
                />
            )}
          </Box>
          {/* CardContent principal: NO overflow ni maxHeight aquí, y forzar overflow: visible en mobile para el badge */}
          <CardContent
            sx={{
              padding: { xs: 0, sm: '24px' },
              position: 'relative',
              overflow: 'visible !important',
              overflowY: 'visible !important',
              maxHeight: 'none !important',
              height: 'auto !important',
            }}
          >
            {/* Título */}
          {showSections.title !== false && (
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                width: typeof window !== 'undefined' && /iPhone|iPad|iPod/.test(window.navigator.userAgent) ? undefined : '90%',
                mx: 'auto',
                fontWeight: 400,
                fontSize: '1.5rem',
                textAlign: 'center',
                margin: typeof window !== 'undefined' && /iPhone|iPad|iPod/.test(window.navigator.userAgent) ? undefined : '4px 0 0px 7px',
                position: 'relative',
                zIndex: 1,
                background: 'transparent',
                overflow: 'visible',
                borderRadius: 0,
                boxShadow: 'none',
                color: 'inherit',
              }}
            >
              {title}
            </Typography>
          )}
            {/* Chips de categoría y subcategoría */}
            {showSections.category !== false && (
              renderCategory
                ? renderCategory(selectedItem)
                : <Stack direction="row" spacing={1} justifyContent="center" sx={{ marginBottom: '16px' }}>
                    <Chip
                      icon={getCategoryIcon(selectedItem.category)}
                      label={getCategoryTranslation(selectedItem.category)}
                      sx={{
                        backgroundColor: selectedItem.category === 'boardgames' ? 'transparent' : getCategoryColor(selectedItem.category, 'strong'),
                        color: selectedItem.category === 'boardgames' ? getCategoryColor(selectedItem.category, 'strong') : 'white',
                        borderColor: selectedItem.category === 'boardgames' ? getCategoryColor(selectedItem.category, 'strong') : 'transparent',
                        border: selectedItem.category === 'boardgames' ? '1.5px solid' : 'none',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        letterSpacing: 0.2,
                        alignSelf: 'flex-start',
                        boxShadow: selectedItem.category === 'boardgames' ? undefined : '0 0 0 2px rgba(0,0,0,0.04)',
                        '& .MuiChip-icon': {
                          color: selectedItem.category === 'boardgames' ? '#fff' : 'white',
                        }
                      }}
                    />
                    {selectedItem.subcategory && (renderSubcategory
                      ? renderSubcategory(selectedItem)
                      : <Chip
                          label={getSubcategoryTranslation(selectedItem.subcategory, selectedItem.category)}
                          variant="outlined"
                          sx={{
                            fontSize: '0.68rem',
                            borderColor: getCategoryColor(selectedItem.category, 'strong'),
                            color: '#666',
                            alignSelf: 'flex-start',
                            marginTop: '0px',
                            borderWidth: 2,
                            borderStyle: 'solid',
                            fontWeight: 500
                          }}
                        />
                    )}
                  </Stack>
            )}
            {/* Información específica por categoría */}
            {renderMobileSpecificContent && renderMobileSpecificContent(selectedItem)}
            {/* Descripción */}
            {showSections.description !== false && (
              renderDescription
                ? renderDescription(selectedItem)
                : <Typography 
                    variant="body1" 
                    sx={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '24px', color: 'text.primary' }}
                  >
                    {description}
                  </Typography>
            )}
            {/* Botones de acción */}
            {showSections.actions !== false && (renderActions
              ? renderActions(selectedItem)
              : renderMobileActionButtons
                ? renderMobileActionButtons(selectedItem)
                : <MobileActionButtons selectedItem={selectedItem} lang={lang} t={t} />
            )}
            {/* Footer custom */}
            {showSections.footer !== false && renderFooter && renderFooter(selectedItem)}
          </CardContent>
        </UiCard>
      </Box>
    </>
  );
};

export default MobileItemDetail;
