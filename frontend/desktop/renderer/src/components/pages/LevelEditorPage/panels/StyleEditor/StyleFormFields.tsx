import { availableFonts } from "@/core/config/game.config";
import {
  FormControl,
  FormControlLabel,
  Grid2,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { Select, Switch, TextField } from "formik-mui";
import { Field } from "formik";
import { ColorField } from "@/components/common/form/ColorField";
import { OptionalField } from "@/components/common/form/OptionalField";

interface LetterStyleRecord {
  label: string;
  name: string;
}

const letterStyleNames: LetterStyleRecord[] = [
  {
    label: "Cимвол",
    name: "default",
  },
  {
    label: "Активный символ",
    name: "active",
  },
  {
    label: "Ошибочный символ",
    name: "mistake",
  },
  {
    label: "Успешный символ",
    name: "success",
  },
];

export const StyleFormFields = () => {
  return (
    <Stack spacing={3} sx={{ mt: 1 }}>
      <Field name="name" component={TextField} label="Название" />

      <Grid2 container spacing={2}>
        <Grid2 size={12}>
          <Typography variant="h6">Предложение</Typography>
        </Grid2>
        <Grid2 size={3}>
          <Field
            name="padding"
            component={TextField}
            label="Внутренний отступ"
            type="number"
            fullWidth
          />
        </Grid2>
        <Grid2 size={3}>
          <Field
            name="borderRadius"
            component={TextField}
            label="Закругление"
            type="number"
            fullWidth
          />
        </Grid2>
        <Grid2 size={3}>
          <Field
            name="rotation"
            component={TextField}
            label="Поворот (градусы)"
            type="number"
            fullWidth
          />
        </Grid2>
        <Grid2 size={3}>
          <Field
            component={OptionalField}
            name="bgcolor"
            defaultValue="#ffffff"
            subFieldComponent={ColorField}
            subFieldProps={{
              label: "Цвет фона",
            }}
          />
        </Grid2>
      </Grid2>

      {letterStyleNames.map(({ label, name }) => (
        <Grid2 key={name} container spacing={1}>
          <Grid2 size={12}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {label}
            </Typography>
          </Grid2>
          <Grid2 size={3}>
            <FormControl fullWidth>
              <Field component={Select} name={`${name}.font`} label="Шрифт">
                {availableFonts.map((font) => (
                  <MenuItem key={font} value={font}>
                    {font}
                  </MenuItem>
                ))}
              </Field>
            </FormControl>
          </Grid2>
          <Grid2 size={3}>
            <Field
              name={`${name}.fontSize`}
              component={TextField}
              label="Размер"
              type="number"
              fullWidth
            />
          </Grid2>
          <Grid2
            size={3}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Field name={`${name}.color`} component={ColorField} label="Цвет" />
          </Grid2>
          <Grid2
            size={3}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FormControlLabel
              control={
                <Field
                  name={`${name}.bold`}
                  component={Switch}
                  type="checkbox"
                />
              }
              label="Жирный шрифт"
            />
          </Grid2>
        </Grid2>
      ))}
    </Stack>
  );
};
