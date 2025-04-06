import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import { useEditorContext } from "../../context";
import { Select, TextField } from "formik-mui";
import { FileField } from "@/components/common/form/FileField";
import { Button, MenuItem, Stack } from "@mui/material";
import { AllowedAssetExtensions } from "@/core/config/asset.config";
import { availableLanguages } from "@/core/config/lang.config";

interface SettingsFormValues {
  name: string;
  audio?: string | null;
  background?: string | null;
  lang: string;
}

const validationSchema = yup.object().shape({
  name: yup.string().min(3, "Слишком короткое название"),
  audio: yup.string().nullable(),
  background: yup.string().nullable(),
});

export const SettingsForm = () => {
  const { draft, updateDraft } = useEditorContext();

  const handleSubmit = async (values: SettingsFormValues) => {
    draft.setName(values.name);
    draft.setLanguage(values.lang);
    await updateDraft({
      newAudioFile: values.audio,
      newBackgroundFile: values.background,
    });
  };

  return (
    <Formik
      initialValues={{ name: draft.name, lang: draft.language.code }}
      validationSchema={validationSchema}
      onSubmit={async (values: SettingsFormValues, { setSubmitting }) => {
        await handleSubmit(values);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Stack spacing={2}>
            <Field name="name" label="Название" component={TextField} />
            <Field name="lang" label="Язык" component={Select}>
              {availableLanguages.map((lang) => (
                <MenuItem value={lang.code} key={lang.code}>
                  {lang.name}
                </MenuItem>
              ))}
            </Field>
            <Field
              name="audio"
              label="Аудио"
              component={FileField}
              extensions={AllowedAssetExtensions.AUDIO}
              initialFileName={draft.audio?.name}
            />
            <Field
              name="background"
              label="Фоновое изображение"
              component={FileField}
              extensions={AllowedAssetExtensions.BACKGROUND}
              initialFileName={draft.background?.name}
            />
            <Button
              type="submit"
              fullWidth
              color="success"
              variant="contained"
              disabled={isSubmitting}
            >
              Сохранить
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};
