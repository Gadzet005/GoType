import { availableFonts, Constraints } from "@/core/config/game.config";
import {
  FormControl,
  FormControlLabel,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { Select, Switch, TextField } from "formik-mui";
import { Field } from "formik";
import { ColorField } from "@/components/common/form/ColorField";
import { NumberField } from "@/components/common/form/NumberField";
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
    <Stack spacing={2}>
      <Field name="name" component={TextField} label="Название" />

      <Typography variant="h6">Предложение</Typography>

      <Stack direction="row" spacing={1}>
        <Field
          name="padding"
          component={NumberField}
          label="Внутренний отступ"
          type="number"
          fullWidth
          min={0}
          max={Constraints.maxPadding}
          onlyInt
        />
        <Field
          name="borderRadius"
          component={NumberField}
          label="Закругление"
          type="number"
          fullWidth
          min={0}
          max={Constraints.maxBorderRadius}
          onlyInt
        />
      </Stack>
      <Field
        component={OptionalField}
        name="bgcolor"
        defaultValue="#ffffff"
        label="Цвет фона"
        disabledText="Прозрачный"
        subFieldComponent={ColorField}
      />

      <Typography variant="h6">Шрифт</Typography>

      <Stack direction="row" spacing={1}>
        <FormControl fullWidth>
          <Field component={Select} name="font" label="Шрифт">
            {availableFonts.map((font) => (
              <MenuItem key={font} value={font}>
                {font}
              </MenuItem>
            ))}
          </Field>
        </FormControl>
        <Field
          name="fontSize"
          component={NumberField}
          label="Размер"
          type="number"
          fullWidth
          min={Constraints.minFontSize}
          max={Constraints.maxFontSize}
          onlyInt
        />
        <FormControl
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          fullWidth
        >
          <FormControlLabel
            control={<Field name="bold" component={Switch} type="checkbox" />}
            label="Жирный"
          />
        </FormControl>
      </Stack>

      <Typography variant="h6">Цвет</Typography>

      <Stack spacing={1}>
        {letterStyleNames.map(({ label, name }) => (
          <Field
            key={name}
            name={`colors.${name}`}
            component={ColorField}
            label={label}
          />
        ))}
      </Stack>

      <Typography variant="h6">Длительность анимации</Typography>
      <Stack direction="row" spacing={1}>
        <Field
          name="introDurationPercent"
          component={NumberField}
          label="Длительность вступления (%)"
          type="number"
          fullWidth
          min={0}
          max={Constraints.maxIntroDurationPercent}
        />
        <Field
          name="outroDurationPercent"
          component={NumberField}
          label="Длительность выхода (%)"
          type="number"
          fullWidth
          min={0}
          max={Constraints.maxOutroDurationPercent}
        />
      </Stack>
    </Stack>
  );
};
