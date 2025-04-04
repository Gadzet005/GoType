import { Box, Typography } from "@mui/material";
import { useEditorContext } from "../context";
import { observer } from "mobx-react";
import { CenterBox } from "@/components/common/CenterBox";

export const FieldEditor = observer(() => {
  const { draft } = useEditorContext();

  if (!draft.audio || !draft.background) {
    return (
      <CenterBox>
        <Typography variant="h5">
          Загрузите аудио файл и фон, чтобы страница стала доступна
        </Typography>
      </CenterBox>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Field Editor
    </Box>
  );
});
