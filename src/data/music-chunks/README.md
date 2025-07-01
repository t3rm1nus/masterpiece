# Sistema de Datos de Música Chunked

## Descripción

El archivo `datos_music.json` ha sido dividido en chunks de 200 elementos para mejorar el rendimiento de carga y permitir una gestión más eficiente de los datos cuando el archivo crezca.

## Estructura

```
src/
├── data/
│   ├── music-chunks/
│   │   ├── index.json              # Índice con metadata de todos los chunks
│   │   ├── music-chunk-1.json      # Chunk 1: elementos 1-200
│   │   └── music-chunk-2.json      # Chunk 2: elementos 201-334
│   └── datos_music.json            # Archivo original (mantener como backup)
├── utils/
│   └── musicDataLoader.js          # Utilidad para cargar chunks
└── hooks/
    └── useMusicData.js             # Hooks React para usar datos chunked
```

## Archivos Generados

### `music-chunks/index.json`
Contiene metadata sobre todos los chunks:
```json
{
  "totalItems": 334,
  "chunkSize": 200,
  "totalChunks": 2,
  "chunks": [
    {
      "fileName": "music-chunk-1.json",
      "startId": 1,
      "endId": 200,
      "itemCount": 200
    },
    {
      "fileName": "music-chunk-2.json", 
      "startId": 201,
      "endId": 334,
      "itemCount": 134
    }
  ]
}
```

### `music-chunk-X.json`
Cada chunk contiene una porción de las recomendaciones:
```json
{
  "recommendations": [
    // Array de elementos musicales
  ]
}
```

## Uso

### 1. Cargar todos los datos (recomendado para uso general)
```javascript
import { MusicDataLoader } from '../utils/musicDataLoader.js';

const allMusicData = await MusicDataLoader.loadAllMusicData();
console.log(allMusicData.recommendations); // Array con todos los elementos
console.log(allMusicData.metadata);        // Metadata sobre la carga
```

### 2. Usando hooks React
```javascript
import { useMusicData } from '../hooks/useMusicData.js';

function MusicComponent() {
  const { musicData, loading, error, filter, metadata } = useMusicData();
  
  if (loading) return <div>Cargando música...</div>;
  if (error) return <div>Error: {error}</div>;
  
  // Usar datos
  const rockMusic = filter.bySubcategory('rock');
  const randomMusic = filter.random(5);
  
  return (
    <div>
      <p>Total items: {metadata.totalItems}</p>
      <p>Loaded from {metadata.totalChunks} chunks</p>
      {/* Renderizar música */}
    </div>
  );
}
```

### 3. Cargar chunk específico (para uso avanzado)
```javascript
const chunk1 = await MusicDataLoader.loadMusicChunk(1);
console.log(chunk1.recommendations); // Solo los primeros 200 elementos
```

### 4. Carga lazy con búsqueda por ID
```javascript
const lazyLoader = await MusicDataLoader.loadMusicDataLazy();
const specificItem = await lazyLoader.getRecommendationById(150);
```

## Ventajas

1. **Rendimiento**: Carga inicial más rápida
2. **Escalabilidad**: Fácil añadir más elementos sin impacto en rendimiento
3. **Flexibilidad**: Permite carga lazy y por demanda
4. **Mantenimiento**: Chunks más pequeños son más fáciles de gestionar
5. **Fallback**: Si falla la carga chunked, usa el archivo original

## Scripts

### Dividir datos automáticamente
```bash
node scripts/split-music-data.js
```

Este script:
- Lee `datos_music.json`
- Crea chunks de 200 elementos
- Genera el archivo índice
- Mantiene el archivo original como backup

## Configuración

Para cambiar el tamaño de los chunks, edita `CHUNK_SIZE` en `scripts/split-music-data.js` y vuelve a ejecutar el script.

## Integración

El sistema está integrado automáticamente con:
- `dataLoader.js`: Usa chunks para cargar datos de música
- Hooks React: Disponibles para componentes
- Sistema de fallback: Usa archivo original si los chunks fallan

## Mantenimiento

1. **Añadir elementos**: Edita `datos_music.json` y ejecuta `split-music-data.js`
2. **Cambiar tamaño de chunk**: Modifica `CHUNK_SIZE` y regenera
3. **Backup**: El archivo original se mantiene para compatibilidad
