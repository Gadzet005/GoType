import { RoutePath } from "@/core/config/routes/path";
import { useAppContext } from "@/core/hooks";
import { getAllLevels } from "@/core/services/electron/level/getAllLevels";
import { LevelInfo } from "@desktop-common/level";
import { Box, Typography } from "@mui/material";
import React from "react";
import { BackButton } from "../../common/BackButton";
import { LevelList } from "./LevelList";

export const LevelListPage = () => {
  const ctx = useAppContext();
  const [levels, setLevels] = React.useState<LevelInfo[]>([]);

  const loadLevels = React.useCallback(async () => {
    const result = await ctx.runService(getAllLevels);
    if (result.ok) {
      setLevels(result.payload!);
    }
  }, [ctx]);

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
