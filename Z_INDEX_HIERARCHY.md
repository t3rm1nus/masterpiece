# Jerarquía de Z-Index - Masterpiece App

## Estructura Lógica de Z-Index

Esta documentación establece la jerarquía coherente de z-index para toda la aplicación, evitando conflictos y superposiciones incorrectas.

### Jerarquía Principal (de menor a mayor)

#### 1. Contenido Base (1-999)
- **1-100**: Contenido principal, cards, elementos de página
- **101-500**: Elementos interactivos, badges, botones flotantes menores
- **501-999**: Elementos destacados, tooltips, dropdowns

#### 2. Navegación y Menús (1000-1299)
- **1000**: Páginas de descargas y donaciones (móvil)
- **1001**: FABs de páginas de descargas y donaciones
- **1100**: Detalles de items (móvil)
- **1101**: Badges de masterpiece en detalles
- **1200**: AppBar móvil (MaterialMobileMenu)
- **1250**: Menús de navegación secundarios

#### 3. Menú Móvil (1300-1399)
- **1300**: Menú móvil (Drawer)
- **1350**: Elementos internos del menú móvil

#### 4. Overlays y Modales (1400-1499)
- **1400**: Overlay base para detalles (móvil y desktop)
- **1401**: Contenido del overlay para detalles
- **1402**: FABs del overlay para detalles
- **1450**: Otros overlays menores

#### 5. Modales y Popups (1500-1999)
- **1500**: Modales, popups de bienvenida, displays de error
- **1600**: Tooltips avanzados
- **1700**: Notificaciones del sistema

#### 6. Splash y Elementos Críticos (9000+)
- **9998**: Backdrop del splash
- **9999**: Splash dialog (el más alto de la app)
- **10000**: Storage monitor (debug)

### Reglas de Aplicación

1. **Jerarquía Estricta**: Nunca usar valores fuera de los rangos establecidos
2. **Incrementos Lógicos**: Usar incrementos de 1-10 para elementos relacionados
3. **Documentación**: Comentar siempre el z-index con su propósito
4. **Consistencia**: Mantener la misma jerarquía en móvil y desktop
5. **Flexibilidad**: Dejar espacios entre rangos para futuras expansiones

### Ejemplos de Uso

```javascript
// ✅ Correcto - Documentado y en rango
zIndex: 1200, // AppBar móvil - por encima del contenido pero por debajo de overlays

// ❌ Incorrecto - Sin documentar y valor arbitrario
zIndex: 3500,

// ✅ Correcto - Elementos relacionados
zIndex: 1400, // Overlay base
zIndex: 1401, // Contenido del overlay
zIndex: 1402, // FAB del overlay
```

### Casos Especiales

- **Splash**: Siempre el más alto (9999) para cubrir toda la app
- **AppBar**: Alto pero no máximo (1200) para permitir overlays
- **Menú Móvil**: Por encima del AppBar pero por debajo de overlays (1300)
- **Detalles**: Por debajo del AppBar pero por encima del contenido (1100)

### Mantenimiento

- Revisar esta documentación antes de agregar nuevos z-index
- Actualizar rangos si es necesario expandir la jerarquía
- Mantener comentarios actualizados en el código
- Testear en móvil y desktop para verificar superposiciones 