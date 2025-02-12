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

interface PasswordFieldProps {
  name?: string;
  label?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

export const PasswordField: FC<PasswordFieldProps> = ({
  name = "password",
  label = "Пароль",
  required = false,
  error = false,
  helperText = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);

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
    <FormControl variant="outlined">
      <InputLabel htmlFor={name} required={required} error={error}>
        {label}
      </InputLabel>
      <OutlinedInput
        id={name}
        label={label}
        name={name}
        type={isVisible ? "text" : "password"}
        error={error}
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
      {helperText && (
        <FormHelperText error={error}>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};
