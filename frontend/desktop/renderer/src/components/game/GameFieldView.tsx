import { Game } from "@/core/store/game/game";
import { Box } from "@mui/material";
import { observer } from "mobx-react";
import React from "react";
import useMeasure from "react-use-measure";
import ResizeObserver from "resize-observer-polyfill";
import { SentenceView } from "./SentenceView";
import { SentenceContainer } from "./SentenceView/container";
import { CursorPosition } from "@/core/store/game/core/cursor";
import { Sentence } from "@/core/store/game/core/sentence";

interface GameFieldProps {
  game: Game;
}

function getSentenceCursor(
  cursor: CursorPosition | null,
  idx: number
): number | undefined {
  return cursor && cursor.sentence == idx ? cursor.letter : undefined;
}

function getSentenceTime(sentence: Sentence, time: number): number {
  return Math.min(
    sentence.totalDuration,
    Math.max(0, time - sentence.introTime)
  );
}

export const GameFieldView: React.FC<GameFieldProps> = observer(({ game }) => {
  const [ref, bounds] = useMeasure({ polyfill: ResizeObserver });

  const SentenceViews = React.useMemo(
    () =>
      game.getVisibleSentences().map((sentence) => {
        const sentenceCursor = getSentenceCursor(
          game.getCursorPosition(),
          sentence.idx
        );
        const sentenceTime = getSentenceTime(sentence, game.time);

        return (
          <SentenceContainer
            key={sentence.idx}
            x={sentence.style.coord.x}
            y={sentence.style.coord.y}
            fieldHeight={bounds.height}
            fieldWidth={bounds.width}
          >
            <SentenceView
              sentence={sentence}
              cursor={sentenceCursor}
              sentenceTime={sentenceTime}
            />
          </SentenceContainer>
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [game.time]
  );

  return (
    <Box
      ref={ref}
      sx={{ position: "relative", overflow: "hidden" }}
      height="100%"
      width="100%"
    >
      {SentenceViews}
    </Box>
  );
});
