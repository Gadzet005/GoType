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
  IconButton,
} from '@mui/material';
import { EmailOutlined, LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { AuthApi } from '@/api/authApi';
import { RoutePath } from '@/config/routes/path';

const errorsMapTranslate: Record<string, string> = {
    'ERR_NO_SUCH_USER': 'ОШИБКА: НЕТ ТАКОГО ПОЛЬЗОВАТЕЛЯ',
    'ERR_INVALID_INPUT': 'ОШИБКА: ВЫ ВВЕЛИ НЕПРАВИЛЬНО ЛОГИН ИЛИ ПАРОЛЬ',
    'ERR_INTERNAL': 'ОШИБКА СЕРВЕРА'
};

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
      if(errorsMapTranslate[error.response?.data?.message]!==undefined){
        setFormError(errorsMapTranslate[error.response?.data?.message]);
      }
      else{
        setFormError(error.response?.data?.message || "Ошибка авторизации");
      }
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
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined sx={{ color: "action.active" }} />
                  </InputAdornment>
                ),
              }}
            />
            
            <PasswordField
              name="password"
              label="Пароль"
            />

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
