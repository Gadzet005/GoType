import {
  Box,
  IconButton,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "@/core/hooks";
import { RoutePath } from "@/core/config/routes/path";
import React from "react";
import { LevelDraftInfo } from "@desktop-common/draft";

interface DraftListItemProps {
  draft: LevelDraftInfo;
  deleleSelf: () => void;
}

export const DraftListItem: React.FC<DraftListItemProps> = ({
  draft,
  deleleSelf,
}) => {
  const navigate = useNavigate();

  const formattedDate = new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(draft.updateTime);

  return (
    <ListItem
      sx={{
        borderRadius: 3,
        bgcolor: "background.paper",
        "&:hover": {
          bgcolor: "action.hover",
        },
        px: 3,
      }}
      secondaryAction={
        <Box>
          <IconButton
            edge="end"
            aria-label="edit"
            onClick={() => navigate(RoutePath.levelEditor, { draft })}
            sx={{ mr: 1 }}
          >
            <EditIcon fontSize="large" />
          </IconButton>
          <IconButton edge="end" aria-label="delete" onClick={deleleSelf}>
            <DeleteIcon fontSize="large" />
          </IconButton>
        </Box>
      }
    >
      <ListItemText
        primary={<Typography variant="h4">{draft.name}</Typography>}
        secondary={
          <Typography variant="caption" color="text.secondary">
            {formattedDate}
          </Typography>
        }
      />
    </ListItem>
  );
};
