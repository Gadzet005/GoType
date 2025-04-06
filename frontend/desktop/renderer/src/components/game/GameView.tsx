import { Background } from "@/components/common/Background";
import { GameFieldView } from "@/components/game/GameFieldView";
import { Game } from "@/core/store/game/game";
import { Asset } from "@desktop-common/asset";
import { Box } from "@mui/material";
import { reaction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { AudioPlayer } from "react-use-audio-player";

interface GameViewProps {
  game: Game;
  audioPlayer: AudioPlayer;
  background: {
    asset: Asset;
    brightness?: number;
  };
  disableInput?: boolean;
  onReadyToStart?: () => void;
  fullScreen?: boolean;
}

export const GameView: React.FC<GameViewProps> = observer(
  ({
    game,
    audioPlayer,
    background,
    disableInput = false,
    fullScreen = false,
    onReadyToStart = () => {},
  }) => {
    background.brightness ??= 1;

    const [isBackgroundLoading, setIsBackgroundLoading] = React.useState(true);

    useHotkeys(
      game.language.alphabet.split(""),
      (event: KeyboardEvent) => {
        if (!disableInput && game.isRunning()) {
          game.input(event.key);
        }
      },
      []
    );

    React.useEffect(() => {
      if (!isBackgroundLoading && audioPlayer.isReady) {
        onReadyToStart();
        if (game.isRunning()) {
          audioPlayer.seek(0);
          audioPlayer.play();
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onReadyToStart, isBackgroundLoading, audioPlayer.isReady]);

    React.useEffect(() => {
      const disposer1 = reaction(
        () => game.isPaused(),
        (isPaused) => {
          if (isPaused) {
            audioPlayer.pause();
          }
        }
      );
      const disposer2 = reaction(
        () => game.isRunning(),
        (isRunning) => {
          if (isRunning) {
            audioPlayer.seek((game.duration * game.getProgress()) / 1000);
            audioPlayer.play();
          }
        }
      );
      return () => {
        disposer1();
        disposer2();
      };
    }, [audioPlayer, game]);

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
          onLoad={() => setIsBackgroundLoading(false)}
        />
        <GameFieldView game={game} />
      </Box>
    );
  }
);
