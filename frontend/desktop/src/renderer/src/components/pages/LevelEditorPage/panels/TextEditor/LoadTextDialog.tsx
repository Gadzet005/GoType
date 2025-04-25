import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import React from "react";
import { useEditorContext } from "../../context";
import { useSnackbar } from "@/core/hooks";
import { TextField } from "formik-mui";
import { sentencesByText } from "../../utils/text";

interface LoadTextDialogProps {
  open?: boolean;
  onClose?: () => void;
}

export const LoadTextDialog: React.FC<LoadTextDialogProps> = ({
  open = false,
  onClose = () => {},
}) => {
  const { draft, updateDraft } = useEditorContext();
  const snackbar = useSnackbar();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle variant="h4">Загрузка текста</DialogTitle>
      <Formik
        initialValues={{ text: "", num: 0 }}
        onSubmit={async (values, { setSubmitting }) => {
          const sentences = sentencesByText(draft, values.text);
          const success = await updateDraft({
            sentences: sentences.map((s) => s.toDraftSentenceData()),
          });

          if (success) {
            snackbar.show("Текст загружен", "success");
          } else {
            snackbar.show("Ошибка загрузки текста", "error");
          }

          setSubmitting(false);
          onClose();
        }}
      >
        <Form>
          <DialogContent>
            <Field
              name="text"
              label="Текст"
              component={TextField}
              fullWidth
              multiline
              minRows={10}
              maxRows={20}
              helperText="Требуется разделить предложения переносом строки"
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={onClose} color="primary" variant="outlined">
              Закрыть
            </Button>
            <Button color="primary" variant="contained" type="submit">
              Загрузить
            </Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};
