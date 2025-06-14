import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useThemeStore from '../store/themeStore';

const MaterialThemeProvider = ({ children }) => {
  const { isDarkTheme } = useThemeStore();
  
  const theme = createTheme({
    palette: {
      mode: isDarkTheme ? 'dark' : 'light',
      primary: {
        main: '#0078d4',
      },
      secondary: {
        main: '#ffc439',
      },
      background: {
        default: isDarkTheme ? '#1e1e1e' : '#ffffff',
        paper: isDarkTheme ? '#2d2d2d' : '#ffffff',
      },
      text: {
        primary: isDarkTheme ? '#ffffff' : '#000000',
        secondary: isDarkTheme ? '#cccccc' : '#666666',
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
            margin: '2px 8px',
            '&:hover': {
              backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
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
