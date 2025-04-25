import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
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
<<<<<<< HEAD
  IconButton,
} from '@mui/material';
import { EmailOutlined, LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { AuthApi } from '@/api/authApi';
import { RoutePath } from '@/config/routes/path';

const PasswordField = ({ name, label }: { name: string; label: string }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <TextField
      fullWidth
      name={name}
      label={label}
      type={showPassword ? 'text' : 'password'}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <LockOutlined sx={{ color: 'action.active' }} />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={handleClickShowPassword}
              edge="end"
              aria-label="toggle password visibility"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
=======
  Grid,
} from "@mui/material";
import { EmailOutlined, LockOutlined } from "@mui/icons-material";
import { AuthApi } from "@/api/authApi";
import { RoutePath } from "@/config/routes/path";
import { PasswordField } from "@/components/form/PasswordField";
>>>>>>> 09cbe46b77f0f7430c479f63fc3017b94cc55ed6

export const Login = () => {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;

    try {
      const tokens = await AuthApi.login({ name, password });
      localStorage.setItem("token", tokens.access_token);
      navigate(RoutePath.profile);
    } catch (error: any) {
      console.error("Login error:", error);
      setFormError(error.response?.data?.message || "Ошибка авторизации");
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
<<<<<<< HEAD
            <TextField 
              name="name" 
              variant="outlined" 
              label="Имя" 
              fullWidth
=======
            <TextField
              name="name"
              variant="outlined"
              label="Имя"
>>>>>>> 09cbe46b77f0f7430c479f63fc3017b94cc55ed6
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined sx={{ color: "action.active" }} />
                  </InputAdornment>
                ),
              }}
            />
<<<<<<< HEAD
            
            <PasswordField
              name="password"
              label="Пароль"
            />
=======

            <Grid container alignItems="flex-end" sx={{ width: "100%" }}>
              <Grid item sx={{ mr: 1, my: 0.5 }}>
                <LockOutlined sx={{ color: "action.active" }} />
              </Grid>
              <Grid item xs sx={{ width: "100%" }}>
                <Box sx={{ width: "100%" }}>
                  <PasswordField name="password" label="Пароль" />
                </Box>
              </Grid>
            </Grid>
>>>>>>> 09cbe46b77f0f7430c479f63fc3017b94cc55ed6

            <Button
              variant="contained"
              type="submit"
              size="large"
              disabled={isPending}
              fullWidth
            >
              {isPending ? <CircularProgress size={24} /> : "Вход"}
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
