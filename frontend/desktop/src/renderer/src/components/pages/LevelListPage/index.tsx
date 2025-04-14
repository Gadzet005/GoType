import { RoutePath } from "@/core/config/routes/path";
import { getAllLevels } from "@/core/services/electron/level/getAllLevels";
import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import { BackButton } from "../../common/BackButton";
import { LevelList } from "./LevelList";
import { Level } from "@/core/store/game/level";
import { useSnackbar } from "@/core/hooks";
import { DownloadLevelDialog } from "./DownloadLevelDialog";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { removeLevel } from "@/core/services/electron/level/removeLevel";

export const LevelListPage = () => {
  const snackbar = useSnackbar();
  const [levels, setLevels] = React.useState<Level[]>([]);
  const [downloadDialogOpen, setDownloadDialogOpen] =
    React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const loadLevels = React.useCallback(async () => {
    const result = await getAllLevels();
    if (result.ok) {
      const levels = result.payload.map((levelInfo) => new Level(levelInfo));
      setLevels(levels);
    } else {
      snackbar.show("Ошибка при загрузке уровней", "error");
      console.error(result.error);
    }
    setIsLoading(false);
  }, []);

  const handleDelete = async (levelId: number) => {
    const result = await removeLevel(levelId);
    if (result.ok) {
      snackbar.show("Уровень успешно удален", "success");
      setLevels((prevLevels) =>
        prevLevels.filter((level) => level.id !== levelId)
      );
    } else {
      snackbar.show("Ошибка при удалении уровня", "error");
    }
  };

  React.useEffect(() => {
    loadLevels();
  }, [loadLevels]);

  return (
    <Box sx={{ p: 2 }}>
      <DownloadLevelDialog
        open={downloadDialogOpen}
        onClose={() => setDownloadDialogOpen(false)}
        onSuccess={loadLevels}
      />
      <BackButton href={RoutePath.home} />
      <Stack spacing={4}>
        <Stack sx={{ alignItems: "center" }} spacing={2}>
          <Typography sx={{ fontWeight: "bold" }} color="primary" variant="h2">
            Сохраненные уровни
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FileDownloadIcon />}
            onClick={() => setDownloadDialogOpen(true)}
          >
            Загрузить уровень
          </Button>
        </Stack>
        {!isLoading && <LevelList levels={levels} onDelete={handleDelete} />}
      </Stack>
    </Box>
  );
};
