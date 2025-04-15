import { Box, Typography } from "@mui/material";
import React from "react";
import { LevelListItem } from "./LevelListItem";
import { Level } from "@/core/store/game/level";

interface LevelListProps {
  levels: Level[];
  onDelete?: (levelId: number) => void;
}

export const LevelList: React.FC<LevelListProps> = React.memo(
  ({ levels, onDelete = () => {} }) => {
    const items = React.useMemo(
      () =>
        levels.map((level) => {
          return (
            <LevelListItem
              key={level.id}
              level={level}
              onDelete={() => onDelete(level.id)}
            />
          );
        }),
      [levels]
    );

    if (levels.length === 0) {
      return (
        <Typography variant="h4" sx={{ textAlign: "center", mt: 5 }}>
          У вас нет сохраненных уровней
        </Typography>
      );
    }

    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 3,
          mt: 3,
        }}
      >
        {items}
      </Box>
    );
  }
);
