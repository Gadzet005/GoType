import { Defaults } from "@/core/config/game.config";
import { fromValues, StyleFormValues, toValues } from "./values";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Form, Formik } from "formik";
import React from "react";
import { useEditorContext } from "../../context";
import { StyleFormFields } from "./StyleFormFields";
import * as yup from "yup";
import { StyleClassData } from "@common/draft/style";

const validationSchema = yup.object({
  name: yup
    .string()
    .required("Обязательное поле")
    .max(20, "Слишком большое название"),
});

interface StyleFormProps {
  open: boolean;
  onClose?: () => void;
  initial?: StyleClassData;
}

export const StyleFormDialog: React.FC<StyleFormProps> = ({
  open,
  onClose = () => {},
  initial,
}) => {
  const { draft } = useEditorContext();

  const styleClass = initial ?? {
    name: "Новый стиль",
    ...Defaults.sentenceStyleClass,
  };

  const handleSave = async (
    values: StyleFormValues,
    setFieldError: (field: string, message: string | undefined) => void
  ) => {
    const styleClass = fromValues(values);
    if (initial) {
      draft.styleClasses.update(initial.name, styleClass);
    } else {
      const r = draft.styleClasses.add(styleClass.name, styleClass);
      if (!r) {
        setFieldError("name", "Стиль с таким именем уже существует");
        return;
      }
    }

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle variant="h4">Редактор стиля</DialogTitle>
      <Formik
        initialValues={toValues(styleClass)}
        validationSchema={validationSchema}
        onSubmit={(values, { setFieldError, setSubmitting }) => {
          handleSave(values, setFieldError);
          setSubmitting(false);
        }}
      >
        <Form>
          <DialogContent>
            <StyleFormFields />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={onClose} color="primary" variant="outlined">
              Закрыть
            </Button>
            <Button color="primary" variant="contained" type="submit">
              Сохранить
            </Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};
