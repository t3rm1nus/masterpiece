import React from 'react';
import { Container, Box } from '@mui/material';

const UiLayout = ({ children, maxWidth = 'md', sx = {}, ...props }) => {
  return (
    <Container maxWidth={maxWidth} sx={{ py: 3, ...sx }} {...props}>
      <Box className="mp-ui-layout" sx={{ width: '100%' }}>
        {children}
      </Box>
    </Container>
  );
};

export default UiLayout;
