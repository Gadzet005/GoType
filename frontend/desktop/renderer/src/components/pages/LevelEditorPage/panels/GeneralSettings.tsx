import { DraftUpdate } from "@desktop-common/draft";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { FileInput } from "@/components/common/FileInput";
import React from "react";
import { updateDraft } from "@/core/services/electron/levelDraft/updateDraft";
import { NamedAsset } from "@desktop-common/asset";
import { AllowedAssetExtensions } from "@/core/config/asset.config";
import { useEditorContext } from "../context";
import { observer } from "mobx-react";

/**
 * undefined  -> no update
 *
 * null       -> clear saved asset
 */
type AssetUpdate =
  | {
      path: string;
      name: string;
    }
  | null
  | undefined;

function getFileName(
  update: AssetUpdate,
  savedAsset: NamedAsset | null
): string | null {
  if (update === null) {
    return null;
  }
  if (update === undefined) {
    if (!savedAsset) {
      return null;
    }
    return savedAsset.name + "." + savedAsset.ext;
  }
  return update.name;
}

export const GeneralSettings: React.FC = observer(() => {
  const draft = useEditorContext();

  const [name, setName] = React.useState<string>(draft.name);
  const [audioUpdate, setAudioUpdate] = React.useState<AssetUpdate>(undefined);
  const [backgroundUpdate, setBackgroundUpdate] =
    React.useState<AssetUpdate>(undefined);

  const handleSave = async () => {
    const updateInfo: DraftUpdate.Args = {
      id: draft.id,
      name,
      newAudioFile: audioUpdate === null ? null : audioUpdate?.path,
      newBackgroundFile:
        backgroundUpdate === null ? null : backgroundUpdate?.path,
    };

    const result = await updateDraft(updateInfo);
    if (result.ok) {
      draft.update(result.payload);
    } else {
      console.error("Failed to update draft");
    }
  };

  const handleReset = () => {
    setName(draft.name);
    setAudioUpdate(undefined);
    setBackgroundUpdate(undefined);
  };

  const audioFileName = getFileName(audioUpdate, draft.audio);
  const backgroundFileName = getFileName(backgroundUpdate, draft.background);

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
        <TextField
          name="name"
          label="Название"
          value={name}
          onChange={(event) => setName(event.target.value)}
          fullWidth
        />
        <FileInput
          label="Аудио"
          fileName={audioFileName}
          extensions={AllowedAssetExtensions.AUDIO}
          onChange={setAudioUpdate}
        />
        <FileInput
          label="Фон"
          fileName={backgroundFileName}
          extensions={AllowedAssetExtensions.BACKGROUND}
          onChange={setBackgroundUpdate}
        />
        <Box sx={{ display: "flex" }}>
          <Button
            sx={{
              borderRadius: 0,
              borderBottomLeftRadius: 8,
              borderTopLeftRadius: 8,
            }}
            fullWidth
            color="success"
            variant="contained"
            onClick={handleSave}
          >
            Сохранить
          </Button>
          <Button
            sx={{
              borderRadius: 0,
              borderBottomRightRadius: 8,
              borderTopRightRadius: 8,
            }}
            fullWidth
            color="error"
            variant="contained"
            onClick={handleReset}
          >
            Сбросить
          </Button>
        </Box>
      </Container>
    </Box>
  );
});
