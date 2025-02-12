import { Game } from "@/core/store/game";
import { Box } from "@mui/material";
import { observer } from "mobx-react";
import React from "react";
import { SentenceView } from "./SentenceView";
import { PauseContext } from "./pause";
import useMeasure from "react-use-measure";
import ResizeObserver from "resize-observer-polyfill";

interface GameFieldProps {
  width: number | string;
  height: number | string;
  game: Game;
}

export const GameField: React.FC<GameFieldProps> = observer(
  ({ width: _width, height: _height, game }) => {
    const [ref, bounds] = useMeasure({ polyfill: ResizeObserver });

    const SentenceViews = game.state.field.getAllSentences().map((sentence) => {
      return (
        <SentenceView
          key={sentence.id}
          sentence={sentence}
          fieldHeight={bounds.height}
          fieldWidth={bounds.width}
        />
      );
    });

    return (
      <Box
        ref={ref}
        sx={{ position: "relative", overflow: "hidden" }}
        height={_height}
        width={_width}
      >
        <PauseContext.Provider value={game.isPaused}>
          {SentenceViews}
        </PauseContext.Provider>
      </Box>
    );
  }
);
