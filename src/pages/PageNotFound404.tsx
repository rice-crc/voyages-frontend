import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AnimatedLogo from '@/assets/sv-logo_v2_notext.svg';
const PageNotFound404: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      bgcolor="#f9fafb"
      px={2}
    >
      <Typography variant="h4" fontWeight="bold" mb={2}>
        404: Page Not Found
      </Typography>

      <img
        src={AnimatedLogo}
        alt="Animated Slave Voyages Logo"
        style={{ maxWidth: 250, margin: 24 }}
      />

      <Typography variant="body1" color="text.secondary" mb={4}>
        Sorry, we couldn't find the page you're looking for.
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate('/')}
        sx={{ px: 4, py: 1.5, borderRadius: 2 }}
      >
        Go Back Home
      </Button>
    </Box>
  );
};

export default PageNotFound404;
