import React from 'react';
import './Modal.css';

/**
 * Modal: Modal base personalizable.
 * Permite definir título, acciones, estilos, callbacks y visibilidad de secciones.
 *
 * Props:
 * - open: boolean (si el modal está abierto)
 * - onClose: función (callback al cerrar)
 * - title: string o ReactNode (título opcional)
 * - actions: ReactNode (acciones opcionales, por ejemplo botones)
 * - children: contenido principal
 * - className: string (clase CSS para el modal)
 * - contentClassName: string (clase CSS para el contenido)
 * - backdropClassName: string (clase CSS para el fondo)
 * - sx: objeto de estilos adicionales { modal, content, backdrop }
 * - onBackdropClick: función (callback al hacer click en el fondo)
 *
 * Ejemplo de uso:
 * <Modal open={open} onClose={onClose} title="Título" actions={<button onClick={onClose}>Cerrar</button>}>
 *   <p>Contenido</p>
 * </Modal>
 */
export default function Modal({
  open,
  onClose,
  title,
  actions,
  children,
  className = '',
  contentClassName = '',
  backdropClassName = '',
  sx = {},
  onBackdropClick,
  ...props
}) {
  if (!open) return null;
  return (
    <div
      className={`mp-modal-backdrop ${backdropClassName}`}
      style={sx.backdrop}
      onClick={onBackdropClick || onClose}
    >
      <div
        className={`mp-modal ${className} ${contentClassName}`}
        style={sx.modal}
        onClick={e => e.stopPropagation()}
        {...props}
      >
        {title && <div className="mp-modal-title" style={sx.title}>{title}</div>}
        <div className="mp-modal-content" style={sx.content}>{children}</div>
        {actions && <div className="mp-modal-actions" style={sx.actions}>{actions}</div>}
      </div>
    </div>
  );
}
