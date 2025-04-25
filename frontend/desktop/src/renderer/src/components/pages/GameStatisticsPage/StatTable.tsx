import { Stack, Typography } from "@mui/material";
import { StatRow } from "./StatRow";
import { GameStatistics } from "@/core/store/game/statistics";
import React from "react";

interface StatTableProps {
  statistics: GameStatistics;
}

export const StatTable: React.FC<StatTableProps> = ({ statistics }) => {
  return (
    <Stack spacing={2}>
      <Typography sx={{ fontWeight: "bold", mb: 3 }} variant="h4">
        Статистика
      </Typography>

      {!statistics.failed && (
        <StatRow
          label="Общая оценка"
          value={statistics.accuracyLevel}
          valueColor="secondary"
        />
      )}
      <StatRow label="Очки" value={statistics.score} />
      <StatRow label="Точность" value={statistics.accuracy.toFixed(2) + "%"} />
      <StatRow
        label="Скорость (символы в минуту)"
        value={statistics.avgVelocity.toFixed(2)}
      />
      <StatRow
        label="Ошибки"
        value={statistics.totalMistakes}
        valueColor="error"
      />
      <StatRow
        label="Пропущено"
        value={statistics.missedTotal}
        valueColor="secondary"
      />
      <StatRow
        label="Максимальное комбо"
        value={statistics.maxCombo}
        valueColor="primary"
      />
    </Stack>
  );
};
