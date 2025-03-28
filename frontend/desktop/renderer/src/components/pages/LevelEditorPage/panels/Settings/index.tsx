import { Box, Container, Typography } from "@mui/material";
import React from "react";
import { observer } from "mobx-react";
import { SettingsForm } from "./form";

export const Settings: React.FC = observer(() => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
      }}
    >
      <Typography variant="h4">Основные настройки</Typography>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
        maxWidth="sm"
      >
        <SettingsForm />
      </Container>
    </Box>
  );
});
