import React from 'react';
import { Box, Typography, SxProps, Theme } from '@mui/material';

interface ModalSx {
  backdrop?: SxProps<Theme>;
  modal?: SxProps<Theme>;
  title?: SxProps<Theme>;
  content?: SxProps<Theme>;
  actions?: SxProps<Theme>;
}

interface ModalProps {
  open: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  backdropClassName?: string;
  sx?: ModalSx;
  onBackdropClick?: () => void;
  [key: string]: any; // Para props adicionales
}

// =============================================
// Modal: Modal base reutilizable y personalizable
// Modal base reutilizable y personalizable. Optimizado para UX, accesibilidad y animaciones modernas.
// =============================================
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
}: ModalProps): React.JSX.Element | null {
  if (!open) return null;
  
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.35)',
        zIndex: 1500, // Modal - por encima de overlays pero por debajo del splash
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx.backdrop
      }}
      onClick={onBackdropClick || onClose}
    >
      <Box
        sx={{
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          p: '2em 1.5em',
          minWidth: 320,
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          ...sx.modal
        }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        {...props}
      >
        {title && <Typography variant="h6" sx={{ mb: 2, ...sx.title }}>{title}</Typography>}
        <Box sx={{ ...sx.content }}>{children}</Box>
        {actions && <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end', ...sx.actions }}>{actions}</Box>}
      </Box>
    </Box>
  );
} 