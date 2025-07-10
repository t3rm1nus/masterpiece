import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeLayout from './HomeLayout';
import UnifiedItemDetail from './UnifiedItemDetail';
import { LoadingFallback } from './LazyComponents';
import HowToDownload from '../pages/HowToDownload';
import CoffeePage from './CoffeePage';

export default function AppContent() {
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
