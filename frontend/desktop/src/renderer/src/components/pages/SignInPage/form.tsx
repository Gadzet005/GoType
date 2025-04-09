import { PasswordField } from "@/components/common/form/PasswordField";
import { ApiError } from "@/core/config/api.config";
import { RoutePath } from "@/core/config/routes/path";
import { useAppContext, useNavigate } from "@/core/hooks";
import { signIn } from "@/core/services/api/user/signIn";
import { Alert, Box, Button } from "@mui/material";
import { Form, Field, Formik } from "formik";
import { TextField } from "formik-mui";
import * as yup from "yup";

interface SignInFormValues {
  name: string;
  password: string;
}

const initialValues: SignInFormValues = { name: "", password: "" };
const validationSchema = yup.object().shape({
  name: yup.string().required("Обязательное поле"),
  password: yup.string().required("Обязательное поле"),
});

export const SignInForm = () => {
  const ctx = useAppContext();
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, setStatus }) => {
        const result = await signIn(ctx, values.name, values.password);
        if (result.ok) {
          navigate(RoutePath.profile);
        } else if (result.error === ApiError.noSuchUser) {
          setStatus({ general: "Неверное имя или пароль." });
        } else {
          setStatus({ general: "Неизвестная ошибка." });
        }
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, status }) => (
        <Form>
          {status?.general && (
            <Alert
              sx={{ mb: 2, justifySelf: "center" }}
              severity="error"
              variant="filled"
            >
              {status.general}
            </Alert>
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Field name="name" component={TextField} label="Имя" type="text" />
            <PasswordField name="password" label="Пароль" />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
            >
              Вход
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
