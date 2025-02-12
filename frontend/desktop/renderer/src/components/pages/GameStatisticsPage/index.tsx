import { RoutePath } from "@/core/config/routes/path";
import { useNavigate } from "@/core/hooks";
import { GameStatistics } from "@/core/store/game/statistics";
import { Level } from "@desktop-common/level";
import { Box, Container, Typography } from "@mui/material";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Button } from "../../ui/Button";
import { StatTable } from "./StatTable";

interface GameStatisticsPageProps {
  level: Level;
  statistics: GameStatistics;
}

export const GameStatisticsPage: React.FC<GameStatisticsPageProps> = ({
  level,
  statistics,
}) => {
  const navigate = useNavigate();
  useHotkeys("esc", () => navigate(RoutePath.levelList));

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          mt: 3,
          gap: 5,
          width: "50%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontWeight: "bold",
            }}
            color="success"
            variant="h4"
          >
            Уровень завершен
          </Typography>
          <Typography color="primary" sx={{ fontWeight: "bold" }} variant="h4">
            {level.name}
          </Typography>
        </Box>

        <StatTable statistics={statistics} />

        <Box sx={{ display: "flex", gap: 3, width: "100%" }}>
          <Button
            size="large"
            color="success"
            variant="contained"
            href={RoutePath.game}
            params={{ level }}
            fullWidth
          >
            Пройти снова
          </Button>
          <Button
            color="primary"
            variant="contained"
            size="large"
            href={RoutePath.levelList}
            fullWidth
          >
            К списку уровней
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
