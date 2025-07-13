import React, { useEffect, ReactNode } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAppTheme } from '../store/useAppStore';

// =============================================
// MaterialThemeProvider: Provider de tema Material UI
// Provider de tema Material UI. Optimizado para performance, soporte de temas dinámicos y experiencia visual consistente.
// =============================================

interface MaterialThemeProviderProps {
  children: ReactNode;
}

const MaterialThemeProvider: React.FC<MaterialThemeProviderProps> = ({ children }) => {
  const { isDarkMode, theme: currentTheme } = useAppTheme();
  
  // Aplicar el tema al HTML para CSS customizado
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);
  
  const theme = createTheme({    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#0078d4',
      },
      secondary: {
        main: '#ffc439',
      },      background: {
        default: isDarkMode ? '#1e1e1e' : '#ffffff',
        paper: isDarkMode ? '#2d2d2d' : '#ffffff',
      },
      text: {
        primary: isDarkMode ? '#ffffff' : '#000000',
        secondary: isDarkMode ? '#cccccc' : '#666666',
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: 'none',
            boxShadow: '0 0 20px rgba(0,0,0,0.3)',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            margin: '2px 8px',            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '8px',
          },
        },
      },
    },
  });
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default MaterialThemeProvider;