import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Link,
  Box,
  Typography,
  Container,
  Alert,
  CircularProgress,
<<<<<<< HEAD
  FormGroup,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton
  
} from '@mui/material';
import { LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material'
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
} from "@mui/material";
import { AuthApi } from "@/api/authApi";
import { RoutePath } from "@/config/routes/path";
import { PasswordField } from "@/components/form/PasswordField";
>>>>>>> 09cbe46b77f0f7430c479f63fc3017b94cc55ed6

export const Register = () => {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToRules, setAgreedToRules] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!agreedToTerms) {
      setFormError('Необходимо принять пользовательское соглашение');
      return;
    }

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;
    const passwordRepeat = formData.get("passwordRepeat") as string;

    if (password !== passwordRepeat) {
      setFormError("Пароли не совпадают.");
      setIsPending(false);
      return;
    }

    setFormError(null);
    setIsPending(true);

    try {
      const tokens = await AuthApi.register({ name, password });
      localStorage.setItem("token", tokens.access_token);
      navigate(RoutePath.profile);
    } catch (error: any) {
      console.error("Registration error:", error);
      setFormError(
        error.response?.data?.message ||
          "Ошибка регистрации. Пользователь с таким именем уже существует."
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Container sx={{ mx: 1, borderRadius: 4, p: 3 }} maxWidth="sm">
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="h3">Регистрация</Typography>
            <Typography component="span" variant="subtitle1">
              Уже есть аккаунт?
            </Typography>
            <Link
              sx={{ textDecoration: "none", ml: 1 }}
              variant="subtitle1"
              href={RoutePath.login}
            >
              Страница входа
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
            />
            <PasswordField 
              name="password" 
              label="Пароль" 
            />
            <PasswordField 
              name="passwordRepeat" 
              label="Повторите пароль" 
            />

            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    disabled={isPending}
                  />
                }
                label={
                  <Typography variant="body2">
                    Согласен с{' '}
                    <Link href={RoutePath.agreement} target="_blank" rel="noopener">
                      пользовательским соглашением
                    </Link>
                  </Typography>
                }
              />
              
            </FormGroup>

=======
            <TextField name="name" variant="outlined" label="Имя" fullWidth />
            <PasswordField name="password" label="Пароль" />
            <PasswordField name="passwordRepeat" label="Повторите пароль" />
>>>>>>> 09cbe46b77f0f7430c479f63fc3017b94cc55ed6
            <Button
              variant="contained"
              type="submit"
              size="large"
              disabled={isPending}
            >
              {isPending ? (
                <CircularProgress size={24} />
              ) : (
                "Зарегистрироваться"
              )}
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
