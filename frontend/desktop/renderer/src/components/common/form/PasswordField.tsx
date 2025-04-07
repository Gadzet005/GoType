import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import React, { FC, useState } from "react";
import { useField } from "formik";

interface PasswordFieldProps {
  name: string;
  label?: string;
  required?: boolean;
}

export const PasswordField: FC<PasswordFieldProps> = ({
  name,
  label = "Пароль",
  required = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [field, meta] = useField(name);

  const handleClickShowPassword = () => setIsVisible((isVisible) => !isVisible);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <FormControl variant="outlined" error={meta.touched && Boolean(meta.error)}>
      <InputLabel htmlFor={name} required={required}>
        {label}
      </InputLabel>
      <OutlinedInput
        {...field}
        id={name}
        label={label}
        type={isVisible ? "text" : "password"}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              sx={{ color: "text.secondary" }}
              aria-label={isVisible ? "Спрятать пароль" : "Показать пароль"}
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              onMouseUp={handleMouseUpPassword}
              edge="end"
            >
              {isVisible ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
      />
      {meta.touched && meta.error && (
        <FormHelperText error>{meta.error}</FormHelperText>
      )}
    </FormControl>
  );
};
