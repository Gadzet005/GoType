import { Constraints, Defaults } from "@/core/config/game.config";
import { StyleClass } from "@desktop-common/draft/style";
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

const requiredMsg = "Обязательное поле";

const minMsg = (min: number) => {
  return `Минимальное значение: ${min}`;
};

const maxMsg = (max: number) => {
  return `Максимальное значение: ${max}`;
};

const letterValidationSchema = yup.object({
  font: yup.string().required(requiredMsg),
  fontSize: yup
    .number()
    .required(requiredMsg)
    .min(Constraints.minFontSize, minMsg(Constraints.minFontSize))
    .max(Constraints.maxFontSize, maxMsg(Constraints.maxFontSize))
    .integer(),
  color: yup.string().required(requiredMsg),
  bold: yup.bool().required(requiredMsg),
});

const validationSchema = yup.object({
  name: yup.string().required(requiredMsg).max(20, "Слишком большое название"),
  padding: yup
    .number()
    .required(requiredMsg)
    .min(0, minMsg(0))
    .max(Constraints.maxPadding, maxMsg(Constraints.maxPadding))
    .integer(),
  borderRadius: yup
    .number()
    .required(requiredMsg)
    .min(0, minMsg(0))
    .max(Constraints.maxBorderRadius, maxMsg(Constraints.maxBorderRadius))
    .integer(),
  rotation: yup
    .number()
    .required(requiredMsg)
    .min(0, minMsg(0))
    .max(360, maxMsg(360))
    .integer(),
  bgcolor: yup.string().nullable(),
  default: letterValidationSchema,
  active: letterValidationSchema,
  mistake: letterValidationSchema,
  success: letterValidationSchema,
});

interface StyleFormProps {
  open: boolean;
  onClose?: () => void;
  onUpdate?: () => void | Promise<void>;
  initial?: StyleClass;
}

export const StyleFormDialog: React.FC<StyleFormProps> = ({
  open,
  onClose = () => {},
  onUpdate = () => {},
  initial,
}) => {
  const draft = useEditorContext();

  const styleClass = initial ?? {
    name: "Новый стиль",
    style: Defaults.sentenceStyle,
  };

  const handleSave = async (
    values: StyleFormValues,
    setFieldError: (field: string, message: string | undefined) => void
  ) => {
    if (initial) {
      // already have style class
      draft.removeStyleClass(initial.name);
      draft.setStyleClass(styleClass.name, fromValues(values));
    } else {
      // new style class
      const r = draft.addStyleClass(fromValues(values));
      if (!r) {
        setFieldError("name", "Стиль с таким именем уже существует");
        return;
      }
    }

    await Promise.resolve(onUpdate());
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
          <DialogActions sx={{ px: 3, pb: 3 }}>
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
