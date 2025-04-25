import React, { useState, useCallback } from "react";
import { Box } from "@mui/material";
import ResizeObserver from "resize-observer-polyfill";
import useMeasure from "react-use-measure";
import { DraftSentence } from "../../store/draftSentence";
import { observer } from "mobx-react";

function getAbsoluteCoord(
  relative: number,
  fieldSize: number,
  sentenceSize: number
): number {
  return (relative * (fieldSize - sentenceSize)) / 100;
}

interface SentenceViewProps {
  sentence: DraftSentence;
  fieldHeight: number;
  fieldWidth: number;
  children: React.ReactNode;
  onDoubleClick?: () => void;
  onSelect?: () => void;
  selected?: boolean;
}

export const DraggableSentenceContainer: React.FC<SentenceViewProps> = observer(
  ({
    sentence,
    fieldHeight,
    fieldWidth,
    children,
    onDoubleClick,
    onSelect,
    selected = false,
  }) => {
    const [ref, bounds] = useMeasure({ polyfill: ResizeObserver });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const xAbs = getAbsoluteCoord(sentence.coord.x, fieldWidth, bounds.width);
    const yAbs = getAbsoluteCoord(sentence.coord.y, fieldHeight, bounds.height);

    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        if (e.ctrlKey) {
          return;
        }

        e.stopPropagation();
        setIsDragging(true);
        setDragStart({
          x: e.clientX - xAbs,
          y: e.clientY - yAbs,
        });
      },
      [xAbs, yAbs]
    );

    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        if (e.ctrlKey) {
          e.stopPropagation();
          if (onSelect) {
            onSelect();
          }
        }
      },
      [onSelect]
    );

    const handleMouseMove = useCallback(
      (e: MouseEvent) => {
        if (!isDragging) return;

        const newXAbs = e.clientX - dragStart.x;
        const newYAbs = e.clientY - dragStart.y;

        const newXPercent = (newXAbs / (fieldWidth - bounds.width)) * 100;
        const newYPercent = (newYAbs / (fieldHeight - bounds.height)) * 100;

        const clampedX = Math.max(0, Math.min(100, newXPercent));
        const clampedY = Math.max(0, Math.min(100, newYPercent));

        sentence.setCoord(clampedX, clampedY);
      },
      [
        isDragging,
        dragStart.x,
        dragStart.y,
        fieldWidth,
        bounds.width,
        bounds.height,
        fieldHeight,
        sentence,
      ]
    );

    const handleMouseUp = useCallback(() => {
      setIsDragging(false);
    }, []);

    React.useEffect(() => {
      if (isDragging) {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };
      }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    return (
      <Box
        sx={{
          position: "absolute",
          left: `${xAbs}px`,
          top: `${yAbs}px`,
          cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none",
          outline: selected || isDragging ? "2px dashed grey" : "none",
          p: 1,
        }}
        ref={ref}
        onMouseDown={handleMouseDown}
        onDoubleClick={onDoubleClick}
        onClick={handleClick}
      >
        {children}
      </Box>
    );
  }
);
