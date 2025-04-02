import React, { useState } from "react";
import { ColorResult, Compact } from "@uiw/react-color";
import { FieldProps } from "formik";
import {
  Box,
  Button,
  Popover,
  Paper,
  useTheme,
  Typography,
  Stack,
} from "@mui/material";

interface ColorPickerFieldProps extends FieldProps {
  label?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const ColorField: React.FC<ColorPickerFieldProps> = ({
  field,
  form,
  label = "Цвет",
  disabled = false,
  fullWidth = false,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const isActuallyDisabled = disabled || form.isSubmitting;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isActuallyDisabled) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (color: ColorResult) => {
    if (!isActuallyDisabled) {
      form.setFieldValue(field.name, color.hex);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "color-picker-popover" : undefined;

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Button
          aria-describedby={id}
          onClick={handleClick}
          disabled={isActuallyDisabled}
          sx={{
            minWidth: "40px",
            width: "40px",
            height: "40px",
            p: 0,
            backgroundColor: field.value || "#ffffff",
            "&:hover": {
              backgroundColor: field.value || "#ffffff",
              opacity: isActuallyDisabled ? 1 : 0.8,
            },
            flexShrink: 0,
          }}
        />
        <Typography
          variant="subtitle1"
          color={isActuallyDisabled ? "text.disabled" : "text.primary"}
          sx={{
            width: fullWidth ? "100%" : "auto",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {label}
        </Typography>
      </Stack>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{
          "& .MuiPopover-paper": {
            mt: 2,
          },
        }}
      >
        <Paper elevation={0}>
          <Compact
            color={field.value}
            onChange={handleChange}
            style={{ backgroundColor: theme.palette.background.paper }}
          />
        </Paper>
      </Popover>
    </Box>
  );
};
