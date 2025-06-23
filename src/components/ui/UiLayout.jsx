import React from 'react';
import { Container, Box } from '@mui/material';

const UiLayout = ({ children, maxWidth = false, sx = {}, ...props }) => {
  return (
    <Container maxWidth={maxWidth} sx={{ py: 3, width: '100vw', maxWidth: '100vw', px: 0, ...sx }} {...props}>
      <Box className="mp-ui-layout" sx={{ width: '100%' }}>
        {children}
      </Box>
    </Container>
  );
};

export default UiLayout;
