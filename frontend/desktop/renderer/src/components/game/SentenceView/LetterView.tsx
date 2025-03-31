import { Typography } from "@mui/material";
import React from "react";
import { LetterStyle } from "@desktop-common/level/style";

interface LetterViewProps {
  letter: string;
  style: LetterStyle;
  isActive?: boolean;
}

export const LetterView: React.FC<LetterViewProps> = React.memo(
  ({ letter, style }) => {
    return (
      <Typography
        component="span"
        sx={{
          fontFamily: style.font,
          fontSize: `${style.fontSize}px`,
          fontWeight: style.bold ? "bold" : "normal",
          color: style.color,
        }}
      >
        {letter}
      </Typography>
    );
  }
);
