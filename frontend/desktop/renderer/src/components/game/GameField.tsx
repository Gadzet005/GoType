import { Game } from "@/core/store/game/game";
import { Box } from "@mui/material";
import { observer } from "mobx-react";
import React from "react";
import useMeasure from "react-use-measure";
import ResizeObserver from "resize-observer-polyfill";
import { PauseContext } from "./pause";
import { SentenceView } from "./SentenceView";
import { SentenceContainer } from "./SentenceView/container";
import { Cursor } from "@/core/store/game/field";
import { Sentence } from "@/core/store/game/field/sentence";

interface GameFieldProps {
  width: number | string;
  height: number | string;
  game: Game;
}

function getSentenceCursor(
  cursor: Cursor | null,
  idx: number
): number | undefined {
  return cursor && cursor.sentence == idx ? cursor.position : undefined;
}

function getSentenceProgress(time: number, sentence: Sentence) {
  const v = Math.min(
    Math.max(0, time - sentence.activeTime) / sentence.activeDuration,
    1
  );
  return Math.round(v * 1000) / 10;
}

export const GameField: React.FC<GameFieldProps> = observer(
  ({ width, height, game }) => {
    const [ref, bounds] = useMeasure({ polyfill: ResizeObserver });

    const SentenceViews = React.useMemo(
      () =>
        game.field.getVisibleSentences().map((sentence) => {
          const cursor = game.field.getCursor();
          const sentenceCursor = getSentenceCursor(cursor, sentence.idx);
          const progress = getSentenceProgress(game.time, sentence);

          return (
            <SentenceContainer
              key={sentence.idx}
              x={sentence.coord.x}
              y={sentence.coord.y}
              fieldHeight={bounds.height}
              fieldWidth={bounds.width}
            >
              <SentenceView
                sentence={sentence}
                cursor={sentenceCursor}
                progress={progress}
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
        height={height}
        width={width}
      >
        <PauseContext.Provider value={game.isPaused()}>
          {SentenceViews}
        </PauseContext.Provider>
      </Box>
    );
  }
);
