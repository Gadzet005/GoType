import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  CircularProgress,
  Alert,
  Container,
  InputAdornment,
  Grid
} from '@mui/material';
import { EmailOutlined, LockOutlined } from '@mui/icons-material';
import { AuthApi } from '@/api/authApi';
import { RoutePath } from '@/config/routes/path';
import { PasswordField } from '@common/components/form/PasswordField';

export const Login = () => {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const password = formData.get('password') as string;

    try {
      const tokens = await AuthApi.login({ name, password });
      localStorage.setItem('token', tokens.access_token);
      navigate(RoutePath.profile);
    } catch (error: any) {
      console.error('Login error:', error);
      setFormError(error.response?.data?.message || 'Ошибка авторизации');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Container sx={{ mx: 1, borderRadius: 4, p: 3 }} maxWidth="sm">
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="h3">Вход</Typography>
            <Typography component="span" variant="subtitle1">
              Нет аккаунта?
            </Typography>
            <Link
              sx={{ textDecoration: "none", ml: 1 }}
              variant="subtitle1"
              href={RoutePath.register}
            >
              Страница регистрации
            </Link>
          </Box>

          {formError && (
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <Alert severity="error" variant="filled">
                {formError}
              </Alert>
            </Box>
          )}

          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            onSubmit={handleSubmit}
          >
            <TextField 
              name="name" 
              variant="outlined" 
              label="Имя" 
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined sx={{ color: 'action.active' }} />
                  </InputAdornment>
                ),
              }}
            />
            
            <Grid container alignItems="flex-end" sx={{ width: '100%' }}>
  <Grid item sx={{ mr: 1, my: 0.5 }}>
    <LockOutlined sx={{ color: 'action.active' }} />
  </Grid>
  <Grid item xs sx={{ width: '100%' }}>
    <Box sx={{ width: '100%' }}>
      <PasswordField
        name="password"
        label="Пароль"
      />
    </Box>
  </Grid>
</Grid>

            <Button
              variant="contained"
              type="submit"
              size="large"
              disabled={isPending}
            >
              {isPending ? <CircularProgress size={24} /> : 'Вход'}
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};