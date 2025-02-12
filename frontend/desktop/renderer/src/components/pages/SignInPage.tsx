import { Button } from "@/components/ui/Button";
import { Link } from "@/components/ui/Link";
import { ApiError } from "@/core/config/api.config";
import { RoutePath } from "@/core/config/routes/path";
import { useNavigate, useServicePending } from "@/core/hooks";
import { signIn as SignInService } from "@/core/services/api/user/signIn";
import { PasswordField } from "@common/components/form/PasswordField";
import { Alert, Box, Container, TextField, Typography } from "@mui/material";
import { observer } from "mobx-react";
import React from "react";
import { BackButton } from "../common/BackButton";

export const SignInPage: React.FC = observer(() => {
  const navigate = useNavigate();
  const [formError, setFormError] = React.useState<string | null>(null);
  const { call: signIn, isPending } = useServicePending(SignInService);

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const name: string = formData.get("name") as string;
    const password: string = formData.get("password") as string;

    signIn(name, password).then((result) => {
      if (result.ok) {
        navigate(RoutePath.profile);
      } else {
        const error = result.error!;
        if (error === ApiError.noSuchUser) {
          setFormError("Неверное имя или пароль.");
        } else if (error === ApiError.invalidInput) {
          setFormError("Неверный формат имени или пароля");
        } else {
          console.error("Unknown error:", error);
          setFormError("Неизвестная ошибка.");
        }
      }
    });
  };

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
            <Typography variant="h3">Вход</Typography>
            <Typography component="span" variant="subtitle1">
              Нет аккаунта?
            </Typography>
            <Link
              sx={{ textDecoration: "none", ml: 1 }}
              variant="subtitle1"
              href={RoutePath.signUp}
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
            onSubmit={submitHandler}
          >
            <TextField name="name" variant="outlined" label="Имя" type="text" />
            <PasswordField />
            <Button
              variant="contained"
              type="submit"
              size="large"
              disabled={isPending()}
            >
              Вход
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
});
