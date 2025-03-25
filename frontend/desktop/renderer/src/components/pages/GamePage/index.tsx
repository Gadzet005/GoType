import { Background } from "@/components/common/Background";
import { ProgressBar } from "@/components/common/ProgressBar";
import { GameField } from "@/components/game/GameField";
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
import { useAudioPlayer } from "react-use-audio-player";
import { ComboCounter } from "./ComboCounter";
import PauseMenu from "./PauseMenu";

interface GamePageProps {
  level: Level;
}

export const GamePage: React.FC<GamePageProps> = observer(({ level }) => {
  const navigate = useNavigate();
  const [game] = React.useState<Game>(new Game(level));
  const [gameRunner] = React.useState<GameRunner>(new GameRunner(game));
  const audioPlayer = useAudioPlayer();

  const handleKeyDown = (event: KeyboardEvent) => {
    if (game.isRunning()) {
      game.input(event.key);
    }
  };

  const handleResume = React.useCallback(() => {
    gameRunner.start();
    audioPlayer.play();
  }, [gameRunner, audioPlayer]);

  const handlePause = () => {
    gameRunner.pause();
    audioPlayer.pause();
  };

  const handleRestart = () => {
    gameRunner.init();
    gameRunner.start();
    audioPlayer.stop();
    audioPlayer.play();
  };

  const handleTogglePause = () => {
    if (game.isPaused()) {
      handleResume();
    } else {
      handlePause();
    }
  };

  useHotkeys("esc", handleTogglePause);
  useHotkeys(game.level.language.alphabet.split(""), handleKeyDown, [
    game.level.language.alphabet,
  ]);

  React.useEffect(() => {
    audioPlayer.load(level.audio.url, {
      autoplay: true,
      loop: false,
      format: level.audio.ext,
    });
    return () => audioPlayer.cleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level.audio.url]);

  React.useEffect(() => {
    gameRunner.init();
    gameRunner.start();
    return () => {
      gameRunner.pause();
    };
  }, [game, gameRunner]);

  React.useEffect(() => {
    when(
      () => game.isFinished(),
      () => {
        navigate(RoutePath.gameStatistics, {
          level,
          statistics: game.statistics,
        });
      }
    );
  }, [game, level, navigate]);

  return (
    <Box sx={{ height: "100%" }}>
      <Background
        imageUrl={level.background.asset.url}
        brightness={level.background.brightness}
      />
      <Box
        sx={{
          height: "100%",
          p: 2,
        }}
      >
        <Stack sx={{ display: "flex", height: "100%", width: "100%" }}>
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
                onClick={handlePause}
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
                value={game.getProgress()}
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
          <GameField width={"100%"} height={"100%"} game={game} />
        </Stack>
        <PauseMenu
          open={game.isPaused()}
          onClose={handleResume}
          onContinue={handleResume}
          onRestart={handleRestart}
          onExit={() => navigate(RoutePath.levelList)}
        />
      </Box>
    </Box>
  );
});
