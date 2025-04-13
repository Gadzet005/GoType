import { Button, Container, Stack, Typography } from "@mui/material";
import React from "react";
import { observer } from "mobx-react";
import { SettingsForm } from "./form";
import { useEditorContext } from "../../context";
import { useAppContext, useSnackbar } from "@/core/hooks";
import { publishLevel } from "@/core/services/api/level/publishLevel";

export const Settings: React.FC = observer(() => {
  const ctx = useAppContext();
  const snackbar = useSnackbar();
  const { draft, audioPlayer, updateDraft } = useEditorContext();

  const handlePublish = async () => {
    const result = await publishLevel(ctx, draft, audioPlayer.duration);
    if (result.ok) {
      const levelId = result.payload;
      const ok = await updateDraft({ publication: { levelId } });
      if (ok) {
        snackbar.show("Уровень успешно опубликован", "success");
      } else {
        snackbar.show("Ошибка при обновлении уровня", "error");
      }
    } else if (result.error === "invalid") {
      snackbar.show(
        "Чтобы опубликовать уровень, необходимо заполнить все поля",
        "warning"
      );
    } else {
      snackbar.show("Ошибка при публикации уровня", "error");
      console.error(result.error);
    }
  };

  return (
    <Container maxWidth="sm">
      <SettingsForm />
      <Stack sx={{ mt: 3 }} spacing={2}>
        <Typography sx={{ textAlign: "center" }} variant="h4">
          Публикация
        </Typography>
        {draft.publication.levelId !== null && (
          <Typography variant="h6">
            ID уровня: {draft.publication.levelId}
          </Typography>
        )}
        <Button
          variant="contained"
          onClick={handlePublish}
          disabled={audioPlayer.isLoading}
        >
          Опубликовать
        </Button>
      </Stack>
    </Container>
  );
});
