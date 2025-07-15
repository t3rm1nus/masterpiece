// =============================================
// ZustandDebug: Herramienta de debug para Zustand
// Muestra el estado seleccionado en el store. Usar solo en desarrollo.
// =============================================

import React from 'react';
import useAppStore from '../store/useAppStore';

const ZustandDebug: React.FC = () => {
  const selectedItem = useAppStore(state => state.selectedItem);
  return (
    <div style={{position: 'fixed', bottom: 0, left: 0, background: '#fff', zIndex: 9999, fontSize: 12, padding: 4, border: '1px solid #ccc'}}>
      Zustand selectedItem: {selectedItem ? JSON.stringify(selectedItem) : 'null'}
    </div>
  );
};

export default ZustandDebug; 