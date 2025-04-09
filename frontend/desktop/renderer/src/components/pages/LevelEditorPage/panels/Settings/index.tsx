import { Container, Stack, Typography } from "@mui/material";
import React from "react";
import { observer } from "mobx-react";
import { GeneralSettings } from "./GeneralSettings";
import { Publication } from "./Publication";

export const Settings: React.FC = observer(() => {
  return (
    <Stack sx={{ alignItems: "center" }} spacing={3}>
      <Container maxWidth="sm">
        <Stack spacing={3}>
          <Typography sx={{ textAlign: "center" }} variant="h4">
            Основные настройки
          </Typography>
          <GeneralSettings />
          <Typography sx={{ textAlign: "center" }} variant="h4">
            Публикация
          </Typography>
          <Publication />
        </Stack>
      </Container>
    </Stack>
  );
});
