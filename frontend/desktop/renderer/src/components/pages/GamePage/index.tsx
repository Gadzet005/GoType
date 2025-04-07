import { ProgressBar } from "@/components/common/ProgressBar";
import { Button } from "@/components/ui/Button";
import { RoutePath } from "@/core/config/routes/path";
import { useNavigate } from "@/core/hooks";
import { GameRunner } from "@/core/store/game";
import { Game } from "@/core/store/game/game";
import { Level } from "@/core/store/game/level";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Stack, Typography } from "@mui/material";
import { when } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { ComboCounter } from "./ComboCounter";
import PauseMenu from "./PauseMenu";
import { GameView } from "@/components/game/GameView";
import { useAutoLoadAudioPlayer } from "@/core/hooks/useAutoLoadAudioPlayer";

interface GamePageProps {
  level: Level;
}

export const GamePage: React.FC<GamePageProps> = observer(({ level }) => {
  const navigate = useNavigate();
  const audioPlayer = useAutoLoadAudioPlayer(level.audio);

  const [game] = React.useState<Game>(new Game(level));
  const [gameRunner] = React.useState<GameRunner>(new GameRunner(game));
  const [isGameReady, setIsGameReady] = React.useState<boolean>(false);

  useHotkeys(
    game.language.alphabet.split(""),
    (event: KeyboardEvent) => {
      if (game.isRunning()) {
        game.input(event.key);
      }
    },
    []
  );

  const resumeGame = React.useCallback(() => {
    gameRunner.start();
    audioPlayer.seek((game.duration * game.getProgress()) / 1000);
    audioPlayer.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game, gameRunner]);

  const pauseGame = React.useCallback(() => {
    gameRunner.pause();
    audioPlayer.pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameRunner]);

  const restartGame = React.useCallback(() => {
    gameRunner.reset();
    resumeGame();
  }, [gameRunner, resumeGame]);

  const handleTogglePause = React.useCallback(() => {
    if (game.isPaused()) {
      resumeGame();
    } else {
      pauseGame();
    }
  }, [game, resumeGame, pauseGame]);

  useHotkeys("esc", handleTogglePause);

  React.useEffect(() => {
    const disposer = when(
      () => game.isFinished(),
      () => {
        navigate(RoutePath.gameStatistics, {
          level,
          statistics: game.statistics,
        });
      }
    );
    return () => {
      disposer();
      if (game.isRunning()) {
        gameRunner.pause();
      }
    };
  }, [game, level, gameRunner, navigate]);

  React.useEffect(() => {
    if (isGameReady && audioPlayer.isReady) {
      resumeGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameReady, audioPlayer.isReady]);

  return (
    <Stack sx={{ height: "100%" }}>
      <Stack sx={{ p: 2, display: "flex" }}>
        <Box
          sx={{
            display: "flex",
            gap: 3,
            pb: 2,
          }}
        >
          <Box sx={{ width: "25%" }}>
            <Button
              sx={{
                bgcolor: "background.paper",
                color: "text.primary",
                height: "50px",
                width: "50px",
              }}
              variant="contained"
              onClick={pauseGame}
            >
              <MenuIcon />
            </Button>
          </Box>
          <Box sx={{ width: "50%", px: 3 }}>
            <ProgressBar
              sx={{
                height: 15,
                borderRadius: 10,
              }}
              value={game.getProgress() * 100}
            />
          </Box>
          <Box
            sx={{
              width: "25%",
              display: "flex",
              justifyContent: "end",
              gap: 1,
            }}
          >
            <ComboCounter combo={game.statistics.comboCounter} />
            <Box
              sx={{
                bgcolor: "background.paper",
                p: 2,
                borderRadius: 4,
                minWidth: "200px",
                textAlign: "center",
              }}
            >
              <Typography color="text.secondary" variant="h4">
                {String(game.statistics.score).padStart(7, "0")}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Stack>
      <PauseMenu
        open={game.isPaused()}
        onClose={resumeGame}
        onContinue={resumeGame}
        onRestart={restartGame}
        onExit={() => navigate(RoutePath.levelList)}
      />
      <GameView
        sentences={game.getVisibleSentences()}
        cursor={game.getCursorPosition()}
        time={game.time}
        background={level.background}
        onReadyToStart={() => setIsGameReady(true)}
        fullScreen
      />
    </Stack>
  );
});
