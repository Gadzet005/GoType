import { LinearProgress, LinearProgressProps } from "@mui/material";
import React from "react";

type ProgressBarProps = Omit<LinearProgressProps, "variant"> & {
  useTransition?: boolean;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  useTransition = false,
  sx,
  ...other
}) => {
  return (
    <LinearProgress
      {...other}
      sx={{
        bgcolor: "background.paper",
        "& .MuiLinearProgress-bar": {
          transition: useTransition ? undefined : "none",
        },
        ...sx,
      }}
      variant="determinate"
    />
  );
};
