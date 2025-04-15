import { FileField } from "@/components/common/form/FileField";
import { NumberField } from "@/components/common/form/NumberField";
import { AllowedAssetExtensions } from "@/core/config/asset.config";
import { availableLanguages } from "@/core/config/lang.config";
import { Button, MenuItem, Stack, Typography } from "@mui/material";
import { Field, Form, Formik } from "formik";
import { Select, TextField } from "formik-mui";
import * as yup from "yup";
import { useEditorContext } from "../../context";

interface SettingsFormValues {
  name: string;
  audio: string | null;
  background: {
    asset: string | null;
    brightness: number;
  };
  lang: string;
  publication: {
    levelName: string;
    description: string;
    preview: string | null;
    difficulty: number;
  };
}

const validationSchema = yup.object({
  name: yup.string().min(3, "Слишком короткое название"),
  publication: yup.object({
    levelName: yup
      .string()
      .required("Обязательное поле")
      .min(3, "Слишком короткое название")
      .max(50, "Слишком длинное название"),
    description: yup
      .string()
      .notRequired()
      .max(5000, "Слишком длинное описание"),
  }),
});

export const SettingsForm = () => {
  const { draft, updateDraft } = useEditorContext();

  const handleSubmit = async (values: SettingsFormValues) => {
    await updateDraft({
      name: values.name,
      audioPath: values.audio ?? undefined,
      background: {
        path: values.background.asset ?? undefined,
        brightness: values.background.brightness / 100,
      },
      languageCode: values.lang,
      publication: {
        levelName: values.publication.levelName,
        description: values.publication.description,
        previewPath: values.publication.preview ?? undefined,
        difficulty: values.publication.difficulty,
      },
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
        publication: {
          levelName: draft.publication.levelName,
          description: draft.publication.description,
          preview: null,
          difficulty: draft.publication.difficulty,
        },
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
            <Typography sx={{ textAlign: "center" }} variant="h4">
              Основные настройки
            </Typography>
            <Field
              name="name"
              label="Название черновика"
              component={TextField}
            />
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
              helperText={draft.audio === null ? "Файл не загружен" : ""}
            />
            <Field
              name="background.asset"
              label="Загрузить фоновое изображение"
              component={FileField}
              extensions={AllowedAssetExtensions.BACKGROUND}
              helperText={
                draft.background.asset === null ? "Файл не загружен" : ""
              }
            />
            <Field
              name="background.brightness"
              label="Яркость фонового изображения"
              component={NumberField}
              max={100}
              min={0}
            />

            <Typography sx={{ textAlign: "center", mt: 2 }} variant="h4">
              Настройки публикации
            </Typography>
            <Field
              name="publication.levelName"
              label="Название уровня"
              component={TextField}
            />
            <Field
              name="publication.description"
              label="Описание"
              component={TextField}
              multiline
              minRows={5}
              maxRows={10}
            />
            <Field
              name="publication.difficulty"
              label="Сложность уровня"
              component={NumberField}
              max={10}
              min={1}
              onlyInt
            />

            <Field
              name="publication.preview"
              label="Загрузить превью файл"
              component={FileField}
              extensions={AllowedAssetExtensions.PREVIEW}
              helperText={
                draft.publication.preview === null ? "Файл не загружен" : ""
              }
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
