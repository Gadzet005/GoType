import { RoutePath } from "@/core/config/routes/path";
import { getAllLevels } from "@/core/services/electron/level/getAllLevels";
import { Box, Typography } from "@mui/material";
import React from "react";
import { BackButton } from "../../common/BackButton";
import { LevelList } from "./LevelList";
import { Level } from "@/core/store/game/level";

export const LevelListPage = () => {
  const [levels, setLevels] = React.useState<Level[]>([]);

  const loadLevels = React.useCallback(async () => {
    const result = await getAllLevels();
    if (result.ok) {
      const levels = result.payload.map((levelInfo) => new Level(levelInfo));
      setLevels(levels);
    } else {
      console.error("Failed to load levels:", result.error);
    }
  }, []);

  React.useEffect(() => {
    loadLevels();
  }, [loadLevels]);

  return (
    <Box sx={{ p: 2 }}>
      <BackButton href={RoutePath.home} />
      <Typography
        sx={{ pb: 3, fontWeight: "bold", textAlign: "center" }}
        color="primary"
        variant="h2"
      >
        Сохраненные уровни
      </Typography>
      <LevelList levels={levels} />
    </Box>
  );
};
