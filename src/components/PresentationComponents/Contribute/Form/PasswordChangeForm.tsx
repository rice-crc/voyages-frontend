import React, { useState } from 'react';

import { Box, TextField, Button, Typography } from '@mui/material';

const PasswordChangeForm = () => {
  const [password, setPassword] = useState<string>('');
  const [passwordAgain, setPasswordAgain] = useState<string>('');
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (password === passwordAgain) {
      alert(`Sucessfully password change`);
    } else {
      alert(`Password is not match, try again`);
    }
  };

  return (
    <Box
      sx={{
        padding: '2rem',
        textAlign: 'left',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Set Password
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 3 }}>
          <TextField
            sx={{ width: 300 }}
            InputProps={{
              sx: {
                height: 42,
                padding: '0 8px',
              },
            }}
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Box>
        <Box sx={{ mb: 3 }}>
          <TextField
            sx={{ width: 300 }}
            InputProps={{
              sx: {
                height: 42,
                padding: '0 8px',
              },
            }}
            label="Password (again)"
            variant="outlined"
            type="password"
            value={passwordAgain}
            onChange={(e) => setPasswordAgain(e.target.value)}
            required
          />
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            backgroundColor: 'rgb(55, 148, 141)',
            color: '#fff',
            height: 32,
            fontSize: '0.85rem',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'rgba(6, 186, 171, 0.83)',
            },
          }}
        >
          Reset Password
        </Button>
      </form>
    </Box>
  );
};

export default PasswordChangeForm;
