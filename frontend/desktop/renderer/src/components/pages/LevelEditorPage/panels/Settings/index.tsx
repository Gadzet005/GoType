import { Container, Stack, Typography } from "@mui/material";
import React from "react";
import { observer } from "mobx-react";
import { SettingsForm } from "./form";

export const Settings: React.FC = observer(() => {
  return (
    <Stack sx={{ alignItems: "center" }} spacing={3}>
      <Typography variant="h4">Основные настройки</Typography>
      <Container maxWidth="sm">
        <Stack spacing={2}>
          <SettingsForm />
        </Stack>
      </Container>
    </Stack>
  );
});
