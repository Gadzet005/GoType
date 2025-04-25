import { openOneFileDialog } from "@/core/services/electron/app/openFileDialog";
import { Button, ButtonProps } from "@mui/material";
import React from "react";
import { FileMeta } from "@common/file";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

type FileUploadButtonProps = ButtonProps & {
  extensions?: string[];
  onLoad?: (meta: FileMeta) => void;
  onError?: (err: string) => void;
};

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  extensions = [],
  onLoad = () => {},
  onError = () => {},
  children,
  ...props
}) => {
  const handleUploadFile = async () => {
    const result = await openOneFileDialog(extensions);
    if (result.ok && result.payload) {
      onLoad(result.payload);
    } else if (!result.ok) {
      onError(result.error);
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<CloudUploadIcon />}
      onClick={handleUploadFile}
      {...props}
    >
      {children}
    </Button>
  );
};
