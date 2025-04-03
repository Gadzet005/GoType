import { ProgressBar } from "@/components/common/ProgressBar";
import { Button } from "@/components/ui/Button";
import { tickTime } from "@/core/config/game.config";
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

interface GamePageProps {
  level: Level;
}

export const GamePage: React.FC<GamePageProps> = observer(({ level }) => {
  const navigate = useNavigate();

  const [game] = React.useState<Game>(new Game(level));
  const [gameRunner] = React.useState<GameRunner>(
    new GameRunner(game, tickTime)
  );

  const handleResume = React.useCallback(() => {
    gameRunner.start();
  }, [gameRunner]);

  const handlePause = React.useCallback(() => {
    gameRunner.pause();
  }, [gameRunner]);

  const handleRestart = React.useCallback(() => {
    gameRunner.reset();
    gameRunner.start();
  }, [gameRunner]);

  const handleTogglePause = React.useCallback(() => {
    if (game.isPaused()) {
      handleResume();
    } else {
      handlePause();
    }
  }, [game, handleResume, handlePause]);

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
      gameRunner.finish();
    };
  }, [game, level, gameRunner, navigate]);

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
        onClose={handleResume}
        onContinue={handleResume}
        onRestart={handleRestart}
        onExit={() => navigate(RoutePath.levelList)}
      />
      <GameView
        game={game}
        background={level.background}
        audio={level.audio}
        onReadyToStart={handleRestart}
      />
    </Stack>
  );
});
