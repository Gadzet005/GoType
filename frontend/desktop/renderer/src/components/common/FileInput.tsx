import React from "react";
import { openOneFileDialog } from "@/core/services/electron/app/openFileDialog";
import { MuiFileInput, MuiFileInputProps } from "mui-file-input";
import CloseIcon from "@mui/icons-material/Close";
import { FileInfo } from "@desktop-common/file";

type FileInputProps = Omit<
  MuiFileInputProps,
  "value" | "onChange" | "multiple"
> & {
  extensions?: string[];
  fileName: string | null;
  onChange: (fileInfo: FileInfo | null) => void;
};

export const FileInput: React.FC<FileInputProps> = ({
  extensions = [],
  fileName,
  onChange,
  ...other
}) => {
  const handleSelectFile = async (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    const result = await openOneFileDialog(extensions);
    if (result.ok) {
      onChange?.(result.payload);
    } else {
      console.error("File dialog error:", result.error);
    }
  };

  const fileDummy = fileName ? new File([], fileName) : null;

  return (
    // @ts-expect-error: missing prop types for MuiFileInput
    <MuiFileInput
      value={fileDummy}
      hideSizeText
      onClick={handleSelectFile}
      clearIconButtonProps={{
        title: "Очистить",
        children: <CloseIcon />,
        onClick: (event) => {
          event.stopPropagation();
          onChange?.(null);
        },
      }}
      {...other}
    />
  );
};
