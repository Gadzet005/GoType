import { Box, BoxProps } from "@mui/material";
import React from "react";

interface TabPanelProps extends BoxProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export const EditorTabPanel: React.FC<TabPanelProps> = ({
  children,
  value,
  index,
  ...other
}) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      {...other}
      sx={{ height: "100%", mt: 2, ...other.sx, overflow: "auto" }}
    >
      {value === index && children}
    </Box>
  );
};
