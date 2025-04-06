import { Box, Typography } from "@mui/material";
import { useEditorContext } from "../../context";
import { observer } from "mobx-react";
import { CenterBox } from "@/components/common/CenterBox";
import { GameView } from "@/components/game/GameView";
import { Draft } from "../../store/draft";
import React from "react";
import { Game } from "@/core/store/game";
import { AudioPlayerView } from "@/components/common/AudioPlayerView";

function draftSentences(draft: Draft) {
  return draft.sentences
    .map((sentence) => sentence.toSentenceData())
    .filter((sentence) => sentence !== null);
}

export const FieldEditor = observer(() => {
  const { draft, audioPlayer } = useEditorContext();

  const [game, setGame] = React.useState<Game | null>(null);

  React.useEffect(() => {
    if (!audioPlayer.isReady) {
      return;
    }

    setGame(
      new Game({
        sentences: draftSentences(draft),
        language: draft.language,
        duration: audioPlayer.duration,
      })
    );
  }, [audioPlayer.duration, audioPlayer.isReady, draft]);

  React.useEffect(() => {
    audioPlayer.seek(0);
    return () => {
      audioPlayer.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!draft.audio || !draft.background) {
    return (
      <CenterBox>
        <Typography variant="h5">
          Загрузите аудио файл и фон, чтобы страница стала доступна
        </Typography>
      </CenterBox>
    );
  }

  if (!game) {
    return null;
  }

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ width: "100%", px: 5, py: 1 }}>
        <AudioPlayerView
          player={audioPlayer}
          step={0.1}
          onTimeChange={(time) => {
            game.step(time);
          }}
        />
      </Box>
      <Box sx={{ flex: 1 }}>
        <GameView
          game={game}
          audioPlayer={audioPlayer}
          background={{
            asset: draft.background.asset!,
            brightness: draft.background.brightness,
          }}
          disableInput
        />
      </Box>
    </Box>
  );
});
