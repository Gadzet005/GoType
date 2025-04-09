import { Box, Typography } from "@mui/material";
import React from "react";

interface StatRowProps {
  label: string;
  value: string | number;
  labelColor?: string;
  valueColor?: string;
}

export const StatRow: React.FC<StatRowProps> = ({
  label,
  value,
  labelColor,
  valueColor,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Typography color={labelColor} sx={{ width: "100%" }} variant="h5">
        {label}
      </Typography>
      <Typography
        color={valueColor}
        sx={{ textAlign: "center", width: "100%" }}
        variant="h6"
      >
        {value}
      </Typography>
    </Box>
  );
};
