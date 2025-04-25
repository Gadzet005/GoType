import React from "react";
import {
  TextField,
  IconButton,
  InputAdornment,
  TextFieldProps,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { FieldProps } from "formik";

type NumberFieldProps = FieldProps &
  Omit<TextFieldProps, "onChange"> & {
    min?: number;
    max?: number;
    defaultValue?: number;
    onlyInt?: boolean;
    onChange?: (value: number) => void;
    withoutIncAndDec?: boolean;
  };

export const NumberField: React.FC<NumberFieldProps> = ({
  field,
  form,
  min = -Infinity,
  max = Infinity,
  label,
  onChange,
  onBlur,
  onlyInt = false,
  withoutIncAndDec = false,
  ...props
}) => {
  const [rawValue, setRawValue] = React.useState(String(field.value));

  const setValue = (newValue: number): number => {
    if (Number.isNaN(newValue)) {
      newValue = 0;
    }

    if (onlyInt) {
      newValue = Math.round(newValue);
    }
    const v = Math.max(Math.min(newValue, max), min);
    form.setFieldValue(field.name, v);

    if (onChange) {
      onChange(v);
    }

    return v;
  };

  const handleIncrement = () => {
    const v = setValue(Number(rawValue) + 1);
    setRawValue(v.toString());
  };

  const handleDecrement = () => {
    const v = setValue(Number(rawValue) - 1);
    setRawValue(v.toString());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInputValue = e.target.value;
    if (!/^(-|\+)?\d*(\.\d*)?$/.test(rawInputValue)) {
      return;
    }
    setRawValue(rawInputValue);
    setValue(Number(rawInputValue));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const v = setValue(Number(rawValue));
    setRawValue(v.toString());
    if (onBlur) {
      onBlur(e);
    }
  };

  const error = Boolean(form.touched[field.name] && form.errors[field.name]);

  return (
    <TextField
      {...field}
      {...props}
      value={rawValue}
      label={label}
      type="text"
      inputMode="numeric"
      onChange={handleChange}
      onBlur={handleBlur}
      error={error}
      helperText={error ? (form.errors[field.name] as string) : undefined}
      slotProps={{
        input: {
          startAdornment: !withoutIncAndDec && (
            <InputAdornment position="start">
              <IconButton
                onClick={handleDecrement}
                disabled={Number(rawValue) <= min}
                size="small"
                edge="start"
              >
                <Remove />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: !withoutIncAndDec && (
            <InputAdornment position="end">
              <IconButton
                onClick={handleIncrement}
                disabled={Number(rawValue) >= max}
                size="small"
                edge="end"
              >
                <Add />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      sx={{
        minWidth: 150,
        "& .MuiOutlinedInput-input": {
          textAlign: "center",
        },
      }}
    />
  );
};
