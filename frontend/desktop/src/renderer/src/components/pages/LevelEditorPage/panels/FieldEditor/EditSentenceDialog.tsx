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
import { Select, TextField } from "formik-mui";
import { useEditorContext } from "../../context";
import { round, toMilliseconds, toSeconds } from "@/core/utils/time";

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
  const { draft, audioPlayer } = useEditorContext();
  const totalDuration = round(audioPlayer.duration, 2);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle variant="h5">Редактирование предложения</DialogTitle>
      <Formik
        initialValues={{
          coord: {
            x: round(sentence.coord.x, 2),
            y: round(sentence.coord.y, 2),
          },
          styleClassName: sentence.styleClassName ?? "",
          showTime: toSeconds(sentence.showTime!),
          duration: toSeconds(sentence.duration!),
          rotation: sentence.rotation,
          content: sentence.content,
        }}
        onSubmit={(values, { setSubmitting }) => {
          sentence.setCoord(values.coord.x, values.coord.y);
          sentence.setRotation(values.rotation);
          sentence.setContent(values.content);

          if (values.styleClassName === "") {
            sentence.setStyleClassName(null);
          } else {
            sentence.setStyleClassName(values.styleClassName);
          }

          sentence.setShowTime(toMilliseconds(values.showTime));
          sentence.setDuration(toMilliseconds(values.duration));

          setSubmitting(false);
          onClose();
        }}
        validate={(values) => {
          if (values.showTime + values.duration > totalDuration) {
            return {
              duration: `Общее время не может превышать длительность аудио (${totalDuration} сек)`,
            };
          }
        }}
      >
        <Form>
          <DialogContent>
            <Stack gap={2}>
              <Field
                name="content"
                label="Текст"
                component={TextField}
                fullWidth
              />
              <Stack direction="row" gap={1}>
                <Field
                  name="styleClassName"
                  label="Стиль"
                  component={Select}
                  formControl={{ sx: { width: "100%" } }}
                >
                  <MenuItem value="">По умолчанию</MenuItem>
                  {draft.styleClasses.getAll().map((styleClass) => (
                    <MenuItem key={styleClass.name} value={styleClass.name}>
                      {styleClass.name}
                    </MenuItem>
                  ))}
                </Field>
                <Field
                  name="rotation"
                  label="Поворот (градусы)"
                  component={NumberField}
                  min={-360}
                  max={360}
                  fullWidth
                />
              </Stack>
              <Typography variant="h6">Время</Typography>
              <Stack direction="row" gap={1}>
                <Field
                  name="showTime"
                  label="Время повляения (сек)"
                  component={NumberField}
                  min={0}
                  max={totalDuration}
                  fullWidth
                />
                <Field
                  name="duration"
                  label="Длительность (сек)"
                  component={NumberField}
                  min={0}
                  max={totalDuration}
                  fullWidth
                />
              </Stack>
              <Typography variant="h6">Координаты (%)</Typography>
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
