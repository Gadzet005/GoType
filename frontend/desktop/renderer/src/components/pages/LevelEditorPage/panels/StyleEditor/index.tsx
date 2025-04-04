import { Button, Container, Stack, Typography } from "@mui/material";
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

  const styleClasses = draft.styleClasses.getAll().map((styleClass) => (
    <StyleClassItem
      key={styleClass.name}
      styleClass={styleClass}
      deleleSelf={() => {
        draft.styleClasses.remove(styleClass.name);
      }}
      editSelf={() => {
        setCurrentStyleClass(styleClass);
        setStyleFormOpen(true);
      }}
    />
  ));

  return (
    <Stack sx={{ alignItems: "center" }} spacing={2}>
      <StyleFormDialog
        open={styleFormOpen}
        onClose={() => setStyleFormOpen(false)}
        initial={currentStyleClass ?? undefined}
      />
      <Typography variant="h4">Внешний вид текста</Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        size="large"
        onClick={() => {
          setCurrentStyleClass(null);
          setStyleFormOpen(true);
        }}
      >
        Добавить стиль
      </Button>
      <Container sx={{ pt: 3 }} maxWidth="sm">
        <Stack spacing={2}>{styleClasses}</Stack>
      </Container>
    </Stack>
  );
});
