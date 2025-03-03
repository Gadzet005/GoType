import { LevelData } from "@desktop-common/level";
import { Box } from "@mui/material";
import React from "react";
import { LevelListItem } from "./LevelListItem";

interface LevelListProps {
  levels: LevelData[];
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
