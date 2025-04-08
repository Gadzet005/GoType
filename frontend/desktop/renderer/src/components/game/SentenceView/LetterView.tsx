import { Typography } from "@mui/material";
import React from "react";

interface LetterViewProps {
  letter: string;
  color?: string;
  font?: string;
  fontSize?: number;
  bold?: boolean;
  opacity?: number;
  isActive?: boolean;
}

export const LetterView: React.FC<LetterViewProps> = React.memo(
  ({
    letter,
    color = "black",
    font = "Onest",
    fontSize = 40,
    bold = false,
    opacity = 1,
    isActive = false,
  }) => {
    return (
      <Typography
        component="span"
        sx={{
          fontFamily: font,
          fontSize: `${fontSize}px`,
          fontWeight: bold ? "bold" : "normal",
          color: color,
          opacity: opacity,
          transition: `opacity 300ms ease-in-out, color 100ms ease-out`,
          textTransform: isActive ? "uppercase" : "none",
        }}
      >
        {letter}
      </Typography>
    );
  }
);
