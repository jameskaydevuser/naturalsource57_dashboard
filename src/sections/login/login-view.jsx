import { useContext, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import { auth } from 'src/firebase';
import { login } from 'src/firebase/auth';
import LogoSvg from 'src/components/logo/LogoSvg';
import Iconify from 'src/components/iconify';
import { CircularProgress } from '@mui/material';
import { AuthContext } from 'src/contexts/Auth';
import { Navigate } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function LoginView() {
  const [loading, setLoading] = useState(false);

  const user = useContext(AuthContext);

  const theme = useTheme();

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    await login(email, password);

    setLoading(false);
  };

  const renderForm = (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3} sx={{ my: 3 }}>
        <TextField name="email" label="Email address" />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" color="inherit">
        Login {loading && <CircularProgress size={16} color="inherit" style={{ marginLeft: 8 }} />}
      </LoadingButton>
    </form>
  );

  if (user) return <Navigate to="/users" />;

  return (
    <Box
      sx={{
        height: '80%',
      }}
    >

      <LogoSvg width={250} height={100} />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">NaturalSource Admin</Typography>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
