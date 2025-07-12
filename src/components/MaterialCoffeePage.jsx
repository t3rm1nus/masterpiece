import React, { useEffect, useState, createContext, useContext } from 'react';
import {
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Container,
  Button,
  useTheme,
  useMediaQuery,
  Fab
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Coffee as CoffeeIcon,
  Favorite as HeartIcon,
  Star as StarIcon,
  Code as CodeIcon,
  Update as UpdateIcon,
  Wifi as WifiIcon,
  Psychology as BrainIcon,
  SentimentVeryDissatisfied as SadIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import UiCard from './ui/UiCard';
import { useLanguage } from '../LanguageContext';
import { useGoogleAnalytics } from '../hooks/useGoogleAnalytics';

// =============================================
// MaterialCoffeePage: Página de donación (Coffee) Material UI
// Optimizada para móviles y desktop, con integración de analytics y experiencia de usuario moderna.
// =============================================

// Contexto para animación de salida del card overlay
export const OverlayCardAnimationContext = createContext({ triggerExitAnimation: () => {} });

const MaterialCoffeePage = () => {
  const { t, getTranslation } = useLanguage();
  const { trackSpecialPageView } = useGoogleAnalytics();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [cardAnim, setCardAnim] = useState('slideInUpFast');
  const [isExiting, setIsExiting] = useState(false);
  // Proveer función para disparar animación de salida
  const triggerExitAnimation = () => {
    if (!isExiting) {
      setIsExiting(true);
      setCardAnim('slideOutDownFast');
    }
  };

  const navigate = useNavigate();

  // Google Analytics tracking para página de donaciones
  useEffect(() => {
    trackSpecialPageView('donations', {
      page_title: 'Donaciones - Coffee Page',
      source: 'main_navigation'
    });
  }, [trackSpecialPageView]);

  // Detectar overlay cierre por navegación atrás
  useEffect(() => {
    const onPopState = () => {
      if (!isExiting) {
        setIsExiting(true);
        setCardAnim('slideOutDownFast');
      }
    };
    const onOverlayExit = () => {
      if (!isExiting) {
        setIsExiting(true);
        setCardAnim('slideOutDownFast');
      }
    };
    window.addEventListener('popstate', onPopState);
    window.addEventListener('overlay-exit', onOverlayExit);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('overlay-exit', onOverlayExit);
    };
  }, [isExiting]);

  // Inyectar keyframes solo una vez
  useEffect(() => {
    if (!document.getElementById('coffee-keyframes')) {
      const style = document.createElement('style');
      style.id = 'coffee-keyframes';
      style.innerHTML = `@keyframes scaleFadeIn {0%{opacity:0;transform:scale(0.92);}100%{opacity:1;transform:scale(1);}}@keyframes scaleFadeOut {0%{opacity:1;transform:scale(1);}100%{opacity:0;transform:scale(0.92);}}.slideInUpFast{animation:scaleFadeIn 0.55s cubic-bezier(0.25,0.46,0.45,0.94) forwards;}.slideOutDownFast{animation:scaleFadeOut 0.55s cubic-bezier(0.25,0.46,0.45,0.94) forwards;}`;
      document.head.appendChild(style);
    }
  }, []);

  // Fix específico para iPhone - asegurar scroll
  useEffect(() => {
    const isIPhone = /iPhone|iPod/.test(navigator.userAgent);
    if (isIPhone) {
      // Forzar propiedades de scroll en iPhone
      document.body.style.overflowY = 'auto';
      document.body.style.webkitOverflowScrolling = 'touch';
      
      return () => {
        // Limpiar al desmontar
        document.body.style.overflowY = '';
        document.body.style.webkitOverflowScrolling = '';
      };
    }
  }, []);

  const handleBack = () => {
    triggerExitAnimation();
  };

  // Ahora se renderiza en todas las pantallas (móvil Y desktop)
  const benefits = [
    {
      text: t.coffee_benefit_1,
      icon: <HeartIcon sx={{ color: '#e74c3c' }} />
    },
    {
      text: t.coffee_benefit_2,
      icon: <WifiIcon sx={{ color: '#f39c12' }} />
    },
    {
      text: t.coffee_benefit_3,
      icon: <Box sx={{ display: 'flex', gap: 0.5 }}>
        <CoffeeIcon sx={{ color: '#8b4513', fontSize: '1.2rem' }} />
        <BrainIcon sx={{ color: '#3498db', fontSize: '1.2rem' }} />
      </Box>
    },
    {
      text: t.coffee_benefit_4,
      icon: <SadIcon sx={{ color: '#9b59b6' }} />
    }
  ];

  const paypalButtonSx = {
    backgroundColor: '#007bff',
    color: '#ffffff',
    padding: '16px 32px',
    border: '2px solid #0056b3',
    borderRadius: '8px',
    fontSize: '1.1em',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'inline-block',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    textDecoration: 'none',
    width: '100%',
    maxWidth: '280px',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    transition: 'all 0.3s ease',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    '&:hover': {
      backgroundColor: '#0056b3',
      transform: 'translateY(-2px)'
    },
    '&:active': {
      backgroundColor: '#007bff',
      transform: 'translateY(0)'
    }
  };

  return (
    <OverlayCardAnimationContext.Provider value={{ triggerExitAnimation }}>
      <Container 
        maxWidth="md" 
        sx={{ 
          padding: { xs: '16px', sm: '24px' },
          paddingTop: isMobile ? { xs: '36px', sm: '80px', md: '50px' } : '40px', // Reducido a la mitad en desktop
          paddingBottom: '40px',
          backgroundColor: isMobile ? '#fafafa' : '#fff',
          minHeight: '100vh',
          position: 'relative',
          zIndex: isMobile ? 1100 : 1200, // En móvil por debajo del menú (1300), en desktop por encima del detalle (1100)
          overflow: 'visible',
          WebkitOverflowScrolling: 'touch'
        }}
        className={cardAnim}
        onAnimationEnd={() => {
          if (cardAnim === 'slideOutDownFast' && isExiting) {
            setTimeout(() => {
              navigate('/');
            }, 100);
          }
        }}
      >
        {/* FAB volver visible solo en desktop, z-index 2100 */}
        {!isMobile && (
          <Fab
            color="primary"
            aria-label="volver"
            onClick={handleBack}
            sx={{
              position: 'fixed',
              top: '8px',
              left: 16,
              zIndex: 2100,
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              }
            }}
          >
            <ArrowBackIcon />
          </Fab>
        )}
        {/* Card principal con icono de café y color de fondo de café */}
        <UiCard 
          elevation={3}
          sx={{ 
            marginBottom: '16px',
            backgroundColor: '#F5F5DC',
            border: '2px solid #D4A574',
            borderRadius: '12px',
          }}
        >
          {/* Botón volver solo en desktop */}
          {/* ELIMINADO: Botón rectangular duplicado en desktop */}
          <CardContent sx={{ textAlign: 'center', padding: '24px' }}>
            {/* Icono de café animado */}
            <Box 
              sx={{ 
                fontSize: '3rem',
                marginBottom: '16px',
                animation: 'bounce 2s infinite'
              }}
            >
              ☕
            </Box>
            {/* Título principal */}
            <Typography 
              variant="h4" 
              component="h1" 
              className="donation-title"
              sx={{ 
                fontWeight: 'bold',
                marginBottom: '16px',
                color: '#8B4513',
                fontSize: { xs: '1.5rem', sm: '1.8rem' },
                textDecoration: 'none',
                textShadow: 'none',
                border: 'none',
                outline: 'none',
                background: 'none',
                backgroundColor: 'transparent',
                width: { xs: '100%', sm: 'auto' },
                display: { xs: 'block', sm: 'inline' },
                textAlign: 'center',
                padding: { xs: 0, sm: undefined },
                // Solo en móviles ocupa todo el ancho y sin padding
                '@media (min-width:600px)': {
                  width: 'auto',
                  display: 'inline',
                  padding: undefined
                },
                '&:hover': {
                  background: 'none',
                  backgroundColor: 'transparent',
                  textDecoration: 'none',
                  color: '#8B4513'
                },
                '&:focus': {
                  background: 'none',
                  backgroundColor: 'transparent',
                  outline: 'none'
                }
              }}
            >
              {t.coffee_page_title}
            </Typography>
            {/* Subtítulo con emoji de mano */}
            <Typography 
              variant="h6" 
              sx={{ 
                marginBottom: '16px',
                color: '#8B4513',
                fontStyle: 'normal',
                fontSize: { xs: '1.1rem', sm: '1.3rem' }
              }}
            >
              {t.coffee_page_subtitle}
            </Typography>
            {/* Descripción principal */}
            <Typography 
              variant="body1" 
              sx={{ 
                lineHeight: 1.6,
                color: '#333333',
                fontSize: '1rem'
              }}
            >
              {t.coffee_description}
            </Typography>
          </CardContent>
        </UiCard>
        {/* Card con fondo blanco y borde gris */}
        <UiCard 
          elevation={2}
          sx={{ 
            marginBottom: '20px',
            backgroundColor: '#ffffff',
            border: '1px solid #d0d0d0',
            borderRadius: '8px'
          }}
        >
          <CardContent>
            <Typography 
              variant="h6" 
              sx={{ 
                marginBottom: '16px',
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#1976d2',
                fontSize: '1.1rem'
              }}
            >
              {t.coffee_benefits_title}
            </Typography>
            <List dense>
              {benefits.map((benefit, index) => (
                <ListItem key={index} sx={{ padding: '8px 0' }}>
                  <ListItemIcon sx={{ minWidth: '40px' }}>
                    {benefit.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={benefit.text}
                    primaryTypographyProps={{
                      fontSize: '0.95rem',
                      lineHeight: 1.4,
                      color: '#333333'
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </UiCard>
        {/* Card con borde verde y fondo verde suave */}
        <UiCard 
          elevation={3}
          sx={{ 
            marginBottom: '20px',
            backgroundColor: '#e8f5e8',
            border: '2px solid #4caf50',
            borderRadius: '8px'
          }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            {/* Título en verde */}
            <Typography 
              variant="h6" 
              sx={{ 
                marginBottom: '8px',
                fontWeight: 'bold',
                color: '#2e7d32'
              }}
            >
              {t.coffee_cta}
            </Typography>
            {/* Párrafo en gris y cursiva */}
            <Typography 
              variant="body2" 
              sx={{ 
                marginBottom: '16px',
                color: '#666666',
                fontStyle: 'italic'
              }}
            >
              {t.coffee_legend}
            </Typography>
            {/* Card interna fondo blanco borde gris */}
            <Paper 
              elevation={2}
              sx={{ 
                padding: '20px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #d0d0d0',
                width: '100%',
                maxWidth: '100%'
              }}
            >
              {/* Párrafo gris */}
              <Typography 
                variant="body2" 
                sx={{ 
                  marginBottom: '16px',
                  color: '#666666',
                  fontSize: '0.9rem',
                  textAlign: 'center'
                }}
              >
                Donación segura a través de PayPal
              </Typography>
              {/* Botón de donar de PayPal tal y como está */}
              <form action="https://www.paypal.com/donate" method="post" target="_top">
                <input type="hidden" name="hosted_button_id" value="SP8LLWVGW7EWC" />
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={paypalButtonSx}
                    title={getTranslation('ui.paypal.title', 'PayPal - The safer, easier way to pay online!')}
                    disableElevation
                    fullWidth
                  >
                    {getTranslation('ui.paypal.button', 'Invítame a un café')}
                  </Button>
                </Box>
              </form>
            </Paper>
          </CardContent>
        </UiCard>
        {/* Card blanca con borde gris - Footer */}
        <UiCard 
          elevation={1}
          sx={{
            backgroundColor: '#ffffff',
            border: '1px solid #d0d0d0',
            borderRadius: '8px'
          }}
        >
          <CardContent sx={{ textAlign: 'center', padding: '16px' }}>
            {/* Párrafo gris y cursiva */}
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#666666',
                fontStyle: 'italic',
                lineHeight: 1.4,
                marginBottom: '16px'
              }}
            >
              {t.coffee_footer}
            </Typography>
          </CardContent>
        </UiCard>
      </Container>
    </OverlayCardAnimationContext.Provider>
  );
};

export default MaterialCoffeePage;
