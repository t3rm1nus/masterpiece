import React from 'react';
import './Alert.css';

/**
 * Alert: Alerta base personalizable.
 * Permite definir título, acciones, icono, estilos, visibilidad y callbacks.
 *
 * Props:
 * - type: 'info' | 'success' | 'warning' | 'error' (tipo de alerta)
 * - title: string o ReactNode (título opcional)
 * - children: contenido principal
 * - actions: ReactNode (acciones opcionales, por ejemplo botones)
 * - icon: ReactNode (icono opcional)
 * - onClose: función (callback al cerrar)
 * - className: string (clase CSS adicional)
 * - sx: objeto de estilos adicionales { root, title, content, actions, icon, close }
 * - visible: boolean (si la alerta está visible)
 *
 * Ejemplo de uso:
 * <Alert type="success" title="Éxito" actions={<button onClick={onClose}>Cerrar</button>} icon={<CheckIcon />} onClose={onClose}>
 *   Operación completada
 * </Alert>
 */
export default function Alert({
  type = 'info',
  title,
  children,
  actions,
  icon,
  onClose,
  className = '',
  sx = {},
  visible = true,
  ...props
}) {
  if (!visible) return null;
  return (
    <div className={`mp-alert mp-alert--${type} ${className}`} style={sx.root} {...props}>
      {icon && <span className="mp-alert-icon" style={sx.icon}>{icon}</span>}
      <div className="mp-alert-content" style={sx.content}>
        {title && <div className="mp-alert-title" style={sx.title}>{title}</div>}
        <div>{children}</div>
      </div>
      {actions && <div className="mp-alert-actions" style={sx.actions}>{actions}</div>}
      {onClose && (
        <button className="mp-alert-close" style={sx.close} onClick={onClose} aria-label="Cerrar alerta">×</button>
      )}
    </div>
  );
}
