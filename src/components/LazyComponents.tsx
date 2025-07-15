import React, { lazy, FC } from 'react';

// =============================================
// LazyComponents: Wrapper de lazy loading para componentes pesados
// Wrapper de lazy loading para componentes pesados. Optimizado para performance, UX y carga progresiva en móviles/desktop.
// =============================================

// Lazy loading de componentes pesados
export const LazyCoffeePage = lazy(() => import('./CoffeePage'));
export const LazyRecommendationsList = lazy(() => import('./RecommendationsList'));
export const LazyHowToDownload = lazy(() => import('../pages/HowToDownload'));

// Componente de loading fallback
interface LoadingFallbackProps {
  message?: string;
}

export const LoadingFallback: FC<LoadingFallbackProps> = ({ message = "Cargando..." }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
    fontSize: '1.1rem',
    color: '#666'
  }}>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <span>{message}</span>
    </div>
  </div>
);

// Agregar estilos CSS para la animación de loading solo una vez
if (typeof document !== 'undefined' && !document.getElementById('lazycomponents-spin-style')) {
  const styleTag = document.createElement('style');
  styleTag.id = 'lazycomponents-spin-style';
  styleTag.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleTag);
} 