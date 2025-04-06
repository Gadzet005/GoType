import { openOneFileDialog } from "@/core/services/electron/app/openFileDialog";
import { Box, IconButton, TextField } from "@mui/material";
import { FieldProps } from "formik";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

interface FileFieldProps extends FieldProps {
  extensions?: string[];
  label?: string;
}

export const FileField: React.FC<FileFieldProps> = ({
  field,
  form,
  extensions = [],
  label = "",
}) => {
  const [fileName, setFileName] = useState<string>("");

  const handleUploadFile = async () => {
    const result = await openOneFileDialog(extensions);
    if (result.ok) {
      if (result.payload) {
        setFileName(result.payload.name);
        form.setFieldValue(field.name, result.payload.path);
      } else {
        handleRemoveFile();
      }
    } else {
      form.setFieldError(
        field.name,
        "Ошибка при загрузке файла. Попробуйте еще раз."
      );
    }
  };

  const handleRemoveFile = () => {
    setFileName("");
    form.setFieldValue(field.name, null);
  };

  return (
    <Box display="flex" alignItems="center">
      <TextField
        label={label}
        variant="outlined"
        value={fileName}
        fullWidth
        onClick={handleUploadFile}
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
  );
};
