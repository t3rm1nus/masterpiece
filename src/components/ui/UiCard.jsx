import React from 'react';
import { Card, Paper } from '@mui/material';

const UiCard = ({ children, elevation = 2, sx = {}, className = '', ...props }) => {
  return (
    <Card
      elevation={elevation}
      className={`mp-ui-card ${className}`}
      sx={{ borderRadius: 3, overflow: 'hidden', ...sx }}
      {...props}
    >
      {children}
    </Card>
  );
};

export default UiCard;
