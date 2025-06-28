import React from 'react';
import {
  Box,
  Typography
} from '@mui/material';
import {
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  ChildCare as ChildCareIcon,
  Code as DeveloperIcon,
  Gamepad as PlatformIcon,
  Translate as TranslateIcon,
  PlaylistPlay as PlaylistPlayIcon
} from '@mui/icons-material';
import { getCategoryColor } from '../../utils/categoryPalette';
import { ensureString } from '../../utils/stringUtils';

export function MobileCategorySpecificContent({ selectedItem, lang, t, getTranslation }) {
  // Documentales
  if (selectedItem.category === 'documentales') {
    return (
      <Box sx={{ marginBottom: '16px', width: '100%' }}>
        {selectedItem.duration && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '8px' }}>
            <AccessTimeIcon sx={{ marginRight: '8px', color: '#111' }} />
            <Typography variant="h6" sx={{ color: '#111', fontWeight: 500, textAlign: 'left' }}>
              <strong>{t.documentales?.duration || 'Duración'}:</strong> {ensureString(selectedItem.duration)}
            </Typography>
          </Box>
        )}
        {selectedItem.episodes && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '8px' }}>
            <PlaylistPlayIcon sx={{ marginRight: '8px', color: '#111' }} />
            <Typography variant="h6" sx={{ color: '#111', fontWeight: 500, textAlign: 'left' }}>
              <strong>{t.documentales?.episodes || 'Episodios'}:</strong> {ensureString(selectedItem.episodes)}
            </Typography>
          </Box>
        )}
        {selectedItem.language && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '8px' }}>
            <TranslateIcon sx={{ marginRight: '8px', color: getCategoryColor(selectedItem.category) }} />
            <Typography variant="h6" sx={{ color: getCategoryColor(selectedItem.category), fontWeight: 500, textAlign: 'left' }}>
              <strong>{t.documentales?.language || 'Idioma'}:</strong> {t.filters?.languages?.[selectedItem.language] || ensureString(selectedItem.language)}
            </Typography>
          </Box>
        )}
        {selectedItem.year && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '8px' }}>
            <AccessTimeIcon sx={{ marginRight: '8px', color: '#111' }} />
            <Typography variant="h6" sx={{ color: '#111', fontWeight: 500, textAlign: 'left' }}>
              <strong>{(getTranslation && typeof getTranslation === 'function')
                ? getTranslation('content.metadata.common.year', 'Año')
                : (t?.content?.metadata?.common?.year || 'Año')
              }:</strong> {ensureString(selectedItem.year, lang)}
            </Typography>
          </Box>
        )}
        {selectedItem.country && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '8px' }}>
            <Typography variant="h6" sx={{ color: getCategoryColor(selectedItem.category), fontWeight: 500, textAlign: 'left' }}>
              <strong>{t.documentales?.country || 'País'}:</strong> {ensureString(selectedItem.country)}
            </Typography>
          </Box>
        )}
        {selectedItem.director && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '8px' }}>
            <PersonIcon sx={{ marginRight: '8px', color: '#111' }} />
            <Typography variant="h6" sx={{ color: '#111', fontWeight: 500, textAlign: 'left' }}>
              <strong>{t.documentales?.director || 'Director'}:</strong> {ensureString(selectedItem.director)}
            </Typography>
          </Box>
        )}
      </Box>
    );
  }
  // Juegos de mesa
  if (selectedItem.category === 'boardgames') {
    return (
      <Box sx={{ marginBottom: '16px', width: '100%' }}>
        {(selectedItem.minPlayers || selectedItem.maxPlayers) && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '8px' }}>
            <PersonIcon sx={{ marginRight: '8px', color: '#111' }} />
            <Typography variant="h6" sx={{ color: '#111', fontWeight: 500, textAlign: 'left' }}>
              <strong>{lang === 'es' ? 'Jugadores' : 'Players'}:</strong>{' '}
              {selectedItem.minPlayers && selectedItem.maxPlayers 
                ? (selectedItem.minPlayers === selectedItem.maxPlayers 
                    ? ensureString(selectedItem.minPlayers) 
                    : `${ensureString(selectedItem.minPlayers)}-${ensureString(selectedItem.maxPlayers)}`)
                : ensureString(selectedItem.minPlayers || selectedItem.maxPlayers)
              }
            </Typography>
          </Box>
        )}
        {selectedItem.playTime && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '8px' }}>
            <AccessTimeIcon sx={{ marginRight: '8px', color: '#111' }} />
            <Typography variant="h6" sx={{ color: '#111', fontWeight: 500, textAlign: 'left' }}>
              <strong>{lang === 'es' ? 'Duración' : 'Play Time'}:</strong> {ensureString(selectedItem.playTime)} min
            </Typography>
          </Box>
        )}
        {selectedItem.age && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '8px' }}>
            <ChildCareIcon sx={{ marginRight: '8px', color: '#111' }} />
            <Typography variant="h6" sx={{ color: '#111', fontWeight: 500, textAlign: 'left' }}>
              <strong>{lang === 'es' ? 'Edad' : 'Age'}:</strong> {ensureString(selectedItem.age)}
            </Typography>
          </Box>
        )}
      </Box>
    );
  }
  // Videojuegos
  if (selectedItem.category === 'videogames') {
    return (
      <Box sx={{ marginBottom: '16px', width: '100%' }}>
        {selectedItem.author && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '8px' }}>
            <DeveloperIcon sx={{ marginRight: '8px', color: getCategoryColor(selectedItem.category) }} />
            <Typography variant="h6" sx={{ color: getCategoryColor(selectedItem.category), fontWeight: 500, textAlign: 'left' }}>
              <strong>{lang === 'es' ? 'Desarrollador' : 'Developer'}:</strong> {ensureString(selectedItem.author)}
            </Typography>
          </Box>
        )}
        {selectedItem.platforms && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '8px' }}>
            <PlatformIcon sx={{ marginRight: '8px', color: getCategoryColor(selectedItem.category) }} />
            <Typography variant="h6" sx={{ color: getCategoryColor(selectedItem.category), fontWeight: 500, textAlign: 'left' }}>
              <strong>{lang === 'es' ? 'Plataformas' : 'Platforms'}:</strong> {ensureString(selectedItem.platforms)}
            </Typography>
          </Box>
        )}
      </Box>
    );
  }
  // Podcasts
  if (selectedItem.category === 'podcast' && selectedItem.author) {
    return (
      <Box sx={{ marginBottom: '16px', width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '8px' }}>
          <PersonIcon sx={{ marginRight: '8px', color: '#111' }} />
          <Typography variant="h6" sx={{ color: '#111', fontWeight: 500, textAlign: 'left' }}>
            <strong>{lang === 'es' ? 'Autor' : 'Author'}:</strong> {ensureString(selectedItem.author)}
          </Typography>
        </Box>
      </Box>
    );
  }
  // Películas
  if ((selectedItem.category === 'movies' || selectedItem.category === 'peliculas') && (selectedItem.year || selectedItem.director)) {
    return (
      <Box sx={{ marginBottom: '16px', width: '100%' }}>
        {selectedItem.director && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '8px' }}>
            <PersonIcon sx={{ marginRight: '8px', color: '#111' }} />
            <Typography variant="h6" sx={{ color: '#111', fontWeight: 500, textAlign: 'left', fontSize: '1rem' }}>
              <strong>{t?.content?.metadata?.common?.director || 'Director'}:</strong> {ensureString(selectedItem.director)}
            </Typography>
          </Box>
        )}
        {selectedItem.year && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '8px' }}>
            <AccessTimeIcon sx={{ marginRight: '8px', color: '#111' }} />
            <Typography variant="h6" sx={{ color: '#111', fontWeight: 500, textAlign: 'left', fontSize: '1rem' }}>
              <strong>{(getTranslation && typeof getTranslation === 'function')
                ? getTranslation('content.metadata.common.year', 'Año')
                : (t?.content?.metadata?.common?.year || 'Año')
              }:</strong> {ensureString(selectedItem.year, lang)}
            </Typography>
          </Box>
        )}
      </Box>
    );
  }
  // Series
  if (selectedItem.category === 'series' && (selectedItem.temporadas || selectedItem.episodios)) {
    return (
      <Box sx={{ marginBottom: '16px', width: '100%' }}>
        {selectedItem.temporadas && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '8px' }}>
            <PlaylistPlayIcon sx={{ marginRight: '8px', color: '#111' }} />
            <Typography variant="h6" sx={{ color: '#111', fontWeight: 500, textAlign: 'left', fontSize: '1rem' }}>
              <strong>{lang === 'es' ? 'Temporadas' : 'Seasons'}:</strong> {ensureString(selectedItem.temporadas)}
            </Typography>
          </Box>
        )}
        {selectedItem.episodios && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '8px' }}>
            <PlaylistPlayIcon sx={{ marginRight: '8px', color: '#111' }} />
            <Typography variant="h6" sx={{ color: '#111', fontWeight: 500, textAlign: 'left', fontSize: '1rem' }}>
              <strong>{lang === 'es' ? 'Episodios' : 'Episodes'}:</strong> {ensureString(selectedItem.episodios)}
            </Typography>
          </Box>
        )}
        {selectedItem.year && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '8px' }}>
            <AccessTimeIcon sx={{ marginRight: '8px', color: '#111' }} />
            <Typography variant="h6" sx={{ color: '#111', fontWeight: 500, textAlign: 'left', fontSize: '1rem' }}>
              <strong>{(getTranslation && typeof getTranslation === 'function')
                ? getTranslation('content.metadata.common.year', 'Año')
                : (t?.content?.metadata?.common?.year || 'Año')
              }:</strong> {ensureString(selectedItem.year, lang)}
            </Typography>
          </Box>
        )}
        {selectedItem.director && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '8px' }}>
            <PersonIcon sx={{ marginRight: '8px', color: '#111' }} />
            <Typography variant="h6" sx={{ color: '#111', fontWeight: 500, textAlign: 'left', fontSize: '1rem' }}>
              <strong>{t?.content?.metadata?.common?.director || 'Director'}:</strong> {ensureString(selectedItem.director)}
            </Typography>
          </Box>
        )}
      </Box>
    );
  }
  
  return null;
}

