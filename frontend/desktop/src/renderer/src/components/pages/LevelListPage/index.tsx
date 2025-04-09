import { RoutePath } from "@/core/config/routes/path";
import { getAllLevels } from "@/core/services/electron/level/getAllLevels";
import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { BackButton } from "../../common/BackButton";
import { LevelList } from "./LevelList";
import { Level } from "@/core/store/game/level";
import { useSnackbar } from "@/core/hooks";
import { FileUploadButton } from "@/components/common/FileUploadButton";
import { AllowedAssetExtensions } from "@/core/config/asset.config";

export const LevelListPage = () => {
  const snackbar = useSnackbar();
  const [levels, setLevels] = React.useState<Level[]>([]);

  const loadLevels = React.useCallback(async () => {
    const result = await getAllLevels();
    if (result.ok) {
      const levels = result.payload.map((levelInfo) => new Level(levelInfo));
      setLevels(levels);
    } else {
      snackbar.show("Ошибка при загрузке уровней", "error");
      console.error(result.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    loadLevels();
  }, [loadLevels]);

  return (
    <Box sx={{ p: 2 }}>
      <BackButton href={RoutePath.home} />
      <Stack spacing={4}>
        <Stack sx={{ alignItems: "center" }} spacing={2}>
          <Typography sx={{ fontWeight: "bold" }} color="primary" variant="h2">
            Сохраненные уровни
          </Typography>
          <FileUploadButton
            extensions={AllowedAssetExtensions.LEVEL_ARCHIVE}
            size="large"
          >
            Загрузить уровень
          </FileUploadButton>
        </Stack>
        <LevelList levels={levels} />
      </Stack>
    </Box>
  );
};
