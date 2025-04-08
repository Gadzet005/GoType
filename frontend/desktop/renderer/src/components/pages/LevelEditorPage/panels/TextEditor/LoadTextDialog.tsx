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

interface LoadTextDialogProps {
  open?: boolean;
  onClose?: () => void;
}

export const LoadTextDialog: React.FC<LoadTextDialogProps> = ({
  open = false,
  onClose = () => {},
}) => {
  const { draft } = useEditorContext();
  const snackbar = useSnackbar();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle variant="h4">Загрузка текста</DialogTitle>
      <Formik
        initialValues={{ text: "", num: 0 }}
        onSubmit={(values, { setSubmitting }) => {
          draft.setSentencesByText(values.text);
          setSubmitting(false);
          snackbar.show("Текст загружен", "success");
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