export function DesktopCategorySpecificContent({ selectedItem, lang, t, getTranslation }) {
  const infoRows = [];
  if (selectedItem.category === 'documentales') {
    if (selectedItem.author) infoRows.push({ label: t.documentales?.author || 'Autor', value: ensureString(selectedItem.author) });
    if (selectedItem.duration) infoRows.push({ label: t.documentales?.duration || 'Duración', value: ensureString(selectedItem.duration) });
    if (selectedItem.language) infoRows.push({ label: t.documentales?.language || 'Idioma', value: t.filters?.languages?.[selectedItem.language] || ensureString(selectedItem.language) });
    if (selectedItem.episodes) infoRows.push({ label: t.documentales?.episodes || 'Episodios', value: ensureString(selectedItem.episodes) });
    if (selectedItem.year) infoRows.push({ label: t.documentales?.year || 'Año', value: ensureString(selectedItem.year) });
    if (selectedItem.country) infoRows.push({ label: t.documentales?.country || 'País', value: ensureString(selectedItem.country) });
    if (selectedItem.director) infoRows.push({ label: t.documentales?.director || 'Director', value: ensureString(selectedItem.director) });
  }
  if (selectedItem.category === 'boardgames') {
    if (selectedItem.minPlayers || selectedItem.maxPlayers) {
      let players = selectedItem.minPlayers && selectedItem.maxPlayers
        ? (selectedItem.minPlayers === selectedItem.maxPlayers
            ? ensureString(selectedItem.minPlayers)
            : `${ensureString(selectedItem.minPlayers)}-${ensureString(selectedItem.maxPlayers)}`)
        : ensureString(selectedItem.minPlayers || selectedItem.maxPlayers);
      infoRows.push({ label: lang === 'es' ? 'Jugadores' : 'Players', value: players });
    }
    if (selectedItem.playTime) infoRows.push({ label: lang === 'es' ? 'Duración' : 'Play Time', value: `${ensureString(selectedItem.playTime)} min` });
    if (selectedItem.age) infoRows.push({ label: lang === 'es' ? 'Edad' : 'Age', value: ensureString(selectedItem.age) });
  }
  if (selectedItem.category === 'videogames') {
    if (selectedItem.author) infoRows.push({ label: lang === 'es' ? 'Desarrollador' : 'Developer', value: ensureString(selectedItem.author) });
    if (selectedItem.platforms) infoRows.push({ label: lang === 'es' ? 'Plataformas' : 'Platforms', value: ensureString(selectedItem.platforms) });
  }
  if (selectedItem.category === 'podcast' && selectedItem.author) {
    infoRows.push({ label: t.author || 'Autor', value: ensureString(selectedItem.author) });
  }
  if (selectedItem.category === 'movies' || selectedItem.category === 'peliculas') {
    if (selectedItem.director) infoRows.push({ label: t.director || 'Director', value: ensureString(selectedItem.director) });
    if (selectedItem.year) infoRows.push({ label: (getTranslation && typeof getTranslation === 'function')
      ? getTranslation('content.metadata.common.year', 'Año')
      : (t?.content?.metadata?.common?.year || 'Año'), value: ensureString(selectedItem.year) });
  }
  if (selectedItem.category === 'series') {
    if (selectedItem.temporadas) infoRows.push({ label: lang === 'es' ? 'Temporadas' : 'Seasons', value: ensureString(selectedItem.temporadas) });
    if (selectedItem.episodios) infoRows.push({ label: lang === 'es' ? 'Episodios' : 'Episodes', value: ensureString(selectedItem.episodios) });
    // Añadir year y director justo después de episodios
    if (selectedItem.year) infoRows.push({ label: (getTranslation && typeof getTranslation === 'function')
      ? getTranslation('content.metadata.common.year', 'Año')
      : (t?.content?.metadata?.common?.year || 'Año'), value: ensureString(selectedItem.year) });
    if (selectedItem.director) infoRows.push({ label: t?.content?.metadata?.common?.director || 'Director', value: ensureString(selectedItem.director) });
  }
  if (infoRows.length === 0) return null;
  return (
    <div className="item-info">
      {infoRows.map((row, idx) => (
        <div className="info-row" key={idx}>
          <span className="info-label">{row.label}: </span>
          <span className="info-value">{row.value}</span>
        </div>
      ))}
    </div>
  );
}
