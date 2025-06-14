import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Chip,
  Container,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Coffee as CoffeeIcon,
  Favorite as HeartIcon,
  Star as StarIcon,
  Code as CodeIcon,
  Update as UpdateIcon
} from '@mui/icons-material';
import { useLanguage } from '../LanguageContext';

const MaterialCoffeePage = () => {
  const { t } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Solo renderizar en móviles
  if (!isMobile) {
    return null;
  }

  const benefits = [
    {
      text: t.coffee_benefit_1,
      icon: <HeartIcon sx={{ color: '#e74c3c' }} />
    },
    {
      text: t.coffee_benefit_2,
      icon: <StarIcon sx={{ color: '#f39c12' }} />
    },
    {
      text: t.coffee_benefit_3,
      icon: <CodeIcon sx={{ color: '#3498db' }} />
    },
    {
      text: t.coffee_benefit_4,
      icon: <UpdateIcon sx={{ color: '#2ecc71' }} />
    }
  ];

  return (    <Container 
      maxWidth="sm" 
      sx={{ 
        padding: '16px',
        paddingTop: '64px', // Espacio para el AppBar fijo (48px) + padding extra (16px)
        paddingBottom: '32px'
      }}
    >
      {/* Tarjeta principal */}
      <Card 
        elevation={3}
        sx={{ 
          marginBottom: '16px',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #2d1810 0%, #1a0e0a 100%)'
            : 'linear-gradient(135deg, #f7f3e9 0%, #e8ddd4 100%)',
          border: theme.palette.mode === 'dark' 
            ? '1px solid #5d4e37' 
            : '1px solid #d4af37'
        }}
      >
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
            sx={{ 
              fontWeight: 'bold',
              marginBottom: '8px',
              color: theme.palette.mode === 'dark' ? '#f4e4bc' : '#8b4513',
              fontSize: { xs: '1.8rem', sm: '2.2rem' }
            }}
          >
            {t.coffee_page_title}
          </Typography>
          
          {/* Subtítulo */}
          <Typography 
            variant="h6" 
            sx={{ 
              marginBottom: '16px',
              color: theme.palette.mode === 'dark' ? '#d2b48c' : '#a0522d',
              fontStyle: 'italic'
            }}
          >
            {t.coffee_page_subtitle}
          </Typography>
          
          {/* Descripción principal */}
          <Typography 
            variant="body1" 
            sx={{ 
              lineHeight: 1.6,
              color: theme.palette.text.primary,
              fontSize: '1rem'
            }}
          >
            {t.coffee_description}
          </Typography>
        </CardContent>
      </Card>

      {/* Tarjeta de beneficios */}
      <Card elevation={2} sx={{ marginBottom: '16px' }}>
        <CardContent>
          <Typography 
            variant="h6" 
            sx={{ 
              marginBottom: '16px',
              textAlign: 'center',
              fontWeight: 'bold',
              color: theme.palette.primary.main
            }}
          >
            {t.coffee_benefits_title}
          </Typography>
          
          <List dense>
            {benefits.map((benefit, index) => (
              <ListItem key={index} sx={{ padding: '4px 0' }}>
                <ListItemIcon sx={{ minWidth: '40px' }}>
                  {benefit.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={benefit.text}
                  primaryTypographyProps={{
                    fontSize: '0.95rem',
                    lineHeight: 1.4
                  }}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Tarjeta de call to action */}
      <Card 
        elevation={3}
        sx={{ 
          marginBottom: '16px',
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1a472a 0%, #0d2818 100%)'
            : 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
          border: '2px solid',
          borderColor: theme.palette.mode === 'dark' ? '#4caf50' : '#2e7d32'
        }}
      >
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              marginBottom: '8px',
              fontWeight: 'bold',
              color: theme.palette.mode === 'dark' ? '#81c784' : '#2e7d32'
            }}
          >
            {t.coffee_cta}
          </Typography>
          
          <Typography 
            variant="body2" 
            sx={{ 
              marginBottom: '16px',
              color: theme.palette.text.secondary,
              fontStyle: 'italic'
            }}
          >
            {t.coffee_legend}
          </Typography>
            {/* Contenedor del botón PayPal con estilos Material UI mejorados para móviles */}
          <Paper 
            elevation={2}
            sx={{ 
              padding: '20px',
              backgroundColor: theme.palette.background.paper,
              borderRadius: '12px',
              border: '1px solid',
              borderColor: theme.palette.divider,
              width: '100%',
              maxWidth: '100%'
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                marginBottom: '16px',
                color: theme.palette.text.secondary,
                fontSize: '0.9rem',
                textAlign: 'center'
              }}
            >
              Donación segura a través de PayPal
            </Typography>
            
            {/* Contenedor del botón de PayPal optimizado para móviles */}
            <Box 
              id="paypal-button-wrapper"
              sx={{
                width: '100%',
                minHeight: '100px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                '& #paypal-container-MRSQEQV646EPA': {
                  borderRadius: '8px',
                  overflow: 'hidden',
                  width: '100% !important',
                  maxWidth: '100% !important',
                  '& > div': {
                    width: '100% !important'
                  },
                  '& button': {
                    width: '100% !important',
                    minWidth: '200px !important',
                    height: 'auto !important',
                    minHeight: '48px !important',
                    fontSize: '16px !important',
                    lineHeight: '1.2 !important',
                    whiteSpace: 'nowrap !important'
                  },
                  '& iframe': {
                    width: '100% !important',
                    minHeight: '48px !important'
                  }
                }
              }}
            >
              <div 
                id="paypal-container-MRSQEQV646EPA"
                style={{ width: '100%', maxWidth: '300px' }}
              ></div>
            </Box>
          </Paper>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card elevation={1}>
        <CardContent sx={{ textAlign: 'center', padding: '16px' }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme.palette.text.secondary,
              fontStyle: 'italic',
              lineHeight: 1.4
            }}
          >
            {t.coffee_footer}
          </Typography>
          
          <Box sx={{ marginTop: '12px' }}>
            <Chip 
              icon={<CoffeeIcon />}
              label="¡Gracias por tu apoyo!"
              color="primary"
              variant="outlined"
              size="small"
            />
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default MaterialCoffeePage;
