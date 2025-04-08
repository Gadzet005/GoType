import { Link } from "@/components/ui/Link";
import { RoutePath } from "@/core/config/routes/path";
import { Box, Container, Typography } from "@mui/material";
import { BackButton } from "../../common/BackButton";
import { observer } from "mobx-react";
import { SignUpForm } from "./form";

export const SignUpPage = observer(() => {
  return (
    <Box sx={{ p: 2 }}>
      <BackButton href={RoutePath.home} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 20,
        }}
      >
        <Container
          sx={{ mx: 1, borderRadius: 4, p: 3, bgcolor: "background.paper" }}
          maxWidth="sm"
        >
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
          <SignUpForm />
        </Container>
      </Box>
    </Box>
  );
});
