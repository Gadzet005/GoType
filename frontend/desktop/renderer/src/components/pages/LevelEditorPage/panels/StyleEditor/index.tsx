import { Box, Button, Container, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import { StyleFormDialog } from "./StyleFormDialog";
import { useEditorContext } from "../../context";
import { StyleClassItem } from "./StyleClassItem";
import { NamedSentenceStyleClass } from "@desktop-common/draft/style";
import { observer } from "mobx-react";

export const StyleEditor = observer(() => {
  const { draft } = useEditorContext();
  const [styleFormOpen, setStyleFormOpen] = React.useState(false);
  const [currentStyleClass, setCurrentStyleClass] =
    React.useState<NamedSentenceStyleClass | null>(null);

  const styleClasses = draft.styleClasses.map((styleClass) => (
    <StyleClassItem
      key={styleClass.name}
      styleClass={styleClass}
      deleleSelf={async () => {
        draft.removeStyleClass(styleClass.name);
      }}
      editSelf={() => {
        setCurrentStyleClass(styleClass);
        setStyleFormOpen(true);
      }}
    />
  ));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
      }}
    >
      <StyleFormDialog
        open={styleFormOpen}
        onClose={() => setStyleFormOpen(false)}
        initial={currentStyleClass ?? undefined}
      />
      <Stack spacing={2}>
        <Typography variant="h4">Внешний вид текста</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setCurrentStyleClass(null);
            setStyleFormOpen(true);
          }}
        >
          Добавить стиль
        </Button>
      </Stack>
      <Container maxWidth="sm">
        <Stack spacing={2}>{styleClasses}</Stack>
      </Container>
    </Box>
  );
});
