import { RoutePath } from "@/core/config/routes/path";
import { useNavigate } from "@/core/hooks";
import { GameStatistics } from "@/core/store/game/statistics";
import { LevelData } from "@common/level";
import { Box, Container, Stack, Typography } from "@mui/material";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Button } from "../../ui/Button";
import { StatTable } from "./StatTable";

interface GameStatisticsPageProps {
  level: LevelData;
  statistics: GameStatistics;
}

export const GameStatisticsPage: React.FC<GameStatisticsPageProps> = ({
  level,
  statistics,
}) => {
  const navigate = useNavigate();
  useHotkeys("esc", () => navigate(RoutePath.levelList));

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="md">
        <Stack sx={{ mt: 3 }} spacing={5}>
          <Stack sx={{ alignItems: "center" }} spacing={2}>
            <Typography
              sx={{
                fontWeight: "bold",
              }}
              color={statistics.failed ? "error" : "success"}
              variant="h4"
            >
              {statistics.failed ? "Уровень провален" : "Уровень пройден"}
            </Typography>
            <Typography
              color="primary"
              sx={{ fontWeight: "bold" }}
              variant="h4"
            >
              {level.name}
            </Typography>
          </Stack>

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
        </Stack>
      </Container>
    </Box>
  );
};
