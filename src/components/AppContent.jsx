import React, { Suspense, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import HomeLayout from './HomeLayout';
import UnifiedItemDetail from './UnifiedItemDetail';
import { LoadingFallback } from './LazyComponents';
import HowToDownload from '../pages/HowToDownload';
import CoffeePage from './CoffeePage';
import useAppStore from '../store/useAppStore';

export default function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setView, setSelectedItem } = useAppStore();

  // Manejar navegación del navegador (botón atrás/adelante)
  useEffect(() => {
    const handlePopState = (event) => {
      console.log('[AppContent] Popstate event:', location.pathname);
      
      // Solo limpiar el detalle si venimos de una ruta diferente a detalle
      // Esto evita que se altere el estado cuando volvemos del detalle
      if (location.pathname === '/' && !event.state?.fromDetail) {
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
        <Route path="/" element={<HomeLayout />}>
          <Route index element={null} />
          <Route path="detalle/:id" element={<UnifiedItemDetail />} />
          <Route path="como-descargar" element={<HowToDownload />} />
          <Route path="donaciones" element={<CoffeePage />} />
        </Route>
        {/* Otras rutas globales si las tienes */}
      </Routes>
    </Suspense>
  );
}
