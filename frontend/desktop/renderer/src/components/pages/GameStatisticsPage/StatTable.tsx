import { Stack, Typography } from "@mui/material";
import React from "react";
import { GameStatistics } from "@/core/store/game/statistics";
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

      <StatRow label="Очки" value={statistics.score} />
      <StatRow label="Точность" value={statistics.accuracy.toFixed(2) + "%"} />
      <StatRow
        label="Правильные буквы"
        value={statistics.rightLetters}
        valueColor="success"
      />
      <StatRow
        label="Максимальное комбо"
        value={statistics.maxCombo}
        valueColor="primary"
      />
    </Stack>
  );
};
