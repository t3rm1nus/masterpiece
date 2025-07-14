import React from 'react';
import { Container, Box, ContainerProps, BoxProps } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

/**
 * UiLayout (Modern Material UI Layout Container)
 * -----------------------------------------------------------------------------
 * Reusable, responsive base layout container for pages and sections.
 * - Extends MUI Container for consistent spacing and alignment.
 * - Mobile-first: removes top padding on mobile, full viewport width.
 * - Accepts custom styles (sx), className, and all MUI Container props.
 * - Designed for modularity, performance, and easy composition.
 *
 * Performance & Mobile Optimizations:
 * - Uses window.innerWidth to adapt padding for mobile/desktop.
 * - Ensures 100vw width for edge-to-edge layouts on all devices.
 * - Minimal re-renders, no unnecessary logic.
 *
 * Example usage:
 *   <UiLayout maxWidth="md" sx={{ bgcolor: '#fafafa' }}>Content</UiLayout>
 *
 * -----------------------------------------------------------------------------
 */

interface UiLayoutProps extends Omit<ContainerProps, 'maxWidth'> {
  children?: React.ReactNode;
  maxWidth?: false | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  sx?: SxProps<Theme>;
  className?: string;
}

const UiLayout: React.FC<UiLayoutProps> = ({ 
  children, 
  maxWidth = false, 
  sx = {}, 
  className = '', 
  ...props 
}) => {
  // Detectar móvil
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 900;
  
  return (
    <Container
      maxWidth={maxWidth}
      sx={{
        py: isMobile ? 0 : 3, // Quitar padding top solo en móviles
        width: '100vw',
        maxWidth: '100vw',
        px: 0,
        ...sx
      }}
      className={className}
      {...props}
    >
      <Box className="mp-ui-layout" sx={{ width: '100%' }}>
        {children}
      </Box>
    </Container>
  );
};

export default UiLayout; 