import React, { ReactNode, useRef, useCallback, CSSProperties } from 'react';
import { CardContent, CardMedia, Typography, Chip, Box, Stack, Fab, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CategoryIcon from '@mui/icons-material/Category';
import ExtensionIcon from '@mui/icons-material/Extension';
import MovieIcon from '@mui/icons-material/Movie';
import BookIcon from '@mui/icons-material/Book';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MicIcon from '@mui/icons-material/Mic';
import TvIcon from '@mui/icons-material/Tv';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import TranslateIcon from '@mui/icons-material/Translate';
import { OndemandVideoIcon, LiveTvIcon } from './CategoryCustomIcons';
import { getCategoryColor, getCategoryGradient } from '../../utils/categoryPalette';
import { ensureString } from '../../utils/stringUtils';
import { applyDetailScrollFixForIPhone, isIPhone } from '../../utils/iPhoneScrollFix';
import UiCard from '../ui/UiCard';
import { MobileActionButtons } from './ItemActionButtons';
import MasterpieceBadge from './MasterpieceBadge';
import { useShare } from '../../hooks/useShare';
import { useLanguage } from '../../LanguageContext';

// Tipos de props
interface MobileItemDetailProps {
  selectedItem: any;
  title?: string;
  description?: string;
  lang?: string;
  t?: any;
  theme?: any;
  getCategoryTranslation?: (cat: string) => string;
  getSubcategoryTranslation?: (subcat: string, cat: string) => string;
  goBackFromDetail?: () => void;
  goToHowToDownload?: () => void;
  imgLoaded?: boolean;
  setImgLoaded?: (loaded: boolean) => void;
  renderMobileSpecificContent?: (item: any) => ReactNode;
  renderMobileActionButtons?: (item: any) => ReactNode;
  renderHeader?: (item: any) => ReactNode;
  renderImage?: (item: any) => ReactNode;
  renderCategory?: (cat: string) => ReactNode;
  renderSubcategory?: (subcat: string, cat: string) => ReactNode;
  renderYear?: (item: any) => ReactNode;
  renderDescription?: (desc: string, item: any) => ReactNode;
  renderActions?: (item: any) => ReactNode;
  renderFooter?: (item: any) => ReactNode;
  showSections?: Record<string, boolean>;
  sx?: CSSProperties;
  className?: string;
  style?: CSSProperties;
  onBack?: () => void;
  getTranslation?: (key: string, fallback?: string) => string;
  isClosing?: boolean;
  onClose?: () => void;
  [key: string]: any;
}

const MobileItemDetail: React.FC<MobileItemDetailProps> = ({
  selectedItem,
  title,
  description,
  lang: propLang,
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
  getTranslation,
  isClosing = false,
  onClose,
  ...props
}) => {
  const cardRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (isIPhone()) {
      const timer = setTimeout(() => {
        applyDetailScrollFixForIPhone();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedItem]);

  const domSafeProps = { ...props };
  delete domSafeProps.showCategorySelect;
  delete domSafeProps.showSubcategoryChips;

  const shouldRender = selectedItem || isClosing;
  if (!shouldRender) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'boardgames': return <ExtensionIcon />;
      case 'movies': return <MovieIcon />;
      case 'books': return <BookIcon />;
      case 'music': return <MusicNoteIcon />;
      case 'videogames': return <SportsEsportsIcon />;
      case 'podcasts': return <MicIcon />;
      case 'series': return <LiveTvIcon />;
      case 'documentales': return <OndemandVideoIcon />;
      case 'comics': return <AutoStoriesIcon />;
      default: return <CategoryIcon />;
    }
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else if (onClose) {
      onClose();
    } else {
      try {
        if (typeof window !== 'undefined' && window.history) {
          window.history.back();
        } else if (typeof window !== 'undefined' && window.location) {
          window.location.assign('/');
        }
      } catch {
        if (typeof window !== 'undefined' && window.location) {
          window.location.assign('/');
        }
      }
    }
  };

  const { share } = useShare();
  const { lang } = useLanguage();
  const currentLang = propLang || lang || 'es';

  const BackButton = (
    showSections.backButton !== false && (
      <Fab
        color="primary"
        aria-label="volver"
        onClick={handleBackClick}
        sx={{
          position: 'fixed',
          top: { xs: '25px', sm: 24 },
          left: 16,
          zIndex: 2000,
          backgroundColor: theme?.palette?.primary?.main,
          transition: 'none',
          '&:hover': {
            backgroundColor: theme?.palette?.primary?.main,
            transform: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)'
          }
        }}
      >
        <ArrowBackIcon />
      </Fab>
    )
  );

  const handleShare = () => {
    const lang = currentLang;
    const title = selectedItem?.title || selectedItem?.name || 'Recomendación de Masterpiece';
    let description = 'Mira esta recomendación en Masterpiece';
    if (selectedItem?.description) {
      if (typeof selectedItem.description === 'string') {
        description = selectedItem.description;
      } else if (typeof selectedItem.description === 'object') {
        description =
          (lang && selectedItem.description[lang] && typeof selectedItem.description[lang] === 'string' && selectedItem.description[lang]) ||
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

  // --- Estilos legacy para chips y botones de acción ---
  const chipSx = {
    fontSize: { xs: '0.8rem', sm: '1rem' },
    borderRadius: '16px',
    fontWeight: 600,
    boxShadow: 2,
    py: '6px',
    px: '12px',
    m: '0 4px 8px 0',
  };
  const actionBtnSx = {
    minWidth: 180,
    maxWidth: 320,
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block',
    textAlign: 'center',
    fontWeight: 700,
    fontSize: '1rem',
    paddingTop: '12px',
    paddingBottom: '12px',
    borderRadius: '8px',
    boxShadow: '2px 2px 8px rgba(0,0,0,0.08)',
    mx: 'auto',
    my: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    p: 0,
    m: 0
  };

  const safeTitle = typeof (selectedItem?.title || selectedItem?.name) === 'string'
    ? (selectedItem?.title || selectedItem?.name)
    : (selectedItem?.title?.[currentLang] || selectedItem?.title?.es || selectedItem?.title?.en || selectedItem?.name?.[currentLang] || selectedItem?.name?.es || selectedItem?.name?.en || '');
  const safeDescription = typeof selectedItem?.description === 'string'
    ? selectedItem.description
    : (selectedItem?.description?.[currentLang] || selectedItem?.description?.es || selectedItem?.description?.en || '');
  const safeCategory = ensureString(selectedItem?.category, currentLang);
  const safeSubcategory = ensureString(selectedItem?.subcategory, currentLang);

  return (
    <>
      {BackButton}
      <Box
        className={`mp-detail-overlay ${className}`}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          height: '100%',
          width: '100%',
          padding: { xs: '45px 0 0 0', sm: '36px 0 0 0' },
          boxSizing: 'border-box',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          scrollBehavior: 'smooth',
          zIndex: 1,
          position: 'relative',
          ...(isIPhone() && {
            WebkitOverflowScrolling: 'touch',
            overflowY: 'auto',
            height: '100vh',
            maxHeight: '100vh',
            '&::-webkit-scrollbar': {
              width: '0px',
              background: 'transparent',
            },
            '&': {
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              overflowY: 'auto',
            },
          }),
          '&::-webkit-scrollbar': {
            width: '0px',
            background: 'transparent',
          },
          '&': {
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          },
        }}
      >
        <UiCard
          className="item-detail-mobile-card"
          ref={cardRef}
          sx={{
            position: 'relative',
            padding: isIPhone() ? 0 : '16px',
            width: { xs: 'calc(100vw - 40px)', sm: '96vw' },
            margin: isIPhone() ? '0 0 8px 0' : '0 auto',
            marginTop: isIPhone() ? 0 : 0,
            marginBottom: isIPhone() ? 0 : { xs: '36px', sm: 0 },
            border: selectedItem.masterpiece ? '3px solid #ffd700' : 'none',
            background: selectedItem.masterpiece ? '#fffbe6' : getCategoryGradient(selectedItem.category),
            zIndex: 1,
            overflow: 'visible',
            ...(isIPhone() && {
              overflowY: 'auto',
              borderBottom: '2px solid #bbb',
            }),
            ...sx
          }}
          style={style}
          {...domSafeProps}
        >
          {/* Renderizado flexible de header, imagen, categoría, etc. */}
          {renderHeader ? renderHeader(selectedItem) : null}
          {showSections.image !== false && (renderImage ? renderImage(selectedItem) : (
            <CardMedia
              component="img"
              image={selectedItem.image}
              alt={selectedItem.title}
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                marginBottom: 2,
                objectFit: 'cover',
                boxShadow: 1
              }}
              onLoad={() => setImgLoaded && setImgLoaded(true)}
              onError={() => setImgLoaded && setImgLoaded(false)}
            />
          ))}
          {/* Chips de categoría y subcategoría, maquetación y colores legacy */}
          <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            {showSections.category !== false && (
              renderCategory
                ? renderCategory(selectedItem.category)
                : <Chip
                    label={getCategoryTranslation ? getCategoryTranslation(selectedItem.category) : selectedItem.category}
                    icon={<CategoryIcon sx={{ mr: 0.5, fontSize: { xs: '1rem', sm: '1.2rem' } }} />}
                    sx={{
                      backgroundColor: getCategoryColor(selectedItem.category),
                      color: 'black',
                      ...chipSx
                    }}
                  />
            )}
            {showSections.subcategory !== false && selectedItem.subcategory && (
              renderSubcategory
                ? renderSubcategory(selectedItem.subcategory, selectedItem.category)
                : <Chip
                    label={getSubcategoryTranslation ? getSubcategoryTranslation(selectedItem.subcategory, selectedItem.category) : selectedItem.subcategory}
                    icon={<TranslateIcon sx={{ mr: 0.5, fontSize: { xs: '1rem', sm: '1.2rem' } }} />}
                    sx={{
                      backgroundColor: getCategoryColor(selectedItem.category),
                      color: 'black',
                      ...chipSx
                    }}
                  />
            )}
            {selectedItem.masterpiece && (
              <MasterpieceBadge
                size={32}
                sx={{ ml: 1 }}
              />
            )}
          </Box>
          {showSections.title !== false && (
            <Typography variant="h5" sx={{ fontWeight: 700, mt: 1, mb: 1, textAlign: 'center' }}>
              {safeTitle}
              {showSections.year !== false && selectedItem.year && (
                <span style={{ color: '#888', fontWeight: 400, marginLeft: 8, fontSize: '0.85em' }}>
                  ({selectedItem.year})
                </span>
              )}
            </Typography>
          )}
          {showSections.description !== false && (
            renderDescription
              ? renderDescription(safeDescription, selectedItem)
              : <Typography variant="body2" sx={{ color: '#444', mb: 2, textAlign: 'center', fontSize: '1.05em', lineHeight: 1.6 }}>{safeDescription}</Typography>
          )}
          {renderMobileSpecificContent && renderMobileSpecificContent(selectedItem)}
          {showSections.actions !== false && (
            renderActions
              ? renderActions(selectedItem)
              : <Box sx={{ pb: '56px' /* Espacio extra para el botón de compartir */ }}>
                  <MobileActionButtons selectedItem={selectedItem} trailerUrl={selectedItem.trailerUrl} lang={currentLang} t={t} goToHowToDownload={goToHowToDownload} onOverlayNavigate={undefined} />
                </Box>
          )}
          {/* Botón de compartir: sticky abajo SOLO en iPhone, absoluto en el resto */}
          {isIPhone() ? (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <img
                src="/icons/share.png"
                alt="Compartir"
                style={{ width: 48, height: 48, zIndex: 1200, cursor: 'pointer' }}
                onClick={handleShare}
              />
            </Box>
          ) : (
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
          {showSections.footer !== false && renderFooter && renderFooter(selectedItem)}
        </UiCard>
      </Box>
    </>
  );
};

export default MobileItemDetail; 