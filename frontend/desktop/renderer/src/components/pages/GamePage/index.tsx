import { Button } from "@/components/ui/Button";
import { RoutePath } from "@/core/config/routes/path";
import { useNavigate } from "@/core/hooks";
import { Game } from "@/core/store/game";
import { Level } from "@desktop-common/level";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import { when } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { ComboCounter } from "./ComboCounter";
import { GameField } from "./GameField";
import PauseMenu from "./PauseMenu";

import "./index.css";

interface GamePageProps {
  level: Level;
}

export const GamePage: React.FC<GamePageProps> = observer(({ level }) => {
  const navigate = useNavigate();
  const [game] = React.useState<Game>(new Game(level));

  const handleKeyDown = (event: KeyboardEvent) => {
    if (game.isRunning) {
      game.input(event.key);
    }
  };

  const handleResume = () => {
    game.start();
  };

  const handlePause = () => {
    game.pause();
  };

  const handleRestart = () => {
    game.init();
    game.start();
  };

  const handleTogglePause = () => {
    if (game.isPaused) {
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
    game.init();
    game.start();
    return () => {
      game.pause();
    };
  }, [game]);

  React.useEffect(() => {
    when(
      () => game.isFinished,
      () => {
        navigate(RoutePath.gameStatistics, {
          level,
          statistics: game.statistics,
        });
      }
    );
  }, [game.isFinished, game.statistics, level, navigate]);

  return (
    <Box
      sx={{
        height: "100%",
        backgroundImage: `url(${level.game.background.url})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
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
                }}
                variant="contained"
                onClick={handlePause}
              >
                <MenuIcon />
              </Button>
            </Box>
            <Box sx={{ width: "50%", px: 2 }}>
              <LinearProgress
                sx={{
                  height: 15,
                  borderRadius: 10,
                  bgcolor: "background.paper",
                }}
                color="primary"
                variant="determinate"
                value={game.progress}
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
              <Box sx={{ bgcolor: "background.paper", p: 2, borderRadius: 4 }}>
                <Typography color="text.secondary" variant="h3">
                  {String(game.statistics.score).padStart(7, "0")}
                </Typography>
              </Box>
            </Box>
          </Box>
          <GameField width={"100%"} height={"100%"} game={game} />
        </Stack>
        <PauseMenu
          open={game.isPaused}
          onClose={handleResume}
          onContinue={handleResume}
          onRestart={handleRestart}
          onExit={() => navigate(RoutePath.levelList)}
        />
      </Box>
    </Box>
  );
});
