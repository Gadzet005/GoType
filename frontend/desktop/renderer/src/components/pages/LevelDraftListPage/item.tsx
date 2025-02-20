import { Box, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppContext, useNavigate } from "@/core/hooks";
import { RoutePath } from "@/core/config/routes/path";
import React from "react";
import { removeDraft } from "@/core/services/electron/levelDraft/removeDraft";
import { LevelDraftInfo } from "@desktop-common/draft";

interface DraftListItemProps {
  draft: LevelDraftInfo;
  deleleSelf: () => void;
}

export const DraftListItem: React.FC<DraftListItemProps> = ({
  draft,
  deleleSelf,
}) => {
  const ctx = useAppContext();
  const navigate = useNavigate();

  const handleOpen = () => {
    navigate(RoutePath.levelEditor, { draft });
  };

  const handleDelete = () => {
    ctx.runService(removeDraft, draft.id).then(() => {
      deleleSelf();
    });
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography variant="h5" color="primary">
        {draft.name}
      </Typography>
      <Typography color="body2">
        {new Date(draft.updateTime).toLocaleString()}
      </Typography>
      <IconButton onClick={handleOpen}>
        <EditIcon />
      </IconButton>
      <IconButton onClick={handleDelete}>
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};
