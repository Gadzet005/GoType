import { PasswordField } from "@/components/common/form/PasswordField";
import { ApiError } from "@/core/config/api.config";
import { RoutePath } from "@/core/config/routes/path";
import { useAppContext, useNavigate } from "@/core/hooks";
import { signUp } from "@/core/services/api/user/signUp";
import { Alert, Box, Button } from "@mui/material";
import { Form, Field, Formik } from "formik";
import { TextField } from "formik-mui";
import * as yup from "yup";

interface SignUpFormValues {
  name: string;
  password: string;
  passwordRepeat: string;
}

const initialValues: SignUpFormValues = {
  name: "",
  password: "",
  passwordRepeat: "",
};
const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Обязательное поле")
    .min(3, "Слишком короткое имя")
    .max(30, "Слишком длинное имя"),
  password: yup
    .string()
    .required("Обязательное поле")
    .min(4, "Слишком короткий пароль"),
  passwordRepeat: yup
    .string()
    .required("Обязательное поле")
    .oneOf([yup.ref("password"), ""], "Пароли должны совпадать"),
});

export const SignUpForm = () => {
  const ctx = useAppContext();
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, setStatus }) => {
        const result = await signUp(ctx, values.name, values.password);
        if (result.ok) {
          navigate(RoutePath.profile);
        } else if (result.error === ApiError.userExists) {
          setStatus({
            general: "Пользователь с таким именем уже зарегистрирован.",
          });
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
            <PasswordField name="passwordRepeat" label="Повторите пароль" />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
            >
              Регистрация
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
