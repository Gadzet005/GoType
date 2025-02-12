import { Button } from "@/components/ui/Button";
import { Link } from "@/components/ui/Link";
import { ApiError } from "@/core/config/api.config";
import { RoutePath } from "@/core/config/routes/path";
import { useNavigate, useServicePending } from "@/core/hooks";
import { PasswordField } from "@common/components/form/PasswordField";
import { Alert, Box, Container, TextField, Typography } from "@mui/material";
import React from "react";
import { BackButton } from "../common/BackButton";
import { observer } from "mobx-react";
import { signUp as SignUpService } from "@/core/services/api/user/signUp";

export const SignUpPage = observer(() => {
  const navigate = useNavigate();
  const [formError, setFormError] = React.useState<string | null>(null);
  const { call: signUp, isPending } = useServicePending(SignUpService);

  const submitHandler = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.target as HTMLFormElement);
      const name: string = formData.get("name") as string;
      const password: string = formData.get("password") as string;
      const passwordRepeat: string = formData.get("passwordRepeat") as string;

      if (password !== passwordRepeat) {
        setFormError(() => "Пароли не совпадают.");
        return;
      }

      signUp(name, password).then((result) => {
        if (result.ok) {
          navigate(RoutePath.profile);
        } else {
          const error = result.error!;
          if (error === ApiError.userExists) {
            setFormError("Пользователь с таким именем уже зарегистрирован.");
          } else if (ApiError.invalidInput) {
            setFormError("Неверный формат имени или пароля");
          } else {
            console.error("Unknown error:", error);
            setFormError("Неизвестная ошибка.");
          }
        }
      });
    },
    [navigate, signUp]
  );

  return (
    <Box sx={{ p: 2 }}>
      <BackButton href={RoutePath.home} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Container sx={{ mx: 1, borderRadius: 4, p: 3 }} maxWidth="sm">
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="h3">Регистрация</Typography>
            <Typography component="span" variant="subtitle1">
              Уже есть аккаунт?
            </Typography>
            <Link
              sx={{ textDecoration: "none", ml: 1 }}
              variant="subtitle1"
              href={RoutePath.signIn}
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
            onSubmit={submitHandler}
          >
            <TextField name="name" variant="outlined" label="Имя" type="text" />
            <PasswordField name="password" />
            <PasswordField name="passwordRepeat" label="Повторите пароль" />
            <Button
              variant="contained"
              type="submit"
              size="large"
              disabled={isPending()}
            >
              Зарегистрироваться
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
});
