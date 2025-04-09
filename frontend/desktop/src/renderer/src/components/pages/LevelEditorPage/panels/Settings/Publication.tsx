import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import { TextField } from "formik-mui";
import { FileField } from "@/components/common/form/FileField";
import { Button, Stack } from "@mui/material";
import { AllowedAssetExtensions } from "@/core/config/asset.config";
import { useSnackbar } from "@/core/hooks";

interface PublicationValues {
  name: string;
  description: string;
  preview: string | null;
}

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Обязательное поле")
    .min(3, "Слишком короткое название")
    .max(50, "Слишком длинное название"),
  description: yup.string().notRequired().max(5000, "Слишком длинное описание"),
  preview: yup.string().required("Обязательное поле"),
});

export const Publication = () => {
  const snackbar = useSnackbar();

  return (
    <Formik
      initialValues={{
        name: "",
        description: "",
        preview: null,
      }}
      validationSchema={validationSchema}
      onSubmit={async (_: PublicationValues, { setSubmitting }) => {
        snackbar.show("TODO: доделать это", "warning");
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Stack spacing={2}>
            <Field name="name" label="Название уровня" component={TextField} />
            <Field
              name="description"
              label="Описание"
              component={TextField}
              multiline
              minRows={5}
              maxRows={10}
            />
            <Field
              name="preview"
              label="Загрузить превью файл"
              component={FileField}
              extensions={AllowedAssetExtensions.PREVIEW}
            />
            <Button
              type="submit"
              fullWidth
              color="secondary"
              variant="contained"
              disabled={isSubmitting}
            >
              Опубликовать
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};
