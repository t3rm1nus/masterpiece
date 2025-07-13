import React, { useRef, useState, useCallback, useMemo } from 'react';
import HomePage from './HomePage';
import HybridMenu from './HybridMenu';
import { useLocation, matchPath } from 'react-router-dom';
import UnifiedItemDetail from './UnifiedItemDetail';
import { useAppView } from '../store/useAppStore';
import HowToDownload from '../pages/HowToDownload';
import CoffeePage from './CoffeePage';

// Hook personalizado para manejar el historial de navegación de forma optimizada
const useNavigationHistory = () => {
  const [navigationHistory, setNavigationHistory] = useState([]);
  
  const addToHistory = useCallback((entry) => {
    console.log('🔄 [useNavigationHistory] addToHistory llamado con:', entry);
    setNavigationHistory(prev => {
      const newHistory = [...prev, entry];
      console.log('🔄 [useNavigationHistory] Historial actualizado:', newHistory);
      return newHistory;
    });
  }, []);
  
  const removeFromHistory = useCallback(() => {
    console.log('🔄 [useNavigationHistory] removeFromHistory llamado');
    setNavigationHistory(prev => {
      const newHistory = prev.slice(0, -1);
      console.log('🔄 [useNavigationHistory] Historial después de remover:', newHistory);
      return newHistory;
    });
  }, []);
  
  const clearHistory = useCallback(() => {
    console.log('🔄 [useNavigationHistory] clearHistory llamado');
    setNavigationHistory([]);
  }, []);
  
  const getLastEntry = useCallback(() => {
    const lastEntry = navigationHistory[navigationHistory.length - 1];
    console.log('🔄 [useNavigationHistory] getLastEntry retorna:', lastEntry);
    return lastEntry;
  }, [navigationHistory]);
  
  return {
    navigationHistory,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getLastEntry
  };
};

