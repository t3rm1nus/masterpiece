import React, { Suspense, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import HomeLayout from './HomeLayout';
import { LoadingFallback } from './LazyComponents';
import { useAppView, useAppData } from '../store/useAppStore';
import { loadRealData } from '../utils/dataLoader';
import useIsomorphicLayoutEffect from '../hooks/useIsomorphicLayoutEffect';

interface AppContentProps {
  initialItem?: any;
}

export default function AppContent({ initialItem }: AppContentProps): React.JSX.Element {
  if (typeof window === 'undefined') {
    console.log('SSR initialItem en AppContent:', initialItem);
  }
  const navigate = useNavigate();
  const location = useLocation();
  const { setView, setSelectedItem } = useAppView();
  const { isDataInitialized, updateWithRealData } = useAppData();

  // Manejar navegación del navegador (botón atrás/adelante)
  useIsomorphicLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      const handlePopState = (event: PopStateEvent): void => {
        // Siempre que la ruta sea '/', forzar estado home y limpiar detalle
        if (location.pathname === '/') {
          setView('home');
          setSelectedItem(null);
        }
        // Si estamos en un detalle, el componente UnifiedItemDetail se encargará
        // de cargar el item basado en el ID de la URL
      };

      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [location.pathname, setView, setSelectedItem]);
  
  // Cargar datos globales al inicio de la app
  React.useEffect(() => {
    let mounted = true;
    if (!isDataInitialized && mounted) {
      loadRealData().then(realData => {
        if (mounted) {
          updateWithRealData(realData);
        }
      }).catch(error => {
        console.error('❌ Error cargando datos globales:', error);
      });
    }
    return () => { mounted = false; };
  }, [isDataInitialized, updateWithRealData]);
  
  return (
    <Suspense fallback={<LoadingFallback />}> 
      <Routes>
        <Route path="/en/*" element={<HomeLayout forcedLang="en" initialItem={initialItem} />} />
        <Route path="/*" element={<HomeLayout initialItem={initialItem} />} />
      </Routes>
    </Suspense>
  );
} 