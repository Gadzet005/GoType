import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { DraftSentence } from "../../store/draftSentence";
import React from "react";
import { Field, Form, Formik } from "formik";
import { NumberField } from "@/components/common/form/NumberField";
import { Select } from "formik-mui";
import { useEditorContext } from "../../context";

interface EditSentenceDialogProps {
  open: boolean;
  onClose: () => void;
  sentence: DraftSentence;
}

export const EditSentenceDialog: React.FC<EditSentenceDialogProps> = ({
  sentence,
  open,
  onClose,
}) => {
  const { draft } = useEditorContext();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle variant="h5">{sentence.content}</DialogTitle>
      <Formik
        initialValues={{
          coord: {
            x: Math.round(sentence.coord.x * 100) / 100,
            y: Math.round(sentence.coord.y * 100) / 100,
          },
          styleClassName: sentence.styleClassName ?? "",
        }}
        onSubmit={(values, { setSubmitting }) => {
          sentence.setCoord(values.coord.x, values.coord.y);

          if (values.styleClassName === "") {
            sentence.setStyleClassName(null);
          } else {
            sentence.setStyleClassName(values.styleClassName);
          }

          setSubmitting(false);
          onClose();
        }}
      >
        <Form>
          <DialogContent>
            <Stack gap={1}>
              <Field name="styleClassName" label="Стиль" component={Select}>
                <MenuItem value="">По умолчанию</MenuItem>
                {draft.styleClasses.getAll().map((styleClass) => (
                  <MenuItem key={styleClass.name} value={styleClass.name}>
                    {styleClass.name}
                  </MenuItem>
                ))}
              </Field>
              <Typography variant="h6" sx={{ mt: 3 }}>
                Смещение относительно левого верхнего угла поля (%)
              </Typography>
              <Stack direction="row" gap={1}>
                <Field
                  name="coord.x"
                  label="x"
                  component={NumberField}
                  min={0}
                  max={100}
                  fullWidth
                />
                <Field
                  name="coord.y"
                  label="y"
                  component={NumberField}
                  min={0}
                  max={100}
                  fullWidth
                />
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button color="primary" variant="contained" type="submit">
              Сохранить
            </Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};
