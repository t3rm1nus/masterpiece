import React from 'react';

/**
 * Temporary static theme toggle for testing
 */
export default function ThemeToggleTest() {
  return (
    <button 
      onClick={() => console.log('Theme toggle clicked - static version')}
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
      aria-label="Test theme toggle"
    >
      🌓
    </button>
  );
}
