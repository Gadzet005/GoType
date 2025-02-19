import { BackButton } from "@/components/common/BackButton";
import { RoutePath } from "@/core/config/routes/path";
import { Box, Typography } from "@mui/material";
import { observer } from "mobx-react";

export const LevelEditorPage = observer(() => {
  return (
    <Box sx={{ p: 2 }}>
      <BackButton href={RoutePath.home} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h3">Редактор уровней</Typography>
      </Box>
    </Box>
  );
});
