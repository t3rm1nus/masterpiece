import React from 'react';
import { useMusicData } from '../hooks/useMusicData.js';
import { Typography, Box, Card, CardContent, Chip, CircularProgress, Alert } from '@mui/material';

// =============================================
// MusicChunkedExample: Ejemplo de uso de datos chunked de música
// Demuestra carga eficiente, filtrado y visualización optimizada para performance y móviles.
// =============================================

const MusicChunkedExample: React.FC = () => {
  const { musicData, loading, error, metadata, filter } = useMusicData();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Cargando datos de música chunked...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Error cargando datos de música: {error}
      </Alert>
    );
  }

  const rockMusic = filter.bySubcategory('rock');
  const electronicMusic = filter.bySubcategory('electronic');
  const masterpieces = filter.byMasterpiece(true);
  const randomPicks = filter.random(5);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🎵 Datos de Música Chunked
      </Typography>
      
      {/* Metadata */}
      <Card sx={{ mb: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📊 Estadísticas de Carga
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Chip 
              label={`Total: ${metadata?.totalItems || 0} elementos`} 
              color="secondary"
            />
            <Chip 
              label={`Chunks: ${metadata?.totalChunks || 0}`} 
              color="secondary"
            />
            <Chip 
              label={`Cargado: ${new Date(metadata?.loadedAt || Date.now()).toLocaleTimeString()}`} 
              color="secondary"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Estadísticas por subcategoría */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary">
              🎸 Rock
            </Typography>
            <Typography variant="h4">
              {rockMusic.length}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary">
              🎛️ Electronic
            </Typography>
            <Typography variant="h4">
              {electronicMusic.length}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary">
              ⭐ Masterpieces
            </Typography>
            <Typography variant="h4">
              {masterpieces.length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Selección aleatoria */}
      <Typography variant="h5" gutterBottom>
        🎲 Selección Aleatoria (5 elementos)
      </Typography>
      <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
        {randomPicks.map((item: any) => (
          <Card key={item.id} sx={{ maxWidth: 300 }}>
            <CardContent>
              <Typography variant="h6" component="div">
                {item.title?.es || item.title?.en || 'Sin título'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.artist}
              </Typography>
              <Box mt={1}>
                <Chip 
                  size="small" 
                  label={item.subcategory} 
                  color="primary"
                />
                {item.masterpiece && (
                  <Chip 
                    size="small" 
                    label="⭐ Masterpiece" 
                    color="secondary"
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Información técnica */}
      <Card sx={{ mt: 3, bgcolor: 'grey.100' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🔧 Información Técnica del Sistema Chunked
          </Typography>
          <Typography variant="body2" paragraph>
            ✅ Los datos se cargan desde {metadata?.totalChunks} chunks separados de ~200 elementos cada uno
          </Typography>
          <Typography variant="body2" paragraph>
            ✅ Mejora el rendimiento inicial de carga
          </Typography>
          <Typography variant="body2" paragraph>
            ✅ Permite escalabilidad cuando el archivo crezca
          </Typography>
          <Typography variant="body2" paragraph>
            ✅ Incluye fallback automático al archivo original
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MusicChunkedExample;