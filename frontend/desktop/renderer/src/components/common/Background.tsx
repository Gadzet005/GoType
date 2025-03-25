import { Box } from "@mui/material";
import React from "react";

interface BackgroundProps {
  imageUrl: string;
  zIndex?: number;
  brightness?: number;
}

export const Background: React.FC<BackgroundProps> = ({
  imageUrl,
  zIndex = -100,
  brightness = 0.5,
}) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        zIndex: zIndex,
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: `rgba(0, 0, 0, ${brightness})`,
        },
      }}
    />
  );
};
