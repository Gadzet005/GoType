import { Box } from "@mui/material";
import React from "react";
import ResizeObserver from "resize-observer-polyfill";
import useMeasure from "react-use-measure";

function getAbsoluteCoord(
  relative: number,
  fieldSize: number,
  sentenceSize: number
): number {
  return (relative * (fieldSize - sentenceSize)) / 100;
}

interface SentenceViewProps {
  x: number;
  y: number;
  fieldHeight: number;
  fieldWidth: number;
  children: React.ReactElement;
}

export const SentenceContainer: React.FC<SentenceViewProps> = ({
  x,
  y,
  fieldHeight,
  fieldWidth,
  children,
}) => {
  const [ref, bounds] = useMeasure({ polyfill: ResizeObserver });
  const xAbs = getAbsoluteCoord(x, fieldWidth, bounds.width);
  const yAbs = getAbsoluteCoord(y, fieldHeight, bounds.height);

  return (
    <Box
      sx={{
        position: "absolute",
        left: `${xAbs}px`,
        top: `${yAbs}px`,
      }}
      ref={ref}
    >
      {children}
    </Box>
  );
};
