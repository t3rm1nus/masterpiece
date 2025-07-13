import React, { Suspense, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import HomeLayout from './HomeLayout';
import { LoadingFallback } from './LazyComponents';
import useAppStore from '../store/useAppStore';

export default function AppContent(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { setView, setSelectedItem } = useAppStore();

  // Manejar navegación del navegador (botón atrás/adelante)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      console.log('[AppContent] Popstate event:', location.pathname);
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
  }, [location.pathname, setView, setSelectedItem]);
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/*" element={<HomeLayout />} />
      </Routes>
    </Suspense>
  );
}