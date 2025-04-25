import { Box } from "@mui/material";
import { observer } from "mobx-react";
import React from "react";
import useMeasure from "react-use-measure";
import ResizeObserver from "resize-observer-polyfill";
import { SentenceView } from "./SentenceView";
import { SentenceContainer } from "./SentenceView/container";
import { CursorPosition } from "@/core/store/game/core/cursor";
import { FieldSentence } from "@/core/store/game/core/fieldSentence";
import { AssetRef } from "@common/asset";
import { Background } from "../common/Background";

interface GameViewProps {
  sentences: FieldSentence[];
  time: number;
  cursor?: CursorPosition | null;
  background: {
    asset: AssetRef;
    brightness?: number;
  };
  onReadyToStart?: () => void;
  fullScreen?: boolean;
}

export const GameView: React.FC<GameViewProps> = observer(
  ({
    sentences,
    time,
    cursor = null,
    background,
    fullScreen = false,
    onReadyToStart = () => {},
  }) => {
    const [ref, bounds] = useMeasure({ polyfill: ResizeObserver });

    const SentenceViews = React.useMemo(
      () =>
        sentences.map((sentence) => (
          <SentenceContainer
            key={sentence.idx}
            x={sentence.style.coord.x}
            y={sentence.style.coord.y}
            fieldHeight={bounds.height}
            fieldWidth={bounds.width}
          >
            <SentenceView
              sentence={sentence}
              cursor={sentence.getRelativeCursor(cursor) ?? undefined}
              sentenceTime={sentence.getRelativeTime(time)}
            />
          </SentenceContainer>
        )),
      [bounds.height, bounds.width, cursor, sentences, time]
    );

    return (
      <Box
        sx={{
          position: fullScreen ? "static" : "relative",
          height: "100%",
          p: 2,
        }}
      >
        <Background
          imageUrl={background.asset.url}
          brightness={background.brightness}
          onLoad={() => onReadyToStart()}
        />
        <Box
          ref={ref}
          sx={{ position: "relative", overflow: "hidden" }}
          height="100%"
          width="100%"
        >
          {SentenceViews}
        </Box>
      </Box>
    );
  }
);
