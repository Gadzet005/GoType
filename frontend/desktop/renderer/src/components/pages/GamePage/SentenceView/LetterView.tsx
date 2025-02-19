import { Typography } from "@mui/material";
import React from "react";
import { LetterStyle } from "@desktop-common/level/style";
import { useIsPaused } from "../pause";
import { AnimationEasing } from "@desktop-common/types";

import "./fade.css";

interface LetterFadeAnimation {
  time: number;
  duration: number;
  easing?: AnimationEasing;
}

interface LetterViewProps {
  letter: string;
  style: LetterStyle;
  fadeIn: LetterFadeAnimation;
  fadeOut: LetterFadeAnimation;
  useUnderline?: boolean;
}

export const LetterView: React.FC<LetterViewProps> = React.memo(
  ({ letter, style, fadeIn, fadeOut, useUnderline = false }) => {
    fadeIn.easing = fadeIn.easing || "ease-in";
    fadeOut.easing = fadeOut.easing || "ease-in";

    const isPaused = useIsPaused();

    return (
      <Typography
        component="span"
        sx={{
          fontFamily: style.fontFamily,
          fontSize: `${style.fontSize}px`,
          fontWeight: style.fontWeight,
          color: style.color,
          opacity: 0,
          animation: `
          fadeIn ${fadeIn.duration}ms ${fadeIn.easing} ${fadeIn.time}ms forwards, 
          fadeIn ${fadeOut.duration}ms ${fadeOut.easing} ${fadeOut.time}ms forwards reverse
          `,

          animationPlayState: isPaused ? "paused" : "running",
          textDecoration: useUnderline ? "underline" : "none",
        }}
      >
        {letter}
      </Typography>
    );
  }
);
