import React from 'react';
import { useAppTheme } from '../store/useAppStore';

/**
 * Componente para cambiar entre temas claro y oscuro
 * 
 * Este componente muestra un botón que permite al usuario cambiar
 * entre los temas claro y oscuro de la aplicación.
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useAppTheme();
  
  return (
    <button 
      onClick={toggleTheme}
      style={{
        background: 'none',
        border: '1px solid var(--border-color)',
        borderRadius: '4px',
        padding: '0.5rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-color)',
        backgroundColor: 'var(--card-background)',
        margin: '0 0.5rem'
      }}
      aria-label={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
    >
      {theme === 'light' ? (
        // Icono de luna para modo oscuro
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        // Icono de sol para modo claro
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}
