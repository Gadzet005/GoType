import { openOneFileDialog } from "@/core/services/electron/app/openFileDialog";
import { Box, IconButton, TextField } from "@mui/material";
import { FieldProps } from "formik";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

interface FileFieldProps extends FieldProps {
  extensions?: string[];
  label?: string;
  helperText?: string;
}

export const FileField: React.FC<FileFieldProps> = ({
  field,
  form,
  extensions = [],
  label = "",
  helperText = "",
}) => {
  const [fileName, setFileName] = useState<string>("");
  const error = form.errors[field.name];
  const touched = form.touched[field.name];

  const handleUploadFile = async () => {
    const result = await openOneFileDialog(extensions);
    if (result.ok) {
      if (result.payload) {
        setFileName(result.payload.name);
        form.setFieldValue(field.name, result.payload.path);
        form.setFieldError(field.name, undefined);
      } else {
        handleRemoveFile();
      }
    } else {
      form.setFieldError(
        field.name,
        result.error || "Ошибка при загрузке файла. Попробуйте еще раз."
      );
    }
    form.setFieldTouched(field.name, true);
  };

  const handleRemoveFile = () => {
    setFileName("");
    form.setFieldValue(field.name, null);
  };

  return (
    <Box display="flex" flexDirection="column" width="100%">
      <Box display="flex" alignItems="center">
        <TextField
          label={label}
          variant="outlined"
          value={fileName}
          fullWidth
          onClick={handleUploadFile}
          error={error != null && touched != null}
          helperText={error && touched ? (error as string) : helperText}
          slotProps={{
            input: {
              readOnly: true,
              endAdornment: fileName && (
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                >
                  <CloseIcon />
                </IconButton>
              ),
            },
          }}
        />
      </Box>
    </Box>
  );
};
