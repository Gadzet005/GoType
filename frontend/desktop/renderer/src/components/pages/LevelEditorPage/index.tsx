import { BackButton } from "@/components/common/BackButton";
import { RoutePath } from "@/core/config/routes/path";
import { LevelDraftInfo } from "@desktop-common/draft";
import { Box, Typography } from "@mui/material";

interface LevelEditorPageProps {
  draft: LevelDraftInfo;
}

export const LevelEditorPage: React.FC<LevelEditorPageProps> = ({ draft }) => {
  return (
    <Box sx={{ p: 2 }}>
      <BackButton href={RoutePath.levelDraftList} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h3">{draft.name}</Typography>
      </Box>
    </Box>
  );
};
