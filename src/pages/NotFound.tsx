import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import useAppTranslations from '../hooks/useAppTranslations';

const randomImage = () => {
  const images = [
    'https://raw.githubusercontent.com/t3rm1nus/masterpiece/main/public/imagenes/notfound/notfound.webp',
    'https://raw.githubusercontent.com/t3rm1nus/masterpiece/main/public/imagenes/notfound/notfound2.webp',
    'https://raw.githubusercontent.com/t3rm1nus/masterpiece/main/public/imagenes/notfound/notfound3.webp',
    'https://raw.githubusercontent.com/t3rm1nus/masterpiece/main/public/imagenes/notfound/notfound4.webp',
    'https://raw.githubusercontent.com/t3rm1nus/masterpiece/main/public/imagenes/notfound/notfound5.webp',
    'https://raw.githubusercontent.com/t3rm1nus/masterpiece/main/public/imagenes/notfound/notfound6.webp',
    'https://raw.githubusercontent.com/t3rm1nus/masterpiece/main/public/imagenes/notfound/notfound7.webp',
    'https://raw.githubusercontent.com/t3rm1nus/masterpiece/main/public/imagenes/notfound/notfound8.webp',
    'https://raw.githubusercontent.com/t3rm1nus/masterpiece/main/public/imagenes/notfound/notfound9.webp',
    'https://raw.githubusercontent.com/t3rm1nus/masterpiece/main/public/imagenes/notfound/notfound10.webp',
  ];
  return images[Math.floor(Math.random() * images.length)];
};

const NotFound: React.FC = () => {
  const { currentLanguage, t } = useAppTranslations();
  const texts = t('ui.errors.not_found_page') as any;
  // Enlaces traducidos
  const links = [
    { to: '/', label: t('ui.navigation.home') },
    { to: '/movies', label: t('categories.movies') },
    { to: '/series', label: t('categories.series') },
    { to: '/books', label: t('categories.books') },
    { to: '/comics', label: t('categories.comics') },
    { to: '/music', label: t('categories.music') },
    { to: '/videogames', label: t('categories.videogames') },
    { to: '/boardgames', label: t('categories.boardgames') },
    { to: '/podcast', label: t('categories.podcast') },
    { to: '/como-descargar', label: t('ui.navigation.how_to_download') },
  ];
  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fafafa',
      textAlign: 'center',
      p: 3,
    }}>
      <img src={randomImage()} alt="404 Not Found" style={{ maxWidth: 320, marginBottom: 24, borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }} />
      <Typography variant="h2" color="primary" gutterBottom>
        {texts.title}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        {texts.message}<br />
        {texts.helpful_links}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mb: 3 }}>
        {links.map(link => (
          <Button key={link.to} component={Link} to={link.to} variant={link.to === '/' ? 'contained' : 'outlined'} color={link.to === '/' ? 'primary' : 'inherit'}>
            {link.label}
          </Button>
        ))}
      </Box>
      <Typography variant="caption" color="textSecondary">
        {texts.contact} <a href="mailto:info@masterpiece.es">info@masterpiece.es</a>.<br />
        {texts.thanks}
      </Typography>
    </Box>
  );
};

export default NotFound; 