import { Button, Container, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import { StyleFormDialog } from "./StyleFormDialog";
import { useEditorContext } from "../../context";
import { StyleClassItem } from "./StyleClassItem";
import { StyleClassData } from "@common/draft/style";
import { observer } from "mobx-react";

interface StyleFormState {
  currentStyleClass: StyleClassData | null;
  creation: boolean;
}

export const StyleEditor = observer(() => {
  const { draft } = useEditorContext();
  const [styleFormState, setStyleFormState] =
    React.useState<StyleFormState | null>(null);

  const styleClasses = draft.styleClasses.getAll().map((styleClass) => (
    <StyleClassItem
      key={styleClass.name}
      styleClass={styleClass}
      deleleSelf={() => {
        draft.styleClasses.remove(styleClass.name);
        draft.sentences.forEach((sentence) => {
          if (sentence.styleClassName === styleClass.name) {
            sentence.setStyleClassName(null);
          }
        });
      }}
      editSelf={() =>
        setStyleFormState({
          currentStyleClass: styleClass,
          creation: false,
        })
      }
      copySelf={() =>
        setStyleFormState({
          currentStyleClass: styleClass,
          creation: true,
        })
      }
      applySelf={() => {
        draft.sentences.forEach((sentence) => {
          if (sentence.styleClassName === null) {
            sentence.setStyleClassName(styleClass.name);
          }
        });
      }}
    />
  ));

  return (
    <Stack sx={{ alignItems: "center" }} spacing={2}>
      <StyleFormDialog
        open={styleFormState !== null}
        onClose={() => setStyleFormState(null)}
        initial={styleFormState?.currentStyleClass ?? undefined}
        creation={styleFormState?.creation ?? true}
      />
      <Typography variant="h4">Внешний вид текста</Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        size="large"
        onClick={() =>
          setStyleFormState({
            currentStyleClass: null,
            creation: true,
          })
        }
      >
        Добавить стиль
      </Button>
      <Container sx={{ pt: 3 }} maxWidth="md">
        <Stack spacing={2}>{styleClasses}</Stack>
      </Container>
    </Stack>
  );
});
