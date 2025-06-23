import React from 'react';
import { Fab } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const FabBackButton = ({ onClick, sx = {}, ...props }) => (
  <Fab
    color="primary"
    aria-label="volver"
    onClick={onClick}
    sx={{
      position: 'fixed',
      top: '80px',
      left: '16px',
      zIndex: 1000,
      ...sx
    }}
    {...props}
  >
    <ArrowBackIcon />
  </Fab>
);

export default FabBackButton;
