import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import { useEditorContext } from "../../context";
import { TextField } from "formik-mui";
import { FileField } from "@/components/common/form/FileField";
import { Button, Stack } from "@mui/material";
import { AllowedAssetExtensions } from "@/core/config/asset.config";
import { DraftUpdate } from "@desktop-common/draft";
import { updateDraft } from "@/core/services/electron/levelDraft/updateDraft";

interface SettingsFormValues {
  name?: string;
  audio?: string | null;
  background?: string | null;
}

const validationSchema = yup.object().shape({
  name: yup.string().min(3, "Слишком короткое название"),
  audio: yup.string().nullable(),
  background: yup.string().nullable(),
});

export const SettingsForm = () => {
  const draft = useEditorContext();

  const handleSubmit = async (values: SettingsFormValues) => {
    const updateInfo: DraftUpdate.Args = {
      id: draft.id,
      name: values.name,
      newAudioFile: values.audio,
      newBackgroundFile: values.background,
    };

    const result = await updateDraft(updateInfo);
    if (result.ok) {
      draft.setName(result.payload.name);
      draft.setAudio(result.payload.audio);
      draft.setBackground(result.payload.background);
    } else {
      console.error("Failed to update draft");
    }
  };

  return (
    <Formik
      initialValues={{ name: draft.name }}
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
