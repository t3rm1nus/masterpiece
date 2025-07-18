import React from 'react';
import { css } from '@emotion/react';

const alertBase = css`
  padding: 1em 1.5em;
  border-radius: 8px;
  margin: 1em 0;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.7em;
`;

const alertTypes = {
  info: css`
    background: #e3f2fd;
    color: #1565c0;
  `,
  success: css`
    background: #e8f5e9;
    color: #2e7d32;
  `,
  warning: css`
    background: #fffde7;
    color: #f9a825;
  `,
  error: css`
    background: #ffebee;
    color: #c62828;
  `
};

interface AlertSx {
  root?: React.CSSProperties;
  title?: React.CSSProperties;
  content?: React.CSSProperties;
  actions?: React.CSSProperties;
  icon?: React.CSSProperties;
  close?: React.CSSProperties;
}

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
  onClose?: () => void;
  className?: string;
  sx?: AlertSx;
  visible?: boolean;
  [key: string]: any; // Para props adicionales
}

// =============================================================================
// Alert (Customizable UI Alert Component)
// -----------------------------------------------------------------------------
// Modern, accessible, and customizable alert for user feedback.
// - Supports info, success, warning, error types.
// - Mobile-first, visually clear, and keyboard accessible.
// - Customizable icons, actions, and close button for accessibility.
// - Minimal re-renders, only visible when needed.
//
// Example usage:
//   <Alert type="success" title="Done!">Operation completed</Alert>
// -----------------------------------------------------------------------------
// =============================================================================

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
}: AlertProps): React.JSX.Element | null {
  if (!visible) return null;
  
  return (
    <div
      css={[alertBase, alertTypes[type] || alertTypes.info, sx.root]}
      className={className}
      {...props}
    >
      {icon && <span style={sx.icon}>{icon}</span>}
      <div style={sx.content}>
        {title && <div style={sx.title}>{title}</div>}
        <div>{children}</div>
      </div>
      {actions && <div style={sx.actions}>{actions}</div>}
      {onClose && (
        <button style={sx.close} onClick={onClose} aria-label="Cerrar alerta">×</button>
      )}
    </div>
  );
} 