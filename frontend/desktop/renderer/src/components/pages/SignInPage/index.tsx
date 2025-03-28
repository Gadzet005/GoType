import { Link } from "@/components/ui/Link";
import { RoutePath } from "@/core/config/routes/path";
import { Box, Container, Typography } from "@mui/material";
import { observer } from "mobx-react";
import React from "react";
import { BackButton } from "../../common/BackButton";
import { SignInForm } from "./form";

export const SignInPage: React.FC = observer(() => {
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
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="h3">Вход</Typography>
            <Typography component="span" variant="subtitle1">
              Нет аккаунта?
            </Typography>
            <Link
              sx={{ textDecoration: "none", ml: 1 }}
              variant="subtitle1"
              href={RoutePath.signUp}
            >
              Зарегистрироваться
            </Link>
          </Box>
          <SignInForm />
        </Container>
      </Box>
    </Box>
  );
});
