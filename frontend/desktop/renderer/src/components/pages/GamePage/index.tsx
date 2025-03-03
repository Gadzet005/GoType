import { Button } from "@/components/ui/Button";
import { RoutePath } from "@/core/config/routes/path";
import { useNavigate } from "@/core/hooks";
import { Game } from "@/core/store/game";
import { LevelData } from "@desktop-common/level";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import { when } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { ComboCounter } from "./ComboCounter";
import { GameField } from "./GameField";
import PauseMenu from "./PauseMenu";

import { useAudioPlayer } from "react-use-audio-player";
import "./index.css";

interface GamePageProps {
  level: LevelData;
}

export const GamePage: React.FC<GamePageProps> = observer(({ level }) => {
  const navigate = useNavigate();
  const [game] = React.useState<Game>(new Game(level));
  const audioPlayer = useAudioPlayer();

  const handleKeyDown = (event: KeyboardEvent) => {
    if (game.isRunning) {
      game.input(event.key);
    }
  };

  const handleResume = React.useCallback(() => {
    game.start();
    audioPlayer.play();
  }, [game, audioPlayer]);

  const handlePause = () => {
    game.pause();
    audioPlayer.pause();
  };

  const handleRestart = () => {
    game.init();
    game.start();
    audioPlayer.stop();
    audioPlayer.play();
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
    audioPlayer.load(level.game.audio.url, {
      autoplay: true,
      loop: false,
      format: level.game.audio.ext,
    });
    return () => audioPlayer.cleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level.game.audio.url]);

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
        backgroundImage: `url(${level.game.background?.url})`,
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
