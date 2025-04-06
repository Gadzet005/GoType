import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import { useEditorContext } from "../../context";
import { Select, TextField } from "formik-mui";
import { FileField } from "@/components/common/form/FileField";
import { Button, MenuItem, Stack } from "@mui/material";
import { AllowedAssetExtensions } from "@/core/config/asset.config";
import { availableLanguages } from "@/core/config/lang.config";
import { NumberField } from "@/components/common/form/NumberField";

interface SettingsFormValues {
  name: string;
  audio: string | null;
  background: {
    asset: string | null;
    brightness: number;
  };
  lang: string;
}

const validationSchema = yup.object().shape({
  name: yup.string().min(3, "Слишком короткое название"),
});

export const SettingsForm = () => {
  const { draft, updateDraft } = useEditorContext();

  const handleSubmit = async (values: SettingsFormValues) => {
    draft.setName(values.name);
    draft.setLanguage(values.lang);
    draft.setBackgroundBrightness(values.background.brightness / 100);
    await updateDraft({
      newAudioFile: values.audio ?? undefined,
      newBackgroundFile: values.background.asset ?? undefined,
    });
  };

  return (
    <Formik
      initialValues={{
        name: draft.name,
        lang: draft.language.code,
        background: {
          asset: null,
          brightness: draft.background.brightness * 100,
        },
        audio: null,
      }}
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
              label="Загрузить аудио файл"
              component={FileField}
              extensions={AllowedAssetExtensions.AUDIO}
            />
            <Field
              name="background.asset"
              label="Загрузить фоновое изображение"
              component={FileField}
              extensions={AllowedAssetExtensions.BACKGROUND}
            />
            <Field
              name="background.brightness"
              label="Яркость фонового изображения"
              component={NumberField}
              max={100}
              min={0}
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
