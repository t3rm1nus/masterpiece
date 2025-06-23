import React from 'react';
import { Card, Paper } from '@mui/material';

const UiCard = ({ children, elevation = 2, sx = {}, className = '', style = {}, ...props }) => {
  // Permite forzar el background o backgroundImage según el valor de sx.background
  const mergedStyle = { ...style };
  if (sx && sx.background) {
    if (typeof sx.background === 'string' && sx.background.startsWith('linear-gradient')) {
      mergedStyle.background = sx.background;
      mergedStyle.backgroundImage = sx.background;
    } else {
      mergedStyle.background = sx.background;
    }
  }
  if (style && style.backgroundImage && style.backgroundImage.startsWith('linear-gradient')) {
    mergedStyle.background = style.backgroundImage;
    mergedStyle.backgroundImage = style.backgroundImage;
  }
  return (
    <Card
      elevation={elevation}
      className={`mp-ui-card ${className}`}
      sx={{ borderRadius: 3, overflow: 'hidden', ...sx }}
      style={mergedStyle}
      {...props}
    >
      {children}
    </Card>
  );
};

export default UiCard;
