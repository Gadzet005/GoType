import { Box, Typography } from "@mui/material";

interface ComboCounterProps {
  combo: number;
}

export function ComboCounter({ combo }: ComboCounterProps) {
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
      }}
    >
      <Typography
        variant="h4"
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