export default function HomeLayout() {
  const location = useLocation();
  const { goToCoffee, goToHowToDownload, goHome } = useAppView();
  
  // Splash state y handlers
  const [splashOpen, setSplashOpen] = useState(false);
  const [splashAudio, setSplashAudio] = useState(null);
  const audioRef = useRef(null);

  // Estado local para overlays - SIN navegación
  const [currentOverlay, setCurrentOverlay] = useState(null);
  const [overlayData, setOverlayData] = useState(null);
  
  // Usar el hook personalizado para el historial
  const { navigationHistory, addToHistory, removeFromHistory, clearHistory, getLastEntry } = useNavigationHistory();

  const openSplash = useCallback((audio) => {
    setSplashAudio(audio || null);
    setSplashOpen(true);
  }, []);
  
  const closeSplash = useCallback(() => {
    setSplashOpen(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  // Detectar ruta inicial y configurar overlay si es necesario
  React.useEffect(() => {
    const isDetail = !!matchPath('/detalle/:category/:id', location.pathname);
    const isHowToDownload = location.pathname === '/como-descargar';
    const isDonaciones = location.pathname === '/donaciones';
    
    if (isDetail) {
      const match = matchPath('/detalle/:category/:id', location.pathname);
      const { category, id } = match?.params || {};
      setCurrentOverlay('detail');
      setOverlayData({ category, id });
    } else if (isHowToDownload) {
      setCurrentOverlay('howToDownload');
      setOverlayData(null);
    } else if (isDonaciones) {
      setCurrentOverlay('donaciones');
      setOverlayData(null);
    } else {
      setCurrentOverlay(null);
      setOverlayData(null);
    }
  }, [location.pathname]);

  // Manejar el botón "volver" del navegador
  React.useEffect(() => {
    const handlePopState = () => {
      // Si estamos en home, limpiar overlay y historial
      if (window.location.pathname === '/') {
        setCurrentOverlay(null);
        setOverlayData(null);
        clearHistory();
      }
      // Si estamos en un detalle, restaurar el detalle
      else if (window.location.pathname.startsWith('/detalle/')) {
        const match = matchPath('/detalle/:category/:id', window.location.pathname);
        const { category, id } = match?.params || {};
        setCurrentOverlay('detail');
        setOverlayData({ category, id });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [clearHistory]);

  // Navegación simplificada - actualiza estado local y URL
  const handleOverlayNavigate = useCallback((targetPath) => {
    console.log('🔄 [HomeLayout] ===== handleOverlayNavigate INICIADO =====');
    console.log('🔄 [HomeLayout] handleOverlayNavigate llamado con:', targetPath);
    console.log('🔄 [HomeLayout] Ruta actual:', location.pathname);
    console.log('🔄 [HomeLayout] Overlay actual:', currentOverlay);
    console.log('🔄 [HomeLayout] Historial actual:', navigationHistory);
    console.log('🔄 [HomeLayout] window.location.pathname:', window.location.pathname);
    
    // Guardar en el historial ANTES de actualizar la URL
    // Detectar si estamos en detalle usando el overlay actual O la URL actual
    const isCurrentlyInDetail = currentOverlay === 'detail' || location.pathname.startsWith('/detalle/') || window.location.pathname.startsWith('/detalle/');
    console.log('🔄 [HomeLayout] ¿Estamos en detalle actualmente?', isCurrentlyInDetail, '(overlay:', currentOverlay, ', ruta:', location.pathname, ', window.location:', window.location.pathname, ')');
    
    if (isCurrentlyInDetail && (targetPath === '/como-descargar' || targetPath === '/donaciones')) {
      console.log('🔄 [HomeLayout] Guardando detalle en historial');
      
      // Extraer datos del detalle desde el overlay actual O la URL actual
      let detailData = null;
      
      if (currentOverlay === 'detail' && overlayData) {
        // Usar datos del overlay actual
        detailData = { category: overlayData.category, id: overlayData.id };
        console.log('🔄 [HomeLayout] Datos extraídos del overlay actual:', detailData);
      } else if (location.pathname.startsWith('/detalle/')) {
        // Usar datos de la URL actual
        const match = matchPath('/detalle/:category/:id', location.pathname);
        const { category, id } = match?.params || {};
        if (category && id) {
          detailData = { category, id };
          console.log('🔄 [HomeLayout] Datos extraídos de la URL actual:', detailData);
        }
      }
      
      // Si no se pudieron extraer datos del overlay ni de la URL, intentar extraer de window.location
      if (!detailData && window.location.pathname.startsWith('/detalle/')) {
        const match = matchPath('/detalle/:category/:id', window.location.pathname);
        const { category, id } = match?.params || {};
        if (category && id) {
          detailData = { category, id };
          console.log('🔄 [HomeLayout] Datos extraídos de window.location:', detailData);
        }
      }
      
      // Verificación adicional: si estamos en detalle pero no tenemos datos, intentar extraer de location.pathname
      if (!detailData && location.pathname.startsWith('/detalle/')) {
        const match = matchPath('/detalle/:category/:id', location.pathname);
        const { category, id } = match?.params || {};
        if (category && id) {
          detailData = { category, id };
          console.log('🔄 [HomeLayout] Datos extraídos de location.pathname como fallback:', detailData);
        }
      }
      
      if (detailData) {
        console.log('🔄 [HomeLayout] Guardando detalle en historial:', detailData);
        addToHistory({ type: 'detail', data: detailData });
      } else {
        console.log('🔄 [HomeLayout] No se pudieron extraer datos del detalle');
      }
    } else {
      console.log('🔄 [HomeLayout] NO guardando en historial - isCurrentlyInDetail:', isCurrentlyInDetail, 'targetPath:', targetPath);
    }
    
    // Actualizar la URL para que sea navegable
    window.history.pushState({}, '', targetPath);
    
    if (targetPath.startsWith('/detalle/')) {
      const match = matchPath('/detalle/:category/:id', targetPath);
      const { category, id } = match?.params || {};
      console.log('🔄 [HomeLayout] Navegando a detalle:', { category, id });
      setCurrentOverlay('detail');
      setOverlayData({ category, id });
    } else if (targetPath === '/como-descargar') {
      console.log('🔄 [HomeLayout] Navegando a como-descargar');
      setCurrentOverlay('howToDownload');
      setOverlayData(null);
    } else if (targetPath === '/donaciones') {
      console.log('🔄 [HomeLayout] Navegando a donaciones');
      setCurrentOverlay('donaciones');
      setOverlayData(null);
    } else {
      console.log('🔄 [HomeLayout] Navegando a home');
      setCurrentOverlay(null);
      setOverlayData(null);
    }
  }, [location.pathname, addToHistory, currentOverlay, navigationHistory, overlayData]);

  // Volver - oculta el overlay actual y actualiza la URL
  const handleBack = useCallback(() => {
    console.log('🔄 [HomeLayout] handleBack llamado');
    console.log('🔄 [HomeLayout] Overlay actual:', currentOverlay);
    console.log('🔄 [HomeLayout] Historial actual:', navigationHistory);
    console.log('🔄 [HomeLayout] URL actual:', window.location.pathname);
    
    // Si estamos en una página especial y hay un detalle en el historial, volver al detalle
    if ((currentOverlay === 'howToDownload' || currentOverlay === 'donaciones')) {
      const lastEntry = getLastEntry();
      console.log('🔄 [HomeLayout] Última entrada del historial:', lastEntry);
      
      if (lastEntry && lastEntry.type === 'detail') {
        console.log('🔄 [HomeLayout] Volviendo al detalle desde historial:', lastEntry.data);
        
        // Actualizar la URL al detalle
        const detailPath = `/detalle/${lastEntry.data.category}/${lastEntry.data.id}`;
        window.history.pushState({}, '', detailPath);
        
        // Restaurar el detalle
        setCurrentOverlay('detail');
        setOverlayData(lastEntry.data);
        
        // Remover la entrada del historial
        removeFromHistory();
        return;
      } else {
        console.log('🔄 [HomeLayout] No hay detalle en el historial o la entrada no es de tipo detail');
      }
    }
    
    // Si no hay detalle en el historial, ir a home
    console.log('🔄 [HomeLayout] Volviendo a home');
    window.history.pushState({}, '', '/');
    setCurrentOverlay(null);
    setOverlayData(null);
    
    // Limpiar el historial si vamos a home
    clearHistory();
  }, [currentOverlay, getLastEntry, removeFromHistory, clearHistory, navigationHistory]);

  const isMobile = useMemo(() => window.innerWidth < 900, []);
  const isOverlay = useMemo(() => !!currentOverlay, [currentOverlay]);

  // Determinar contenido del overlay
  const overlayContent = useMemo(() => {
    if (currentOverlay === 'detail' && overlayData) {
      return (
        <UnifiedItemDetail 
          onBack={handleBack} 
          category={overlayData.category} 
          id={overlayData.id} 
          onOverlayNavigate={handleOverlayNavigate}
        />
      );
    } else if (currentOverlay === 'howToDownload') {
      return <HowToDownload onAnimationEnd={handleBack} />;
    } else if (currentOverlay === 'donaciones') {
      return <CoffeePage onAnimationEnd={handleBack} />;
    }
    return null;
  }, [currentOverlay, overlayData, handleBack, handleOverlayNavigate]);

  // Overlay simplificado
  const OverlayWrapper = useCallback(({ children }) => {
    return (
      <div
        style={{
          position: 'fixed',
          top: isMobile ? 49 : 70,
          left: 0,
          width: '100vw',
          height: isMobile ? 'calc(100vh - 49px)' : 'calc(100vh - 70px)',
          zIndex: isMobile ? 1500 : 1200,
          background: 'rgba(255,255,255,0.98)',
          overflowY: 'auto',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </div>
    );
  }, [isMobile]);

  return (
    <div>
      <HybridMenu
        onSplashOpen={openSplash}
        splashOpen={splashOpen}
        splashAudio={splashAudio}
        onSplashClose={closeSplash}
        audioRef={audioRef}
        onOverlayNavigate={handleOverlayNavigate}
        onBack={handleBack}
      />
      
      {/* HomePage SIEMPRE visible - solo se oculta visualmente */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        opacity: isOverlay ? 0 : 1,
        pointerEvents: isOverlay ? 'none' : 'auto',
        transition: 'none',
      }}>
        <HomePage
          key="homepage"
          onSplashOpen={openSplash}
          splashOpen={splashOpen}
          splashAudio={splashAudio}
          onSplashClose={closeSplash}
          audioRef={audioRef}
          onOverlayNavigate={handleOverlayNavigate}
        />
      </div>
      
      {/* Overlay */}
      {isOverlay && overlayContent && (
        <OverlayWrapper key={`overlay-${currentOverlay}`}>
          {overlayContent}
        </OverlayWrapper>
      )}
    </div>
  );
} 