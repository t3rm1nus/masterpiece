import React from 'react';
import { useLanguage } from '../LanguageContext';
import { useAppView, useAppTheme } from '../store/useAppStore';
import '../styles/components/item-detail.css';
import { getCategoryColor } from '../utils/categoryUtils';
import { ensureString } from '../utils/stringUtils';
import { useTrailerUrl } from '../hooks/useTrailerUrl';
import MobileItemDetail from './shared/MobileItemDetail';
import DesktopItemDetail from './shared/DesktopItemDetail';
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
const UnifiedItemDetail = ({ item, onClose, selectedCategory }) => {
  const { lang, t, getCategoryTranslation, getSubcategoryTranslation } = useLanguage();
  const { goBackFromDetail, goToHowToDownload } = useAppView();
  const { getMasterpieceBadgeConfig } = useAppTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  
  const badgeConfig = getMasterpieceBadgeConfig();
  const selectedItem = item;

  const [imgLoaded, setImgLoaded] = React.useState(false);
  
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
    console.log('[UnifiedItemDetail] Renderizando MobileItemDetail', selectedItem);
    return (
      <MobileItemDetail
        selectedItem={selectedItem}
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
          <MobileCategorySpecificContent selectedItem={selectedItem} lang={lang} t={t} />
        )}
        renderMobileActionButtons={() => (
          <MobileActionButtons
            selectedItem={selectedItem}
            trailerUrl={trailerUrl}
            lang={lang}
            t={t}
            goToHowToDownload={goToHowToDownload}
          />
        )}
      />
    );
  }
  // Renderizado para desktop usando subcomponente
  console.log('[UnifiedItemDetail] Renderizando DesktopItemDetail', selectedItem);
  return (
    <DesktopItemDetail
      selectedItem={selectedItem}
      title={title}
      description={description}
      lang={lang}
      t={t}
      getCategoryTranslation={getCategoryTranslation}
      getSubcategoryTranslation={getSubcategoryTranslation}
      goToHowToDownload={goToHowToDownload}
      renderDesktopSpecificContent={() => (
        <DesktopCategorySpecificContent selectedItem={selectedItem} lang={lang} t={t} getTranslation={typeof t === 'function' ? t : undefined} />
      )}
      renderDesktopActionButtons={() => (
        <DesktopActionButtons
          selectedItem={selectedItem}
          trailerUrl={trailerUrl}
          lang={lang}
          t={t}
          goToHowToDownload={goToHowToDownload}
        />
      )}
    />
  );
  
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

export default UnifiedItemDetail;
