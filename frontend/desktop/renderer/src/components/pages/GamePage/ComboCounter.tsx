import { Box, Typography } from "@mui/material";
import React from "react";

interface ComboCounterProps {
  combo: number;
}

export const ComboCounter: React.FC<ComboCounterProps> = React.memo(
  ({ combo }) => {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.paper",
          px: 4,
          py: 2,
          borderRadius: 4,
          minWidth: "100px",
        }}
      >
        <Typography
          variant="h5"
          color="primary"
          sx={{
            fontWeight: "bold",
          }}
        >
          x{combo}
        </Typography>
      </Box>
    );
  }
);
