import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

interface FileUploadProps {
  label?: string;
  accept?: string[];
  helperText?: string;
}

export const FileInput: React.FC<FileUploadProps> = ({
  label = "Загрузка файла",
  accept = [],
  helperText,
}) => {
  if (helperText === undefined) {
    helperText = "Поддерживаемые форматы: " + accept.join(", ");
  }

  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <FormControl fullWidth size="small">
      <InputLabel
        shrink
        sx={{
          position: "relative",
          transform: "none",
          mb: 0.5,
          ml: 1,
        }}
      >
        {label}
      </InputLabel>
      <Paper
        elevation={0}
        sx={{
          border: "2px solid",
          borderColor: file ? "primary.main" : "grey.500",
          borderRadius: 3,
        }}
      >
        {!file ? (
          <Box
            sx={{
              p: 1,
              borderRadius: 3,
              textAlign: "center",
              cursor: "url('cursor/pointer.png'), pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.1)",
              },
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              onChange={handleFileSelect}
              accept={accept.join(",")}
              style={{ display: "none" }}
              ref={fileInputRef}
            />
            <CloudUploadIcon sx={{ color: "text.secondary", fontSize: 20 }} />
            <Typography variant="body2" color="textSecondary">
              Выберите файл
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 1,
            }}
          >
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="body2" noWrap>
                {file.name}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {formatFileSize(file.size)}
              </Typography>
            </Box>
            <IconButton size="small" onClick={handleRemoveFile} sx={{ p: 0.5 }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Paper>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
