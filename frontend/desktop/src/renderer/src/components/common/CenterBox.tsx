import { Box } from "@mui/material";
import React from "react";

interface CenterBoxProps {
  children: React.ReactNode;
}

export const CenterBox: React.FC<CenterBoxProps> = ({ children }) => {
  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      {children}
    </Box>
  );
};
