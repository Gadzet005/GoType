import { Box } from "@mui/material";
import React from "react";
import { LevelListItem } from "./LevelListItem";
import { Level } from "@/core/store/game/level";

interface LevelListProps {
  levels: Level[];
}

export const LevelList: React.FC<LevelListProps> = React.memo(({ levels }) => {
  const items = React.useMemo(
    () =>
      levels.map((level) => {
        return <LevelListItem key={level.id} level={level} />;
      }),
    [levels]
  );

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
});
