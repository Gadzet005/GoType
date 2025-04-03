import { Background } from "@/components/common/Background";
import { GameFieldView } from "@/components/game/GameFieldView";
import { Game } from "@/core/store/game/game";
import { Asset } from "@desktop-common/asset";
import { Box } from "@mui/material";
import { reaction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useAudioPlayer } from "react-use-audio-player";

interface GameViewProps {
  game: Game;
  audio: Asset;
  background: {
    asset: Asset;
    brightness?: number;
  };
  disableInput?: boolean;
  onReadyToStart?: () => void;
}

export const GameView: React.FC<GameViewProps> = observer(
  ({
    game,
    audio,
    background,
    disableInput = false,
    onReadyToStart = () => {},
  }) => {
    background.brightness ??= 1;

    const audioPlayer = useAudioPlayer();

    useHotkeys(
      game.language.alphabet.split(""),
      (event: KeyboardEvent) => {
        if (!disableInput && game.isRunning()) {
          game.input(event.key);
        }
      },
      []
    );

    const [loadCount, setLoadCount] = React.useState(0);

    React.useEffect(() => {
      audioPlayer.load(audio.url, {
        autoplay: true,
        loop: false,
        format: audio.ext,
      });
      return () => audioPlayer.cleanup();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [audio]);

    React.useEffect(() => {
      if (audioPlayer.isReady) {
        setLoadCount((v) => v + 1);
      }
    }, [audioPlayer.isReady]);

    React.useEffect(() => {
      if (loadCount == 2) {
        onReadyToStart();
      }
    }, [loadCount, onReadyToStart]);

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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [audioPlayer]);

    return (
      <Box sx={{ height: "100%" }}>
        <Background
          imageUrl={background.asset.url}
          brightness={background.brightness}
          onLoad={() => setLoadCount((v) => v + 1)}
        />
        <GameFieldView game={game} />
      </Box>
    );
  }
);
