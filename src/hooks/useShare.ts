import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

interface ShareOptions {
  title?: string;
  text?: string;
  url?: string;
  dialogTitle?: string;
}

// Función para obtener la URL pública correcta
const getPublicUrl = (): string => {
  console.log('🔍 [useShare] Detectando plataforma...');
  console.log('🔍 [useShare] Capacitor.isNativePlatform():', Capacitor.isNativePlatform());
  console.log('🔍 [useShare] window.location.hostname:', window.location.hostname);
  console.log('🔍 [useShare] window.location.pathname:', window.location.pathname);
  console.log('🔍 [useShare] window.location.href:', window.location.href);
  
  // Si estamos en Android nativo, construir la URL pública
  if (Capacitor.isNativePlatform()) {
    console.log('📱 [useShare] Detectado Android nativo');
    const path = window.location.pathname;
    const lang = path.startsWith('/en/') ? 'en' : 'es';
    const baseUrl = lang === 'en' ? 'https://masterpiece.es/en' : 'https://masterpiece.es';
    
    // Extraer la ruta después del idioma
    let cleanPath = path;
    if (lang === 'en') {
      cleanPath = path.replace('/en', '');
    }
    
    const finalUrl = `${baseUrl}${cleanPath}`;
    console.log('🔗 [useShare] URL generada para Android:', finalUrl);
    return finalUrl;
  }
  
  // Si estamos en desarrollo web (localhost), usar localhost
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    console.log('🌐 [useShare] Detectado desarrollo web (localhost)');
    return window.location.href;
  }
  
  // Para producción web, usar la URL actual
  console.log('🌐 [useShare] Detectado producción web');
  return window.location.href;
};

export const useShare = () => {
  const share = async (options: ShareOptions) => {
    try {
      // Obtener la URL pública correcta
      const publicUrl = options.url || getPublicUrl();
      
      // Si estamos en Android nativo, usar el plugin de Capacitor
      if (Capacitor.isNativePlatform()) {
        await Share.share({
          title: options.title || 'Masterpiece',
          text: options.text || 'Mira esta recomendación en Masterpiece',
          url: publicUrl,
          dialogTitle: options.dialogTitle || 'Compartir con...'
        });
      } 
      // Si estamos en web y el navegador soporta Web Share API
      else if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: options.title || document.title,
          text: options.text,
          url: publicUrl,
        });
      } 
      // Fallback: copiar al portapapeles
      else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(publicUrl);
        
        // Mostrar notificación de éxito
        if (typeof window !== 'undefined') {
          // Crear una notificación temporal
          const notification = document.createElement('div');
          notification.textContent = 'Enlace copiado al portapapeles';
          notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #4CAF50;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          `;
          document.body.appendChild(notification);
          
          // Remover después de 3 segundos
          setTimeout(() => {
            if (notification.parentNode) {
              notification.parentNode.removeChild(notification);
            }
          }, 3000);
        }
      } 
      // Último fallback: alert
      else {
        alert('Enlace copiado al portapapeles');
      }
    } catch (error) {
      console.error('Error al compartir:', error);
      
      // Fallback en caso de error
      try {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          const publicUrl = options.url || getPublicUrl();
          await navigator.clipboard.writeText(publicUrl);
          alert('Enlace copiado al portapapeles');
        } else {
          const publicUrl = options.url || getPublicUrl();
          alert('No se pudo compartir. Enlace: ' + publicUrl);
        }
      } catch (fallbackError) {
        console.error('Error en fallback:', fallbackError);
        const publicUrl = options.url || getPublicUrl();
        alert('No se pudo compartir. Enlace: ' + publicUrl);
      }
    }
  };

  return { share };
}; 