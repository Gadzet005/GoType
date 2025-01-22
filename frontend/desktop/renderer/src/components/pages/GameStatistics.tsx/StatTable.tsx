import { Stack, Typography } from "@mui/material";
import React from "react";
import { GameStatistics } from "@/public/game/statistics";
import { StatRow } from "./StatRow";

interface StatTableProps {
  statistics: GameStatistics;
}

export const StatTable: React.FC<StatTableProps> = ({ statistics }) => {
  return (
    <Stack spacing={2}>
      <Typography sx={{ fontWeight: "bold", mb: 3 }} variant="h4">
        Статистика
      </Typography>

      <StatRow label="Очки" value={String(statistics.score)} />
      <StatRow label="Точность" value={statistics.accuracy.toFixed(2) + "%"} />
      <StatRow
        label="Скорость печати"
        value={statistics.averageSpeed.toFixed(2) + " мс."}
      />
    </Stack>
  );
};
