import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import React from "react";
import { useAppContext, useSnackbar } from "@/core/hooks";
import { NumberField } from "@/components/common/form/NumberField";
import { downloadLevel } from "@/core/services/api/level/downloadLevel";

interface DownloadLevelDialogProps {
  open?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export const DownloadLevelDialog: React.FC<DownloadLevelDialogProps> = ({
  open = false,
  onClose = () => {},
  onSuccess = () => {},
}) => {
  const ctx = useAppContext();
  const snackbar = useSnackbar();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle variant="h4">Загрузка уровня</DialogTitle>
      <Formik
        initialValues={{ id: 1 }}
        onSubmit={async ({ id }, { setSubmitting }) => {
          const result = await downloadLevel(ctx, id);
          if (result.ok) {
            snackbar.show("Уровень успешно загружен", "success");
            onSuccess();
          } else {
            console.error(result.error);
            snackbar.show(
              "Уровень не удалось загрузить. Убедитесь, что уровень с таким id существует.",
              "error"
            );
          }

          setSubmitting(false);
          onClose();
        }}
      >
        <Form>
          <DialogContent>
            <Field
              name="id"
              label="ID уровня"
              component={NumberField}
              min={0}
              onlyInt
              withoutIncAndDec
              fullWidth
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={onClose} color="primary" variant="outlined">
              Закрыть
            </Button>
            <Button color="success" variant="contained" type="submit">
              Загрузить
            </Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};
