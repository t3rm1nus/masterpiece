import React from 'react';
import HomePage from './HomePage';
import { Outlet, useLocation } from 'react-router-dom';
import HybridMenu from './HybridMenu';

export default function HomeLayout() {
  const location = useLocation();
  const isDetail = location.pathname.startsWith('/detalle');

  return (
    <div>
      <HybridMenu />
      <div style={{ display: isDetail ? 'none' : 'block' }}>
        <HomePage />
      </div>
      <Outlet />
    </div>
  );
} 